import { z } from "zod"

import { flattenArgs } from "../support"
import {
  countSchema,
  modeSchema,
  seedSchema,
  sizeSchema,
  sourceSchema,
  strengthSchema
} from "./common"
import type { RawImg2ImgArgs, RawTxt2ImgArgs } from "../types"

export const txt2ImgArgsSchema = z.object({
  count: countSchema,
  mode: modeSchema.default("broad"),
  project: z.string().max(20),
  seed: seedSchema
})

export const img2ImgArgsSchema = txt2ImgArgsSchema.extend({
  source: sourceSchema,
  strength: strengthSchema
})

const rawTxt2ImgArgsSchema = z.object({
  prompt: z.string(),
  scale: z.number().min(1).max(10),
  ddim_steps: z.number().min(1).max(200),
  n_iter: countSchema.default(5),
  n_samples: z.number().default(3),
  seed: seedSchema,
  H: sizeSchema,
  W: sizeSchema,
  outdir: z.string(),
  sampler: z.enum(["ddim", "plms"]).default("ddim"),
  turbo: z.boolean().default(true)
})

export const parseTxt2ImgArgs = (args: Partial<RawTxt2ImgArgs>): string[] =>
  flattenArgs(rawTxt2ImgArgsSchema.parse(args))

export const rawImg2ImgArgsSchema = rawTxt2ImgArgsSchema.extend({
  "init-img": sourceSchema,
  strength: strengthSchema
})

export const parseImg2ImgArgs = (args: Partial<RawImg2ImgArgs>): string[] =>
  flattenArgs(rawImg2ImgArgsSchema.parse(args))
