import is from "@sindresorhus/is"
import { ZodError } from "zod"

import { logger } from "./logger"

export const handleError = (error: Error | unknown) => {
  if (error instanceof ZodError) {
    const messages: string[] = error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    )

    for (const message of messages) {
      logger.error(message)
    }
    throw error
  } else if (is.error(error)) {
    logger.fatal(error.message)
    throw error
  } else {
    throw new Error(`Unexpected error: ${JSON.stringify(error)}`)
  }
}
