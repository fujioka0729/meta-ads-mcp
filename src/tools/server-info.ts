import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { VERSION, DEFAULT_API_HOST, DEFAULT_API_VERSION } from "../constants.js";
import { loadConfig } from "../config/config.js";

export function register(server: McpServer): void {
  server.tool(
    "meta_ads_server_info",
    "MCPサーバーのバージョンと接続先情報を表示します",
    {},
    async () => {
      let apiHost = DEFAULT_API_HOST;
      let apiVersion = DEFAULT_API_VERSION;

      try {
        const config = await loadConfig();
        apiHost = config.apiHost;
        apiVersion = config.apiVersion;
      } catch {
        // 設定未完了の場合はデフォルト値を使用
      }

      const text = [
        `meta-ads-mcp v${VERSION}`,
        `API Host: ${apiHost}`,
        `API Version: ${apiVersion}`,
      ].join("\n");

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
