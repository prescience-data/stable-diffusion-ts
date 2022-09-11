import { getProfile } from "./profiles"
import { getProject } from "./projects"
import type { Profile } from "./profiles"

/**
 * Merge and flatten all prompts for a given project.
 *
 * @param project - Project id string.
 *
 * @public
 */
export const loadPrompts = (project: string): string[] => {
  const { prompts, profiles } = getProject(project)

  const input: string[] = [
    ...prompts,
    ...profiles.flatMap((profile: Profile) => getProfile(profile))
  ]
  return [...new Set<string>(input).values()]
}
