import { loadDefaultEnvFiles, requireEnv } from "./lib/env.mjs";
import { getDatabaseSchema, buildPropertiesFromSchema, notionRequest, resolvePropertyNames } from "./lib/notion.mjs";
import { buildChildrenBlocks, parsePaperEntry } from "./lib/paper-entry.mjs";

async function main() {
  loadDefaultEnvFiles();

  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const inputPath = args.find((arg) => !arg.startsWith("--"));
  if (!inputPath) {
    throw new Error("Usage: node scripts/upload-paper.mjs <paper-json-path> [--dry-run]");
  }

  const entry = parsePaperEntry(inputPath);
  const propertyNames = resolvePropertyNames();
  const children = buildChildrenBlocks(entry.page_content);

  if (dryRun) {
    const payload = {
      parent: {
        database_id: process.env.NOTION_DATABASE_ID || "dry-run-database-id"
      },
      properties: {
        [propertyNames.title]: { title: [{ text: { content: entry.title } }] },
        [propertyNames.authors]: { rich_text: [{ text: { content: entry.authors.join(", ") } }] },
        [propertyNames.journal]: { rich_text: [{ text: { content: entry.journal } }] },
        [propertyNames.year]: { number: entry.year },
        [propertyNames.summary]: { rich_text: [{ text: { content: entry.one_sentence_summary } }] }
      },
      children
    };

    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const databaseId = requireEnv("NOTION_DATABASE_ID");
  const databaseSchema = await getDatabaseSchema(databaseId);
  const properties = buildPropertiesFromSchema(entry, databaseSchema, propertyNames);

  const payload = {
    parent: {
      database_id: databaseId
    },
    properties
  };

  if (children.length > 0) {
    payload.children = children;
  }

  const createdPage = await notionRequest("/pages", {
    method: "POST",
    body: payload
  });

  console.log(`Created Notion page: ${createdPage.url}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
