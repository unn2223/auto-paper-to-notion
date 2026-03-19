import fs from "node:fs";
import path from "node:path";

function main() {
  const cwd = process.cwd();
  const pdfFiles = fs
    .readdirSync(cwd, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".pdf"))
    .map((entry) => {
      const fullPath = path.join(cwd, entry.name);
      const stat = fs.statSync(fullPath);
      return {
        name: entry.name,
        fullPath,
        mtimeMs: stat.mtimeMs
      };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  if (pdfFiles.length === 0) {
    throw new Error("No PDF files found in the project root.");
  }

  if (process.argv.includes("--latest")) {
    console.log(pdfFiles[0].fullPath);
    return;
  }

  console.log(JSON.stringify(pdfFiles, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
