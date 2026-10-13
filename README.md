# UNFPA — Syria Facility Map (redesigned static website)

A simplified, mobile-first website with the **user-supplied UNFPA SVG logo** and colors extracted from the logo (`#3571A4` blue, `#E38A15` orange). It remains a **static, offline-map** site: no application API, no authentication, no backend, no facility database, and no third-party map tiles.

## October 13 map and zoom corrections (v3)

- **Whole Syria visible by default:** the initial camera fits the actual Syria outline, across desktop and mobile widths. The Reset / crosshair button always returns to the whole-country view, including after importing facility data.
- **Stable scale at any zoom:** city names and facility badges render in fixed CSS pixels above the geographic SVG. This corrects the giant letters, partial circles, and white-looking marker artifacts that appeared in the screenshots.
- **Georeferenced precision:** original WGS84 geographic input is used as supplied by `facilities.private.json`; horizontal coordinate X is longitude, vertical coordinate Y is latitude. Each **unclustered** site marker is placed at its corresponding projected X/Y position. The separate confidential JSON stores the original input and any earlier documented coordinate-conversion/reversal flags; this update does not change any source coordinates.
- **Readable overview:** the zoomed-out map shows one aggregate badge per governorate. Clusters are *visual aggregates*, not exact facility positions. Zooming in progressively separates facilities; shared-coordinate sites open a selection list instead of hiding individual records.
- **Smarter zoom:** plus/minus, cursor-wheel, double-click, pan and mobile two-finger pinch supported. The plus button moves toward service coverage on an unfiltered overview, instead of magnifying unpopulated eastern areas. Maximum/minimum zoom and camera focal-point bounds are constrained.
- **City orientation guides:** thin orange dashed lines link Lattakia–Tartous, Lattakia–Hama, Hama–Homs and Tartous–Homs. **They are schematic visual guides, not surveyed roads or transport routes.** The lines recede at close zoom to avoid visual clutter.
- **Mobile:** smaller aggregation bubbles, reduced map-label collisions, 45-pixel tap targets, and scroll-friendly touch behavior. The four governorate buttons remain available above the map.
- **Favicon:** the actual user-provided UNFPA logo artwork on a transparent SVG canvas, with no colored square, border, or additional shape.

The code has no login, no API, no backend, and no sensitive facility records embedded or committed.

## Changes in this version

- Large distraction-free Syria map, simpler header and streamlined statistics.
- Quick governorate filters, programme chips, search, and collapsible partner/type filters.
- Desktop hover / keyboard-focus preview of facilities and marker clusters.
- Marker clustering that adapts to the zoom level. Click a cluster to zoom toward its facilities or to choose among co-located records.
- Smooth zoom in/out, wheel zoom at the mouse cursor, drag-to-pan, double-click to zoom, Fit Locations button.
- Touch-friendly zoom buttons and two-finger drag / pinch gestures. One-finger vertical scrolling is preserved on mobile.
- Mobile bottom navigation, bottom-sheet facility details, compact summary with expandable detailed fields.
- English / Arabic labels, responsive directory, insights and data quality views.
- `prefers-reduced-motion` support, keyboard shortcuts (`/` to focus map search, `Esc` to close details), focusable map markers.

## Files to upload to the **existing** GitHub repository

Upload these files from this package's root, preserving the paths:

```text
index.html
README.md
assets/
  app.js
  styles.css
  map-geography.js
  unfpa-logo.svg
  favicon.svg
```

Existing repo: https://github.com/SHAHEEN963/UNFPA-INTERACTION-MAP

### GitHub web interface

1. Open the repository and make sure you're on the `main` branch.
2. Replace the existing `index.html`, `README.md`, and three old files under `assets/` with these new versions.
3. Add `assets/unfpa-logo.svg` and `assets/favicon.svg`.
4. Commit changes. GitHub Pages automatically redeploys from `main` + `/(root)` if Pages is already enabled.
5. Reload the Pages URL; a hard-refresh may be necessary to clear the browser's cached CSS and JS.

For easiest overwrite of entire folders, use GitHub Desktop or Git instead of the web editor:

```bash
# Run from a local clone of your existing repository:
# Copy index.html, README.md, and assets/ from this ZIP into your clone.
git add index.html README.md assets/
git commit -m "Redesign UNFPA Syria facilities map UX"
git push origin main
```

**This ZIP contains no original facility records or precise facility coordinates.**

## Load the original facilities on your device

The private JSON is a **separate file**: `facilities.private.json` from the earlier delivery. The new website accepts the same file format; no conversion needed.

1. Open `index.html` directly in a modern browser, or visit the deployed website.
2. Click **Load data / Choose JSON file**.
3. Select your local `facilities.private.json` file.
4. Browse the four governorates and use the map, directory, statistics, and records.
5. Refresh the browser to clear loaded data from the application's in-memory session.

The dashboard loads the records into the open tab only. It does not upload them or write them to browser storage. CSV export is a local download and includes a confidentiality warning.

### Important confidentiality information

- Never upload `facilities.private.json`, the source Excel workbook, CSV exports, or unredacted detailed record files to your GitHub repository, GitHub Pages, or other public hosting.
- The records include potentially sensitive addresses / locations. This static version is **not an access-controlled system**.
- GitHub Pages generally serves the website to anyone with the URL, even if the source repository is private; hosting the source and hosting the confidential records are different decisions.
- Import private data only on authorized devices. If online multi-user access to exact coordinates is necessary, use organization-approved authentication and a protected data service instead.
- This site makes no application API calls and does not load network map tiles or hosted fonts.
- The UNFPA logo is provided by the project owner for use in this layout; organizational brand clearance is the owner's responsibility.

## Implementation notes

- Standalone HTML + CSS + vanilla JS, no build step or npm dependencies.
- SVG map geography is bundled as `assets/map-geography.js`.
- WGS84 latitude/longitude values are projected client-side. The dataset's original values and any correction notes are preserved.
- Clusters are calculated in rendered screen coordinates and adapt to zoom.
- Source data validation requires `facility_code`, `main_program` and `governorate_en` per record.
- No third-party analytics.

## Deployment URL

If GitHub Pages is enabled on the user's existing repository:

`https://shaheen963.github.io/UNFPA-INTERACTION-MAP/`

Changes may take a few minutes to appear after a push.
