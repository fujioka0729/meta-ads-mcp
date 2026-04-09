import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadConfig } from "../config/config.js";
import { saveToken } from "../auth/token-store.js";
import { DEFAULT_API_VERSION } from "../constants.js";

/** short-lived token → long-lived token に交換 */
async function exchangeForLongLivedToken(
  appId: string,
  appSecret: string,
  shortLivedToken: string
): Promise<{ access_token: string; expires_in: number }> {
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
    expires_in: data.expires_in || 5184000,
  };
}

export function register(server: McpServer): void {
  server.tool(
    "meta_ads_save_token",
    "Graph API Explorerで取得したアクセストークンを保存します。short-livedトークンは自動的にlong-lived（60日有効）に交換されます。",
    {
      access_token: z.string().describe("Graph API Explorerで取得したアクセストークン"),
    },
    async ({ access_token }) => {
      try {
        const config = await loadConfig();

        if (!config.appId || !config.appSecret) {
          return {
            content: [
              {
                type: "text" as const,
                text: "appId/appSecretが未設定です。先に meta_ads_configure で設定してください。",
              },
            ],
            isError: true,
          };
        }

        // long-lived トークンに交換
        const longLived = await exchangeForLongLivedToken(
          config.appId,
          config.appSecret,
          access_token
        );

        const token = {
          access_token: longLived.access_token,
          token_type: "bearer" as const,
          expires_in: longLived.expires_in,
          obtained_at: Date.now(),
        };

        await saveToken(token);

        const expiresAt = new Date(token.obtained_at + token.expires_in * 1000);
        return {
          content: [
            {
              type: "text" as const,
              text: `トークンを保存しました。\nlong-lived トークンに交換済み（60日有効）\n有効期限: ${expiresAt.toISOString()}`,
            },
          ],
        };
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return {
          content: [{ type: "text" as const, text: `トークン保存エラー: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
