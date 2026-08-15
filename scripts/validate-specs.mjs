#!/usr/bin/env node
/**
 * Validates docs/specs/*.json against spec.schema.json (no extra deps).
 * Run from repo root: node scripts/validate-specs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const specsDir = path.join(root, "docs", "specs");
const schema = JSON.parse(
  fs.readFileSync(path.join(specsDir, "spec.schema.json"), "utf8")
);

const ID_RE = /^[a-z0-9-]+$/;
const LAYERS = new Set(schema.properties.layer.enum);
const required = schema.required;

function fail(file, msg) {
  console.error(`FAIL ${file}: ${msg}`);
  return false;
}

function validateSpec(file, data) {
  let ok = true;
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return fail(file, "root must be an object");
  }
  for (const key of required) {
    if (!(key in data)) ok = fail(file, `missing "${key}"`) && ok;
  }
  for (const key of Object.keys(data)) {
    if (!schema.properties[key]) ok = fail(file, `unknown key "${key}"`) && ok;
  }
  if (typeof data.id !== "string" || !ID_RE.test(data.id)) {
    ok = fail(file, "id must match ^[a-z0-9-]+$") && ok;
  }
  const base = path.basename(file, ".json");
  if (data.id && data.id !== base) {
    ok = fail(file, `id "${data.id}" must match filename "${base}"`) && ok;
  }
  if (!LAYERS.has(data.layer)) {
    ok = fail(file, `layer must be one of ${[...LAYERS].join(", ")}`) && ok;
  }
  if (typeof data.doc !== "string" || !data.doc.startsWith("docs/")) {
    ok = fail(file, 'doc must be a path starting with "docs/"') && ok;
  }
  for (const field of ["given", "when", "then"]) {
    if (
      data[field] !== undefined &&
      (typeof data[field] !== "object" ||
        data[field] === null ||
        Array.isArray(data[field]))
    ) {
      ok = fail(file, `"${field}" must be an object`) && ok;
    }
  }
  return ok;
}

const files = fs
  .readdirSync(specsDir)
  .filter((f) => f.endsWith(".json") && f !== "spec.schema.json")
  .sort();

if (files.length === 0) {
  console.error("FAIL: no spec JSON files in docs/specs/");
  process.exit(1);
}

let passed = 0;
for (const file of files) {
  const full = path.join(specsDir, file);
  const data = JSON.parse(fs.readFileSync(full, "utf8"));
  if (validateSpec(file, data)) {
    console.log(`ok ${data.id}`);
    passed += 1;
  }
}

const failed = files.length - passed;
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
