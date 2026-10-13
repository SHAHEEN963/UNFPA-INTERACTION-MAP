# Syria Facilities — Static Interactive Website

**No API. No authentication or sign-in. No backend. No database.**

The original authenticated project is replaced by this standalone, client-side dashboard. This source tree contains zero original facility records or coordinates.

Open `index.html` directly in a current browser or deploy these files as a static website (GitHub Pages, Netlify, or a private static hosting service). The vector map is bundled and runs offline.

## To display the real facility records

1. Download `facilities.private.json` **separately** from the code package.
2. Open `index.html` in the browser.
3. Select **Load private JSON** and choose `facilities.private.json` from your computer.
4. Explore the map, directory, statistics, filters and detailed facility descriptions.

**Data stays in the active browser tab** and is not sent to an API or saved by the dashboard. Refreshing requires reselecting the JSON file. The map runs without third-party map tiles or external analytics.

## GitHub upload safety

- This repository contains **only source code and a coarse public geographic basemap**.
- Never commit `facilities.private.json`, the original Excel workbook, PDFs or CSV exports. Facilities include Women and Girls Safe Spaces and exact addresses that must remain confidential.
- A public GitHub Pages site will not provide authentication. It is a map *interface* only until an authorized person selects the local data file.
- The code is intentionally separated from actual facility records so that publishing the source does not publish sensitive coordinates.
- If location confidentiality is critical, avoid uploading the data to cloud hosting or repositories at all.

## Project files

- `index.html`: single-page map/dashboard layout
- `assets/app.js`: interactive map, imported data, detail panels, CSV export, filters, statistics and bilingual interface
- `assets/styles.css`: layout, motion and responsive styles
- `assets/map-geography.js`: offline vector map geometry, no facility locations

For an actual authenticated private deployment, server-side access controls would be required; they are deliberately removed here as requested.

## Upload to GitHub

1. Create a **private** repository at https://github.com/new named `syria-facilities-map` (leave it empty: no README, license, or `.gitignore`).
2. From this folder in a terminal, run:

```bash
git init
git add .
git commit -m "Build static Syria facilities map"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/syria-facilities-map.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your account username. GitHub may prompt you to sign in through its credential manager; never put passwords or access tokens in a code file.

For optional GitHub Pages publishing, see the repository **Settings > Pages > Build and deployment > Deploy from a branch > main > /(root)**. Remember: the static webpage contains no authentication, and a Pages URL is not private access control. Facility records remain outside the repository and must only be loaded locally by authorized people.
