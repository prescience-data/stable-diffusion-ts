import { Img2ImgCommand } from "../commands"
import { logger } from "../support"

Img2ImgCommand.run().catch((error) => logger.error(error))
