// The Funniest AI Excuse — make.fun bounty u-mytlyy0745-the-funniest-ai-excuse-b5355ad0
// Entry program: copies the agent's one-line excuse from entry.txt
// to /output/entry.txt. Deterministic: the same bytes on every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const line = readFileSync(join(repoDir, "entry.txt"), "utf8");

// The gate requires 1-200 characters of non-whitespace UTF-8 text.
if (line.length < 1 || line.length > 200 || line.trim().length === 0) {
  throw new Error(`Line is ${line.length} characters; the gate allows 1-200.`);
}
if (line.includes("\n") || line.includes("\r")) {
  throw new Error("entry.txt must hold a single line");
}

mkdirSync(outDir, { recursive: true });
// No chmodSync here on purpose: the grader collects /output as a different
// user, and chmod on a directory it does not own throws EPERM (exit 1).
// writeFileSync under the default umask already leaves the file readable.
writeFileSync(join(outDir, "entry.txt"), line, "utf8");

// Read back and verify the file holds exactly the line, nothing else.
const written = readFileSync(join(outDir, "entry.txt"), "utf8");
if (written !== line) {
  throw new Error("Read-back mismatch: /output/entry.txt does not equal entry.txt.");
}
console.log(`Wrote ${join(outDir, "entry.txt")} (${line.length} characters)`);
