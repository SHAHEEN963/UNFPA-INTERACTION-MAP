/* Run with npm run test:map after npm install and npx playwright install chromium. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    for (const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
      const page = await browser.newPage({viewport});
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      if (process.env.MAP_DATA_PATH) {
        await page.route('**/assets/facilities-data.js', route => route.fulfill({
          contentType:'application/javascript', body:fs.readFileSync(process.env.MAP_DATA_PATH,'utf8')
        }));
      }
      await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
      await page.waitForFunction(() => state.records.length > 0 && state.animation === null);
      const actual = await page.evaluate(() => ({
        total:state.records.length, pins:document.querySelectorAll('.map-pin').length,
        mapped:state.records.filter(r=>Number.isFinite(r.lat)&&Number.isFinite(r.lon)).length,
        partners:document.getElementById('statPartners').textContent,
        expectedPartners:new Set(state.records.filter(r=>!r.protected&&r.implementing_partner).map(r=>r.implementing_partner)).size
      }));
      assert.equal(actual.pins,actual.mapped,'one marker per located facility');
      assert.equal(Number(actual.partners),actual.expectedPartners,'no fixed partner count');
      const start = await page.evaluate(() => state.viewBox.w);
      await page.locator('#zoomInBtn').click();
      await page.waitForFunction(() => state.animation === null);
      assert.ok(await page.evaluate(w=>state.viewBox.w < w,start),'zoom in');
      await page.locator('#fullMapBtn').click();
      await page.waitForFunction(() => state.animation === null);
      if (viewport.width > 600) {
        const box = await page.locator('#mapSvg').boundingBox();
        await page.mouse.move(box.x + box.width/2,box.y + box.height/2);
        await page.mouse.wheel(0,-180);
        await page.waitForFunction(w=>state.viewBox.w < w,start);
        await page.waitForFunction(() => !state.zoomRaf);
      }
      // Contract test with synthetic colocated facilities and a withheld record.
      await page.evaluate(() => {
        const base = state.records.find(r=>!r.protected&&Number.isFinite(r.lat));
        importRecords([
          {...base,id:'TEST-PIN-A',facility_code:'TEST-PIN-A'},
          {...base,id:'TEST-PIN-B',facility_code:'TEST-PIN-B'},
          {...base,id:'PROTECTED-TEST',facility_code:'Protected facility',protected:true,lat:null,lon:null}
        ]);
      });
      await page.waitForFunction(() => state.animation === null);
      const pins = await page.locator('.map-pin').count();
      assert.equal(pins,2,'colocated facilities are separate; withheld facility has no pin');
      const positions = await page.locator('.map-pin').evaluateAll(nodes=>nodes.map(n=>[n.style.left,n.style.top].join(',')));
      assert.equal(new Set(positions).size,2,'screen-space separation retained');
      await page.locator('.map-pin').first().click();
      await page.locator('#detailSheet').waitFor({state:'visible'});
      assert.match(await page.locator('#detailBody').innerText(),/TEST-PIN-/);
      assert.deepEqual(errors,[],'no browser errors');
      await page.close();
    }
    console.log('Map smoke tests passed: desktop/mobile, public data, separate pins, details, button/wheel zoom.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
