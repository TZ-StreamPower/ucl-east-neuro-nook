// One-off asset generator (dev server must be running on :8080).
//  - src/assets/scenes/*.jpg : small copies of the game's own scene art (originals in public/game untouched)
//  - src/assets/maps/<routeId>.jpg : OpenStreetMap-based route preview images (© OpenStreetMap contributors, ODbL; tiles OpenFreeMap)
// Usage: node scripts/gen-images.mjs
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";

const base = process.env.E2E_BASE_URL ?? "http://localhost:8080";
const scenes = ["atrium", "classroom", "home_evening", "lunch", "route"];
const routes = {
  "stratford-marshgate": ["stratford", "marshgate"],
  "intl-poolstreet": ["stratford-intl", "one-pool-street"],
  "marshgate-poolstreet": ["marshgate", "one-pool-street"],
};
const b = await chromium.launch({
  channel: "chrome",
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
});
const p = await (await b.newContext({ viewport: { width: 800, height: 450 } })).newPage();

await p.goto(base + "/");
for (const s of scenes) {
  const data = await p.evaluate(async (name) => {
    const img = new Image();
    img.src = `/game/assets/scenes/${name}.png`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = 720;
    c.height = Math.round((720 * img.naturalHeight) / img.naturalWidth);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.8).split(",")[1];
  }, s);
  writeFileSync(`src/assets/scenes/${s}.jpg`, Buffer.from(data, "base64"));
  console.log("scene", s, Math.round((data.length * 3) / 4 / 1024) + "KB");
}

for (const [id, [from, to]] of Object.entries(routes)) {
  await p.goto(`${base}/navigate?from=${from}&to=${to}&mode=calm`);
  await p.waitForSelector('[data-map-state="ready"]', { timeout: 30000 });
  await p.addStyleTag({
    content: `.geo-map{position:fixed!important;inset:0!important;z-index:99999!important;width:100vw!important;height:100vh!important;aspect-ratio:auto!important;border-radius:0!important;border:0!important;box-shadow:none!important}
      .maplibregl-ctrl-bottom-right,.maplibregl-ctrl-attrib{display:none!important}`,
  });
  await p.evaluate(() => {
    window.__geoMap.resize();
    window.__geoRefit();
  });
  await p.waitForTimeout(3500);
  const buf = await p.screenshot({ type: "jpeg", quality: 74 });
  writeFileSync(`src/assets/maps/${id}.jpg`, buf);
  console.log("map", id, Math.round(buf.length / 1024) + "KB");
}
await b.close();
