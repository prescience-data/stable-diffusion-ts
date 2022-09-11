import { parse, resolve } from "node:path"
import is from "@sindresorhus/is"
import { execa } from "execa"
import { ensureDir, readdir, readFile, writeFile } from "fs-extra"
import got from "got"
import type { ExecaChildProcess } from "execa"

import {
  Command,
  getExtension,
  handleError,
  resolveProjectPath,
  waitForTimeout
} from "../support"
import { rawSwinirArgsSchema, swinirArgsSchema } from "../zod"
import type {
  CliCommand,
  JobCounter,
  SwinirArgs,
  SwinirOutput,
  SwinirRequest,
  SwinirResponse
} from "../types"

/**
 * Executes StableDiffusion Txt2Img command.
 *
 * @public
 */
export class SwinirCommand
  extends Command<SwinirArgs>
  implements CliCommand<SwinirArgs>
{
  /**
   * Command name to display in logging.
   *
   * @public
   */
  public readonly name: string = "upscale"

  /**
   * Command line args parsing schema.
   *
   * @internal
   */
  protected readonly _schema = swinirArgsSchema

  /**
   * String to use as container name.
   *
   * @internal
   */
  #containerName: string = "swinir"

  /**
   * Flags if the outdir base path has been created.
   *
   * @internal
   */
  #hasOutDir: boolean = false

  /**
   * Tracks number of container retries.
   *
   * @internal
   */
  #retries: number = 0

  /**
   * Static initializer.
   *
   * @public
   */
  public static async run(): Promise<void> {
    return new SwinirCommand().run()
  }

  /**
   * Execute the command.
   *
   * @public
   */
  public async run(): Promise<void> {
    try {
      // Start docker.
      await this._startContainer()

      // Setup upscale job.
      const { task, project, jpeg, noise, source } = this.args()

      const inputDir: string = resolveProjectPath(project, "upscale")

      const filenames: string[] = []
      if (!source) {
        for (const filename of await readdir(inputDir)) {
          if (
            !filename.includes("_upscaled") &&
            (filename.endsWith(".png") || filename.endsWith(".jpg"))
          ) {
            filenames.push(resolve(inputDir, filename))
          }
        }
      } else {
        filenames.push(resolve(inputDir, source))
      }

      const job: JobCounter = {
        current: 1,
        total: filenames.length
      }

      for (const filename of filenames) {
        this.logger.debug(`Reading file "${filename}".`)
        const buffer: Buffer = await readFile(filename)
        const ext: "png" | "jpeg" = getExtension(filename)

        // Build request.
        const request: SwinirRequest = rawSwinirArgsSchema.parse({
          task_type: task,
          jpeg,
          noise,
          image: `data:image/${ext};base64,${buffer.toString("base64")}`
        })

        this.logger.debug(
          `Sending upscaler input (${job.current++}/${job.total}).`,
          { ...request, image: request.image.slice(0, 32) }
        )

        // Call published RPC service.
        const output: SwinirOutput | undefined = await this._send(request)

        // Write result to disk.
        if (output) {
          await this._write(filename, output)
        }
      }
    } catch (error) {
      this.logger.warn(`Encountered error during ${this.name} run.`)
      handleError(error)
    } finally {
      await this._stopContainer()
    }
  }

  /**
   * Sends a http request to the container rpc service.
   *
   * @param request - Formatted swinir request.
   *
   * @internal
   */
  protected async _send(
    request: SwinirRequest
  ): Promise<SwinirOutput | undefined> {
    // Set 2 min timeout.
    const timeout: number = 1000 * 60 * 2
    // Call published RPC service.
    const { status, output }: SwinirResponse = await got
      .post("http://localhost:5000/predictions", {
        // Long timeouts are required for large jobs.
        timeout: {
          request: timeout,
          socket: timeout,
          send: timeout,
          response: timeout
        },
        json: { input: request }
      })
      .json()

    this.logger.debug(`Upscale result "${status}".`)

    return output.shift()
  }

  /**
   * Writes success base64 response to file.
   *
   * @param filename - Original filename including full path.
   * @param output - Output object from success response.
   *
   * @internal
   */
  protected async _write(
    filename: string,
    output: SwinirOutput
  ): Promise<void> {
    const content: string | undefined = output.file.split(";base64,")?.pop()
    if (!content) {
      throw new Error(`No content provided for "${filename}".`)
    }

    const { base, dir } = parse(filename)

    const outDir: string = dir.replace(`upscale`, `upscaled`)

    if (!this.#hasOutDir) {
      await ensureDir(outDir)
      this.#hasOutDir = true
    }

    const path: string = resolve(outDir, base)
    this.logger.debug(`Writing upscaled image to "${path}".`)
    await writeFile(path, Buffer.from(content, "base64"), {
      encoding: "base64"
    })
  }

  /**
   * Starts the swinir container using `latest` version.
   *
   * @internal
   */
  protected async _startContainer(): Promise<void> {
    try {
      // Start docker.
      this.logger.info(`Starting upscaler container.`)
      // docker run --rm -d -p 5000:5000 --gpus=all r8.im/jingyunliang/swinir
      const docker: ExecaChildProcess = execa(
        `docker`,
        [
          `run`,
          `--rm`,
          `--name=${this.#containerName}`,
          `-d`,
          `-p`,
          `5000:5000`,
          `--gpus=all`,
          `r8.im/jingyunliang/swinir`
        ],
        { stdio: "inherit" }
      )

      // Wait for docker container id.
      await docker

      // Bug: Delay between container up and container ready.
      this.logger.debug(`Waiting for container ready state.`)
      await waitForTimeout(4000)
    } catch (error) {
      this.logger.warn((error as Error).message)
      return this._retryContainer()
    }
  }

  /**
   * Stops swinir container when task complete.
   *
   * @internal
   */
  protected async _stopContainer(): Promise<void> {
    // Stop docker.
    const containerId: string | undefined = await this._getContainerId()

    if (containerId) {
      this.logger.info(`Stopping upscaler container "${containerId}".`)
      const dockerStop: ExecaChildProcess = execa(
        "docker",
        ["stop", containerId],
        { stdio: "inherit" }
      )
      await dockerStop
    }
  }

  /**
   * Attempts to recover from a container start error.
   *
   * @internal
   */
  protected async _retryContainer(): Promise<void> {
    // Increment max retries.
    this.#retries++

    // Stop existing container.
    await this._stopContainer()

    await waitForTimeout(1000)

    // Crash after max retries.
    if (this.#retries > 2) {
      throw new Error(`Container recovery reached max retries.`)
    }

    // Attempt recovery.
    return this._startContainer()
  }

  /**
   * Attempts to resolve the container id hash from docker.
   *
   * @internal
   */
  protected async _getContainerId(): Promise<string | undefined> {
    const { stdout } = await execa(
      `docker`,
      [`ps`, `-a`, `-q`, `--filter="name=${this.#containerName}"`],
      { shell: true }
    )

    if (is.string(stdout) && stdout.match(/[0-9a-fA-F]{12,32}/i)) {
      return stdout.trim()
    } else {
      return undefined
    }
  }
}
