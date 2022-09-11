import { modeSchema } from "../zod"
import type { Mode, ModeArgs, Modes } from "../types"

const modes: Modes = {
  broad: {
    steps: 50,
    scale: 7
  },
  normal: {
    steps: 90,
    scale: 8
  },
  narrow: {
    steps: 100,
    scale: 9
  }
}

export const getMode = (mode: Mode | string): ModeArgs =>
  modes[modeSchema.parse(mode)]
