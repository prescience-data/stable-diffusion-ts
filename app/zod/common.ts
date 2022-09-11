import is from "@sindresorhus/is"
import { randomInt } from "crypto"
import { z } from "zod"

export const seedSchema = z.preprocess(
  (v) => (is.string(v) ? parseInt(v) : v),
  z.number().min(1).default(randomInt(1000000, 9999999))
)

export const sizeSchema = z.preprocess(
  (v) => (is.string(v) ? parseInt(v) : v),
  z.number().min(512).default(512)
)

export const strengthSchema = z.preprocess(
  (v) => (is.string(v) ? parseFloat(v) : v),
  z.number().min(0).max(1).default(0.8)
)

export const modeSchema = z.enum(["broad", "normal", "narrow"])

export const countSchema = z.preprocess(
  (v) => (is.string(v) ? parseInt(v) : v),
  z.number().min(1).max(500).default(10)
)

export const sourceSchema = z
  .string()
  .refine((value) =>
    [".jpg", ".png"].some((extension) => value.endsWith(extension))
  )
