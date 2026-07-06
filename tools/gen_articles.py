#!/usr/bin/env python3
"""Scan articles/*.md and write articles/index.json.

Run locally for preview:  python3 tools/gen_articles.py
CI runs it automatically on push (see .github/workflows/articles.yml).

Front matter (optional) at the top of each .md:
    ---
    title: My post title
    date: 2026-07-06        # ISO date; used for sorting + display
    excerpt: One-line summary shown in the list.
    ---
Anything missing is derived: title -> slug, excerpt -> first paragraph.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ARTICLES = ROOT / "articles"
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

FM_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n?", re.DOTALL)


def parse_front_matter(text):
    meta = {}
    body = text
    m = FM_RE.match(text)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        body = text[m.end():]
    return meta, body


def first_paragraph(body):
    for block in re.split(r"\n\s*\n", body.strip()):
        block = block.strip()
        if not block or block.startswith(("#", "```", ">", "-", "*", "|")):
            continue
        # strip simple markdown syntax for a clean preview
        text = re.sub(r"[*_`\[\]]", "", block)
        text = re.sub(r"\((https?://[^)]+)\)", "", text)
        text = re.sub(r"\s+", " ", text).strip()
        return (text[:157] + "…") if len(text) > 158 else text
    return ""


def display_date(iso):
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", iso or "")
    if m:
        y, mo, _ = m.groups()
        return f"{MONTHS[int(mo) - 1]} {y}"
    return iso or ""


def main():
    posts = []
    for md in sorted(ARTICLES.glob("*.md")):
        slug = md.stem
        meta, body = parse_front_matter(md.read_text(encoding="utf-8"))
        post = {
            "slug": slug,
            "title": meta.get("title", slug),
            "date": meta.get("date", ""),
            "display": display_date(meta.get("date", "")),
            "excerpt": meta.get("excerpt") or first_paragraph(body),
        }
        posts.append(post)
        # Per-post JSON carries the raw Markdown body. JSON has no YAML front
        # matter, so GitHub Pages serves it verbatim even when Jekyll is on
        # (a raw .md would get converted to .html and 404 on fetch).
        per_post = dict(post, body=body)
        (ARTICLES / f"{slug}.json").write_text(
            json.dumps(per_post, ensure_ascii=False) + "\n", encoding="utf-8")

    # newest first; posts without a date sink to the bottom
    posts.sort(key=lambda p: p["date"] or "0000", reverse=True)

    out = ARTICLES / "index.json"
    out.write_text(json.dumps(posts, ensure_ascii=False, indent=2) + "\n",
                   encoding="utf-8")
    print(f"Wrote {out.relative_to(ROOT)} and {len(posts)} per-post JSON file(s)")


if __name__ == "__main__":
    main()
