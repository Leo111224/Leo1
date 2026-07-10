#!/usr/bin/env python3
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter

BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"

def search_pubmed(query: str, max_results: int = 30, email: str = "research@example.com") -> dict:
    params = urllib.parse.urlencode({"db": "pubmed", "term": query, "retmax": min(max_results, 100), "retmode": "json", "sort": "relevance", "email": email})
    with urllib.request.urlopen(f"{BASE}/esearch.fcgi?{params}", timeout=30) as response:
        found = json.loads(response.read().decode("utf-8"))["esearchresult"]
    ids = found.get("idlist", [])
    if not ids:
        return {"total": 0, "articles": []}
    summary = urllib.parse.urlencode({"db": "pubmed", "id": ",".join(ids), "retmode": "json", "email": email})
    with urllib.request.urlopen(f"{BASE}/esummary.fcgi?{summary}", timeout=30) as response:
        result = json.loads(response.read().decode("utf-8"))["result"]
    articles = [{"pmid": pmid, "title": result[pmid].get("title", ""), "journal": result[pmid].get("fulljournalname", ""), "date": result[pmid].get("pubdate", "")} for pmid in ids if pmid in result]
    return {"total": int(found.get("count", 0)), "returned": len(articles), "articles": articles}

def word_frequency(texts: list[str], top_n: int = 20) -> list[tuple[str, int]]:
    stop = {"with", "from", "that", "this", "were", "study", "patients", "using", "between"}
    words = re.findall(r"[A-Za-z][A-Za-z-]{3,}", " ".join(texts).lower())
    return Counter(word for word in words if word not in stop).most_common(top_n)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("topic")
    parser.add_argument("--max-results", type=int, default=30)
    args = parser.parse_args()
    print(json.dumps(search_pubmed(args.topic, args.max_results), ensure_ascii=False, indent=2))
