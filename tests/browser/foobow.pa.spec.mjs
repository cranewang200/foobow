import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";

const prototypeUrl = pathToFileURL(`${process.cwd()}/prototype/index.html`).toString();

test.beforeEach(async ({ page }) => {
  await page.goto(prototypeUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("daily ritual, map, deed, community, and profile flows work", async ({ page }) => {
  await expect(page).toHaveTitle("Foobow Prototype");
  await expect(page.getByRole("heading", { name: "Foobow" })).toBeVisible();

  await page.getByRole("button", { name: "Heavy" }).click();
  await expect(page.locator("#recommendedDeed")).toHaveText("Light a path home");

  await page.getByRole("button", { name: "Complete deed" }).click();
  await expect(page.locator("#karmaValue")).toHaveText("72");

  await page.getByRole("button", { name: "Map" }).click();
  await page.getByLabel("Toronto crosswalk good deed spot").click();
  await expect(page.locator("#spotName")).toHaveText("Toronto crosswalk");

  await page.getByRole("button", { name: "Deeds" }).click();
  await page.getByText("Anonymous blessing").first().click();
  await expect(page.locator("#ritualTitle")).toHaveText("Anonymous blessing");
  await page.getByRole("button", { name: "Perform ritual" }).click();
  await expect(page.locator("#karmaValue")).toHaveText("77");

  await page.getByRole("button", { name: "Community" }).click();
  await page.locator("#blessingInput").fill("May your next step feel lighter.");
  await page.getByRole("button", { name: "Send blessing" }).click();
  await expect(page.locator(".blessing p").first()).toHaveText("May your next step feel lighter.");

  await page.locator("button", { hasText: "Report" }).first().click();
  await expect(page.locator("button", { hasText: "Reported for review" }).first()).toBeDisabled();

  await page.getByRole("button", { name: "Profile" }).click();
  await expect(page.locator("#exportDataButton")).toBeVisible();
  await expect(page.locator("#deleteDataButton")).toBeVisible();

  await page.getByRole("button", { name: "Donate" }).click();
  await expect(page.locator("#impactDialog")).toHaveJSProperty("open", true);
  await expect(page.locator("#impactDialog")).toContainText("does not buy luck, virtue, or guaranteed karma");
});

test("theme, language, and local persistence work", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await expect(page.locator("body")).toHaveClass(/dark/);

  await page.getByRole("button", { name: "Switch language" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");

  await page.locator("#journalEntry").fill("A private note that should persist.");
  await page.reload();
  await expect(page.locator("#journalEntry")).toHaveValue("A private note that should persist.");
  await expect(page.locator("body")).toHaveClass(/dark/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
});

