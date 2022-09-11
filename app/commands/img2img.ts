import type { ExecaReturnValue } from "execa"

import { loadPrompts } from "../prompts"
import {
  Command,
  getMode,
  handleError,
  resolveProjectFile,
  resolveProjectPath,
  wrap
} from "../support"
import { img2ImgArgsSchema, parseImg2ImgArgs } from "../zod"
import type { CliCommand, Img2ImgArgs } from "../types"

/**
 * Executes StableDiffusion Img2Img command.
 *
 * @public
 */
export class Img2ImgCommand
  extends Command<Img2ImgArgs>
  implements CliCommand<Img2ImgArgs>
{
  /**
   * Command name to display in logging.
   *
   * @public
   */
  public readonly name: string = "img2img"

  /**
   * Command line args parsing schema.
   *
   * @internal
   */
  protected readonly _schema = img2ImgArgsSchema

  /**
   * Static initializer.
   *
   * @public
   */
  public static async run(): Promise<void> {
    return new Img2ImgCommand().run()
  }

  /**
   * Execute the command.
   *
   * @public
   */
  public async run(): Promise<void> {
    try {
      const { strength, mode, seed, project, source, count } = this.args()
      const { steps, scale } = getMode(mode)
      const outdir: string = resolveProjectPath(project, "samples")
      const image: string = resolveProjectFile(project, source)
      const prompt: string = wrap(loadPrompts(project).join(", "))

      const args: string[] = parseImg2ImgArgs({
        prompt,
        scale,
        seed,
        strength,
        outdir,
        ddim_steps: steps,
        n_iter: count,
        "init-img": image
      })

      const result: ExecaReturnValue = await this.conda(
        "optimizedSD/optimized_img2img.py",
        args
      )

      this.logger.info(result)
    } catch (error) {
      this.logger.warn(`Encountered error during ${this.name} run.`)
      handleError(error)
    }
  }
}
