import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { cp, mkdir, mkdtemp, readFile, rm, symlink, unlink } from "node:fs/promises";
import { createServer } from "node:net";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../..");
const templates = join(here, "templates");

const reservePort = () => new Promise((resolvePort, reject) => {
  const server = createServer();
  server.once("error", reject);
  server.listen(0, "127.0.0.1", () => {
    const address = server.address();
    if (!address || typeof address === "string") {
      reject(new Error("Could not reserve a port."));
      return;
    }
    server.close((error) => error ? reject(error) : resolvePort(address.port));
  });
});

const readOutput = async (page, name) =>
  JSON.parse(await page.getByTestId(name).textContent());

const waitForAsset = async (page, kind) => {
  await page.waitForFunction((wanted) => {
    const output = document.querySelector('[data-testid="assets"]');
    return output && JSON.parse(output.textContent).some(
      (asset) => asset.kind === wanted && asset.status === "ready",
    );
  }, kind, { timeout: 30_000 });
  return (await readOutput(page, "assets")).find((asset) => asset.kind === kind);
};

const chooseAsset = async (page, asset) => {
  await page.getByRole("button", { name: "Choose media for Media" }).click();
  const dialog = page.getByRole("dialog", { name: "Choose media" });
  await dialog.getByRole("button", { name: `Select ${asset.displayName}` }).click();
  await dialog.getByRole("button", { name: "Choose asset" }).click();
};

const publishStory = async (page, asset, title) => {
  await page.getByLabel("Title *").fill(title);
  await page.getByRole("button", { name: "Save draft" }).click();
  await page.waitForFunction(() => JSON.parse(
    document.querySelector('[data-testid="entry"]').textContent,
  )?.id, null, { timeout: 15_000 });
  await page.getByRole("button", { name: "Preview draft" }).click();
  await page.waitForFunction(() => JSON.parse(
    document.querySelector('[data-testid="draft-preview"]').textContent,
  )?.id, null, { timeout: 15_000 });
  const draft = await readOutput(page, "draft-preview");
  assert.equal(draft.status, "draft");
  assert.equal(draft.fields.media, asset.id);
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await page.waitForFunction(() => JSON.parse(
    document.querySelector('[data-testid="public-entry"]').textContent,
  )?.id, null, { timeout: 15_000 });
  const published = await readOutput(page, "public-entry");
  assert.equal(published.fields.title, title);
  assert.equal(published.fields.media, asset.id);
};

for (const framework of ["next", "tanstack"]) {
  test(`${framework} Workspace runs browser image and video CMS journeys`, { timeout: 180_000 }, async () => {
    const app = join(root, "apps", `workspace-${framework}`);
    const directory = await mkdtemp(join(app, "tests", ".cms-media-e2e-"));
    let server;
    let browser;
    let output = "";
    try {
      await cp(join(app, "src"), join(directory, "src"), { recursive: true });
      await cp(join(app, "public"), join(directory, "public"), { recursive: true });
      await cp(join(app, "tsconfig.json"), join(directory, "tsconfig.json"));
      await cp(join(templates, "workflow.jsx"), join(directory, "src/workflow.jsx"));
      if (framework === "next") {
        await mkdir(join(directory, "src/app/cms-media-e2e"));
        await cp(join(templates, "next/app/page.jsx"), join(directory, "src/app/cms-media-e2e/page.jsx"));
        await unlink(join(directory, "src/app/api/[...path]/route.ts"));
        await cp(join(templates, "next/app/api/[...path]/route.js"), join(directory, "src/app/api/[...path]/route.js"));
        await cp(join(templates, "next/next.config.mjs"), join(directory, "next.config.mjs"));
      } else {
        await cp(join(templates, "tanstack/src/routes/index.jsx"), join(directory, "src/routes/cms-media-e2e.jsx"));
        await unlink(join(directory, "src/routes/api/$.ts"));
        await cp(join(templates, "tanstack/src/routes/api/$.jsx"), join(directory, "src/routes/api/$.jsx"));
        await cp(join(templates, "tanstack/vite.config.mjs"), join(directory, "vite.config.mjs"));
      }
      await symlink(join(here, "backend.mjs"), join(directory, "backend.mjs"));
      const port = await reservePort();
      const base = `http://127.0.0.1:${port}`;
      const cli = framework === "next"
        ? join(app, "node_modules/next/dist/bin/next")
        : join(app, "node_modules/vite/bin/vite.js");
      const args = framework === "next"
        ? [cli, "dev", "-p", String(port)]
        : [cli, "dev", "--host", "127.0.0.1", "--port", String(port), "--strictPort"];
      server = spawn(process.execPath, ["--experimental-strip-types", ...args], {
        cwd: directory,
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
        stdio: ["ignore", "pipe", "pipe"],
      });
      const append = (chunk) => { output = `${output}${chunk}`.slice(-20_000); };
      server.stdout.on("data", append);
      server.stderr.on("data", append);
      const deadline = Date.now() + 120_000;
      let ready = false;
      while (Date.now() < deadline) {
        if (server.exitCode !== null || server.signalCode !== null) throw new Error(`Framework exited:\n${output}`);
        try {
          const response = await fetch(`${base}/cms-media-e2e`);
          if (response.ok) {
            ready = true;
            break;
          }
        } catch {
          await delay(250);
          continue;
        }
        await delay(250);
      }
      if (!ready) throw new Error(`Framework did not become ready:\n${output}`);
      const api = await fetch(`${base}/api/cms/admin/content-types`);
      assert.equal(api.status, 200, `${await api.text()}\n${output}`);
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await page.route("**/api/auth/state", (route) =>
        route.fulfill({ json: { status: "unauthenticated", user: null } }),
      );
      const errors = [];
      const optimizerRequests = [];
      page.on("request", (request) => {
        if (new URL(request.url()).pathname === "/_next/image") optimizerRequests.push(request.url());
      });
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      try {
        await page.goto(`${base}/cms-media-e2e`);
        await page.getByText("true", { exact: true }).waitFor();
        const image = await page.evaluate(() => {
          const canvas = document.createElement("canvas");
          canvas.width = 64;
          canvas.height = 48;
          const context = canvas.getContext("2d");
          context.fillStyle = "#239";
          context.fillRect(0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/png").split(",")[1];
        });
        await page.locator('section[aria-label="Image upload"] input[type="file"]').setInputFiles({
          name: "cover.png",
          mimeType: "image/png",
          buffer: Buffer.from(image, "base64"),
        });
        const imageAsset = await waitForAsset(page, "image");
        assert.equal(imageAsset.width, 32);
        assert.equal(imageAsset.height, 24);
        assert.equal(imageAsset.variants[0].status, "ready");
        await chooseAsset(page, imageAsset);
        await page.getByRole("button", { name: "Edit image details" }).click();
        await page.getByRole("group", { name: "Photo gallery with 2 photos" }).waitFor();
        await page.getByRole("tab", { name: "Crop" }).click();
        await page.getByRole("slider", { name: "Zoom crop" }).press("ArrowRight");
        await page.getByRole("tab", { name: "Hotspots" }).click();
        await page.getByRole("button", { name: "Add hotspot point" }).click();
        await page.getByRole("group", { name: "Image focal point and hotspots image canvas" }).press("Enter");
        await page.getByRole("button", { name: "Save details" }).click();
        await page.waitForFunction((id) => {
          const assets = JSON.parse(document.querySelector('[data-testid="assets"]').textContent);
          const asset = assets.find((item) => item.id === id);
          return asset?.crop && asset.hotspots.length === 1;
        }, imageAsset.id, { timeout: 15_000 });
        await publishStory(page, imageAsset, "Image story");

        await page.reload();
        await page.getByText("true", { exact: true }).waitFor();
        const video = await readFile(join(root, "packages/media/tests/fixtures/finite-duration.webm"));
        assert.ok(video.length > 1024);
        let partTransfers = 0;
        page.on("response", (response) => {
          if (response.url().includes("/api/e2e/upload/multipart/") && response.ok()) {
            partTransfers += 1;
          }
        });
        await page.locator('section[aria-label="Video upload"] input[type="file"]').setInputFiles({
          name: "clip.webm", mimeType: "video/webm", buffer: video,
        });
        await page.getByRole("button", { name: "Pause", exact: true }).click({ timeout: 30_000 });
        await page.getByText("Upload paused", { exact: true }).waitFor();
        await page.getByRole("button", { name: "Resume", exact: true }).click();
        await page.getByText("Video ready", { exact: true }).waitFor({ timeout: 30_000 });
        const videoAsset = await waitForAsset(page, "video");
        const videoInfo = await readOutput(page, "video-info");
        assert.equal(videoInfo.width, 160);
        assert.equal(videoInfo.height, 90);
        assert.ok(videoInfo.duration > 0);
        assert.ok(videoInfo.posterBytes > 0);
        assert.ok(partTransfers > 1);
        assert.equal(videoAsset.variants[0].status, "ready");
        await chooseAsset(page, videoAsset);
        await publishStory(page, videoAsset, "Video story");
        assert.deepEqual(errors, []);
        assert.deepEqual(optimizerRequests, []);
      } catch (error) {
        const alerts = await page.getByRole("alert").allTextContents();
        const assets = await page.getByTestId("assets").count() ? await page.getByTestId("assets").textContent() : "unavailable";
        const hydrated = await page.getByTestId("hydrated").count() ? await page.getByTestId("hydrated").textContent() : "unavailable";
        throw new Error(`Browser journey failed: ${error.message}\nHydrated: ${hydrated}\nAlerts: ${alerts.join("\n")}\nAssets: ${assets}\nPage errors: ${errors.join("\n")}\nFramework output:\n${output}`, { cause: error });
      }
    } finally {
      await browser?.close();
      if (server && server.exitCode === null && server.signalCode === null) {
        server.kill("SIGTERM");
        await Promise.race([once(server, "exit"), delay(5_000)]);
        if (server.exitCode === null && server.signalCode === null) {
          server.kill("SIGKILL");
          await once(server, "exit");
        }
      }
      await rm(directory, { recursive: true, force: true });
    }
  });
}
