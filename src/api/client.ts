import type { Config } from "../config/schema.js";
import { getAccessToken } from "../auth/token-manager.js";

/** Meta Graph API リクエスト */
export async function apiRequest(
  config: Config,
  method: string,
  path: string,
  query?: Record<string, string>,
  body?: unknown
): Promise<unknown> {
  const accessToken = await getAccessToken();
  const url = new URL(`${config.apiHost}/${config.apiVersion}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };

  const options: RequestInit = { method, headers };

  if (body && method === "POST") {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), options);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Meta Ads API エラー (${method} ${path} → ${response.status}): ${errorBody}`
    );
  }

  if (response.status === 204) {
    return { success: true };
  }

  return response.json();
}
