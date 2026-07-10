#!/usr/bin/env python3
"""Normalize, deduplicate, filter, and summarize literature search records."""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any


def normalize_doi(value: Any) -> str:
    text = str(value or "").strip().lower()
    text = re.sub(r"^https?://(?:dx\.)?doi\.org/", "", text)
    return text.rstrip(".,;:)")


def normalize_title(value: Any) -> str:
    return re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "", str(value or "").lower())


def record_key(record: dict[str, Any]) -> str:
    doi = normalize_doi(record.get("doi"))
    if doi:
        return f"doi:{doi}"
    pmid = str(record.get("pmid") or "").strip()
    if pmid:
        return f"pmid:{pmid}"
    title = normalize_title(record.get("title"))
    year = str(record.get("year") or "").strip()
    first_author = normalize_title(record.get("first_author") or record.get("authors"))[:40]
    return f"title:{title}|year:{year}|author:{first_author}"


def richness(record: dict[str, Any]) -> tuple[int, int]:
    populated = sum(value not in (None, "", [], {}) for value in record.values())
    return populated, len(json.dumps(record, ensure_ascii=False))


def load_records(path: Path) -> list[dict[str, Any]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    records = payload.get("records") if isinstance(payload, dict) else payload
    if not isinstance(records, list) or not all(isinstance(x, dict) for x in records):
        raise ValueError("Input must be a JSON list or an object containing a records list")
    return records


def process(records: list[dict[str, Any]], year_start: int | None = None,
            year_end: int | None = None) -> dict[str, Any]:
    groups: dict[str, list[dict[str, Any]]] = {}
    filtered: list[dict[str, Any]] = []
    excluded_by_year = 0
    for raw in records:
        record = dict(raw)
        if record.get("doi"):
            record["doi"] = normalize_doi(record["doi"])
        try:
            year = int(record.get("year"))
        except (TypeError, ValueError):
            year = None
        if (year_start and year and year < year_start) or (year_end and year and year > year_end):
            excluded_by_year += 1
            continue
        filtered.append(record)
        groups.setdefault(record_key(record), []).append(record)

    unique, duplicate_groups = [], []
    for key, group in groups.items():
        ordered = sorted(group, key=richness, reverse=True)
        unique.append(ordered[0])
        if len(ordered) > 1:
            duplicate_groups.append({"key": key, "kept": ordered[0], "duplicates": ordered[1:]})

    sources = Counter(str(x.get("source") or x.get("database") or "unknown") for x in unique)
    years = Counter(str(x.get("year") or "unknown") for x in unique)
    return {
        "records": unique,
        "duplicate_groups": duplicate_groups,
        "summary": {
            "input_records": len(records),
            "excluded_by_year": excluded_by_year,
            "unique_records": len(unique),
            "duplicates_removed": sum(len(x["duplicates"]) for x in duplicate_groups),
            "sources": dict(sorted(sources.items())),
            "years": dict(sorted(years.items())),
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--year-start", type=int)
    parser.add_argument("--year-end", type=int)
    args = parser.parse_args()
    try:
        result = process(load_records(args.input), args.year_start, args.year_end)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        parser.error(str(exc))
    text = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        args.output.write_text(text + "\n", encoding="utf-8")
    else:
        print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

