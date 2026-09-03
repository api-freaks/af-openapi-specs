import { dump, load } from "js-yaml";

export function toYaml(spec: unknown): string {
  const yaml = dump(spec, { noRefs: true, lineWidth: -1 });
  if (JSON.stringify(load(yaml)) !== JSON.stringify(spec)) {
    throw new Error("YAML round-trip mismatch");
  }
  return yaml;
}
