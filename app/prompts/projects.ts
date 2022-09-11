import type { Profile } from "./profiles"

export interface Project extends Record<string, unknown> {
  prompts: string[]
  profiles: Profile[]
}

/**
 * Internal project map.
 *
 * @internal
 */
const projects: Map<string, Project> = new Map<string, Project>([
  [
    `yoji`,
    {
      prompts: [
        `gritty 2d matte digital illustration of ((CONCEPT DESCRIPTION)) by (yoji shinkawa) and (dan milligan) and (alex ichim) in the style of (far cry)`,
        `movie poster by (alphonse mucha) and (jesper ejsing) and (tom bagshaw) and (leandro fernández)`,
        `frank castle vietnam`,
        `artstation 2d matte`,
        `dutch from black lagoon anime`
      ],
      profiles: [`quality.cinematic`, `quality.fine`]
    }
  ]
])

/**
 * Extract a project config by key.
 *
 * @param key - Project id string.
 *
 * @public
 */
export const getProject = (key: string): Project => {
  const project: Project | undefined = projects.get(key)

  if (!project) {
    throw new Error(`Invalid project id "${key}".`)
  }

  return project
}
