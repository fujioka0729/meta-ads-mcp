import * as http from "http";
import * as crypto from "crypto";
import { OAUTH_REDIRECT_PORT, OAUTH_REDIRECT_URI, DEFAULT_API_VERSION } from "../constants.js";
import type { Token } from "../config/schema.js";

const OAUTH_TIMEOUT_MS = 120_000;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface OAuthFlow {
  authUrl: string;
  waitForCallback: () => Promise<Token>;
  cancel: () => void;
}

/** short-lived token を code から取得 */
async function exchangeCodeForToken(
  appId: string,
  appSecret: string,
  code: string
): Promise<string> {
  const url = new URL(`https://graph.facebook.com/${DEFAULT_API_VERSION}/oauth/access_token`);
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", OAUTH_REDIRECT_URI);
  url.searchParams.set("client_secret", appSecret);
  url.searchParams.set("code", code);

  const response = await fetch(url.toString());
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`トークン交換に失敗 (${response.status}): ${body}`);
  }

  const data = await response.json();
  return data.access_token;
}

/** short-lived token → long-lived token に交換 */
async function exchangeForLongLivedToken(
  appId: string,
  appSecret: string,
  shortLivedToken: string
): Promise<Token> {
  const url = new URL(`https://graph.facebook.com/${DEFAULT_API_VERSION}/oauth/access_token`);
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("client_secret", appSecret);
  url.searchParams.set("fb_exchange_token", shortLivedToken);

  const response = await fetch(url.toString());
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`long-lived トークン交換に失敗 (${response.status}): ${body}`);
  }

  const data = await response.json();
  return {
    access_token: data.access_token,
    token_type: data.token_type || "bearer",
    expires_in: data.expires_in || 5184000, // デフォルト60日
    obtained_at: Date.now(),
  };
}

/** OAuth Authorization Code Flow を開始 */
export function startOAuthFlow(
  appId: string,
  appSecret: string,
  scopes: string[]
): OAuthFlow {
  const state = crypto.randomUUID();

  const authUrl = new URL(`https://www.facebook.com/${DEFAULT_API_VERSION}/dialog/oauth`);
  authUrl.searchParams.set("client_id", appId);
  authUrl.searchParams.set("redirect_uri", OAUTH_REDIRECT_URI);
  authUrl.searchParams.set("scope", scopes.join(","));
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("response_type", "code");

  let server: http.Server | null = null;
  let timeoutId: NodeJS.Timeout | null = null;

  const waitForCallback = (): Promise<Token> => {
    return new Promise<Token>((resolve, reject) => {
      server = http.createServer(async (req, res) => {
        const reqUrl = new URL(req.url!, `http://localhost:${OAUTH_REDIRECT_PORT}`);

        if (reqUrl.pathname !== "/callback") {
          res.writeHead(404);
          res.end("Not Found");
          return;
        }

        const code = reqUrl.searchParams.get("code");
        const returnedState = reqUrl.searchParams.get("state");
        const error = reqUrl.searchParams.get("error");

        if (error) {
          const errorDesc = reqUrl.searchParams.get("error_description") || error;
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(`<html><body><h1>認証エラー</h1><p>${escapeHtml(errorDesc)}</p></body></html>`);
          cleanup();
          reject(new Error(`OAuth エラー: ${errorDesc}`));
          return;
        }

        if (returnedState !== state) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<html><body><h1>State不一致エラー</h1></body></html>");
          cleanup();
          reject(new Error("OAuth state が一致しません"));
          return;
        }

        if (!code) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<html><body><h1>認証コードがありません</h1></body></html>");
          cleanup();
          reject(new Error("認証コードが取得できませんでした"));
          return;
        }

        try {
          const shortLived = await exchangeCodeForToken(appId, appSecret, code);
          const longLived = await exchangeForLongLivedToken(appId, appSecret, shortLived);

          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<html><body><h1>認証完了!</h1><p>このタブを閉じてください。</p></body></html>");
          cleanup();
          resolve(longLived);
        } catch (err) {
          res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<html><body><h1>認証エラー</h1><p>トークン取得に失敗しました。</p></body></html>");
          cleanup();
          reject(err);
        }
      });

      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error("認証がタイムアウトしました（120秒）。再度 meta_ads_authenticate を実行してください。"));
      }, OAUTH_TIMEOUT_MS);

      server.listen(OAUTH_REDIRECT_PORT, () => {
        // サーバー起動完了
      });

      server.on("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE") {
          reject(new Error(`ポート ${OAUTH_REDIRECT_PORT} が使用中です。他のプロセスを終了してから再試行してください。`));
        } else {
          reject(err);
        }
      });
    });
  };

  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (server) {
      server.close();
      server = null;
    }
  };

  const cancel = () => {
    cleanup();
  };

  return { authUrl: authUrl.toString(), waitForCallback, cancel };
}
