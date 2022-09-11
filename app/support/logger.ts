import { Logger } from "tslog"

import { env } from "./env"

/**
 * Application logger instance.
 *
 * @public
 */
export const logger: Logger = new Logger({
  minLevel: env.LOG_LEVEL ?? "debug",
  name: "stable-diffusion",
  dateTimePattern: "hour:minute:second.millisecond",
  displayLogLevel: true,
  displayTypes: true,
  displayFilePath: "hidden"
})
