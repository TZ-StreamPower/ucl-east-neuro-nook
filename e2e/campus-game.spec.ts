import { expect, test, type Page } from "@playwright/test";

const play = (page: Page) => page.getByRole("link", { name: /^Play / });
const overlay = (page: Page) => page.getByRole("region", { name: "Campus Practice game" });
const gameFrame = (page: Page) => page.frameLocator('iframe[title^="Same Day"]');

/** SSR renders before React attaches handlers; clicking earlier does nothing. */
const hydrated = (page: Page) =>
  page.waitForFunction(() =>
    Object.keys(document.querySelector("a") ?? {}).some((k) => k.startsWith("__reactProps")),
  );

async function openGame(page: Page) {
  await play(page).first().click();
  await expect(overlay(page)).toBeVisible();
  await expect(gameFrame(page).locator("#welcomeScreen")).toBeVisible();
  // Loading overlay clears once the frame is verified and Finish/Escape are hooked.
  await expect(overlay(page).getByRole("status")).toBeHidden();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(play(page).first()).toBeVisible();
  await hydrated(page);
});

test("Campus → game → Back returns to Campus with scroll kept", async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 300));
  const before = await page.evaluate(() => window.scrollY);
  await openGame(page);
  await page.getByRole("button", { name: "Back to Explore" }).click();
  await expect(overlay(page)).toBeHidden();
  await expect(page).not.toHaveURL(/game=1/);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(4);
});

test("Escape closes the game from the page and from inside the frame", async ({ page }) => {
  await openGame(page);
  await page.keyboard.press("Escape");
  await expect(overlay(page)).toBeHidden();

  await openGame(page);
  await gameFrame(page)
    .locator("body")
    .click({ position: { x: 5, y: 5 } });
  await page.keyboard.press("Escape");
  await expect(overlay(page)).toBeHidden();
});

test("Finish inside the game returns to Campus", async ({ page }) => {
  await openGame(page);
  // #finishButton is on the game's ending screen; trigger it directly to test the hook.
  await gameFrame(page)
    .locator("#finishButton")
    .evaluate((el: HTMLElement) => {
      // Async: the frame is torn down by the click, so do not await its result.
      setTimeout(() => el.click(), 0);
    });
  await expect(overlay(page)).toBeHidden();
});

test("a failed/blank game load reaches Retry, and Retry recovers", async ({ page }) => {
  await page.route("**/game/index.html*", (r) =>
    r.fulfill({ status: 404, contentType: "text/html", body: "<h1>Not found</h1>" }),
  );
  await play(page).first().click();
  await expect(page.getByText("Couldn't load the game")).toBeVisible();

  await page.unroute("**/game/index.html*");
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(gameFrame(page).locator("#welcomeScreen")).toBeVisible();
  await expect(page.getByText("Couldn't load the game")).toBeHidden();
});

test("direct /?game=1 loads the game and has no horizontal overflow", async ({ page }) => {
  await page.goto("/?game=1");
  await hydrated(page);
  await expect(gameFrame(page).locator("#welcomeScreen")).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
