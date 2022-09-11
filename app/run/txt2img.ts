import { Txt2ImgCommand } from "../commands"
import { logger } from "../support"

Txt2ImgCommand.run().catch((error) => logger.error(error))
