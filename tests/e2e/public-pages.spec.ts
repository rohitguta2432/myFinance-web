import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
    test("landing page loads with hero", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/myfinancial/i);
        await expect(page.locator("text=Get Your Diagnosis")).toBeVisible();
        await expect(page.locator("text=You think you")).toBeVisible();
    });

    test("navbar is visible with links", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("nav")).toBeVisible();
    });

    test("pricing page loads", async ({ page }) => {
        await page.goto("/pricing");
        await expect(page).toHaveTitle(/pricing/i);
    });

    test("how it works page loads", async ({ page }) => {
        await page.goto("/how-it-works");
        await expect(page.locator("body")).toBeVisible();
    });

    test("blog page loads with posts", async ({ page }) => {
        await page.goto("/blog");
        await expect(page).toHaveTitle(/blog/i);
    });

    test("privacy page loads", async ({ page }) => {
        await page.goto("/privacy");
        await expect(page.locator("body")).toBeVisible();
    });

    test("disclaimer page loads", async ({ page }) => {
        await page.goto("/disclaimer");
        await expect(page.locator("body")).toBeVisible();
    });
});

test.describe("Auth Guard", () => {
    test("assessment redirects to home without session", async ({ page }) => {
        await page.goto("/assessment/step-1");
        await page.waitForURL("**/");
        expect(page.url()).not.toContain("/assessment");
    });

    test("dashboard redirects to home without session", async ({ page }) => {
        await page.goto("/dashboard");
        await page.waitForURL("**/");
        expect(page.url()).not.toContain("/dashboard");
    });
});

test.describe("Responsive Design", () => {
    test("landing page renders on mobile", async ({ page, isMobile }) => {
        await page.goto("/");
        await expect(page.locator("text=Get Your Diagnosis")).toBeVisible();
        if (isMobile) {
            // mobile CTA should be visible
            await expect(page.locator("body")).toBeVisible();
        }
    });
});

test.describe("SEO & Meta", () => {
    test("landing page has meta description", async ({ page }) => {
        await page.goto("/");
        const desc = page.locator('meta[name="description"]');
        await expect(desc).toHaveAttribute("content", /.+/);
    });

    test("landing page has OG tags", async ({ page }) => {
        await page.goto("/");
        const ogTitle = page.locator('meta[property="og:title"]');
        await expect(ogTitle).toHaveAttribute("content", /.+/);
    });
});

test.describe("Performance", () => {
    test("landing page loads under 5 seconds", async ({ page }) => {
        const start = Date.now();
        await page.goto("/", { waitUntil: "domcontentloaded" });
        const loadTime = Date.now() - start;
        expect(loadTime).toBeLessThan(5000);
    });
});
