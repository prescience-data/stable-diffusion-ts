import type { Args } from "./args"

export interface Txt2ImgArgs extends Args {
  count: number
  mode: Mode
  project: string
  seed: number
}

export interface Img2ImgArgs extends Txt2ImgArgs {
  source: string
  strength: number
}

export interface RawTxt2ImgArgs {
  ddim_steps: number
  scale: number
  outdir: string
  seed: number
  prompt: string
  n_iter: number
  n_samples: number
  turbo: boolean
  H: number
  W: number
}

export interface RawImg2ImgArgs extends RawTxt2ImgArgs {
  strength: number
  "init-img": string
}

export type Mode = "broad" | "normal" | "narrow"

export interface ModeArgs {
  steps: number
  scale: number
}

export type Modes = Record<Mode, ModeArgs>
