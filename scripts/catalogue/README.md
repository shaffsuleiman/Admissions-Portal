# Official catalogue crawler

This pipeline discovers English-taught programmes from official University of
Bologna, Sapienza University of Rome, and University of Padua catalogues. It
normalizes and deduplicates the records, stores a reviewable JSON snapshot, and
can generate an idempotent Supabase migration.

It deliberately does **not** scrape eligibility rules into live matching. New
programmes enter the verifier queue as `unverified`. On existing records, the
generated SQL updates only catalogue metadata and preserves human-reviewed
requirements, fees, deadlines, evidence, source URLs, and verification status.

```bash
python3 -m venv .venv
.venv/bin/pip install -r scripts/catalogue/requirements.txt
npm run catalogue:crawl
```

For a reproducible run against saved HTML:

```bash
.venv/bin/python scripts/catalogue/crawl.py --offline-dir /tmp \
  --checked-at 2026-09-24 \
  --sql-output supabase/migrations/202609240010_bulk_catalogue_refresh.sql
```

Review `data/catalogue/latest-diff.json` before applying generated SQL. A removed
record is reported but never deleted automatically.
