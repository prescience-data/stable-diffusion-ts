import { homedir } from "node:os"
import { resolve } from "node:path"
import { Command as BaseCommand } from "@nodesuite/cli"
import { execa } from "execa"
import { pathExistsSync } from "fs-extra"
import type { Spec } from "arg"
import type { ExecaChildProcess } from "execa"
import type { ZodObject } from "zod"

import { createSpec, getArgs } from "./args"
import { logger } from "./logger"
import type { Args, CliCommand } from "../types"

/**
 * Abstract base image command.
 *
 * @public
 */
export abstract class Command<A extends Args = Args>
  extends BaseCommand
  implements CliCommand<A>
{
  /**
   * Args parsing schema.
   *
   * @internal
   */
  protected abstract readonly _schema: ZodObject<any>

  /**
   * Caches the args spec after first generation.
   *
   * @internal
   */
  #spec: Spec | undefined

  /**
   * Constructor
   *
   * @internal
   */
  protected constructor() {
    super({ logger })
  }

  /**
   * Generate argv parser spec.
   *
   * @internal
   */
  protected get _spec(): Spec {
    return (this.#spec = this.#spec ?? createSpec(this._schema))
  }

  /**
   * Resolve path to vendor command.
   *
   * @param command - Valid python script name.
   * @param args - Trailing arguments to append.
   *
   * @public
   */
  public async conda(
    command: string,
    args: string[] = []
  ): Promise<ExecaChildProcess> {
    const conda: string = resolve(homedir(), "anaconda3/Scripts/conda.exe")

    const cwd: string = this.vendorPath("stable-diffusion")
    const script: string = this.vendorPath("stable-diffusion", command)

    return execa(
      conda,
      ["run", "-n", "ldm", "--cwd", cwd, "python", script, args.join(" ")],
      { cwd, stdio: "inherit", shell: true }
    )
  }

  /**
   * Resolves a path to a script or directory in the vendor folder.
   *
   * @param vendor - Name of vendor directory.
   * @param path - Path to target file or subdirectory.
   *
   * @public
   */
  public vendorPath(vendor: string, path: string = ""): string {
    const target: string = resolve(process.cwd(), "vendor", vendor, path).trim()

    if (!pathExistsSync(target)) {
      throw new Error(
        `Vendor command "${vendor} ${path}" does not exist: "${target}".`
      )
    }
    return target
  }

  /**
   * Parse cli args through schema.
   *
   * @public
   */
  public args(): A {
    const args: A = getArgs(this._spec)
    const parsed: A = this._schema.parse(args) as A
    this.logger.debug(`Parsed arguments.`, parsed)
    return parsed
  }
}
