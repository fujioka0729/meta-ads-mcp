import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadConfig } from "../config/config.js";
import { apiRequest } from "../api/client.js";

export function register(server: McpServer): void {
  server.tool(
    "meta_ads_api_delete",
    "Meta Ads APIにDELETEリクエストを送信します",
    {
      path: z.string().describe("APIパス（例: /{campaign_id}）"),
      query: z.record(z.string()).optional().describe("クエリパラメータ"),
    },
    async ({ path, query }) => {
      try {
        const config = await loadConfig();
        const result = await apiRequest(config, "DELETE", path, query);
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
