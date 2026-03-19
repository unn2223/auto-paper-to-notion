import { loadDefaultEnvFiles, requireEnv } from "./lib/env.mjs";
import { getDatabaseSchema, resolvePropertyNames } from "./lib/notion.mjs";

async function main() {
  loadDefaultEnvFiles();

  const databaseId = requireEnv("NOTION_DATABASE_ID");
  const databaseSchema = await getDatabaseSchema(databaseId);
  const propertyNames = resolvePropertyNames();

  const summary = Object.values(propertyNames).map((propertyName) => {
    const property = databaseSchema.properties?.[propertyName];
    return {
      name: propertyName,
      type: property ? property.type : "missing"
    };
  });

  console.log(`Database title: ${databaseSchema.title?.map((item) => item.plain_text).join("") || "(untitled)"}`);
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
