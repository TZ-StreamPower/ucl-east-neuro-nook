import { defineConfig } from "@playwright/test";

// Smoke tests run against the local dev server (port 8080), reusing it if already running.
// Uses the system Chrome (no browser download); override with PW_CHANNEL=msedge etc.
export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:8080",
    channel: process.env.PW_CHANNEL ?? "chrome",
    launchOptions: { args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] }, // software WebGL for headless map
    viewport: { width: 393, height: 852 },
    hasTouch: true,
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:8080",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
