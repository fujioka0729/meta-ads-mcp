import { z } from "zod";
import { DEFAULT_API_HOST, DEFAULT_API_VERSION, DEFAULT_SCOPES } from "../constants.js";

export const ConfigSchema = z.object({
  adAccountId: z.string(),
  appId: z.string().optional(),
  appSecret: z.string().optional(),
  apiHost: z.string().default(DEFAULT_API_HOST),
  apiVersion: z.string().default(DEFAULT_API_VERSION),
  scopes: z.array(z.string()).default(DEFAULT_SCOPES),
});

export type Config = z.infer<typeof ConfigSchema>;

export const TokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
  obtained_at: z.number(),
});

export type Token = z.infer<typeof TokenSchema>;
