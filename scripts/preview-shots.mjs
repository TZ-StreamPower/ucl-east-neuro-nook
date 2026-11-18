// Visual checkpoints at 390x844 -> .preview/<label>/ (git-ignored). Usage: npm run preview:shots [label]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const label = process.argv[2] ?? new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
const dir = `.preview/${label}`;
mkdirSync(dir, { recursive: true });
const base = process.env.E2E_BASE_URL ?? "http://localhost:8080";
const pages = [
  ["explore", "/", false],
  ["explore-map", "/?view=map", true],
  ["navigate", "/navigate?from=stratford&to=marshgate&mode=calm", true],
  ["community", "/community", false],
  ["place", "/place/marshgate", false],
];
const b = await chromium.launch({
  channel: process.env.PW_CHANNEL ?? "chrome",
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
});
const p = await (
  await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })
).newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message.slice(0, 160)));
for (const [name, url, map] of pages) {
  await p.goto(base + url);
  await p.waitForLoadState("networkidle").catch(() => {});
  if (map) await p.waitForSelector('[data-map-state="ready"]', { timeout: 20000 }).catch(() => {});
  // Scroll through so lazy images load, then report any broken ones.
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(map ? 2500 : 600);
  const broken = await p.evaluate(
    () => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length,
  );
  if (broken) console.log(name, "broken/unloaded images:", broken);
  await p.screenshot({ path: `${dir}/${name}.png` });
  await p.screenshot({ path: `${dir}/${name}-full.png`, fullPage: true });
  const overflow = await p.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  console.log(name, "overflowX:", overflow);
}
console.log("saved to", dir, errors.length ? "errors: " + errors.join(" | ") : "no page errors");
await b.close();
