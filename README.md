# @apifreaks/openapi-specs

[![npm](https://img.shields.io/npm/v/@apifreaks/openapi-specs.svg)](https://www.npmjs.com/package/@apifreaks/openapi-specs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

npm package and source repo for the public [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.1.html) specifications of [APIFreaks](https://apifreaks.com) products.

The specs (catalog, authentication, and how to open them in Swagger, Postman, or a code generator) are in **[specs/README.md](specs/README.md)**. This README is the package: install, the typed lookup API, and how the repo is built.

## Install

```bash
npm install @apifreaks/openapi-specs
```

Node.js 18 or later. ESM and CommonJS are both supported.

## Usage

Importing anything from `@apifreaks/openapi-specs` (the package entry) loads every spec. Use that when you need to list or look up specs at runtime. For a single product, import the JSON file (see below) so you do not go through that entry.

### Lookup

```ts
import {
  getSpecJson,
  getSpecYaml,
  getSpecsByCategory,
  SpecSlug,
  SpecCategory,
} from "@apifreaks/openapi-specs";

const spec = getSpecJson(SpecSlug.IP_LOCATOR);
const yaml = getSpecYaml(SpecSlug.IP_LOCATOR);
const ipSlugs = getSpecsByCategory(SpecCategory.IP_INTELLIGENCE);
```

`SpecSlug` and `SpecCategory` are generated from `specs/`. If you write `SpecSlug.IP_LOCATOR` and that file is later renamed or removed, TypeScript fails at compile time. Raw strings (`getSpecJson("ip-locator")`) still typecheck; unknown slugs return `undefined` at runtime. Unknown categories return `[]`.

`getSpec` is a deprecated alias for `getSpecJson` and will be removed in the next major version.

### Single spec

JSON is published from `specs/`. TypeScript JSON imports need `"resolveJsonModule": true`.

```ts
import ipLocator from "@apifreaks/openapi-specs/specs/ip-intelligence/ip-locator.json";
```

YAML copies are also generated at build time into `dist/specs/` (not in the GitHub `specs/` folder) and published as files, but the YAML text is also embedded in the manifest — reading it through `getSpecYaml(slug)` at runtime, rather than importing the `.yaml` file, works from any module system (Node can't `import` `.yaml`) and needs no filesystem access.

### CommonJS

```js
const { getSpecJson, getSpecYaml, SpecSlug } = require("@apifreaks/openapi-specs");
```

## Exports

Importing any of these from `@apifreaks/openapi-specs` loads every spec.

| Export | Type | Description |
| ------ | ---- | ----------- |
| `getSpecJson(slug)` | `(string) => OpenAPISpec \| undefined` | Spec object for a slug |
| `getSpecYaml(slug)` | `(string) => string \| undefined` | Pre-rendered YAML text for a slug |
| `getSpec(slug)` | `(string) => OpenAPISpec \| undefined` | **Deprecated.** Alias for `getSpecJson`, removed in the next major version |
| `getSpecsByCategory(category)` | `(string) => string[]` | Slugs in a category, or `[]` |
| `SpecSlug` | `{ IP_LOCATOR: "ip-locator", … }` | Enumerated slugs |
| `SpecCategory` | `{ IP_INTELLIGENCE: "ip-intelligence", … }` | Enumerated categories |
| `SPEC_SLUGS` | `string[]` | All slugs |
| `SPEC_CATEGORIES` | `string[]` | All category names |
| `SPECS` | `Record<string, OpenAPISpec>` | Spec objects keyed by slug |
| `SPECS_YAML` | `Record<string, string>` | Pre-rendered YAML text keyed by slug |
| `SPECS_BY_CATEGORY` | `Record<string, string[]>` | Slugs grouped by category |

```ts
import type {
  OpenAPISpec,
  SpecSlugValue,
  SpecCategoryValue,
} from "@apifreaks/openapi-specs";
```

`OpenAPISpec` is a typed envelope (`openapi`, `info`, `paths`, …), not a full OpenAPI 3.1 schema.

## Development

```
specs/                     # OpenAPI JSON. See specs/README.md
src/
  index.ts                 # Public API
  types.ts                 # OpenAPISpec
  manifest.ts              # AUTO-GENERATED. Do not edit.
scripts/
  generate-manifest.ts     # Walks specs/, writes src/manifest.ts (embeds JSON + YAML)
  generate-yaml.ts         # JSON → dist/specs/**/*.yaml (published files)
  yaml.ts                  # Shared JSON->YAML dump used by both scripts
test/
  validate.test.ts         # JSON well-formedness; YAML round-trip after build
```

```bash
npm install
npm run generate      # regenerate src/manifest.ts from specs/
npm run build         # generate + bundle + YAML
npm run typecheck
npm test
```

`src/manifest.ts` is produced by `npm run generate`. It imports every spec and builds `SPECS`, `SPECS_YAML`, `SPEC_SLUGS`, `SpecSlug`, and `SpecCategory`.

### Adding a spec

1. Add a complete OpenAPI 3.1 document at `specs/<category>/<slug>.json`. Use the same security schemes as the existing files: header `X-apiKey` and query `apiKey`.
2. Run `npm run generate`. Do not edit `src/manifest.ts` by hand.
3. Run `npm test`, then `npm run build`.

## Maintainers

`prepublishOnly` runs the build. The published tarball includes `dist/`, `specs/`, `package.json`, README, and LICENSE.

Pushing a tag matching `v*` publishes to npm via GitHub Actions. The bump scripts **test, commit a version, tag, and push**; they will trigger that publish:

```bash
npm run bump:patch
npm run bump:minor
npm run bump:major
```

## License

[MIT](LICENSE)
