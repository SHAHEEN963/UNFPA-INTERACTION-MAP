# UNFPA Syria Facilities Map — V4

**Edition:** GITHUB-SAFE SOURCE (public site)

This is a static interactive website. **No API, account, login, JSON import step, or backend.**
Records from the supplied `Shaheen copy List of Facilities Homs AoR(1).xlsx` have been converted into
`assets/facilities-data.js`, which loads automatically when `index.html` opens.

## Facility data

- Source worksheets: Lattakia (19), Tartous (4), Hama (14), Homs (14).
- Total 51 records, 26 RH, 17 GBV, 8 Youth; 47 distinct coordinate pairs.
- All facilities have their own marker where coordinates are available. **No clusters or numbered counts**.
- Facilities sharing identical or nearby coordinates are displayed using slight screen-space separation.
  The underlying latitude/longitude is unchanged and appears in the facility record.
- 4 DMS coordinate pairs converted to decimal degrees, and 2 likely reversed lat/lon entries
  plotted after swapping; please confirm the latter with the field team.
- Map silhouette updated with a more accurate coastline, based on geographic shoreline data.
- Country overview opens by default; zoom controls, cursor-centered smooth wheel zoom, pan and two-finger pinch.
- City-to-city guide lines removed.

## Privacy, visibility, and security

This is the **public-safe edition** intended for the existing public GitHub repository.
Of the 51 records, **34 RH / Youth facilities** have individual exact-coordinate markers, while
**17 GBV/protection site records are retained in aggregate counts but their exact coordinates,
addresses, facility identifiers, and brochure text have been removed**. The protected facilities
are listed generically in the directory and are not shown as misleading approximate map pins.

Use this version for public GitHub Pages only with your organization's approval of the remaining
34 listed sites. No login means the source code and mapped coordinates are publicly accessible.

## Open or deploy

1. Extract the ZIP.
2. Open `index.html` in a current browser for offline use. All map assets are bundled locally.
3. The data loads immediately. Filter by governorate/program, hover or click individual markers,
   open facility details, browse the directory and insights, and export CSV if authorized.

**GitHub Pages update (public-safe edition only):** upload `index.html`, `README.md`, and the
`assets/` files to the root of `SHAHEEN963/UNFPA-INTERACTION-MAP` on the `main` branch;
GitHub Pages will redeploy automatically if enabled. Do not upload the Internal edition.

## Geographic accuracy notes

- Each marker is anchored to the WGS84 coordinates from the Excel workbook, after format
  conversion and the two specifically flagged probable swaps.
- At dense clusters, visual markers may shift a small number of screen pixels to prevent overlap.
  Those visual offsets do not alter the underlying coordinates.
- The workbook is not independently field-surveyed. Entries flagged in Data quality need review
  before precise navigation or operational use.
- Country base geometry is a cartographic orientation aid, not a cadastral boundary. Shoreline
  improvements use GSHHS data distributed with Matplotlib Basemap (coastline reference).

## Project files

- `index.html` — single-page dashboard
- `assets/styles.css` — styles and responsive layout
- `assets/app.js` — map engine, markers, navigation, filters, details
- `assets/facilities-data.js` — **embedded Excel snapshot**, edition-specific
- `assets/map-geography.js` — offline map outlines and city-reference coordinates
- `assets/unfpa-logo.svg`, `assets/favicon.svg` — branding assets
- `.gitignore` — Git filtering rules

To update the records after your workbook changes, regenerate the data JS from the new Excel
file and review coordinate quality; this is a *snapshot*, not a live Excel connection.
