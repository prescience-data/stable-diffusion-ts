import type { CliCommand as BaseCliCommand } from "@nodesuite/cli"
import type { ExecaChildProcess } from "execa"

import type { Args } from "./args"

export interface CliCommand<A extends Args = Args> extends BaseCliCommand {
  // Resolves a valid path to a vendor script or subdirectory.
  vendorPath(vendor: string, path: string): string

  // Resolve path to stable-diffusion vendor command.
  conda(command: string, args?: string[]): Promise<ExecaChildProcess>

  // Parse cli args through schema.
  args(): A
}
