import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, basename, relative } from "node:path";
import { load } from "js-yaml";
import {
  SPEC_SLUGS,
  SPECS,
  SPEC_CATEGORIES,
  SPECS_BY_CATEGORY,
  getSpecsByCategory,
} from "../src/index.js";

const specsDir = join(import.meta.dirname, "..", "specs");

function findAllSpecs(dir: string): string[] {
  const results: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      results.push(...findAllSpecs(full));
    } else if (name.endsWith(".json")) {
      results.push(relative(specsDir, full));
    }
  }
  return results;
}

const allSpecFiles = findAllSpecs(specsDir);

describe("OpenAPI spec validation", () => {
  for (const relPath of allSpecFiles) {
    const filePath = join(specsDir, relPath);

    it(`${relPath} is valid and well-formed`, () => {
      const raw = readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      assert.ok(parsed, `${relPath} should parse to an object`);

      assert.ok(
        typeof parsed.openapi === "string" && parsed.openapi.startsWith("3."),
        `${relPath} must have openapi version starting with "3."`,
      );
      assert.ok(parsed.info?.title, `${relPath} must have info.title`);
      assert.ok(parsed.info?.version, `${relPath} must have info.version`);
      assert.ok(
        parsed.paths && Object.keys(parsed.paths).length > 0,
        `${relPath} must have at least one path`,
      );
    });
  }

  it("SPEC_SLUGS length matches number of spec files", () => {
    assert.equal(SPEC_SLUGS.length, allSpecFiles.length);
  });

  it("every SPEC_SLUGS entry has a corresponding SPECS entry", () => {
    for (const slug of SPEC_SLUGS) {
      assert.ok(SPECS[slug], `SPECS['${slug}'] should exist`);
    }
  });
});

describe("Category structure", () => {
  it("SPEC_CATEGORIES is non-empty", () => {
    assert.ok(
      SPEC_CATEGORIES.length > 0,
      "SPEC_CATEGORIES should not be empty",
    );
  });

  it("every category in SPECS_BY_CATEGORY exists in SPEC_CATEGORIES", () => {
    for (const cat of Object.keys(SPECS_BY_CATEGORY)) {
      assert.ok(
        SPEC_CATEGORIES.includes(cat),
        `SPECS_BY_CATEGORY['${cat}'] should be in SPEC_CATEGORIES`,
      );
    }
  });

  it("every SPEC_CATEGORIES entry has a SPECS_BY_CATEGORY entry", () => {
    for (const cat of SPEC_CATEGORIES) {
      assert.ok(
        SPECS_BY_CATEGORY[cat],
        `SPECS_BY_CATEGORY['${cat}'] should exist`,
      );
    }
  });

  it("every slug in SPECS_BY_CATEGORY exists in SPECS", () => {
    for (const [cat, slugs] of Object.entries(SPECS_BY_CATEGORY)) {
      for (const slug of slugs) {
        assert.ok(
          SPECS[slug],
          `SPECS_BY_CATEGORY['${cat}'] contains '${slug}' which should be in SPECS`,
        );
      }
    }
  });

  it("getSpecsByCategory returns correct slugs", () => {
    for (const cat of SPEC_CATEGORIES) {
      const slugs = getSpecsByCategory(cat);
      assert.deepEqual(slugs, SPECS_BY_CATEGORY[cat]);
    }
  });

  it("getSpecsByCategory returns empty array for unknown category", () => {
    assert.deepEqual(getSpecsByCategory("nonexistent"), []);
  });
});

const distSpecsDir = join(import.meta.dirname, "..", "dist", "specs");

describe("YAML spec generation", { skip: !existsSync(distSpecsDir) }, () => {
  for (const relPath of allSpecFiles) {
    const slug = basename(relPath, ".json");

    it(`${slug} YAML matches its JSON source`, () => {
      const jsonSpec = JSON.parse(
        readFileSync(join(specsDir, relPath), "utf-8"),
      );
      const yamlPath = join(distSpecsDir, relPath.replace(/\.json$/, ".yaml"));
      const yamlSpec = load(readFileSync(yamlPath, "utf-8"));
      assert.deepEqual(
        yamlSpec,
        jsonSpec,
        `${relPath} YAML must match its JSON source`,
      );
    });
  }
});
