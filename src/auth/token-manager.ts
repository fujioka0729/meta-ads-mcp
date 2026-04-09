import { TOKEN_REFRESH_BUFFER_SECONDS } from "../constants.js";
import type { Token } from "../config/schema.js";
import { loadToken } from "./token-store.js";

/** トークンが有効かチェック */
export function isTokenValid(token: Token): boolean {
  const expiresAt = token.obtained_at + token.expires_in * 1000;
  const now = Date.now();
  return now < expiresAt - TOKEN_REFRESH_BUFFER_SECONDS * 1000;
}

/** アクセストークンを取得（キャッシュ有効なら再利用、期限切れなら再認証を促す） */
export async function getAccessToken(): Promise<string> {
  const cached = await loadToken();
  if (cached && isTokenValid(cached)) {
    return cached.access_token;
  }

  throw new Error(
    "アクセストークンがありません（または期限切れ）。meta_ads_authenticate ツールで認証してください。"
  );
}
