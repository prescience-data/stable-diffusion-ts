import type { Args } from "./args"

export interface SwinirArgs extends Args {
  project: string
  source: string
  task: string
  noise: 15 | 25 | 50
  jpeg: 10 | 20 | 30 | 40
}

export interface SwinirRequest {
  image: string
  task_type:
    | "Real-World Image Super-Resolution-Large"
    | "Real-World Image Super-Resolution-Medium"
    | "Grayscale Image Denoising"
    | "Color Image Denoising"
    | "JPEG Compression Artifact Reduction"
    | string

  noise: number
  jpeg: number
}

export interface JobCounter {
  total: number
  current: number
}

export interface SwinirOutput {
  file: string
}

export interface SwinirResponse {
  status: string
  output: SwinirOutput[]
}
