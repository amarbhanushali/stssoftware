import { chromium } from "playwright";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { services, projects, articles } from "../src/data.js";
const data = mkdtempSync(path.join(tmpdir(), "sts-browser-test-"));
const child = spawn(process.execPath, ["server/index.mjs"], {
  env: {
    ...process.env,
    PORT: "0",
    DATA_DIR: data,
    SMTP_HOST: "",
    HOST: "127.0.0.1",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
  const base = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(Error("Server timeout")), 15000);
    child.once("error", reject);
    child.stdout.on("data", (b) => {
      const m = b.toString().match(/http:\/\/127\.0\.0\.1:\d+/);
      if (m) {
        clearTimeout(timeout);
        resolve(m[0]);
      }
    });
  });
  browser = await chromium.launch({
    headless: true,
    channel: process.env.BROWSER_CHANNEL || "chrome",
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  mkdirSync("tests/artifacts", { recursive: true });
  const routes = [
    "/",
    "/services",
    "/about",
    "/process",
    "/technology",
    "/work",
    "/insights",
    "/consultation",
    "/contact",
    "/privacy",
    "/terms",
    ...services.map((s) => `/services/${s.slug}`),
    ...projects.map((p) => `/work/${p.slug}`),
    ...articles.map((a) => `/insights/${a.slug}`),
  ];
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    assert.equal(await page.locator("h1").count(), 1, route);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      route,
    );
    assert.equal(
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.some((i) => !i.complete || i.naturalWidth === 0),
        ),
      false,
      route,
    );
  }
  console.log(
    `PASS: ${routes.length} routes load, render and fit desktop without broken images.`,
  );
  await page.goto(base + "/services");
  await page
    .getByRole("button", { name: "AI Automation", exact: true })
    .click();
  assert.equal(await page.locator(".service-card").count(), 1);
  await page
    .getByRole("link", { name: "Explore service", exact: true })
    .click();
  assert.match(page.url(), /services\/ai-automation/);
  await page.getByRole("link", { name: "Discuss This Service" }).click();
  assert.equal(
    await page.locator("select[name=service]").inputValue(),
    "ai-automation",
  );
  await page.getByLabel("Your name *", { exact: true }).fill("Browser Test");
  await page
    .getByLabel("Email address *", { exact: true })
    .fill("browser@example.com");
  await page
    .getByLabel("What would you like to build or improve? *")
    .fill("Build an inventory application for the browser test workflow.");
  await page.locator("input[name=privacy]").check();
  await page.route("**/api/enquiries", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Temporary test failure. Please retry." }),
    }),
  );
  await page.getByRole("button", { name: "Send Project Enquiry" }).click();
  await page.getByRole("alert").waitFor();
  assert.equal(
    await page.locator("input[name=name]").inputValue(),
    "Browser Test",
  );
  await page.unroute("**/api/enquiries");
  await page.getByRole("button", { name: "Send Project Enquiry" }).click();
  await page.locator(".receipt").waitFor();
  assert.match(await page.locator(".receipt").innerText(), /^STS-/);
  console.log(
    "PASS: service context, form recovery and real saved enquiry receipt.",
  );
  await page.goto(base + "/insights");
  await page.getByRole("searchbox").fill("nonexistent query");
  await page.getByText("No matching articles").waitFor();
  await page.getByRole("button", { name: "Clear filters" }).click();
  assert.equal(await page.locator(".article-card").count(), 6);
  await page.getByRole("button", { name: "Practical AI", exact: true }).click();
  assert.equal(await page.locator(".article-card").count(), 1);
  await page.getByRole("link", { name: "Read guide", exact: true }).click();
  await page.getByRole("heading", { name: "Choose a bounded task" }).waitFor();
  await page.goto(base + "/work");
  await page
    .getByRole("button", { name: "Mobile Solutions", exact: true })
    .click();
  assert.equal(await page.locator(".project-card").count(), 1);
  await page.goto(base + "/technology");
  await page
    .getByRole("tab", { name: "Mobile Application", exact: true })
    .click();
  assert.match(
    await page.getByRole("tabpanel").innerText(),
    /React Native or Flutter/,
  );
  await page.goto(base + "/consultation");
  await page
    .locator("summary")
    .filter({ hasText: "How is the project price decided?" })
    .click();
  assert.equal(await page.locator("details[open]").count(), 1);
  console.log(
    "PASS: article search, category filters, detail pages, technology tabs and FAQs.",
  );
  for (const route of [
    "/",
    "/services",
    "/consultation",
    "/technology",
    "/work",
    "/insights",
  ]) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.screenshot({
      path: `tests/artifacts/${route === "/" ? "home" : route.slice(1)}-desktop.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Mobile overflow: ${route}`,
    );
  }
  await page.goto(base + "/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  assert.equal(await page.locator("#main-navigation").isVisible(), true);
  await page
    .locator("#main-navigation")
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await page.locator("#main-navigation").waitFor({ state: "hidden" });
  assert.equal(await page.locator("#main-navigation").isVisible(), false);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator("#main-navigation a").first().focus();
  await page.keyboard.press("Escape");
  await page.locator("#main-navigation").waitFor({ state: "hidden" });
  for (const route of ["/", "/consultation", "/services"]) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.screenshot({
      path: `tests/artifacts/${route === "/" ? "home" : route.slice(1)}-mobile.png`,
      fullPage: true,
    });
    await page.screenshot({
      path: `tests/artifacts/${route === "/" ? "home" : route.slice(1)}-mobile-viewport.png`,
    });
  }
  console.log(
    `PASS: ${routes.length} routes fit mobile and the mobile menu works.`,
  );
  assert.deepEqual(errors, []);
  console.log("PASS: no browser runtime or hydration errors.");
} finally {
  await browser?.close();
  if (!child.killed) {
    const closed = new Promise((resolve) => child.once("exit", resolve));
    child.kill();
    await closed;
  }
  rmSync(data, { recursive: true, force: true });
}
