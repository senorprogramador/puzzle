import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import tutorialManifest from "../generated/tutorial-manifest.json";
import { TutorialVideo } from "./tutorial-video";

const siteDirectory = fileURLToPath(new URL("../../", import.meta.url));

describe("TutorialVideo", () => {
  it("renders a responsive, accessible native video with captions and fallback links", () => {
    const markup = renderToStaticMarkup(<TutorialVideo id="data-table" />);
    const tutorial = tutorialManifest.find((entry) => entry.id === "data-table");

    expect(tutorial).toBeDefined();
    expect(markup).toContain('controls=""');
    expect(markup).toContain('preload="none"');
    expect(markup).toContain(`poster="${tutorial?.thumbnailUrl}"`);
    expect(markup).toContain(`<source src="${tutorial?.videoUrl}" type="video/mp4"/>`);
    expect(markup).toContain(`src="${tutorial?.captionsUrl}"`);
    expect(markup).toContain('kind="captions"');
    expect(markup).toContain(`aria-label="${tutorial?.title}"`);
    expect(markup).toContain('href="/videos/components/data-table/tutorial.mp4"');
    expect(markup).toContain("1:36");
  });

  it("rejects unregistered tutorial IDs and unsafe external URLs", () => {
    expect(() => renderToStaticMarkup(<TutorialVideo id="unknown" />)).toThrow(
      'No rendered video tutorial is registered for "unknown".',
    );
    expect(() =>
      renderToStaticMarkup(
        <TutorialVideo id="data-table" externalUrl="javascript:alert(1)" />,
      ),
    ).toThrow("TutorialVideo externalUrl must use HTTP or HTTPS.");
  });

  it("points at existing published MP4, thumbnail, and WebVTT assets", async () => {
    for (const tutorial of tutorialManifest) {
      for (const assetUrl of [
        tutorial.videoUrl,
        tutorial.thumbnailUrl,
        tutorial.captionsUrl,
      ]) {
        const path = join(siteDirectory, "public", assetUrl.slice(1));
        await access(path);
      }
      const captionsPath = join(
        siteDirectory,
        "public",
        tutorial.captionsUrl.slice(1),
      );
      expect(await readFile(captionsPath, "utf8")).toMatch(/^WEBVTT\n/);
    }
  });
});
