import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser } from "playwright";
import tutorialManifest from "../src/generated/tutorial-manifest.json";

const site = fileURLToPath(new URL("..", import.meta.url));
const screenshotDirectory = process.env.TUTORIAL_VIDEO_SCREENSHOT_DIR;
const server = spawn("node", [resolve(site, ".output/server/index.mjs")], {
  cwd: site,
  env: {
    ...process.env,
    HOST: "127.0.0.1",
    PORT: "0",
    NODE_ENV: "production",
    NO_COLOR: "1",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser: Browser | undefined;
let output = "";
const capture = (chunk: Buffer) => {
  output = (output + chunk.toString()).slice(-4000);
};
server.stdout.on("data", capture);
server.stderr.on("data", capture);

try {
  if (screenshotDirectory) await mkdir(screenshotDirectory, { recursive: true });

  const origin = await new Promise<string>((resolveOrigin, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Documentation site did not start:\n${output}`)),
      30000,
    );
    server.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    server.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Documentation site exited with ${code}:\n${output}`));
    });
    server.stdout.on("data", () => {
      const url = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (url) {
        clearTimeout(timer);
        resolveOrigin(url);
      }
    });
  });

  browser = await chromium.launch();
  for (const tutorial of tutorialManifest) {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
      reducedMotion: "reduce",
    });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(`${origin}${tutorial.documentationUrl}`, {
      waitUntil: "networkidle",
    });
    await page.getByRole("heading", { name: "Watch the tutorial" }).waitFor();
    const section = page.locator(".puzzle-tutorial-video");
    const video = section.locator("video");
    assert.equal(await video.count(), 1, `${tutorial.id} has one native video player.`);
    assert.equal(await video.getAttribute("preload"), "none");
    assert.equal(await video.getAttribute("poster"), tutorial.thumbnailUrl);
    assert.equal(await video.getAttribute("aria-label"), tutorial.title);
    assert.ok(await video.evaluate((element) => (element as HTMLVideoElement).controls));

    const source = section.locator("source");
    assert.equal(await source.getAttribute("src"), tutorial.videoUrl);
    const videoResponse = await fetch(`${origin}${tutorial.videoUrl}`, { method: "HEAD" });
    assert.equal(videoResponse.status, 200, `${tutorial.videoUrl} is served.`);
    assert.match(
      videoResponse.headers.get("content-type") ?? "",
      /video\/mp4/,
      `${tutorial.id} is served as MP4.`,
    );
    assert.ok(Number(videoResponse.headers.get("content-length")) > 0);

    const posterResponse = await fetch(`${origin}${tutorial.thumbnailUrl}`, {
      method: "HEAD",
    });
    assert.equal(posterResponse.status, 200, `${tutorial.thumbnailUrl} is served.`);
    const captionsResponse = await fetch(`${origin}${tutorial.captionsUrl}`);
    assert.equal(captionsResponse.status, 200, `${tutorial.captionsUrl} is served.`);
    assert.match(await captionsResponse.text(), /^WEBVTT\n/);
    assert.ok(await section.locator('track[kind="captions"]').count());

    for (const viewport of [
      { width: 1280, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      const layout = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        playerWidth: document.querySelector("video")?.getBoundingClientRect().width ?? 0,
      }));
      assert.ok(layout.documentWidth <= layout.viewportWidth, `${tutorial.id} has no horizontal overflow.`);
      assert.ok(layout.playerWidth > 0 && layout.playerWidth <= layout.viewportWidth);
      if (screenshotDirectory) {
        await section.scrollIntoViewIfNeeded();
        await section.screenshot({
          path: resolve(
            screenshotDirectory,
            `${tutorial.id}-${viewport.width}.png`,
          ),
        });
      }
    }

    const metadata = await video.evaluate(async (element) => {
      const player = element as HTMLVideoElement;
      player.preload = "metadata";
      player.load();
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error("Timed out loading video metadata."));
        }, 15000);
        const onLoaded = () => {
          clearTimeout(timer);
          resolve();
        };
        const onError = () => {
          clearTimeout(timer);
          reject(
            new Error(`Video metadata failed: ${player.error?.message ?? "unknown error"}`),
          );
        };
        player.addEventListener("loadedmetadata", onLoaded, { once: true });
        player.addEventListener("error", onError, { once: true });
      });
      return {
        duration: player.duration,
        paused: player.paused,
        width: player.videoWidth,
        height: player.videoHeight,
      };
    });
    assert.ok(Math.abs(metadata.duration - tutorial.durationSeconds) < 1);
    assert.equal(metadata.paused, true, "Video does not autoplay.");
    assert.equal(metadata.width, 1920);
    assert.equal(metadata.height, 1080);

    await video.focus();
    assert.equal(
      await video.evaluate((element) => document.activeElement === element),
      true,
      "Native player can receive keyboard focus.",
    );

    assert.deepEqual(errors, [], `${tutorial.id} has no browser console errors.`);
    await page.close();
    console.log(`Validated browser player: ${tutorial.id}`);
  }
} finally {
  await browser?.close();
  if (server.exitCode === null && server.signalCode === null) {
    const exited = once(server, "exit");
    server.kill("SIGTERM");
    const timer = setTimeout(() => server.kill("SIGKILL"), 5000);
    timer.unref();
    await exited;
    clearTimeout(timer);
  }
}
