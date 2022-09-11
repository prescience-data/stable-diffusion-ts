import { SwinirCommand } from "../commands"
import { logger } from "../support"

SwinirCommand.run().catch((error) => logger.error(error))
