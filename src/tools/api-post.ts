import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadConfig } from "../config/config.js";
import { apiRequest } from "../api/client.js";

export function register(server: McpServer): void {
  server.tool(
    "meta_ads_api_post",
    "Meta Ads APIにPOSTリクエストを送信します（作成・更新兼用）",
    {
      path: z.string().describe("APIパス（例: /act_XXXXX/campaigns）"),
      body: z.record(z.unknown()).describe("リクエストボディ"),
      query: z.record(z.string()).optional().describe("クエリパラメータ"),
    },
    async ({ path, body, query }) => {
      try {
        const config = await loadConfig();
        const result = await apiRequest(config, "POST", path, query, body);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (e) {
        return {
          content: [{ type: "text" as const, text: `エラー: ${e instanceof Error ? e.message : String(e)}` }],
          isError: true,
        };
      }
    }
  );
}
