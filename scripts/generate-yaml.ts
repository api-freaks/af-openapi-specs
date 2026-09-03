import {
  readdirSync,
  statSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
} from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { toYaml } from "./yaml.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const specsDir = join(__dirname, "..", "specs");
const outDir = join(__dirname, "..", "dist", "specs");

function walkJsonFiles(dir: string): string[] {
  const results: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      results.push(...walkJsonFiles(full));
    } else if (name.endsWith(".json")) {
      results.push(full);
    }
  }
  return results;
}

const jsonFiles = walkJsonFiles(specsDir);

for (const jsonPath of jsonFiles) {
  const relPath = relative(specsDir, jsonPath);
  const parsed = JSON.parse(readFileSync(jsonPath, "utf-8"));
  let yaml: string;
  try {
    yaml = toYaml(parsed);
  } catch (err) {
    throw new Error(`YAML round-trip mismatch for ${relPath}`, { cause: err });
  }

  const outPath = join(outDir, relPath.replace(/\.json$/, ".yaml"));
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, yaml, "utf-8");
}

console.log(`Generated ${jsonFiles.length} YAML specs into dist/specs`);
