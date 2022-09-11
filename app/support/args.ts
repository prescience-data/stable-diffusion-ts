import is from "@sindresorhus/is"
import arg from "arg"
import { ZodBoolean, ZodNumber } from "zod"
import type { Spec } from "arg"
import type { ZodObject } from "zod"

import type { Args } from "../types"

/**
 * Vercel arg spec constructors.
 *
 * @internal
 */
type Constructor = StringConstructor | NumberConstructor | BooleanConstructor

/**
 * Extracts constructor type from Zod type.
 *
 * @param zodType - Zod type to extract.
 *
 * @internal
 */
const getType = (zodType: unknown): Constructor => {
  if (zodType instanceof ZodNumber) {
    return Number
  }

  if (zodType instanceof ZodBoolean) {
    return Boolean
  }

  return String
}

/**
 * Generates a Vercel arg spec from Zod schema.
 *
 * @param schema - Zod schema to deconstruct.
 *
 * @public
 */
export const createSpec = <Z extends ZodObject<any>>(schema: Z): Spec =>
  Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => [
      `--${key}`,
      getType(value)
    ])
  )

/**
 * Parses argv and strips leading dash.
 *
 * @param spec - Vercel arg spec to consume.
 *
 * @public
 */
export const getArgs = <A extends Args>(spec: Spec): A =>
  Object.fromEntries(
    Object.entries(arg(spec)).map(([key, value]) => [
      key.replace(/^[^a-zA-Z]+/, ""),
      value
    ])
  ) as A

/**
 * Flattens an object to a valid execa args array.
 *
 * @param args - Object based args to flatten.
 *
 * @public
 */
export const flattenArgs = <A extends Args>(args: A): string[] =>
  Object.entries(args)
    .flatMap(([key, value]) => [
      `--${key}`,
      is.boolean(value) ? `` : `${value}`
    ])
    .map((arg) => arg.trim())
    .filter((arg) => arg !== ``)

/**
 * Safely wraps complex args in quotes.
 *
 * @param arg - Unsafe arg to wrap.
 *
 * @public
 */
export const wrap = (arg: string): string => `"${arg}"`
