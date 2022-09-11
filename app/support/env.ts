import "dotenv-defaults/config"

import { z } from "zod"

import type { Env } from "../types"

/**
 * Parsed environment variables.
 *
 * @public
 */
export const env: Env = z
  .object({
    APP_NAME: z.string().default("artwork"),
    NODE_ENV: z.enum(["development", "test", "production"]),
    LOG_LEVEL: z
      .enum(["debug", "info", "warn", "error", "fatal"])
      .default("debug"),
    SWINIR_VERSION: z.string().default("latest")
  })
  .parse(process.env)
