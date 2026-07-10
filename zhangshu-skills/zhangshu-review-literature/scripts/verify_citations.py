#!/usr/bin/env python3
"""Extract, normalize, and optionally verify DOI citations through Crossref."""

from __future__ import annotations

import argparse
import json
import re
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

DOI_PATTERN = re.compile(r"10\.\d{4,9}/[-._;()/:A-Z0-9]+", re.I)


def extract_dois(text: str) -> list[str]:
    dois = []
    for raw in DOI_PATTERN.findall(text):
        doi = raw.rstrip(".,;:)]}").lower()
        if doi not in dois:
            dois.append(doi)
    return dois


def verify_crossref(doi: str, timeout: float) -> dict[str, object]:
    url = "https://api.crossref.org/works/" + urllib.parse.quote(doi, safe="")
    request = urllib.request.Request(url, headers={"User-Agent": "ZhangshuReviewVerifier/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            message = json.load(response).get("message", {})
        return {
            "doi": doi,
            "verified": True,
            "title": (message.get("title") or [""])[0],
            "journal": (message.get("container-title") or [""])[0],
            "type": message.get("type", ""),
        }
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as exc:
        return {"doi": doi, "verified": False, "error": str(exc)}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--online", action="store_true", help="Verify each DOI against Crossref")
    parser.add_argument("--timeout", type=float, default=10.0)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    try:
        content = args.input.read_text(encoding="utf-8")
    except OSError as exc:
        parser.error(str(exc))
    dois = extract_dois(content)
    items = [verify_crossref(doi, args.timeout) for doi in dois] if args.online else [
        {"doi": doi, "verified": None, "status": "syntax_only"} for doi in dois
    ]
    report = {
        "mode": "online" if args.online else "syntax_only",
        "total_unique_dois": len(dois),
        "verified": sum(x.get("verified") is True for x in items),
        "failed": sum(x.get("verified") is False for x in items),
        "items": items,
    }
    text = json.dumps(report, ensure_ascii=False, indent=2)
    if args.output:
        args.output.write_text(text + "\n", encoding="utf-8")
    else:
        print(text)
    return 1 if args.online and report["failed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())

