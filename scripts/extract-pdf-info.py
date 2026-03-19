import json
import sys
from pathlib import Path

from pypdf import PdfReader

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python scripts/extract-pdf-info.py <pdf-path>")

    pdf_path = Path(sys.argv[1])
    if not pdf_path.exists():
        raise SystemExit(f"PDF not found: {pdf_path}")

    reader = PdfReader(str(pdf_path))
    metadata = {}
    for key, value in (reader.metadata or {}).items():
        metadata[str(key)] = "" if value is None else str(value)

    pages = []
    for index, page in enumerate(reader.pages[:3]):
        text = page.extract_text() or ""
        pages.append(
            {
                "page": index + 1,
                "text_excerpt": text[:5000],
            }
        )

    result = {
        "file": pdf_path.name,
        "page_count": len(reader.pages),
        "metadata": metadata,
        "pages": pages,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
