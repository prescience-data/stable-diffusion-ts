import { loadPrompts } from "../prompts"
import {
  Command,
  getMode,
  handleError,
  resolveProjectPath,
  wrap
} from "../support"
import { parseTxt2ImgArgs, txt2ImgArgsSchema } from "../zod"
import type { CliCommand, Txt2ImgArgs } from "../types"

/**
 * Executes StableDiffusion Txt2Img command.
 *
 * @public
 */
export class Txt2ImgCommand
  extends Command<Txt2ImgArgs>
  implements CliCommand<Txt2ImgArgs>
{
  /**
   * Command name to display in logging.
   *
   * @public
   */
  public readonly name: string = "txt2img"

  /**
   * Command line args parsing schema.
   *
   * @internal
   */
  protected readonly _schema = txt2ImgArgsSchema

  /**
   * Static initializer.
   *
   * @public
   */
  public static async run(): Promise<void> {
    return new Txt2ImgCommand().run()
  }

  /**
   * Execute the command.
   *
   * @public
   */
  public async run(): Promise<void> {
    try {
      const { mode, seed, project, count } = this.args()
      const { steps, scale } = getMode(mode)
      const outdir: string = resolveProjectPath(project, "samples")
      const prompt: string = wrap(loadPrompts(project).join(", "))

      const args: string[] = parseTxt2ImgArgs({
        scale,
        seed,
        prompt,
        outdir,
        ddim_steps: steps,
        n_iter: count
      })

      this.logger.info(args)

      await this.conda("optimizedSD/optimized_txt2img.py", args)

      this.logger.info(`Job complete.`)
    } catch (error) {
      this.logger.warn(`Encountered error during ${this.name} run.`)
      handleError(error)
    }
  }
}
