import { expect, test, type Page } from "@playwright/test";

const hydrated = (page: Page) =>
  page.waitForFunction(() =>
    Object.keys(document.querySelector("a") ?? {}).some((k) => k.startsWith("__reactProps")),
  );

test("four primary sections", async ({ page }) => {
  await page.goto("/");
  await hydrated(page);
  const nav = page.getByRole("navigation", { name: "Main" });
  for (const l of ["Explore", "Navigate", "Community", "Saved"]) {
    await expect(nav.getByRole("link", { name: l })).toBeVisible();
  }
});

test("Explore: featured rail, image cards and a real map view", async ({ page }) => {
  await page.goto("/");
  await hydrated(page);
  await expect(page.getByRole("heading", { name: "Featured" })).toBeVisible();
  await page.getByRole("button", { name: "Map" }).click();
  await expect(page.locator('[data-map-state="ready"]')).toBeVisible({ timeout: 20000 });
  await page
    .locator(".geo-pin", { has: page.locator("span") })
    .filter({ hasText: "Marshgate" })
    .first()
    .click({ force: true });
  await expect(page.getByText("Open details")).toBeVisible();
});

test("Navigate: map, Quick vs Calm comparison, overlay, place sheet, expand", async ({ page }) => {
  await page.goto("/navigate?from=stratford&to=marshgate&mode=calm");
  await hydrated(page);
  await expect(page.locator('[data-map-state="ready"]')).toBeVisible({ timeout: 20000 });
  await expect(page.locator(".geo-pin")).toHaveCount(14);
  const calm = page.getByRole("button", { name: /Calmest/ });
  const quick = page.getByRole("button", { name: /Quickest/ });
  await expect(calm).toContainText("16 min");
  await expect(quick).toContainText("12 min");
  await quick.click();
  await expect(quick).toHaveAttribute("aria-pressed", "true");
  const overlay = page.getByRole("button", { name: "Sensory overlay" });
  await overlay.click();
  await expect(overlay).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Orbit plaza", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Orbit plaza" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Expand map" }).click();
  await expect(page.getByRole("dialog", { name: "Explore map" })).toBeVisible();
  await expect(page.getByText(/Illustrative route line/).last()).toBeVisible();
});

test("Navigate: finishing a walk opens Reflect", async ({ page }) => {
  await page.goto("/navigate?from=marshgate&to=one-pool-street&mode=calm&walk=1&step=1");
  await hydrated(page);
  await expect(page.getByText("You have arrived")).toBeVisible();
  await page.getByRole("button", { name: /Finish/ }).click();
  await expect(page).toHaveURL(/\/reflect/);
  await expect(page.getByRole("heading", { name: "How was your walk?" })).toBeVisible();
});

test("Community: three post layouts", async ({ page }) => {
  await page.goto("/community");
  await hydrated(page);
  await expect(page.getByText("Demo post").first()).toBeVisible();
  await expect(page.getByLabel(/^Experience:/).first()).toBeVisible();
  await expect(page.getByLabel(/^Route review:/).first()).toBeVisible();
  await expect(page.getByText("Question", { exact: true }).first()).toBeVisible();
  const save = page.getByRole("button", { name: "Save post" }).first();
  await save.click();
  await expect(page.getByRole("button", { name: "Remove from Saved" }).first()).toBeVisible();
});

test("Reflect: independent ratings, save, share as Community experience", async ({ page }) => {
  await page.goto("/reflect?from=stratford&to=marshgate&mode=calm");
  await hydrated(page);
  const save = page.getByRole("button", { name: /^Save/ });
  await expect(save).toBeDisabled();
  await page.getByRole("button", { name: "Quiet" }).click();
  await page.getByRole("button", { name: "Crowded" }).click();
  await expect(page.getByRole("button", { name: "Quiet" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Loud" })).toHaveAttribute("aria-pressed", "false");
  await page.getByPlaceholder("What would help someone else?").fill("Calm after the bridge");
  await page.getByRole("switch").check();
  await page.getByRole("button", { name: "Save and share" }).click();
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "See it in Community" }).click();
  await expect(page.getByText("Calm after the bridge")).toBeVisible();
});

test("Place page order: hero, sensory, essentials, map, community, action", async ({ page }) => {
  await page.goto("/place/marshgate");
  await hydrated(page);
  const order = ["How it feels", "Essential information", "Map preview", "Community"];
  const ys: number[] = [];
  for (const h of order) {
    const box = await page
      .getByRole("heading", { name: new RegExp(`^${h}`) })
      .first()
      .boundingBox();
    ys.push(box!.y);
  }
  expect(ys).toEqual([...ys].sort((a, b) => a - b));
  await expect(page.getByRole("link", { name: /Route here/ })).toBeVisible();
});

test("Navigate: offline tiles fall back to the schematic map and stay usable", async ({ page }) => {
  await page.route("**/tiles.openfreemap.org/**", (r) => r.abort());
  await page.goto("/navigate?from=stratford&to=marshgate&mode=calm");
  await hydrated(page);
  await expect(page.locator('[data-map-state="fallback"]')).toBeVisible({ timeout: 20000 });
  await expect(page.getByText(/Street map unavailable offline/)).toBeVisible();
  await page.getByRole("button", { name: "Orbit plaza", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Orbit plaza" })).toBeVisible();
});
