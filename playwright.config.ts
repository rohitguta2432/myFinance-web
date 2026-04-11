import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    timeout: 30000,
    retries: 1,
    reporter: "html",
    use: {
        baseURL: "http://localhost:3001",
        screenshot: "only-on-failure",
        trace: "on-first-retry",
    },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
        // WebKit/Safari requires system libs (libgstcodecparsers, libavif)
        // Install with: sudo npx playwright install-deps webkit
        // Then uncomment:
        // { name: "webkit", use: { ...devices["Desktop Safari"] } },
        // { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
    ],
});
