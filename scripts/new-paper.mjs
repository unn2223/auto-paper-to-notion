import fs from "node:fs";
import path from "node:path";

const templatePath = path.resolve("templates/paper-entry.template.json");

function main() {
  const targetPath = process.argv[2];
  if (!targetPath) {
    throw new Error("Usage: node scripts/new-paper.mjs <output-json-path>");
  }

  const absoluteTargetPath = path.resolve(targetPath);
  if (fs.existsSync(absoluteTargetPath)) {
    throw new Error(`File already exists: ${absoluteTargetPath}`);
  }

  fs.mkdirSync(path.dirname(absoluteTargetPath), { recursive: true });
  fs.copyFileSync(templatePath, absoluteTargetPath);
  console.log(`Created paper template: ${absoluteTargetPath}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
