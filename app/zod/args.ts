import { z } from "zod"

/**
 * Generic command line args base schema.
 *
 * @public
 */
export const argsSchema = z.object({
  _: z.array(z.string()).default([]),
  project: z.string()
})
