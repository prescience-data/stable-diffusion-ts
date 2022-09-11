import { parse, resolve } from "node:path"
import { ensureDirSync } from "fs-extra"

export const resolveProjectPath = (
  project: string,
  path: string = ""
): string => {
  const projectPath: string = resolve(process.cwd(), "projects", project, path)
  ensureDirSync(projectPath)
  return projectPath
}

export const resolveProjectFile = (
  project: string,
  file: string = ""
): string => resolve(process.cwd(), "projects", project, file)

export const getExtension = (filename: string): "jpeg" | "png" => {
  const { ext } = parse(filename)
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "jpeg"
    case ".png":
      return "png"
    default:
      throw new Error(`Invalid image extension "${ext}".`)
  }
}
