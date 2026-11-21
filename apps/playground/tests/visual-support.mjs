export const CANONICAL_IMAGE_REF =
  "mcr.microsoft.com/playwright:v1.65.1-noble@sha256:56be08aca06bf736a928da2e3235a3b63ef71ee97313beb18c6019fea791aba4";
export const CANONICAL_ENVIRONMENT_ID =
  "playwright-1.65.1-ubuntu-24.04-arm64-chromium-159.0.8154.6-bun-1.4.4";
export const BROWSER_LAUNCH_ARGS = [
  "--disable-gpu",
  "--disable-dev-shm-usage",
];
export const EXPECTED_PLATFORM_FONT_FAMILIES = ["WenQuanYi Zen Hei"];

export const settlePage = async (page) => {
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation: none !important;
        caret-color: transparent !important;
        scroll-behavior: auto !important;
        transition: none !important;
      }
    `,
  });

  const readiness = await page.evaluate(async () => {
    await document.fonts.ready;
    const failedFonts = [...document.fonts]
      .filter((font) => font.status === "error")
      .map((font) => ({
        family: font.family,
        style: font.style,
        weight: font.weight,
      }));

    const failedImages = await Promise.all(
      [...document.images].map(async (image) => {
        image.loading = "eager";

        try {
          await image.decode();
        } catch (error) {
          return {
            src: image.currentSrc || image.src,
            error: error instanceof Error ? error.message : String(error),
          };
        }

        if (!image.complete || image.naturalWidth === 0) {
          return { src: image.currentSrc || image.src, error: "Image is incomplete." };
        }

        return null;
      }),
    );

    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );

    return {
      fontSetStatus: document.fonts.status,
      failedFonts,
      failedImages: failedImages.filter(Boolean),
    };
  });

  if (
    readiness.fontSetStatus !== "loaded" ||
    readiness.failedFonts.length > 0 ||
    readiness.failedImages.length > 0
  ) {
    throw new Error(`Page assets did not settle: ${JSON.stringify(readiness)}`);
  }

  return readiness;
};

export const inspectRenderedFonts = async (page) => {
  const session = await page.context().newCDPSession(page);

  try {
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const { root } = await session.send("DOM.getDocument");
    const renderedFonts = [];

    for (const selector of ["h1", "main"]) {
      const { nodeId } = await session.send("DOM.querySelector", {
        nodeId: root.nodeId,
        selector,
      });

      if (!nodeId) {
        throw new Error(`Cannot inspect rendered font for "${selector}".`);
      }

      const { fonts } = await session.send("CSS.getPlatformFontsForNode", {
        nodeId,
      });
      const computedFontFamily = await page.locator(selector).first().evaluate(
        (element) => getComputedStyle(element).fontFamily,
      );

      renderedFonts.push({
        selector,
        computedFontFamily,
        platformFonts: fonts.map(
          ({ familyName, postScriptName, isCustomFont, glyphCount }) => ({
            familyName,
            postScriptName,
            isCustomFont,
            glyphCount,
          }),
        ),
      });
    }

    return renderedFonts;
  } finally {
    await session.detach();
  }
};

export const watchPageDiagnostics = (page) => {
  const diagnostics = {
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    externalRequests: [],
    badResponses: [],
  };
  const origin = new URL("http://127.0.0.1:4173").origin;

  page.on("console", (message) => {
    if (message.type() === "error") {
      diagnostics.consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => diagnostics.pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    diagnostics.failedRequests.push(
      `${request.method()} ${request.url()} (${request.failure()?.errorText ?? "unknown error"})`,
    );
  });
  page.on("request", (request) => {
    const requestUrl = new URL(request.url());
    if (
      (requestUrl.protocol === "http:" || requestUrl.protocol === "https:") &&
      requestUrl.origin !== origin
    ) {
      diagnostics.externalRequests.push(request.url());
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      diagnostics.badResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  return diagnostics;
};
