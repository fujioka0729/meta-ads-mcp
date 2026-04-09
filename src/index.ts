import { setupSkills } from "./cli.js";

// CLI サブコマンド処理
const command = process.argv[2];
if (command === "setup-skills") {
  setupSkills();
} else {
  // MCP サーバー起動
  const { McpServer } = await import("@modelcontextprotocol/sdk/server/mcp.js");
  const { StdioServerTransport } = await import("@modelcontextprotocol/sdk/server/stdio.js");
  const { VERSION } = await import("./constants.js");
  const { register: registerConfigure } = await import("./tools/configure.js");
  const { register: registerAuthenticate } = await import("./tools/authenticate.js");
  const { register: registerAuthStatus } = await import("./tools/auth-status.js");
  const { register: registerServerInfo } = await import("./tools/server-info.js");
  const { register: registerApiGet } = await import("./tools/api-get.js");
  const { register: registerApiPost } = await import("./tools/api-post.js");
  const { register: registerApiDelete } = await import("./tools/api-delete.js");
  const { register: registerApiListPaths } = await import("./tools/api-list-paths.js");

  const server = new McpServer({
    name: "meta-ads-mcp",
    version: VERSION,
    description: "Meta Ads APIと連携するMCPサーバー",
  });

  registerConfigure(server);
  registerAuthenticate(server);
  registerAuthStatus(server);
  registerServerInfo(server);
  registerApiGet(server);
  registerApiPost(server);
  registerApiDelete(server);
  registerApiListPaths(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
