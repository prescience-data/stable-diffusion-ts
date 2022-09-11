import { z } from "zod"

export const swinirTaskSchema = z.enum([
  "Real-World Image Super-Resolution",
  "Grayscale Image Denoising",
  "Color Image Denoising",
  "JPEG Compression Artifact Reduction"
])

export const rawSwinirArgsSchema = z.object({
  image: z.string(),
  task_type: swinirTaskSchema.default("Real-World Image Super-Resolution"),
  noise: z
    .number()
    .refine((value) => [15, 25, 50].includes(value))
    .default(15),
  jpeg: z
    .number()
    .refine((value) => [10, 20, 30, 40].includes(value))
    .default(40)
})

export const swinirArgsSchema = rawSwinirArgsSchema
  .omit({
    image: true,
    task_type: true
  })
  .extend({
    project: z.string(),
    source: z.string().optional(),
    task: swinirTaskSchema.default("Real-World Image Super-Resolution")
  })
