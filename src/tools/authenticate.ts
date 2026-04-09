import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { execFile } from "child_process";
import { loadConfig } from "../config/config.js";
import { saveToken } from "../auth/token-store.js";
import { startOAuthFlow } from "../auth/oauth-server.js";

export function register(server: McpServer): void {
  server.tool(
    "meta_ads_authenticate",
    "Meta Ads APIのOAuth認証を開始します。ブラウザでFacebookログインを行います。",
    {},
    async () => {
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

        const { authUrl, waitForCallback } = startOAuthFlow(
          config.appId,
          config.appSecret,
          config.scopes
        );

        // ブラウザを開く（macOS/Linux/Windows対応）
        const platform = process.platform;
        const openCmd =
          platform === "darwin" ? "open" :
          platform === "win32" ? "start" :
          "xdg-open";

        execFile(openCmd, [authUrl]);

        console.error("認証URLをブラウザで開いています...");

        const token = await waitForCallback();
        await saveToken(token);

        const expiresAt = new Date(token.obtained_at + token.expires_in * 1000);
        return {
          content: [
            {
              type: "text" as const,
              text: `認証完了! トークンを保存しました。\n有効期限: ${expiresAt.toISOString()}`,
            },
          ],
        };
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return {
          content: [{ type: "text" as const, text: `認証エラー: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
