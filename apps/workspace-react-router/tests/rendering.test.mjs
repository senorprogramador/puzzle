import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { chromium } from "playwright";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
let server;
let browser;
let baseUrl;
let serverOutput = "";

const reservePort = async () =>
  new Promise((resolve, reject) => {
    const listener = createServer();
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", () => {
      const address = listener.address();
      if (!address || typeof address === "string") {
        reject(new Error("Could not reserve a port for the fixture server."));
        return;
      }

      listener.close((error) => {
        if (error) reject(error);
        else resolve(address.port);
      });
    });
  });

const appendServerOutput = (chunk) => {
  serverOutput = `${serverOutput}${chunk}`.slice(-6000);
};

const waitForServer = async () => {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`React Router fixture exited early:\n${serverOutput}`);
    }

    try {
      const response = await fetch(`${baseUrl}/fr/workspace`);
      if (response.ok) return;
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`React Router fixture did not become ready:\n${serverOutput}`);
};

before(async () => {
  await access(new URL("../dist/server/entry.server.js", import.meta.url)).catch(() => {
    throw new Error("Run the workspace-react-router production build before this test.");
  });

  const port = await reservePort();
  baseUrl = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ["server.mjs"], {
    cwd: appRoot,
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: String(port),
      NODE_ENV: "production",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", appendServerOutput);
  server.stderr.on("data", appendServerOutput);

  await waitForServer();
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser?.close();

  if (!server || server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([
    once(server, "exit"),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
});

test("direct localized requests render loader data and locale metadata", async () => {
  const response = await fetch(`${baseUrl}/fr/workspace?q=membres`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /<html lang="fr" dir="ltr">/);
  assert.match(html, /<title>Découvrez les espaces de travail traduits<\/title>/);
  assert.match(html, /name="description" content="Les données chargées/);
  assert.match(html, /property="og:title" content="Découvrez les espaces/);
  assert.match(html, /href="http:\/\/127\.0\.0\.1:\d+\/fr\/workspace"/);
  assert.match(html, /Membres de l’équipe/);
  assert.doesNotMatch(html, /<li>Projets partagés<\/li>/);

  const arabicResponse = await fetch(`${baseUrl}/ar/workspace`);
  const arabicHtml = await arabicResponse.text();
  assert.equal(arabicResponse.status, 200);
  assert.match(arabicHtml, /<html lang="ar" dir="rtl">/);
  assert.match(arabicHtml, /استكشف محتوى مساحة العمل المترجم/);
});

test("native route actions return localized action data in SSR", async () => {
  const response = await fetch(`${baseUrl}/fr/workspace`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ note: "Bonjour" }),
  });
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Votre note a été enregistrée\./);
  assert.match(html, /Bonjour/);
});

test("production browser hydrates, navigates, searches, submits actions, and shows errors", async () => {
  const staticPage = await browser.newPage({ javaScriptEnabled: false });
  await staticPage.goto(`${baseUrl}/ar/workspace`);
  assert.equal(await staticPage.getByTestId("localized-title").count(), 1);
  assert.equal(await staticPage.getByTestId("router-hydration").getAttribute("data-hydrated"), "false");
  await staticPage.close();

  const page = await browser.newPage();
  const hydrationErrors = [];
  page.on("pageerror", (error) => hydrationErrors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydration|did not match|server rendered/i.test(message.text())
    ) {
      hydrationErrors.push(message.text());
    }
  });

  await page.goto(`${baseUrl}/en/workspace`);
  await page.waitForFunction(
    () => document.querySelector('[data-testid="router-hydration"]')?.dataset.hydrated === "true",
  );
  await page.getByTestId("locale-link-fr").click();
  await page.getByText("Découvrez les espaces de travail traduits").waitFor();
  await page.waitForFunction(() => document.documentElement.lang === "fr");
  assert.equal(await page.title(), "Découvrez les espaces de travail traduits");
  assert.equal(
    await page.locator('meta[name="description"]').getAttribute("content"),
    "Les données chargées sont rendues sur le serveur puis hydratées dans le navigateur.",
  );

  await page.getByLabel("Rechercher des sujets").fill("membres");
  await page.getByRole("button", { name: "Rechercher" }).click();
  await page.waitForURL(/\/fr\/workspace\?q=membres/);
  await page.waitForFunction(
    () => document.querySelectorAll('[data-testid="localized-topics"] li').length === 1,
  );
  assert.equal(await page.locator('[data-testid="localized-topics"] li').count(), 1);
  assert.match(await page.locator('[data-testid="localized-topics"]').textContent(), /Membres de l’équipe/);

  await page.getByLabel("Votre note").fill("Note du navigateur");
  await page.getByRole("button", { name: "Enregistrer la note" }).click();
  await page.getByTestId("action-result").waitFor();
  assert.match(await page.getByTestId("action-result").textContent(), /Note du navigateur/);

  await page.getByLabel("Votre note").fill("");
  await page.getByRole("button", { name: "Enregistrer la note" }).click();
  await page.getByTestId("route-error").waitFor();
  assert.equal(await page.getByTestId("route-error-status").textContent(), "400");

  assert.deepEqual(hydrationErrors, []);
  await page.close();
});

test("unsupported locale requests use the route error boundary and HTTP status", async () => {
  const response = await fetch(`${baseUrl}/xx/workspace`);
  const html = await response.text();

  assert.equal(response.status, 404);
  assert.match(html, /Workspace request failed/);
  assert.match(html, /Unsupported locale\./);
});
