#!/usr/bin/env python3
"""Crawl official Italian university catalogues into a review-safe snapshot.

The crawler discovers programmes and basic catalogue metadata only. Generated SQL
never marks a programme verified and never overwrites human-reviewed admission
rules, deadlines, fees, evidence, or verification state.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
from dataclasses import asdict, dataclass
from datetime import date
from pathlib import Path
from typing import Callable, Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup, Tag


ACADEMIC_YEAR = "2026/27"
USER_AGENT = "AdmissionsPortalCatalogueBot/1.0 (+human-reviewed admissions catalogue)"


@dataclass(frozen=True)
class Programme:
    university_slug: str
    university_name: str
    programme_name: str
    city: str
    degree_level: str
    teaching_language: str
    official_programme_code: str | None
    degree_class: str | None
    duration_years: float | None
    source_url: str
    catalogue_source_url: str
    academic_year: str = ACADEMIC_YEAR

    @property
    def identity(self) -> str:
        identifier = self.official_programme_code or f"{normalize_key(self.programme_name)}:{normalize_key(self.degree_level)}"
        return f"{self.university_slug}:{identifier}:{self.academic_year}"

    def serialized(self) -> dict[str, object]:
        data = asdict(self)
        data["content_hash"] = hashlib.sha256(
            json.dumps(data, sort_keys=True, ensure_ascii=False).encode("utf-8")
        ).hexdigest()[:16]
        return data


@dataclass(frozen=True)
class Source:
    key: str
    url: str
    offline_filename: str
    parser: Callable[[str, str], list[Programme]]


def clean(value: str) -> str:
    return " ".join(value.split()).strip()


def normalize_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.casefold()).strip("-")


def text_after_label(card: Tag, label: str) -> str | None:
    text = clean(card.get_text(" ", strip=True))
    next_labels = {
        "Place of teaching": r"Language",
        "Language": r"Duration",
    }
    boundary = next_labels.get(label, r"[A-Z][A-Za-z ]+")
    match = re.search(rf"{re.escape(label)}\s*:\s*(.*?)(?=\s+{boundary}\s*:|$)", text)
    return clean(match.group(1)) if match else None


def parse_bologna(html: str, catalogue_url: str, default_level: str) -> list[Programme]:
    soup = BeautifulSoup(html, "html.parser")
    programmes: list[Programme] = []

    for card in soup.select(".card-list-abstract > .item"):
        language = text_after_label(card, "Language")
        if not language or "English" not in language:
            continue

        heading = card.find(["h2", "h3", "h4", "h5"])
        link = card.select_one(".card-actions a[href]")
        if not heading or not link:
            continue

        name = clean(heading.get_text(" ", strip=True))
        card_text = clean(card.get_text(" ", strip=True))
        codes = re.findall(r"\bCod\.\s*(\d+)\b", card_text)
        duration_match = re.search(r"Duration\s*:\s*(\d+(?:\.\d+)?)\s*years?", card_text)
        source_url = urljoin(catalogue_url, str(link.get("href")))
        level = "Single-cycle" if "/singlecycle/" in source_url else default_level

        programmes.append(
            Programme(
                university_slug="bologna",
                university_name="University of Bologna",
                programme_name=name,
                city=text_after_label(card, "Place of teaching") or "Bologna",
                degree_level=level,
                teaching_language="English",
                official_programme_code=codes[0] if codes else None,
                degree_class=None,
                duration_years=float(duration_match.group(1)) if duration_match else None,
                source_url=source_url,
                catalogue_source_url=catalogue_url,
            )
        )

    return programmes


def parse_bologna_first(html: str, catalogue_url: str) -> list[Programme]:
    return parse_bologna(html, catalogue_url, "Bachelor")


def parse_bologna_second(html: str, catalogue_url: str) -> list[Programme]:
    return parse_bologna(html, catalogue_url, "Master")


def sapienza_degree_level(degree_class: str) -> str:
    normalized = degree_class.upper().replace(".", "").strip()
    if normalized in {"LM-41", "LM-46", "LM-42", "LMR/02", "LMG/01"}:
        return "Single-cycle"
    if normalized.startswith("LM"):
        return "Master"
    return "Bachelor"


def parse_sapienza(html: str, catalogue_url: str) -> list[Programme]:
    soup = BeautifulSoup(html, "html.parser")
    programmes: list[Programme] = []

    for card in soup.select("li.corso-card"):
        language_node = card.select_one(".corso--languages")
        title_link = card.select_one(".corso--header a[href]")
        code_node = card.select_one(".corso--codice")
        class_nodes = card.select(".corso--tipologia")
        if not language_node or not title_link or not code_node:
            continue

        language_text = clean(language_node.get_text(" ", strip=True)).upper()
        if not re.search(r"\bENG\b", language_text):
            continue

        code_match = re.search(r"\b(\d{4,6})\b", clean(code_node.get_text(" ", strip=True)))
        degree_class = ""
        for node in class_nodes:
            candidate = clean(node.get_text(" ", strip=True))
            if re.search(r"\b(?:L|LM|LMG|LMR)[-/]", candidate, re.IGNORECASE):
                degree_class = candidate
                break
        degree_class = re.sub(r"\.$", "", degree_class).strip() or None

        programmes.append(
            Programme(
                university_slug="sapienza",
                university_name="Sapienza University of Rome",
                programme_name=clean(title_link.get_text(" ", strip=True)),
                city="Rome",
                degree_level=sapienza_degree_level(degree_class or ""),
                teaching_language="English",
                official_programme_code=code_match.group(1) if code_match else None,
                degree_class=degree_class,
                duration_years=(
                    5.0
                    if sapienza_degree_level(degree_class or "") == "Single-cycle"
                    else 2.0
                    if sapienza_degree_level(degree_class or "") == "Master"
                    else 3.0
                ),
                source_url=urljoin(catalogue_url, str(title_link.get("href"))),
                catalogue_source_url=catalogue_url,
            )
        )

    return programmes


def padua_links(container: Tag, catalogue_url: str, level: str) -> list[Programme]:
    programmes: list[Programme] = []
    for link in container.select("a[href]"):
        href = str(link.get("href"))
        name = clean(link.get_text(" ", strip=True))
        if "/en/corsi-di-laurea/" not in href or not name:
            continue
        if "new programme 2027/2028" in name.casefold() or "to be approved" in name.casefold():
            continue
        programmes.append(
            Programme(
                university_slug="padova",
                university_name="University of Padua",
                programme_name=name,
                city="Padua",
                degree_level=level,
                teaching_language="English",
                official_programme_code=None,
                degree_class=None,
                duration_years=3.0 if level == "Bachelor" else 2.0 if level == "Master" else None,
                source_url=urljoin(catalogue_url, href),
                catalogue_source_url=catalogue_url,
            )
        )
    return programmes


def parse_padua_combined(html: str, catalogue_url: str) -> list[Programme]:
    soup = BeautifulSoup(html, "html.parser")
    programmes: list[Programme] = []
    for marker in soup.find_all(["p", "h2", "h3", "h4"]):
        label = clean(marker.get_text(" ", strip=True)).casefold()
        sibling = marker.find_next_sibling("ul")
        if not sibling:
            continue
        if label == "bachelor's degree programmes":
            programmes.extend(padua_links(sibling, catalogue_url, "Bachelor"))
        elif label == "single-cycle master's degree programmes":
            programmes.extend(padua_links(sibling, catalogue_url, "Single-cycle"))
    return programmes


def parse_padua_master(html: str, catalogue_url: str) -> list[Programme]:
    soup = BeautifulSoup(html, "html.parser")
    main = soup.find("main") or soup
    return padua_links(main, catalogue_url, "Master")


def parse_polito(html: str, catalogue_url: str, level: str) -> list[Programme]:
    soup = BeautifulSoup(html, "html.parser")
    programmes: list[Programme] = []

    for card in soup.select("article.pol-courses--list-item"):
        languages = str(card.get("data-course-languages") or "").split()
        title_link = card.select_one(".pol-course-title a[href]")
        if "EN" not in languages or not title_link:
            continue
        location = card.select_one(".pol-course-data--site dd")
        programmes.append(
            Programme(
                university_slug="torino-politecnico",
                university_name="Politecnico di Torino",
                programme_name=clean(title_link.get_text(" ", strip=True)),
                city=clean(location.get_text(" ", strip=True)) if location else "Turin",
                degree_level=level,
                teaching_language="English",
                official_programme_code=None,
                degree_class=None,
                duration_years=3.0 if level == "Bachelor" else 2.0,
                source_url=urljoin(catalogue_url, str(title_link.get("href"))),
                catalogue_source_url=catalogue_url,
            )
        )
    return programmes


def parse_polito_bachelor(html: str, catalogue_url: str) -> list[Programme]:
    return parse_polito(html, catalogue_url, "Bachelor")


def parse_polito_master(html: str, catalogue_url: str) -> list[Programme]:
    return parse_polito(html, catalogue_url, "Master")


def parse_polimi(html: str, catalogue_url: str, level: str) -> list[Programme]:
    soup = BeautifulSoup(html, "html.parser")
    programmes: list[Programme] = []

    for link in soup.select("a.link[href]"):
        language = link.select_one(".info-label--internet")
        title = link.select_one(".localised-title-title")
        if not language or "ENG" not in clean(language.get_text(" ", strip=True)).split("-") or not title:
            continue
        campuses = [clean(node.get_text(" ", strip=True)) for node in link.select(".campusName")]
        city = ", ".join(dict.fromkeys(campuses)) or "Milan"
        programmes.append(
            Programme(
                university_slug="milano-politecnico",
                university_name="Politecnico di Milano",
                programme_name=clean(title.get_text(" ", strip=True)),
                city=city,
                degree_level=level,
                teaching_language="English",
                official_programme_code=None,
                degree_class=None,
                duration_years=3.0 if level == "Bachelor" else 2.0,
                source_url=urljoin(catalogue_url, str(link.get("href"))),
                catalogue_source_url=catalogue_url,
            )
        )
    return programmes


def parse_polimi_bachelor(html: str, catalogue_url: str) -> list[Programme]:
    return parse_polimi(html, catalogue_url, "Bachelor")


def parse_polimi_master(html: str, catalogue_url: str) -> list[Programme]:
    return parse_polimi(html, catalogue_url, "Master")


def parse_pisa(html: str, catalogue_url: str) -> list[Programme]:
    soup = BeautifulSoup(html, "html.parser")
    programmes: list[Programme] = []

    for paragraph in soup.find_all("p"):
        title_link = paragraph.find("a", href=True)
        if not title_link:
            continue
        raw_name = clean(title_link.get_text(" ", strip=True))
        if not re.match(r"^(?:Master|Bachelor)", raw_name, re.IGNORECASE):
            continue
        paragraph_text = clean(paragraph.get_text(" ", strip=True))
        code_match = re.search(r"\b([A-Z]{2,4}-L(?:M)?)\b", paragraph_text)
        level = "Bachelor" if raw_name.casefold().startswith("bachelor") else "Master"
        name = re.sub(r"^Master(?:’s)?(?: Degree)?\s+(?:in\s+)?", "", raw_name, flags=re.IGNORECASE)
        name = re.sub(r"^Bachelor(?:’s|'s)? Degree\s*(?:[-–]\s*|in\s+)?", "", name, flags=re.IGNORECASE)
        programmes.append(
            Programme(
                university_slug="pisa",
                university_name="University of Pisa",
                programme_name=clean(name),
                city="Pisa",
                degree_level=level,
                teaching_language="English",
                official_programme_code=code_match.group(1) if code_match else None,
                degree_class=None,
                duration_years=3.0 if level == "Bachelor" else 2.0,
                source_url=urljoin(catalogue_url, str(title_link.get("href"))),
                catalogue_source_url=catalogue_url,
            )
        )
    return programmes


SOURCES = [
    Source(
        "unibo-first",
        "https://www.unibo.it/en/study/first-and-single-cycle-degree?corsiper=iscritti&orderby=alphabetic",
        "catalogue-unibo-first.html",
        parse_bologna_first,
    ),
    Source(
        "unibo-second",
        "https://www.unibo.it/en/study/second-cycle-degree?corsiper=iscritti&orderby=alphabetic",
        "catalogue-unibo-second.html",
        parse_bologna_second,
    ),
    Source(
        "padua-bachelor",
        "https://www.unipd.it/en/corsi-laurea-lingua-inglese",
        "catalogue-padua-bachelor.html",
        parse_padua_combined,
    ),
    Source(
        "padua-master",
        "https://www.unipd.it/en/corsi-laurea-magistrale-lingua-inglese",
        "catalogue-padua-master.html",
        parse_padua_master,
    ),
    Source(
        "sapienza",
        "https://corsidilaurea.uniroma1.it/en/home?_language=ENG",
        "catalogue-sapienza.html",
        parse_sapienza,
    ),
    Source(
        "polito-bachelor",
        "https://www.polito.it/en/education/bachelor-s-degree-programmes",
        "catalogue-polito-bachelor.html",
        parse_polito_bachelor,
    ),
    Source(
        "polito-master",
        "https://www.polito.it/en/education/master-s-degree-programmes",
        "catalogue-polito-master.html",
        parse_polito_master,
    ),
    Source(
        "polimi-bachelor",
        "https://www.polimi.it/en/education/laurea-programmes",
        "catalogue-polimi-bachelor.html",
        parse_polimi_bachelor,
    ),
    Source(
        "polimi-master",
        "https://www.polimi.it/en/education/laurea-magistrale-programmes",
        "catalogue-polimi-master.html",
        parse_polimi_master,
    ),
    Source(
        "pisa",
        "https://www.unipi.it/en/international-students/programmes-taught-in-english/degree-programmes-held-in-english/",
        "catalogue-unipi.html",
        parse_pisa,
    ),
]


def fetch(url: str, attempts: int = 3) -> str:
    request = Request(url, headers={"User-Agent": USER_AGENT, "Accept-Language": "en"})
    for attempt in range(1, attempts + 1):
        try:
            with urlopen(request, timeout=40) as response:
                return response.read().decode("utf-8", errors="replace")
        except (HTTPError, URLError, TimeoutError) as error:
            if attempt == attempts:
                raise RuntimeError(f"Could not fetch {url}: {error}") from error
            time.sleep(attempt * 2)
    raise AssertionError("unreachable")


def deduplicate(programmes: Iterable[Programme]) -> list[Programme]:
    by_identity: dict[str, Programme] = {}
    for programme in programmes:
        existing = by_identity.get(programme.identity)
        if existing and existing != programme:
            print(f"warning: duplicate identity {programme.identity}; keeping first", file=sys.stderr)
            continue
        by_identity[programme.identity] = programme
    return sorted(
        by_identity.values(),
        key=lambda item: (item.university_name, item.degree_level, item.programme_name.casefold()),
    )


def snapshot_identity(row: dict[str, object]) -> str:
    identifier = row.get("official_programme_code") or (
        f"{normalize_key(str(row['programme_name']))}:{normalize_key(str(row['degree_level']))}"
    )
    return f"{row['university_slug']}:{identifier}:{row['academic_year']}"


def calculate_diff(previous: list[dict[str, object]], current: list[dict[str, object]]) -> dict[str, object]:
    previous_by_id = {snapshot_identity(row): row for row in previous}
    current_by_id = {snapshot_identity(row): row for row in current}
    added = sorted(set(current_by_id) - set(previous_by_id))
    removed = sorted(set(previous_by_id) - set(current_by_id))
    changed = sorted(
        key
        for key in set(previous_by_id) & set(current_by_id)
        if previous_by_id[key].get("content_hash") != current_by_id[key].get("content_hash")
    )
    return {
        "summary": {"added": len(added), "changed": len(changed), "removed": len(removed)},
        "added": added,
        "changed": changed,
        "removed": removed,
    }


def load_supplement(path: Path) -> list[Programme]:
    """Load reviewed catalogue rows for official sites that block automated fetches."""
    if not path.exists():
        return []

    payload = json.loads(path.read_text(encoding="utf-8"))
    rows = payload.get("programmes", payload) if isinstance(payload, dict) else payload
    if not isinstance(rows, list):
        raise ValueError(f"Supplement must contain a programme list: {path}")

    programmes: list[Programme] = []
    for index, row in enumerate(rows):
        if not isinstance(row, dict):
            raise ValueError(f"Supplement row {index + 1} is not an object")
        programme = Programme(**row)
        if programme.academic_year != ACADEMIC_YEAR:
            raise ValueError(
                f"Supplement row {index + 1} uses {programme.academic_year}; expected {ACADEMIC_YEAR}"
            )
        if programme.teaching_language != "English":
            raise ValueError(f"Supplement row {index + 1} is not English-taught")
        programmes.append(programme)
    return programmes


def generate_sql(records: list[dict[str, object]], checked_at: str) -> str:
    payload = json.dumps(records, ensure_ascii=False, separators=(",", ":"))
    return f"""-- Generated by scripts/catalogue/crawl.py. Do not hand-edit.
-- Catalogue discovery only: no record is auto-verified and reviewed fields are preserved.

alter table public.programmes
  drop constraint if exists programmes_university_name_programme_name_academic_year_key;

create unique index if not exists programmes_name_year_level_idx
  on public.programmes (university_name, programme_name, academic_year, degree_level);

with incoming as (
  select *
  from jsonb_to_recordset($catalogue${payload}$catalogue$::jsonb) as row(
    university_slug text,
    university_name text,
    programme_name text,
    city text,
    degree_level text,
    teaching_language text,
    official_programme_code text,
    degree_class text,
    duration_years numeric,
    source_url text,
    catalogue_source_url text,
    academic_year text,
    content_hash text
  )
), resolved as (
  select incoming.*, universities.id as university_id
  from incoming
  join public.universities on universities.slug = incoming.university_slug
), updated as (
  update public.programmes as programme
  set
    university_id = resolved.university_id,
    university_name = resolved.university_name,
    programme_name = resolved.programme_name,
    city = resolved.city,
    degree_level = resolved.degree_level,
    teaching_language = resolved.teaching_language,
    official_programme_code = coalesce(resolved.official_programme_code, programme.official_programme_code),
    degree_class = coalesce(resolved.degree_class, programme.degree_class),
    duration_years = coalesce(resolved.duration_years, programme.duration_years),
    catalogue_source_url = resolved.catalogue_source_url,
    catalogue_checked_at = date '{checked_at}',
    updated_at = now()
  from resolved
  where programme.academic_year = resolved.academic_year
    and programme.university_id = resolved.university_id
    and (
      (resolved.official_programme_code is not null
        and programme.official_programme_code = resolved.official_programme_code)
      or (lower(programme.programme_name) = lower(resolved.programme_name)
        and programme.degree_level = resolved.degree_level)
    )
  returning programme.id
)
insert into public.programmes (
  university_id, university_name, programme_name, country_code, city,
  degree_level, teaching_language, intake, source_url, application_url,
  academic_year, verification_status, verification_notes, requirements,
  official_programme_code, degree_class, catalogue_source_url,
  catalogue_checked_at, duration_years
)
select
  resolved.university_id,
  resolved.university_name,
  resolved.programme_name,
  'IT',
  resolved.city,
  resolved.degree_level,
  resolved.teaching_language,
  'Fall 2026',
  resolved.source_url,
  resolved.source_url,
  resolved.academic_year,
  'unverified',
  'Discovered in an official university catalogue. Admission requirements, fees, and deadlines require human verification.',
  '{{}}'::jsonb,
  resolved.official_programme_code,
  resolved.degree_class,
  resolved.catalogue_source_url,
  date '{checked_at}',
  resolved.duration_years
from resolved
where not exists (
  select 1
  from public.programmes as existing
  where existing.university_id = resolved.university_id
    and existing.academic_year = resolved.academic_year
    and (
      (resolved.official_programme_code is not null
        and existing.official_programme_code = resolved.official_programme_code)
      or (lower(existing.programme_name) = lower(resolved.programme_name)
        and existing.degree_level = resolved.degree_level)
    )
)
on conflict (university_name, programme_name, academic_year, degree_level) do nothing;
"""


def load_html(source: Source, offline_dir: Path | None) -> str:
    if offline_dir:
        path = offline_dir / source.offline_filename
        if not path.exists():
            raise FileNotFoundError(f"Missing offline source: {path}")
        return path.read_text(encoding="utf-8")
    return fetch(source.url)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--offline-dir", type=Path, help="Read saved source HTML instead of fetching")
    parser.add_argument("--output", type=Path, default=Path("data/catalogue/italy-programmes.json"))
    parser.add_argument("--previous", type=Path, help="Snapshot to compare instead of the output path")
    parser.add_argument("--diff-output", type=Path, default=Path("data/catalogue/latest-diff.json"))
    parser.add_argument("--sql-output", type=Path, help="Also generate an idempotent Supabase import migration")
    parser.add_argument(
        "--supplement",
        type=Path,
        default=Path("data/catalogue/priority-programmes.json"),
        help="Reviewed official catalogue rows for sources that block automated requests",
    )
    parser.add_argument("--checked-at", default=date.today().isoformat())
    args = parser.parse_args()

    all_programmes: list[Programme] = []
    source_counts: dict[str, int] = {}
    for source in SOURCES:
        parsed = source.parser(load_html(source, args.offline_dir), source.url)
        source_counts[source.key] = len(parsed)
        all_programmes.extend(parsed)

    supplemental_programmes = load_supplement(args.supplement)
    for university_slug in sorted({item.university_slug for item in supplemental_programmes}):
        source_counts[f"supplement:{university_slug}"] = sum(
            item.university_slug == university_slug for item in supplemental_programmes
        )
    all_programmes.extend(supplemental_programmes)

    programmes = deduplicate(all_programmes)
    serialized = [programme.serialized() for programme in programmes]
    previous: list[dict[str, object]] = []
    previous_path = args.previous or args.output
    if previous_path.exists():
        previous_payload = json.loads(previous_path.read_text(encoding="utf-8"))
        previous = previous_payload.get("programmes", previous_payload) if isinstance(previous_payload, dict) else previous_payload

    diff = calculate_diff(previous, serialized)
    snapshot = {
        "academic_year": ACADEMIC_YEAR,
        "catalogue_checked_at": args.checked_at,
        "source_counts": source_counts,
        "programme_count": len(serialized),
        "programmes": serialized,
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.diff_output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.diff_output.write_text(json.dumps(diff, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if args.sql_output:
        args.sql_output.parent.mkdir(parents=True, exist_ok=True)
        args.sql_output.write_text(generate_sql(serialized, args.checked_at), encoding="utf-8")

    print(json.dumps({"programmes": len(serialized), "sources": source_counts, "diff": diff["summary"]}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
