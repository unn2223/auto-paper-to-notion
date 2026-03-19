import { requireEnv } from "./env.mjs";

export const NOTION_API_BASE_URL = "https://api.notion.com/v1";
export const NOTION_VERSION = "2022-06-28";
export const DEFAULT_PROPERTY_NAMES = {
  title: "\uB17C\uBB38 \uC81C\uBAA9",
  authors: "\uC800\uC790",
  journal: "\uC800\uB110\uBA85",
  year: "\uCD9C\uD310\uC5F0\uB3C4",
  summary: "\uC8FC\uC694\uB0B4\uC6A9 \uC694\uC57D"
};

export async function notionRequest(resourcePath, options = {}) {
  const token = requireEnv("NOTION_TOKEN");
  const method = options.method || "GET";

  let response;
  try {
    response = await fetch(`${NOTION_API_BASE_URL}${resourcePath}`, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION,
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch (error) {
    throw new Error(describeNetworkError(resourcePath, error));
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Notion API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function getDatabaseSchema(databaseId) {
  return notionRequest(`/databases/${databaseId}`);
}

export function resolvePropertyNames() {
  return {
    title: process.env.NOTION_PROP_TITLE || DEFAULT_PROPERTY_NAMES.title,
    authors: process.env.NOTION_PROP_AUTHORS || DEFAULT_PROPERTY_NAMES.authors,
    journal: process.env.NOTION_PROP_JOURNAL || DEFAULT_PROPERTY_NAMES.journal,
    year: process.env.NOTION_PROP_YEAR || DEFAULT_PROPERTY_NAMES.year,
    summary: process.env.NOTION_PROP_SUMMARY || DEFAULT_PROPERTY_NAMES.summary
  };
}

export function buildPropertiesFromSchema(entry, databaseSchema, propertyNames) {
  const schemaProperties = databaseSchema.properties || {};

  return {
    [propertyNames.title]: buildPropertyValue(
      lookupProperty(schemaProperties, propertyNames.title),
      entry.title
    ),
    [propertyNames.authors]: buildPropertyValue(
      lookupProperty(schemaProperties, propertyNames.authors),
      entry.authors
    ),
    [propertyNames.journal]: buildPropertyValue(
      lookupProperty(schemaProperties, propertyNames.journal),
      entry.journal
    ),
    [propertyNames.year]: buildPropertyValue(
      lookupProperty(schemaProperties, propertyNames.year),
      entry.year
    ),
    [propertyNames.summary]: buildPropertyValue(
      lookupProperty(schemaProperties, propertyNames.summary),
      entry.one_sentence_summary
    )
  };
}

function lookupProperty(properties, propertyName) {
  const property = properties[propertyName];
  if (!property) {
    throw new Error(`Property not found in Notion database: ${propertyName}`);
  }
  return property;
}

function buildPropertyValue(property, rawValue) {
  switch (property.type) {
    case "title":
      return {
        title: buildRichTextArray(String(rawValue))
      };
    case "rich_text":
      return {
        rich_text: buildRichTextArray(arrayToText(rawValue))
      };
    case "number":
      return {
        number: typeof rawValue === "number" ? rawValue : Number(rawValue)
      };
    case "date":
      return {
        date: {
          start: formatYearAsDate(rawValue)
        }
      };
    case "url":
      return {
        url: String(rawValue)
      };
    case "select":
      return {
        select: {
          name: String(rawValue)
        }
      };
    case "multi_select":
      return {
        multi_select: arrayToList(rawValue).map((item) => ({
          name: String(item)
        }))
      };
    default:
      throw new Error(
        `Unsupported property type for automation: ${property.name} (${property.type})`
      );
  }
}

function buildRichTextArray(content) {
  return [
    {
      text: {
        content
      }
    }
  ];
}

function arrayToText(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}

function arrayToList(value) {
  return Array.isArray(value) ? value : [value];
}

function formatYearAsDate(value) {
  const year = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(year)) {
    throw new Error(`Cannot convert value to year/date: ${value}`);
  }
  return `${year}-01-01`;
}

function describeNetworkError(resourcePath, error) {
  const message = error instanceof Error ? error.message : String(error);

  if (/fetch failed/i.test(message)) {
    return [
      `Failed to reach the Notion API at ${resourcePath}.`,
      "This usually means the current environment blocked outbound network access or DNS/TLS failed.",
      "If you are running inside Codex, rerun the same command outside the sandbox.",
      `Original error: ${message}`
    ].join(" ");
  }

  return `Failed to reach the Notion API at ${resourcePath}: ${message}`;
}