export type { OpenAPISpec } from "./types.js";
export {
  SPEC_SLUGS,
  SPECS,
  SPECS_YAML,
  SPEC_CATEGORIES,
  SPECS_BY_CATEGORY,
  SpecSlug,
  SpecCategory,
} from "./manifest.js";
export type { SpecSlugValue, SpecCategoryValue } from "./manifest.js";

import { SPECS, SPECS_YAML, SPECS_BY_CATEGORY } from "./manifest.js";
import type { OpenAPISpec } from "./types.js";
import type { SpecSlugValue, SpecCategoryValue } from "./manifest.js";

// `(string & {})` keeps autocomplete/compile-checking for known slugs via SpecSlug
// while still accepting arbitrary strings at the call site.
export function getSpecJson(
  slug: SpecSlugValue | (string & {}),
): OpenAPISpec | undefined {
  return SPECS[slug];
}

export function getSpecYaml(
  slug: SpecSlugValue | (string & {}),
): string | undefined {
  return SPECS_YAML[slug];
}

/** @deprecated Use {@link getSpecJson} instead. Removed in the next major version. */
export function getSpec(
  slug: SpecSlugValue | (string & {}),
): OpenAPISpec | undefined {
  return getSpecJson(slug);
}

export function getSpecsByCategory(
  category: SpecCategoryValue | (string & {}),
): string[] {
  return SPECS_BY_CATEGORY[category] ?? [];
}
