import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { saveConfig } from "../config/config.js";
import { DEFAULT_API_HOST, DEFAULT_API_VERSION, DEFAULT_SCOPES } from "../constants.js";

export function register(server: McpServer): void {
  server.tool(
    "meta_ads_configure",
    "Meta Ads APIの接続設定を保存します",
    {
      ad_account_id: z.string().describe("広告アカウントID（act_XXXXX形式）"),
      app_id: z.string().describe("MetaアプリID"),
      app_secret: z.string().describe("Metaアプリシークレット"),
    },
    async ({ ad_account_id, app_id, app_secret }) => {
      await saveConfig({
        adAccountId: ad_account_id,
        appId: app_id,
        appSecret: app_secret,
        apiHost: DEFAULT_API_HOST,
        apiVersion: DEFAULT_API_VERSION,
        scopes: DEFAULT_SCOPES,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `設定を保存しました。\n広告アカウントID: ${ad_account_id}\nアプリID: ${app_id}`,
          },
        ],
      };
    }
  );
}
