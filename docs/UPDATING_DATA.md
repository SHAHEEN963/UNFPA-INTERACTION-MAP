# Update the public map from Excel

The website remains a static, offline-capable map. Python runs **locally on an
approved device**, reads the XLSX, and produces the JavaScript snapshot the existing
map already loads. No Excel upload, API, backend, or browser-side private dataset is
introduced. The XLSX is never copied into the generated output.

## First-time setup

Use Python 3.10 or newer, from the repository directory:

```sh
python -m venv .venv
```

Activate with `source .venv/bin/activate` on macOS/Linux, or
`.venv\Scripts\Activate.ps1` in Windows PowerShell. Then:

```sh
python -m pip install -r requirements-import.txt
python -m unittest discover -s tests -v
```

Keep the workbook **outside the repository**. The supplied source was
`Shaheen copy List of Facilities Homs AoR(1).xlsx`, uploaded on 13 October 2026.
Its four source sheets were verified against the original V4 snapshot; no newer
workbook was assumed or used for this implementation. A filename/date alone does
not prove freshness: obtain the replacement from the responsible data owner.

## Every update: preview, review, apply

1. Save the approved replacement XLSX outside this repository. Work on a Git branch.
2. Generate a preview (this does not replace the site's current data):

```sh
python tools/import_facilities.py "/private/path/facilities-new.xlsx"
```

3. Read `build/import-review/report.json`. A successful preview writes
   `build/import-review/facilities-data.js` too. Exit code `0` means a valid preview;
   `2` means blocked. A blocked run removes the earlier candidate, reports fixed
   error codes and counts, and leaves the published snapshot unchanged.
4. Review totals, counts by governorate/program, mapped/withheld counts, public
   additions/removals, changed field counts and coordinate warnings. Check the
   candidate's **public** records against the workbook locally. Protected records
   appear only as generic entries. All changed counts require review, including
   offsetting additions/removals and changes that leave the total unchanged.
5. Copy `approval_token` from the reviewed report, then run:

```sh
python tools/import_facilities.py "/private/path/facilities-new.xlsx" --apply --approve "TOKEN_FROM_REPORT"
```

The importer revalidates the workbook and atomically replaces
`assets/facilities-data.js` only when the token matches the current baseline,
public candidate and publication allowlist. Changes to any of those require a
fresh review. This token is a local review guard, **not authentication or a substitute
for organizational approval**. A private edit that has no public effect does not
invalidate the token, but is still revalidated. Do not run concurrent imports.

6. Open `index.html`; inspect the map, filters, directory and data-quality view.
   For repeatable browser checks:

```sh
npm ci
npx playwright install chromium
npm run test:map
```

7. Review `git diff -- assets/facilities-data.js` and `git status`. Commit only
   the sanitized snapshot and intentional code/policy changes. Open a PR and use
   the existing approval/deployment process. Do not attach the workbook, private
   diagnostics, or internal edition to the PR. To roll back, restore the last
   reviewed public `assets/facilities-data.js` from Git and redeploy that version.

Advanced options: `--baseline PATH` selects another existing **public** snapshot
(and replaces that file on `--apply`); `--policy PATH` selects an explicitly reviewed
publication policy; `--review-dir PATH` changes the preview destination. Never use
an internal dataset as the baseline. Keep review output in an ignored directory.

## Workbook contract

- Only `Lattakia`, `Tartous`, `Hama`, and `Homs` are imported. Each is required
  and must contain at least one record. Decommissioning an entire sheet requires
  an intentional schema change, not a silent count reduction.
- `Sheet1`, `Calc_Data`, and `Statistics` are known aggregate sheets in the original
  workbook and are deliberately ignored. Unknown worksheets block the run.
- Row 1 holds the headers below. Column order may change. Surrounding whitespace,
  line breaks, case and a leading `*` are normalized. Unknown, duplicate or missing
  headers block the run. Add reviewed aliases in `HEADERS`/`read_workbook` if the
  source schema changes; do not guess columns from position.
- The optional `الرقم` serial column is ignored. The original workbook contains
  array formulas there; they are never evaluated. Formula/error cells in imported
  fields are rejected. Blank rows are skipped; partial rows are rejected.
- Facility code, implementing partner, program, facility type, governorate and
  both coordinates must have values. Other columns must exist but may be empty.
- Programs are `RH`, `GBV`, `Youth` (case-insensitive). Governorate must match its
  worksheet (English, Arabic, or the original bilingual form).
- Facility codes are globally unique after Unicode/case/whitespace normalization.
  Repeated full records with a different code also block the run. Distinct facilities
  sharing a coordinate pair remain separate records and receive a public co-location
  flag. Hidden sites do not contribute to a public co-location flag.

| Internal field | Original header |
| --- | --- |
| implementing_partner | *Final Implementing Partner (IP) الشريك المنفذ النهائي |
| facility_code | *Facility Code / رمز المنشأة |
| main_program | *Main Program |
| facility_type | *Main Facility Type / نوع المنشأة |
| mode | Mode of Facility |
| governorate | *Governorate |
| district | *District |
| subdistrict | *Sub District |
| commune | *Commune \| Village \| Town |
| neighbourhood | Neighbourhood |
| site_name | Site Name اسم الموقع (العنوان التفصيلي) |
| lat | Latitude |
| lon | Longtitude (also accepts Longitude) |
| brochure | Detailed Information for the Brochure |

## Coordinates and existing warnings

Decimal numbers/strings and DMS such as `35°30'30.0"N` are supported, including
nonbreaking spaces and the source's omitted closing seconds mark. Invalid DMS
minutes/seconds, mismatched hemispheres, booleans, NaN/infinity, missing values,
world-range errors and points outside the broad Syria sanity extent are rejected.
Decimal comma/ambiguous formats are not guessed.

The broad extent (32–38 latitude, 35.5–43 longitude) is **not a coastline test**.
It cannot certify that a point lies on land or in the right village. Keep field
verification in the review process. New coordinate swaps are never guessed.

V4 contains two explicitly flagged likely inversions. The importer preserves a
flagged swap only when the same public facility code and exact original coordinate
pair still match the baseline, and the baseline corrected pair is its exact reverse.
The warning remains: field verification is still pending. A changed invalid pair
blocks import. Correcting the source to the already reviewed decimal pair removes
the inherited swap warning; the importer does not claim a field visit occurred.

## Publication rules

`tools/public-policy.json` starts with an empty list and contains no real facility
identifiers. The importer carries forward approvals only for codes already public
in the baseline with a supported non-protection type (33 in the original V4).
The policy is an explicit allowlist for additional organization-approved public codes.
A record can expose details only when its code is approved by one of these routes and its
(program, facility type, mode) matches one of these supported combinations:

| Program | Facility type | Mode |
| --- | --- | --- |
| RH | RH Static Clinic | RH SC |
| RH | Breast Cancer Unit | RH SC |
| RH | CEmONC | RH SC |
| Youth | Youth Friendly Space | YFS |

Everything else is withheld, including all GBV, WGSS, CWC, unknown types/modes and
new codes. A known type with a new unapproved code remains in aggregate counts
without coordinates. A mislabeled RH protection facility is therefore not exposed.
When an existing public site becomes protected, remove its code from the allowlist
if explicitly listed, as part of the same review; approval must not survive a
protection reclassification. An implicitly approved code loses that approval once
it no longer appears among the baseline public non-protection records.

To publish a new non-protection site, obtain organizational approval of its public
address/details, add **only that approved code** to `approved_public_codes`, and
repeat preview/review. Never put protected codes, private addresses or private
coordinates in this policy or any public configuration. New service types require
an explicit code review before they can be public. The importer has no override
that publishes GBV/protection records and no unredacted export mode.

Protected records are constructed from fixed strings and permitted aggregate
labels only. Coordinates/original coordinates, code, partner, address, brochure,
source row and quality flags are stripped. Synthetic protected IDs are assigned
from aggregate buckets, never from source row/order or a hash of a private ID.

The report contains only counts and fixed field/error names, **no record IDs,
names, addresses, phone numbers, coordinates or old/new values**. Protected
comparison is aggregate-only. A redacted baseline cannot reveal which individual
protected facilities were added, removed or changed, or offsetting changes within
the same protected bucket. That reconciliation must be done privately by the data
owner. The report does not pretend otherwise.

## Error handling and tests

Diagnostics intentionally avoid row numbers and raw source values. Use the fixed
error code to check the relevant source column locally. For example:

| Code | What to review locally |
| --- | --- |
| missing_required_column / unknown_column / duplicate_column | Header spelling and duplicate headers |
| duplicate_facility_code / duplicate_record_different_code | Duplicate codes or copied records across the four sheets |
| formula_not_allowed / excel_error | Replace formula/error values in data with verified literal values |
| missing_coordinate / invalid_coordinate / invalid_dms | Latitude/longitude columns and coordinate format |
| outside_syria_extent_review_source | Source coordinates, including possible inversion; verify rather than guess |
| governorate_sheet_mismatch / unknown_program | Classification and worksheet placement |
| approval_token_required_or_stale | Run preview again, review it, and use its new token |
| input_or_output_failure | Check the local file format, dependencies, paths and write permissions; no traceback is printed |

Unit tests use generated synthetic XLSX files, including adversarial secret
sentinels. They cover schema/coordinate/duplicate failures, redaction, stable
protected projection, count changes, stale approvals, deterministic output,
atomic replacement and error sanitization. Browser tests check the actual map on
desktop/mobile sizes, colocated independent markers, detail panels and zoom.
CI uses synthetic fixtures only and never receives the real XLSX.

The importer limits file size, ZIP expansion and row count and requires defusedxml.
These are safeguards, not a sandbox for hostile workbooks. Dependencies are pinned.
`.gitignore` helps prevent accidental uploads; it is not access control and does
not remove files already in Git history. No private workbook is included in this PR.

## Delivery scope

This code-only change does not replace the currently published V4 snapshot.
`docs/original-workbook-review.json` records the aggregate result of the local
preview: 51 total, 33 mapped and 18 withheld. The stricter snapshot must be reviewed
and separately approved for public upload. No real facility identifiers or contact
details are added to the tooling, fixtures or default policy.
