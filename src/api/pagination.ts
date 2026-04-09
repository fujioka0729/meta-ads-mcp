import type { Config } from "../config/schema.js";
import { apiRequest } from "./client.js";
import { getAccessToken } from "../auth/token-manager.js";

/** カーソルベースで全ページ取得 */
export async function fetchAllPages(
  config: Config,
  path: string,
  query?: Record<string, string>,
  maxPages: number = 10
): Promise<unknown[]> {
  const allResults: unknown[] = [];
  let nextUrl: string | null = null;
  let page = 0;

  while (page < maxPages) {
    let response: Record<string, unknown>;

    if (nextUrl) {
      const accessToken = await getAccessToken();
      const url = new URL(nextUrl);
      url.searchParams.set("access_token", accessToken);
      const res = await fetch(url.toString());
      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Meta Ads API ページネーションエラー (${res.status}): ${errorBody}`);
      }
      response = (await res.json()) as Record<string, unknown>;
    } else {
      response = (await apiRequest(config, "GET", path, {
        ...query,
        limit: query?.limit || "100",
      })) as Record<string, unknown>;
    }

    if (response.data && Array.isArray(response.data)) {
      allResults.push(...response.data);
    } else {
      allResults.push(response);
      break;
    }

    const paging = response.paging as Record<string, unknown> | undefined;
    nextUrl = (paging?.next as string) || null;
    if (!nextUrl) break;
    page++;
  }

  return allResults;
}
