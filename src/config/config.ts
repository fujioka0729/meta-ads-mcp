import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import { CONFIG_DIR_NAME } from "../constants.js";
import { ConfigSchema, type Config } from "./schema.js";

/** 設定ディレクトリのパスを取得 */
export function getConfigDir(): string {
  return path.join(os.homedir(), ".config", CONFIG_DIR_NAME);
}

/** 設定ファイルを読み込み（環境変数でフォールバック） */
export async function loadConfig(): Promise<Config> {
  const configPath = path.join(getConfigDir(), "config.json");

  let fileConfig: Record<string, unknown> = {};
  try {
    const raw = await fs.readFile(configPath, "utf-8");
    fileConfig = JSON.parse(raw);
  } catch {
    // ファイルがなければ環境変数のみで構成
  }

  const merged = {
    adAccountId: fileConfig.adAccountId ?? process.env.META_ADS_AD_ACCOUNT_ID ?? "",
    appId: fileConfig.appId ?? process.env.META_ADS_APP_ID,
    appSecret: fileConfig.appSecret ?? process.env.META_ADS_APP_SECRET,
    apiHost: fileConfig.apiHost ?? process.env.META_ADS_API_HOST,
    apiVersion: fileConfig.apiVersion ?? process.env.META_ADS_API_VERSION,
    scopes: fileConfig.scopes,
  };

  return ConfigSchema.parse(merged);
}

/** 設定ファイルを保存 */
export async function saveConfig(config: Config): Promise<void> {
  const dir = getConfigDir();
  await fs.mkdir(dir, { recursive: true });
  const configPath = path.join(dir, "config.json");
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), { encoding: "utf-8", mode: 0o600 });
}
