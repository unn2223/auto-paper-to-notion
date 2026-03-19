import fs from "node:fs";
import path from "node:path";

export function parsePaperEntry(filePath) {
  const absolutePath = path.resolve(filePath);
  const raw = fs.readFileSync(absolutePath, "utf8");
  const data = JSON.parse(raw);

  if (!data.title || typeof data.title !== "string") {
    throw new Error("Field `title` is required.");
  }

  if (!Array.isArray(data.authors) || data.authors.length === 0) {
    throw new Error("Field `authors` must be a non-empty array.");
  }

  if (!data.journal || typeof data.journal !== "string") {
    throw new Error("Field `journal` is required.");
  }

  if (!Number.isInteger(data.year)) {
    throw new Error("Field `year` must be an integer.");
  }

  if (!data.one_sentence_summary || typeof data.one_sentence_summary !== "string") {
    throw new Error("Field `one_sentence_summary` is required.");
  }

  if (data.page_content && !Array.isArray(data.page_content)) {
    throw new Error("Field `page_content` must be an array when provided.");
  }

  return data;
}

export function buildChildrenBlocks(pageContent = []) {
  const blocks = [];

  for (const section of pageContent) {
    if (!section || typeof section !== "object") {
      continue;
    }

    if (section.heading) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: richText(String(section.heading))
        }
      });
    }

    if (Array.isArray(section.paragraphs)) {
      for (const paragraph of section.paragraphs) {
        if (!paragraph) {
          continue;
        }

        blocks.push({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: richText(String(paragraph))
          }
        });
      }
    }

    if (Array.isArray(section.bullets)) {
      for (const bullet of section.bullets) {
        if (!bullet) {
          continue;
        }

        blocks.push({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: richText(String(bullet))
          }
        });
      }
    }
  }

  return blocks;
}

function richText(content) {
  return [
    {
      type: "text",
      text: {
        content
      }
    }
  ];
}
