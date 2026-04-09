export const VERSION = "0.1.0";
export const DEFAULT_API_HOST = "https://graph.facebook.com";
export const DEFAULT_API_VERSION = "v21.0";
export const DEFAULT_SCOPES = [
  "ads_management",
  "ads_read",
  "business_management",
  "read_insights",
];
export const TOKEN_REFRESH_BUFFER_SECONDS = 60;
export const CONFIG_DIR_NAME = "meta-ads-mcp";
export const OAUTH_REDIRECT_PORT = 9876;
export const OAUTH_REDIRECT_URI = `http://localhost:${OAUTH_REDIRECT_PORT}/callback`;
