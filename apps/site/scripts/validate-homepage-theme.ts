import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser, type Page } from "playwright";

const site = fileURLToPath(new URL("..", import.meta.url));
const screenshotDirectory = resolve(
  process.env.PUZZLE_HOMEPAGE_THEME_SCREENSHOT_DIR ??
    resolve(site, "test-results", "homepage-theme"),
);
const responsiveWidths = [375, 390, 768, 1024, 1440, 1920];
const screenshotWidths = new Map([
  [390, "mobile"],
  [1440, "desktop"],
]);

type AccentSample = { text: string; color: string; background: string };

type ThemeColors = {
  pageBackground: string;
  pageText: string;
  headline: string;
  headlineAccent: string;
  eyebrow: string;
  introCopy: string;
  textLink: string;
  flowBackground: string;
  flowHeading: string;
  flowCopy: string;
  contextBackground: string;
  contextCopy: string;
  featureHeading: string;
  featureCopy: string;
  setupBackground: string;
  setupCopy: string;
  terminalBackground: string;
  terminalText: string;
  terminalPrompt: string;
  terminalNote: string;
  primaryButtonText: string;
  primaryButtonBackground: string;
  secondaryButtonText: string;
  sectionEyebrows: AccentSample[];
  sectionTitleAccents: AccentSample[];
};

type BaseThemeColors = Omit<
  ThemeColors,
  "sectionEyebrows" | "sectionTitleAccents"
>;

const startSite = async () => {
  let output = "";
  const server = spawn("node", [resolve(site, ".output/server/index.mjs")], {
    cwd: site,
    env: {
      ...process.env,
      NODE_ENV: "production",
      HOST: "127.0.0.1",
      PORT: "0",
      NO_COLOR: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const capture = (chunk: Buffer) => {
    output = (output + chunk.toString()).slice(-4000);
  };

  try {
    const origin = await new Promise<string>((resolveOrigin, reject) => {
      const timer = setTimeout(() => reject(new Error(`Site did not start:\n${output}`)), 30000);
      const fail = (error: Error) => {
        clearTimeout(timer);
        reject(error);
      };
      const inspectOutput = (chunk: Buffer) => {
        capture(chunk);
        const url = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
        if (url) {
          clearTimeout(timer);
          resolveOrigin(url);
        }
      };

      server.once("error", fail);
      server.once("exit", (code) => {
        clearTimeout(timer);
        reject(new Error(`Site exited with ${code}:\n${output}`));
      });
      server.stdout.on("data", inspectOutput);
      server.stderr.on("data", inspectOutput);
    });

    return { origin, server };
  } catch (error) {
    await stopSite(server);
    throw error;
  }
};

const stopSite = async (server: ReturnType<typeof spawn>) => {
  if (server.exitCode !== null || server.signalCode !== null) return;

  const exited = once(server, "exit");
  server.kill("SIGTERM");
  const timer = setTimeout(() => server.kill("SIGKILL"), 5000);
  timer.unref();
  await exited;
  clearTimeout(timer);
};

const waitForRender = async (page: Page) => {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolveFrame) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolveFrame()));
    });
  });
};

const waitForScheme = async (page: Page, expected: "dark" | "light") => {
  await page.waitForFunction((expectedScheme) => {
    const scope = document.querySelector<HTMLElement>(
      ".puzzle-theme-scope[data-puzzle-theme-scope]",
    );
    const toggle = document.querySelector<HTMLInputElement>("#home-dark-mode");
    if (!scope || !toggle) return false;

    const isDark = getComputedStyle(scope)
      .getPropertyValue("color-scheme")
      .includes("dark");
    return isDark === (expectedScheme === "dark") && toggle.checked === isDark;
  }, expected);
};

const assertHomepageAppBarSticks = async (page: Page) => {
  const appBar = page.locator(".home-page > .puzzle-app-bar");
  assert.equal(
    await appBar.evaluate((element) => getComputedStyle(element).position),
    "sticky",
    "homepage appbar uses sticky positioning",
  );

  await page.evaluate(() => window.scrollTo(0, 900));
  assert.equal(
    await appBar.evaluate((element) => element.getBoundingClientRect().top),
    0,
    "homepage appbar stays at the viewport top after scrolling",
  );
  await page.evaluate(() => window.scrollTo(0, 0));
};

const trackBrowserErrors = (page: Page, errors: string[]) => {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
};

const collectAccentSamples = async (
  page: Page,
  selector: string,
): Promise<AccentSample[]> => {
  const elements = page.locator(selector);
  const samples: AccentSample[] = [];

  for (let index = 0; index < await elements.count(); index++) {
    const element = elements.nth(index);
    await element.scrollIntoViewIfNeeded();
    await waitForRender(page);
    samples.push(
      await element.evaluate((node) => {
        const home = node.closest<HTMLElement>(".home-page");
        const section = node.closest<HTMLElement>(".puzzle-section") ?? home;
        if (!section) throw new Error("Homepage section was not found");
        return {
          text: node.textContent?.trim() ?? "",
          color: getComputedStyle(node).color,
          background: getComputedStyle(section).backgroundColor,
        };
      }),
    );
  }

  return samples;
};

const inspectTheme = async (page: Page): Promise<ThemeColors> => {
  const baseColors = await page.locator("#ai-development").evaluate((section) => {
    const home = section.closest(".home-page");
    if (!home) throw new Error("Homepage theme wrapper was not found");
    const homeStyle = getComputedStyle(home);
    const colorOf = (selector: string) => {
      const element = section.querySelector(selector);
      if (!element) throw new Error(`Homepage theme test could not find ${selector}`);
      return getComputedStyle(element).color;
    };
    const backgroundOf = (selector: string) => {
      const element = section.querySelector(selector);
      if (!element) throw new Error(`Homepage theme test could not find ${selector}`);
      return getComputedStyle(element).backgroundColor;
    };
    const buttons = section.querySelectorAll(".home-ai__actions a");
    if (buttons.length < 2) throw new Error("Homepage AI calls to action were not found");
    const primaryButton = buttons.item(0);
    const secondaryButton = buttons.item(1);
    if (!primaryButton || !secondaryButton) {
      throw new Error("Homepage AI calls to action were not found");
    }

    const colors: BaseThemeColors = {
      pageBackground: homeStyle.backgroundColor,
      pageText: homeStyle.color,
      headline: colorOf(".home-ai__intro h2"),
      headlineAccent: colorOf(".home-ai__intro h2 span"),
      eyebrow: colorOf(".home-ai__eyebrow"),
      introCopy: colorOf(".home-ai__intro > p:not(.home-ai__eyebrow)"),
      textLink: colorOf(".home-ai__text-link"),
      flowBackground: backgroundOf(".home-ai__flow"),
      flowHeading: colorOf(".home-ai__flow-heading"),
      flowCopy: colorOf(".home-ai__project > p"),
      contextBackground: backgroundOf(".home-ai__context"),
      contextCopy: colorOf(".home-ai__context-row > span"),
      featureHeading: colorOf(".home-ai__features h3"),
      featureCopy: colorOf(".home-ai__features p"),
      setupBackground: backgroundOf(".home-ai__setup"),
      setupCopy: colorOf(".home-ai__setup-copy > p:not(.home-ai__eyebrow)"),
      terminalBackground: backgroundOf(".home-ai__terminal"),
      terminalText: colorOf(".home-ai__terminal li code"),
      terminalPrompt: colorOf(".home-ai__terminal li > span"),
      terminalNote: colorOf(".home-ai__terminal-heading > span:last-child"),
      primaryButtonText: getComputedStyle(primaryButton).color,
      primaryButtonBackground: getComputedStyle(primaryButton).backgroundColor,
      secondaryButtonText: getComputedStyle(secondaryButton).color,
    };
    return colors;
  });
  const sectionEyebrows = await collectAccentSamples(
    page,
    ".home-page .puzzle-hero__eyebrow, .home-page .puzzle-section-header__eyebrow",
  );
  const sectionTitleAccents = await collectAccentSamples(
    page,
    ".home-page .puzzle-hero__title > span, .home-page .puzzle-section-header__title > span",
  );
  return { ...baseColors, sectionEyebrows, sectionTitleAccents };
};

const parseRgb = (color: string): [number, number, number] => {
  const srgbChannels = color.match(
    /^color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i,
  );
  if (srgbChannels) {
    return [
      Number.parseFloat(srgbChannels[1]!) * 255,
      Number.parseFloat(srgbChannels[2]!) * 255,
      Number.parseFloat(srgbChannels[3]!) * 255,
    ];
  }

  const channels = color.match(/[\d.]+/g) ?? [];
  const red = Number.parseFloat(channels[0] ?? "NaN");
  const green = Number.parseFloat(channels[1] ?? "NaN");
  const blue = Number.parseFloat(channels[2] ?? "NaN");
  assert.ok(
    Number.isFinite(red) && Number.isFinite(green) && Number.isFinite(blue),
    `Expected an RGB color, received ${color}`,
  );
  return [red, green, blue];
};

const assertSameColor = (actual: string, expected: string, message: string) => {
  const actualChannels = parseRgb(actual);
  const expectedChannels = parseRgb(expected);
  assert.ok(
    actualChannels.every(
      (channel, index) => Math.abs(channel - expectedChannels[index]!) <= 1,
    ),
    `${message}: ${actual} does not match ${expected}`,
  );
};

const luminance = (color: string) => {
  const [red, green, blue] = parseRgb(color);
  const linearize = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
};

const contrastRatio = (foreground: string, background: string) => {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
};

const assertThemeColors = (colors: ThemeColors, theme: "dark" | "light") => {
  const consistencyChecks: Array<[string, string, string]> = [
    ["AI heading matches page text", colors.headline, colors.pageText],
    ["AI text link matches page text", colors.textLink, colors.pageText],
    ["flow heading matches page text", colors.flowHeading, colors.pageText],
    ["feature heading matches page text", colors.featureHeading, colors.pageText],
    ["muted descriptions are consistent", colors.introCopy, colors.featureCopy],
    ["flow and setup surfaces are consistent", colors.flowBackground, colors.setupBackground],
    ["context and terminal surfaces are consistent", colors.contextBackground, colors.terminalBackground],
  ];

  for (const [label, actual, expected] of consistencyChecks) {
    assert.equal(actual, expected, `${theme}: ${label}`);
  }

  assert.ok(colors.sectionEyebrows.length > 0, `${theme}: section eyebrow labels are present`);
  for (const eyebrow of colors.sectionEyebrows) {
    assert.ok(eyebrow.text, `${theme}: section eyebrow has a label`);
    assertSameColor(
      eyebrow.color,
      colors.eyebrow,
      `${theme}: ${eyebrow.text} uses the readable primary accent`,
    );
    const ratio = contrastRatio(eyebrow.color, eyebrow.background);
    assert.ok(
      ratio >= 4.5,
      `${theme}: ${eyebrow.text} contrast is ${ratio.toFixed(2)}:1; expected at least 4.5:1`,
    );
  }

  assert.ok(colors.sectionTitleAccents.length > 0, `${theme}: section title accents are present`);
  for (const titleAccent of colors.sectionTitleAccents) {
    assertSameColor(
      titleAccent.color,
      colors.headlineAccent,
      `${theme}: section title uses the primary accent`,
    );
    const ratio = contrastRatio(titleAccent.color, titleAccent.background);
    assert.ok(
      ratio >= 3,
      `${theme}: section title accent contrast is ${ratio.toFixed(2)}:1; expected at least 3:1`,
    );
  }

  const contrastChecks: Array<[string, string, string, number]> = [
    ["headline", colors.headline, colors.pageBackground, 3],
    ["eyebrow", colors.eyebrow, colors.pageBackground, 4.5],
    ["intro copy", colors.introCopy, colors.pageBackground, 4.5],
    ["feature copy", colors.featureCopy, colors.pageBackground, 4.5],
    ["flow heading", colors.flowHeading, colors.flowBackground, 4.5],
    ["flow copy", colors.flowCopy, colors.flowBackground, 4.5],
    ["context copy", colors.contextCopy, colors.contextBackground, 4.5],
    ["setup copy", colors.setupCopy, colors.setupBackground, 4.5],
    ["terminal command", colors.terminalText, colors.terminalBackground, 4.5],
    ["terminal prompt", colors.terminalPrompt, colors.terminalBackground, 4.5],
    ["terminal note", colors.terminalNote, colors.terminalBackground, 4.5],
    ["primary call to action", colors.primaryButtonText, colors.primaryButtonBackground, 4.5],
    ["secondary call to action", colors.secondaryButtonText, colors.setupBackground, 4.5],
  ];

  for (const [label, foreground, background, minimum] of contrastChecks) {
    const ratio = contrastRatio(foreground, background);
    assert.ok(
      ratio >= minimum,
      `${theme}: ${label} contrast is ${ratio.toFixed(2)}:1; expected at least ${minimum}:1`,
    );
  }
};

const checkResponsiveWidths = async (
  page: Page,
  theme: "dark" | "light",
) => {
  for (const width of responsiveWidths) {
    await page.setViewportSize({ width, height: 1000 });
    const section = page.locator("#ai-development");
    await section.scrollIntoViewIfNeeded();
    await waitForRender(page);

    const documentWidth = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    assert.ok(documentWidth <= 1, `${theme}: ${width}px homepage has ${documentWidth}px horizontal overflow`);

    const screenshotName = screenshotWidths.get(width);
    if (screenshotName) {
      const screenshotPath = resolve(
        screenshotDirectory,
        `${theme}-${screenshotName}.png`,
      );
      await section.screenshot({
        path: screenshotPath,
        animations: "disabled",
        caret: "hide",
      });
    }
  }
};

await mkdir(screenshotDirectory, { recursive: true });

let server: ReturnType<typeof spawn> | undefined;
let browser: Browser | undefined;

try {
  const started = await startSite();
  server = started.server;
  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  const errors: string[] = [];
  trackBrowserErrors(page, errors);

  const response = await page.goto(`${started.origin}/`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200, "homepage response");
  const darkModeToggle = page.getByRole("switch", { name: "Dark mode" });
  await darkModeToggle.waitFor({ state: "visible" });
  await waitForScheme(page, "light");
  assert.equal(await darkModeToggle.isChecked(), false, "light system preference starts in light mode");
  await assertHomepageAppBarSticks(page);

  const section = page.locator("#ai-development");
  await section.scrollIntoViewIfNeeded();
  await waitForRender(page);
  const lightColors = await inspectTheme(page);
  assertThemeColors(lightColors, "light");
  await checkResponsiveWidths(page, "light");

  await page.locator('label[for="home-dark-mode"]').click();
  await waitForScheme(page, "dark");
  assert.equal(await darkModeToggle.isChecked(), true, "theme toggle switches to dark mode");

  const darkColors = await inspectTheme(page);
  assertThemeColors(darkColors, "dark");
  assert.notEqual(darkColors.pageBackground, lightColors.pageBackground, "theme switch changes page background");
  assert.notEqual(darkColors.pageText, lightColors.pageText, "theme switch changes page text");
  assert.ok(
    luminance(lightColors.pageBackground) > luminance(darkColors.pageBackground),
    "light mode uses a lighter page background",
  );
  assert.ok(
    luminance(lightColors.pageText) < luminance(darkColors.pageText),
    "light mode uses darker page text",
  );
  assert.ok(
    luminance(lightColors.flowBackground) > luminance(darkColors.flowBackground),
    "light mode uses a lighter flow surface",
  );
  assert.ok(
    luminance(lightColors.terminalBackground) > luminance(darkColors.terminalBackground),
    "light mode uses a lighter terminal surface",
  );
  await checkResponsiveWidths(page, "dark");

  const darkPreferencePage = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    colorScheme: "dark",
  });
  trackBrowserErrors(darkPreferencePage, errors);
  const darkPreferenceResponse = await darkPreferencePage.goto(`${started.origin}/`, {
    waitUntil: "networkidle",
  });
  assert.equal(darkPreferenceResponse?.status(), 200, "dark preference homepage response");
  await waitForScheme(darkPreferencePage, "dark");
  const systemDarkColors = await inspectTheme(darkPreferencePage);
  assertThemeColors(systemDarkColors, "dark");
  assert.equal(
    systemDarkColors.pageBackground,
    darkColors.pageBackground,
    "dark system preference uses the same dark colors",
  );
  await darkPreferencePage.close();

  assert.deepEqual(errors, [], "homepage browser errors");
  console.log(
    `Homepage dark/light color, contrast, responsive, sticky appbar and screenshot checks passed: ${screenshotDirectory}`,
  );
} finally {
  await browser?.close();
  if (server) await stopSite(server);
}
