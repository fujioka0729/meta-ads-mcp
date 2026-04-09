import { describe, it, expect, vi, beforeEach } from "vitest";
import { isTokenValid } from "./token-manager.js";
import type { Token } from "../config/schema.js";

describe("isTokenValid", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("有効期限内のトークンはtrueを返す", () => {
    const token: Token = {
      access_token: "test_token_123",
      expires_in: 5184000, // 60日
      token_type: "bearer",
      obtained_at: Date.now(),
    };
    expect(isTokenValid(token)).toBe(true);
  });

  it("期限切れのトークンはfalseを返す", () => {
    const token: Token = {
      access_token: "expired_token",
      expires_in: 3600, // 1時間
      token_type: "bearer",
      obtained_at: Date.now() - 3700 * 1000, // 1時間+100秒前
    };
    expect(isTokenValid(token)).toBe(false);
  });

  it("バッファ60秒以内のトークンはfalseを返す", () => {
    const token: Token = {
      access_token: "almost_expired",
      expires_in: 3600,
      token_type: "bearer",
      obtained_at: Date.now() - (3600 - 30) * 1000, // 残り30秒
    };
    expect(isTokenValid(token)).toBe(false);
  });

  it("バッファ60秒をちょうど超えるトークンはtrueを返す", () => {
    const token: Token = {
      access_token: "valid_token",
      expires_in: 3600,
      token_type: "bearer",
      obtained_at: Date.now() - (3600 - 120) * 1000, // 残り120秒
    };
    expect(isTokenValid(token)).toBe(true);
  });

  it("expires_inが0のトークンはfalseを返す", () => {
    const token: Token = {
      access_token: "zero_expiry",
      expires_in: 0,
      token_type: "bearer",
      obtained_at: Date.now(),
    };
    expect(isTokenValid(token)).toBe(false);
  });

  it("obtained_atが未来のトークンはtrueを返す", () => {
    const token: Token = {
      access_token: "future_token",
      expires_in: 3600,
      token_type: "bearer",
      obtained_at: Date.now() + 60000, // 1分後
    };
    expect(isTokenValid(token)).toBe(true);
  });
});

vi.mock("./token-store.js", () => ({
  loadToken: vi.fn(),
}));

import { loadToken } from "./token-store.js";
import { getAccessToken } from "./token-manager.js";

const mockedLoadToken = vi.mocked(loadToken);

describe("getAccessToken", () => {
  it("トークンがない場合はエラーをスローする", async () => {
    mockedLoadToken.mockResolvedValue(null);

    await expect(getAccessToken()).rejects.toThrow(
      "meta_ads_authenticate"
    );
  });

  it("期限切れトークンの場合はエラーをスローする", async () => {
    mockedLoadToken.mockResolvedValue({
      access_token: "expired",
      expires_in: 1,
      token_type: "bearer",
      obtained_at: Date.now() - 100000,
    });

    await expect(getAccessToken()).rejects.toThrow(
      "meta_ads_authenticate"
    );
  });

  it("有効なトークンがある場合はaccess_tokenを返す", async () => {
    mockedLoadToken.mockResolvedValue({
      access_token: "valid_access_token",
      expires_in: 5184000,
      token_type: "bearer",
      obtained_at: Date.now(),
    });

    const result = await getAccessToken();
    expect(result).toBe("valid_access_token");
  });
});
