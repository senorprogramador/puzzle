import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { cpus, platform, release, totalmem } from "node:os";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { gzipSync } from "node:zlib";

import { chromium } from "playwright";

const repositoryRoot = new URL("..", import.meta.url).pathname;
const profiles = ["baseline", "conservative", "balanced", "aggressive", "custom"];
const optimizedProfiles = profiles.filter((profile) => profile !== "baseline");
const primaryEnvironment = {
  id: "desktop-fast",
  width: 1365,
  height: 768,
  mobile: false,
  downlinkMbps: 10,
  latencyMs: 20,
  cpuThrottle: 1,
};
const supplementalEnvironments = [
  {
    id: "desktop-slow",
    width: 1365,
    height: 768,
    mobile: false,
    downlinkMbps: 1.5,
    latencyMs: 150,
    cpuThrottle: 1,
  },
  {
    id: "mobile-fast",
    width: 390,
    height: 844,
    mobile: true,
    downlinkMbps: 10,
    latencyMs: 20,
    cpuThrottle: 4,
  },
  {
    id: "mobile-slow",
    width: 390,
    height: 844,
    mobile: true,
    downlinkMbps: 1.5,
    latencyMs: 150,
    cpuThrottle: 4,
  },
];
const frameworks = [
  {
    id: "next",
    packageName: "workspace-next",
    appDirectory: join(repositoryRoot, "apps/workspace-next"),
    packagePath: join(repositoryRoot, "apps/workspace-next/package.json"),
  },
  {
    id: "tanstack",
    packageName: "workspace-tanstack",
    appDirectory: join(repositoryRoot, "apps/workspace-tanstack"),
    packagePath: join(repositoryRoot, "apps/workspace-tanstack/package.json"),
  },
];

const round = (value) => Math.round(value * 100) / 100;

const reservePort = async () =>
  new Promise((resolve, reject) => {
    const listener = createServer();
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", () => {
      const address = listener.address();
      if (!address || typeof address === "string") {
        reject(new Error("Could not reserve a benchmark port."));
        return;
      }

      listener.close((error) => {
        if (error) reject(error);
        else resolve(address.port);
      });
    });
  });

const startApplication = async (framework) => {
  const port = await reservePort();
  const output = { value: "" };
  const serverEntry = join(framework.appDirectory, ".output/server/index.mjs");
  const isTanStack = framework.id === "tanstack";
  const server = isTanStack
    ? spawn(process.execPath, [serverEntry], {
        cwd: framework.appDirectory,
        env: {
          ...process.env,
          HOST: "127.0.0.1",
          PORT: String(port),
          NODE_ENV: "production",
        },
        stdio: ["ignore", "pipe", "pipe"],
      })
    : spawn("bun", ["run", "--filter", framework.packageName, "start"], {
        cwd: repositoryRoot,
        env: {
          ...process.env,
          HOSTNAME: "127.0.0.1",
          PORT: String(port),
          NODE_ENV: "production",
        },
        stdio: ["ignore", "pipe", "pipe"],
      });
  const appendOutput = (chunk) => {
    output.value = `${output.value}${chunk}`.slice(-8000);
  };
  server.stdout.on("data", appendOutput);
  server.stderr.on("data", appendOutput);
  const baseUrl = `http://127.0.0.1:${port}`;
  const baselineUrl = `${baseUrl}/rendering-benchmark/baseline`;
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(
        `${framework.id} benchmark server exited before readiness:\n${output.value}`,
      );
    }

    try {
      const response = await fetch(baselineUrl);
      if (response.ok) return { server, baseUrl, output };
    } catch {
      await delay(200);
      continue;
    }

    await delay(200);
  }

  server.kill("SIGTERM");
  throw new Error(
    `${framework.id} benchmark server did not become ready:\n${output.value}`,
  );
};

const stopApplication = async ({ server }) => {
  if (server.exitCode !== null) return;
  const exited = once(server, "exit");
  server.kill("SIGTERM");
  await Promise.race([exited, delay(5_000)]);
  if (server.exitCode === null) server.kill("SIGKILL");
};

const routeFor = (framework, profile) => {
  if (profile === "baseline") return "/rendering-benchmark/baseline";
  return `/rendering-benchmark/profile/${profile}`;
};

const installBrowserMetrics = () => {
  const metrics = {
    cls: 0,
    lcp: null,
    longTasks: [],
    eventTimings: [],
    unsupported: [],
    observers: [],
  };
  const supportedTypes = new Set(
    window.PerformanceObserver?.supportedEntryTypes ?? [],
  );
  const observe = (type, options, callback) => {
    if (!supportedTypes.has(type)) {
      metrics.unsupported.push(type);
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true, ...options });
      metrics.observers.push(observer);
    } catch (error) {
      metrics.unsupported.push(`${type}: ${String(error)}`);
    }
  };

  observe("largest-contentful-paint", {}, (entries) => {
    const latest = entries.at(-1);
    if (latest) metrics.lcp = { startTime: latest.startTime, size: latest.size };
  });
  observe("layout-shift", {}, (entries) => {
    for (const entry of entries) {
      if (!entry.hadRecentInput) metrics.cls += entry.value;
    }
  });
  observe("longtask", {}, (entries) => {
    metrics.longTasks.push(
      ...entries.map((entry) => ({
        startTime: entry.startTime,
        duration: entry.duration,
      })),
    );
  });
  observe("event", { durationThreshold: 16 }, (entries) => {
    metrics.eventTimings.push(
      ...entries
        .filter((entry) => entry.interactionId > 0)
        .map((entry) => ({
          name: new URL(entry.name).pathname,
          duration: entry.duration,
          interactionId: entry.interactionId,
        })),
    );
  });
  window.__renderingBenchmarkMetrics = metrics;

  const observerStats = {
    supported: typeof window.IntersectionObserver === "function",
    instances: 0,
    observeCalls: 0,
    unobserveCalls: 0,
    disconnectCalls: 0,
    targetRootMargin: null,
  };
  const NativeObserver = window.IntersectionObserver;

  if (NativeObserver) {
    const instances = new WeakSet();
    const observe = NativeObserver.prototype.observe;
    const unobserve = NativeObserver.prototype.unobserve;
    const disconnect = NativeObserver.prototype.disconnect;
    NativeObserver.prototype.observe = function (target) {
      if (!instances.has(this)) {
        instances.add(this);
        observerStats.instances += 1;
      }
      observerStats.observeCalls += 1;
      if (target.id === "benchmark-data-table-boundary") {
        observerStats.targetRootMargin = this.rootMargin;
      }
      return observe.call(this, target);
    };
    NativeObserver.prototype.unobserve = function (target) {
      observerStats.unobserveCalls += 1;
      return unobserve.call(this, target);
    };
    NativeObserver.prototype.disconnect = function () {
      observerStats.disconnectCalls += 1;
      return disconnect.call(this);
    };
  }

  window.__renderingBenchmarkObservers = observerStats;
};

const waitForTwoFrames = (page) =>
  page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
  );

const cdpMetricSnapshot = async (session) => {
  const { metrics } = await session.send("Performance.getMetrics");
  const values = Object.fromEntries(
    metrics.map(({ name, value }) => [name, value]),
  );
  const milliseconds = (name) =>
    values[name] === undefined ? null : round(values[name] * 1000);

  return {
    taskDurationMs: milliseconds("TaskDuration"),
    scriptDurationMs: milliseconds("ScriptDuration"),
    layoutDurationMs: milliseconds("LayoutDuration"),
    recalcStyleDurationMs: milliseconds("RecalcStyleDuration"),
    jsHeapUsedBytes: values.JSHeapUsedSize ?? null,
    domNodeCount: values.Nodes ?? null,
    jsEventListenerCount: values.JSEventListeners ?? null,
  };
};

const browserMetricSnapshot = (page) =>
  page.evaluate(() => {
    const roundMetric = (value) => Math.round(value * 100) / 100;
    const navigation = performance.getEntriesByType("navigation")[0];
    const paints = performance.getEntriesByType("paint");
    const fcp = paints.find((entry) => entry.name === "first-contentful-paint");
    const state = window.__renderingBenchmarkMetrics;
    const scripts = performance
      .getEntriesByType("resource")
      .filter((entry) => /\.(?:m?js)(?:$|\?)/i.test(entry.name))
      .map((entry) => ({
        name: entry.name,
        startTime: entry.startTime,
        duration: entry.duration,
        transferSize: entry.transferSize,
        encodedBodySize: entry.encodedBodySize,
      }));
    const fcpTime = fcp?.startTime ?? null;
    const totalBlockingTimeMs =
      fcpTime === null
        ? null
        : state.longTasks.reduce(
            (total, task) =>
              task.startTime >= fcpTime
                ? total + Math.max(0, task.duration - 50)
                : total,
            0,
          );
    const maxEventTimingMs = state.eventTimings.reduce(
      (maximum, event) => Math.max(maximum, event.duration),
      0,
    );

    return {
      ttfbMs:
        navigation === undefined
          ? null
          : roundMetric(navigation.responseStart - navigation.startTime),
      fcpMs: fcpTime === null ? null : roundMetric(fcpTime),
      lcpMs:
        state.lcp === null ? null : roundMetric(state.lcp.startTime),
      cls: roundMetric(state.cls),
      labTbtMs:
        totalBlockingTimeMs === null
          ? null
          : roundMetric(totalBlockingTimeMs),
      inpMs: null,
      maxEventTimingMs:
        maxEventTimingMs === 0 ? null : roundMetric(maxEventTimingMs),
      scriptResources: scripts,
      jsTransferBytes: scripts.reduce(
        (total, entry) => total + entry.transferSize,
        0,
      ),
      jsEncodedBytes: scripts.reduce(
        (total, entry) => total + entry.encodedBodySize,
        0,
      ),
      observerUnsupported: state.unsupported,
      intersectionObservers: { ...window.__renderingBenchmarkObservers },
      longTaskCount: state.longTasks.length,
      eventTimingCount: state.eventTimings.length,
      contentVisibility:
        document.getElementById("benchmark-boundary-0") === null
          ? null
          : getComputedStyle(
              document.getElementById("benchmark-boundary-0"),
            ).contentVisibility,
      containIntrinsicSize:
        document.getElementById("benchmark-boundary-0") === null
          ? null
          : getComputedStyle(
              document.getElementById("benchmark-boundary-0"),
            ).containIntrinsicSize,
      settings: (() => {
        const element = document.querySelector(
          '[data-testid="benchmark-profile-settings"]',
        );
        if (!element) return null;
        return {
          profile: element.dataset.profile,
          rootMargin: element.dataset.rootMargin,
          prefetch: element.dataset.prefetch === "true",
          adaptiveScheduling:
            element.dataset.adaptiveScheduling === "true",
          contentVisibility:
            element.dataset.contentVisibility === "true",
          intrinsicSizing: element.dataset.intrinsicSizing,
          deferredLoading: element.dataset.deferredLoading,
          foldState: element.dataset.foldState,
          foldVisibility: element.dataset.foldVisibility,
          foldActivated: element.dataset.foldActivated === "true",
        };
      })(),
      activationState: window.__renderingBenchmarkActivation
        ? { ...window.__renderingBenchmarkActivation }
        : null,
    };
  });

const createPage = async (browser, environment, sharedContext) => {
  const ownsContext = sharedContext === undefined;
  const context =
    sharedContext ??
    (await browser.newContext({
      viewport: { width: environment.width, height: environment.height },
      isMobile: environment.mobile,
      deviceScaleFactor: 1,
      serviceWorkers: "block",
    }));
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  await page.addInitScript(installBrowserMetrics);
  await session.send("Network.enable");
  await session.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: environment.latencyMs,
    downloadThroughput:
      (environment.downlinkMbps * 1024 * 1024) / 8,
    uploadThroughput: (environment.downlinkMbps * 1024 * 1024) / 16,
  });
  await session.send("Emulation.setDeviceMetricsOverride", {
    width: environment.width,
    height: environment.height,
    deviceScaleFactor: 1,
    mobile: environment.mobile,
  });
  await session.send("Emulation.setCPUThrottlingRate", {
    rate: environment.cpuThrottle,
  });
  await session.send("Performance.enable");

  const requests = [];
  const failedRequests = [];
  const httpErrors = [];
  const pageErrors = [];
  const consoleErrors = [];
  page.on("request", (request) => {
    requests.push({
      url: request.url(),
      resourceType: request.resourceType(),
    });
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    failedRequests.push({
      url: new URL(request.url()).pathname,
      error: request.failure()?.errorText ?? "unknown",
    });
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      httpErrors.push({
        url: new URL(response.url()).pathname,
        status: response.status(),
      });
    }
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  return {
    context,
    ownsContext,
    page,
    session,
    requests,
    failedRequests,
    httpErrors,
    pageErrors,
    consoleErrors,
  };
};

const activateDeferredTable = async (
  page,
  initialTableCount,
  { failedRequests, httpErrors, pageErrors, consoleErrors },
) => {
  if (initialTableCount > 0) {
    await page.getByTestId("benchmark-data-table-loaded").waitFor();
    return {
      activationGapPx: null,
      activationLatencyMs: null,
      scrollToMountMs: null,
      observerRootMargin: null,
    };
  }

  await page.evaluate(() => {
    const state = {
      firstLoadingAt: null,
      tableMountedAt: null,
    };
    const record = () => {
      if (
        state.firstLoadingAt === null &&
        document
          .getElementById("benchmark-data-table-boundary")
          ?.getAttribute("aria-busy") === "true"
      ) {
        state.firstLoadingAt = performance.now();
      }
      if (
        state.tableMountedAt === null &&
        document.querySelector('[data-testid="benchmark-data-table-loaded"]')
      ) {
        state.tableMountedAt = performance.now();
      }
    };
    const observer = new MutationObserver(record);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["aria-busy"],
      childList: true,
      subtree: true,
    });
    window.__renderingBenchmarkActivation = state;
    record();
  });

  const scrollStartedAt = await page.evaluate(() => performance.now());
  let activationGapPx = null;
  const scrollSamples = [];
  for (const gap of [1000, 800, 600, 400, 300, 200, 100, 0, -100]) {
    const scrollSample = await page.evaluate(async (targetGap) => {
      const boundary = document.getElementById(
        "benchmark-data-table-boundary",
      );
      if (!boundary) throw new Error("Deferred table boundary is missing.");
      const top = boundary.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, top - window.innerHeight - targetGap),
        behavior: "instant",
      });
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      const rect = boundary.getBoundingClientRect();
      const settings = document.querySelector(
        '[data-testid="benchmark-profile-settings"]',
      );
      return {
        targetGap,
        scrollY: window.scrollY,
        top: rect.top,
        bottom: rect.bottom,
        viewportHeight: window.innerHeight,
        foldState: settings?.dataset.foldState ?? null,
        foldActivated: settings?.dataset.foldActivated === "true",
      };
    }, gap);
    scrollSamples.push(scrollSample);
    try {
      await page.waitForFunction(
        () => {
          const settings = document.querySelector(
            '[data-testid="benchmark-profile-settings"]',
          );
          const boundary = document.getElementById(
            "benchmark-data-table-boundary",
          );
          return (
            settings?.dataset.foldActivated === "true" ||
            boundary?.getAttribute("aria-busy") === "true" ||
            document.querySelector(
              '[data-testid="benchmark-data-table-loaded"]',
            ) !== null
          );
        },
        null,
        { polling: "raf", timeout: 250 },
      );
      activationGapPx = gap;
      break;
    } catch (error) {
      if (!(error instanceof Error) || error.name !== "TimeoutError") {
        throw error;
      }
    }
  }

  if (activationGapPx === null) {
    const observerState = await page.evaluate(
      () => window.__renderingBenchmarkObservers,
    );
    const profileSettings = await page
      .getByTestId("benchmark-profile-settings")
      .evaluate((element) => element.dataset);
    throw new Error(
      `The deferred table did not activate at the measured scroll thresholds: ${JSON.stringify({ scrollSamples, observerState, profileSettings, failedRequests, httpErrors, pageErrors, consoleErrors })}`,
    );
  }
  try {
    await page
      .getByTestId("benchmark-data-table-loaded")
      .waitFor({ timeout: 10_000 });
  } catch (error) {
    const boundaryState = await page.evaluate(() => {
      const boundary = document.getElementById(
        "benchmark-data-table-boundary",
      );
      return {
        boundaryHtml: boundary?.innerHTML,
        boundaryBusy: boundary?.getAttribute("aria-busy"),
        observerState: window.__renderingBenchmarkObservers,
        activationState: window.__renderingBenchmarkActivation,
      };
    });
    throw new Error(
      `Deferred table failed to mount: ${JSON.stringify(boundaryState)}; ${String(error)}`,
    );
  }
  const activation = await page.evaluate(
    () => window.__renderingBenchmarkActivation,
  );
  const observerState = await page.evaluate(
    () => window.__renderingBenchmarkObservers,
  );
  const activationStart =
    activation.firstLoadingAt ?? activation.tableMountedAt;

  return {
    activationGapPx,
    activationLatencyMs:
      activation.tableMountedAt === null || activationStart === null
        ? null
        : round(activation.tableMountedAt - activationStart),
    scrollToMountMs:
      activation.tableMountedAt === null
        ? null
        : round(activation.tableMountedAt - scrollStartedAt),
    observerRootMargin: observerState.targetRootMargin,
  };
};

const measurePage = async ({
  browser,
  baseUrl,
  framework,
  profile,
  environment,
  cache,
  sharedContext,
}) => {
  const {
    context,
    ownsContext,
    page,
    session,
    requests,
    failedRequests,
    httpErrors,
    pageErrors,
    consoleErrors,
  } = await createPage(browser, environment, sharedContext);
  const url = `${baseUrl}${routeFor(framework, profile)}`;
  const response = await page.goto(url, { waitUntil: "load" });
  assert.equal(response?.status(), 200, `${framework.id}/${profile} returned HTTP error.`);
  await page.waitForLoadState("networkidle");
  await page.getByTestId("benchmark-hero").waitFor();
  if (profile !== "baseline") {
    await page
      .getByTestId("benchmark-profile-settings")
      .waitFor({ state: "attached" });
  }
  await waitForTwoFrames(page);

  const initialTableCount = await page
    .getByTestId("benchmark-data-table-loaded")
    .count();
  assert.equal(
    initialTableCount,
    profile === "baseline" ? 1 : 0,
    `${framework.id}/${profile} had an unexpected initial table state.`,
  );
  const initialBrowser = await browserMetricSnapshot(page);
  const initialCdp = await cdpMetricSnapshot(session);
  const initialRequestCount = requests.length;
  const initialScriptRequestCount = requests.filter(
    (request) => request.resourceType === "script",
  ).length;
  const activation = await activateDeferredTable(page, initialTableCount, {
    failedRequests,
    httpErrors,
    pageErrors,
    consoleErrors,
  });

  await page.getByRole("textbox", { name: "Search table" }).fill("Project 001");
  await page.getByText("Project 001", { exact: true }).waitFor();
  await waitForTwoFrames(page);

  const finalBrowser = await browserMetricSnapshot(page);
  const finalCdp = await cdpMetricSnapshot(session);
  const finalScriptRequestCount = requests.filter(
    (request) => request.resourceType === "script",
  ).length;
  const initialScriptNames = new Set(
    initialBrowser.scriptResources.map((resource) => resource.name),
  );
  const deferredScriptResources = finalBrowser.scriptResources.filter(
    (resource) => !initialScriptNames.has(resource.name),
  );

  assert.deepEqual(
    pageErrors,
    [],
    `${framework.id}/${profile} emitted browser runtime errors.`,
  );

  const sample = {
    framework: framework.id,
    profile,
    environment: environment.id,
    cache,
    initialRequestCount,
    totalRequestCount: requests.length,
    initialScriptRequestCount,
    totalScriptRequestCount: finalScriptRequestCount,
    initial: {
      ttfbMs: initialBrowser.ttfbMs,
      fcpMs: initialBrowser.fcpMs,
      lcpMs: initialBrowser.lcpMs,
      cls: initialBrowser.cls,
      labTbtMs: initialBrowser.labTbtMs,
      inpMs: null,
      maxEventTimingMs: initialBrowser.maxEventTimingMs,
      jsTransferBytes: initialBrowser.jsTransferBytes,
      jsEncodedBytes: initialBrowser.jsEncodedBytes,
      ...initialCdp,
      observerCount: initialBrowser.intersectionObservers.instances,
      observeCalls: initialBrowser.intersectionObservers.observeCalls,
      contentVisibility: initialBrowser.contentVisibility,
      containIntrinsicSize: initialBrowser.containIntrinsicSize,
      profileSettings: initialBrowser.settings,
      observerUnsupported: initialBrowser.observerUnsupported,
    },
    afterActivation: {
      jsTransferBytes: finalBrowser.jsTransferBytes,
      jsEncodedBytes: finalBrowser.jsEncodedBytes,
      deferredJsTransferBytes: deferredScriptResources.reduce(
        (total, resource) => total + resource.transferSize,
        0,
      ),
      deferredJsEncodedBytes: deferredScriptResources.reduce(
        (total, resource) => total + resource.encodedBodySize,
        0,
      ),
      deferredJsResources: deferredScriptResources.map((resource) => ({
        name: resource.name.split("/").at(-1),
        startTime: round(resource.startTime),
        duration: round(resource.duration),
      })),
      labTbtMs: finalBrowser.labTbtMs,
      ...finalCdp,
      observerCount: finalBrowser.intersectionObservers.instances,
      observeCalls: finalBrowser.intersectionObservers.observeCalls,
    },
    activation,
    failedRequests,
    httpErrors,
    consoleErrors,
  };

  await session.detach();
  if (ownsContext) await context.close();
  else await page.close();
  return sample;
};

const validateSeoAndNoJavaScript = async (browser, framework, baseUrl) => {
  const audit = [];
  const noJavaScriptContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1365, height: 768 },
    serviceWorkers: "block",
  });

  for (const profile of profiles) {
    const url = `${baseUrl}${routeFor(framework, profile)}`;
    const response = await fetch(url);
    assert.equal(response.status, 200, `${framework.id}/${profile} SSR failed.`);
    const html = await response.text();
    assert.match(html, /<title>Rendering optimization benchmark<\/title>/);
    assert.match(html, /name="description"/);
    assert.match(html, /data-testid="benchmark-hero"/);
    assert.match(html, /data-testid="benchmark-critical-content"/);
    assert.match(html, /data-testid="benchmark-section-23"/);
    assert.match(html, /aria-label="Benchmark navigation"/);
    assert.match(html, /href="#benchmark-data-table"/);
    assert.match(html, /alt="A neutral chart preview for the rendering benchmark"/);

    if (profile === "baseline") {
      assert.match(html, /data-testid="benchmark-data-table-loaded"/);
      assert.match(html, /Project 001/);
    } else {
      assert.match(html, /data-testid="benchmark-table-fallback"/);
      assert.doesNotMatch(html, /data-testid="benchmark-data-table-loaded"/);
    }

    audit.push({
      profile,
      serverHtmlBytes: Buffer.byteLength(html),
      hasPageTitle: true,
      hasDescription: true,
      hasMainHeading: true,
      hasCriticalContent: true,
      has24LongSections: true,
      hasNavigationLinks: true,
      hasImageAlt: true,
      structuredDataBlocks: (
        html.match(/application\/ld\+json/g) ?? []
      ).length,
      deferredTableInServerHtml: profile === "baseline",
    });

    const page = await noJavaScriptContext.newPage();
    await page.goto(url, { waitUntil: "load" });
    assert.equal(await page.getByRole("main").count(), 1);
    assert.equal(await page.getByRole("heading", { level: 1 }).count(), 1);
    assert.equal(await page.getByTestId("benchmark-critical-content").count(), 1);
    if (profile === "baseline") {
      assert.equal(await page.getByRole("table").count(), 1);
    } else {
      assert.equal(await page.getByTestId("benchmark-table-fallback").count(), 1);
      assert.equal(await page.getByRole("table").count(), 0);
    }
    await page.close();
  }

  await noJavaScriptContext.close();
  return audit;
};

const walkFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walkFiles(path) : [path];
    }),
  );
  return nested.flat();
};

const inspectBundleDirectory = async (directory, filter) => {
  let files;
  try {
    files = await walkFiles(directory);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const assets = [];
  for (const path of files) {
    if (!/\.(?:m?js|css)$/.test(path) || !filter(path)) continue;
    const contents = await readFile(path);
    assets.push({
      name: relative(repositoryRoot, path),
      bytes: contents.byteLength,
      gzipBytes: gzipSync(contents).byteLength,
    });
  }
  return assets.sort((left, right) => left.name.localeCompare(right.name));
};

const inspectNextRouteChunks = async (framework, route) => {
  const manifestPath = join(
    framework.appDirectory,
    ".next/server/app",
    route,
    "page_client-reference-manifest.js",
  );
  const source = await readFile(manifestPath, "utf8");
  const assignment = `globalThis.__RSC_MANIFEST["/${route}/page"] = `;
  const assignmentIndex = source.indexOf(assignment);
  if (assignmentIndex < 0) {
    throw new Error(`Could not find the Next client manifest for ${route}.`);
  }
  const jsonStart = assignmentIndex + assignment.length;
  const jsonEnd = source.lastIndexOf(";");
  const manifest = JSON.parse(source.slice(jsonStart, jsonEnd).trim());
  const moduleEntries = Object.entries(manifest.clientModules);
  const chunkNames = [
    ...new Set(
      moduleEntries.flatMap(([, module]) => module.chunks ?? []),
    ),
  ].sort();
  const chunks = [];

  for (const chunkName of chunkNames) {
    const chunkPath = join(
      framework.appDirectory,
      ".next",
      chunkName.replace(/^\/_next\//, ""),
    );
    const contents = await readFile(chunkPath);
    chunks.push({
      name: chunkName,
      bytes: contents.byteLength,
      gzipBytes: gzipSync(contents).byteLength,
    });
  }

  return {
    clientModuleCount: moduleEntries.length,
    applicationClientModules: moduleEntries
      .map(([name]) => name)
      .filter((name) => name.includes("[project]/apps/")),
    chunks,
    totalBytes: chunks.reduce((total, chunk) => total + chunk.bytes, 0),
    totalGzipBytes: chunks.reduce(
      (total, chunk) => total + chunk.gzipBytes,
      0,
    ),
  };
};

const inspectBuiltBundles = async () => {
  const next = frameworks.find((framework) => framework.id === "next");
  if (!next) throw new Error("The Next.js benchmark application is missing.");

  const nextBaseline = await inspectNextRouteChunks(
    next,
    "rendering-benchmark/baseline",
  );
  const nextProfile = await inspectNextRouteChunks(
    next,
    "rendering-benchmark/profile/[profile]",
  );
  const baselineChunkNames = new Set(
    nextBaseline.chunks.map((chunk) => chunk.name),
  );
  const profileChunkNames = new Set(
    nextProfile.chunks.map((chunk) => chunk.name),
  );
  const nextRouteChunkComparison = {
    sharedChunks: nextBaseline.chunks.filter((chunk) =>
      profileChunkNames.has(chunk.name),
    ),
    baselineOnlyChunks: nextBaseline.chunks.filter(
      (chunk) => !profileChunkNames.has(chunk.name),
    ),
    profileOnlyChunks: nextProfile.chunks.filter(
      (chunk) => !baselineChunkNames.has(chunk.name),
    ),
  };

  return {
    next: {
      routes: {
        baseline: nextBaseline,
        profile: nextProfile,
      },
      routeChunkComparison: nextRouteChunkComparison,
      serverBenchmarkChunks: await inspectBundleDirectory(
        join(repositoryRoot, "apps/workspace-next/.next/server"),
        (path) => /rendering-benchmark|benchmark-panels/i.test(path),
      ),
    },
    tanstack: {
      browserBenchmarkChunks: await inspectBundleDirectory(
        join(repositoryRoot, "apps/workspace-tanstack/.output/public/assets"),
        (path) =>
          /rendering-benchmark|benchmark-panels|fold-boundary/i.test(path),
      ),
      serverBenchmarkChunks: await inspectBundleDirectory(
        join(
          repositoryRoot,
          "apps/workspace-tanstack/node_modules/.nitro/vite/services/ssr/assets",
        ),
        (path) => /rendering-benchmark|benchmark-panels|fold-boundary/i.test(path),
      ),
    },
  };
};

const readPackage = async (path) =>
  JSON.parse(await readFile(path, "utf8"));

const installedPackageVersion = async (framework, packageName) => {
  const packagePath = createRequire(framework.packagePath).resolve(
    `${packageName}/package.json`,
  );
  const manifest = await readPackage(packagePath);
  return manifest.version;
};

const appVersions = async () => {
  const versions = {};
  for (const framework of frameworks) {
    const manifest = await readPackage(framework.packagePath);
    const frameworkPackage =
      framework.id === "next" ? "next" : "@tanstack/react-start";
    const routerPackage =
      framework.id === "tanstack" ? "@tanstack/react-router" : undefined;
    versions[framework.id] = {
      framework: {
        package: frameworkPackage,
        declared: manifest.dependencies[frameworkPackage],
        installed: await installedPackageVersion(
          framework,
          frameworkPackage,
        ),
      },
      router:
        routerPackage === undefined
          ? null
          : {
              package: routerPackage,
              declared: manifest.dependencies[routerPackage],
              installed: await installedPackageVersion(
                framework,
                routerPackage,
              ),
            },
      react: {
        declared: manifest.dependencies.react,
        installed: await installedPackageVersion(framework, "react"),
      },
      typescript: {
        declared: manifest.devDependencies.typescript,
        installed: await installedPackageVersion(framework, "typescript"),
      },
    };
  }
  return versions;
};

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const middle = Math.floor(sorted.length / 2);
  return round(
    sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle],
  );
};

const summarizeSamples = (samples) => {
  const keys = [
    "initial.ttfbMs",
    "initial.fcpMs",
    "initial.lcpMs",
    "initial.cls",
    "initial.labTbtMs",
    "initial.jsTransferBytes",
    "initial.jsEncodedBytes",
    "initial.scriptDurationMs",
    "initial.taskDurationMs",
    "initial.jsHeapUsedBytes",
    "initialRequestCount",
    "totalRequestCount",
    "afterActivation.jsTransferBytes",
    "afterActivation.deferredJsEncodedBytes",
    "afterActivation.scriptDurationMs",
    "activation.activationGapPx",
    "activation.activationLatencyMs",
  ];
  const groups = new Map();
  for (const sample of samples) {
    const key = `${sample.framework}|${sample.profile}|${sample.environment}|${sample.cache}`;
    const group = groups.get(key) ?? [];
    group.push(sample);
    groups.set(key, group);
  }

  return [...groups.entries()].map(([key, group]) => {
    const [framework, profile, environment, cache] = key.split("|");
    const metrics = {};
    for (const path of keys) {
      const values = group
        .map((sample) =>
          path.split(".").reduce((value, part) => value?.[part], sample),
        )
        .filter((value) => typeof value === "number");
      metrics[path] = median(values);
    }
    return { framework, profile, environment, cache, runs: group.length, metrics };
  });
};

const compareProfilesToBaseline = (summary) => {
  const metricKeys = [
    "initial.ttfbMs",
    "initial.fcpMs",
    "initial.lcpMs",
    "initial.cls",
    "initial.labTbtMs",
    "initial.jsTransferBytes",
    "initial.jsEncodedBytes",
    "initial.taskDurationMs",
    "initial.scriptDurationMs",
    "initial.jsHeapUsedBytes",
    "initialRequestCount",
    "afterActivation.jsTransferBytes",
    "afterActivation.deferredJsEncodedBytes",
    "activation.activationGapPx",
    "activation.activationLatencyMs",
  ];

  return summary
    .filter((sample) => sample.profile !== "baseline")
    .map((sample) => {
      const baseline = summary.find(
        (candidate) =>
          candidate.framework === sample.framework &&
          candidate.environment === sample.environment &&
          candidate.cache === sample.cache &&
          candidate.profile === "baseline",
      );
      if (!baseline) {
        throw new Error(
          `Missing baseline sample for ${sample.framework}/${sample.environment}/${sample.cache}.`,
        );
      }

      const deltas = {};
      for (const key of metricKeys) {
        const value = sample.metrics[key];
        const baselineValue = baseline.metrics[key];
        if (typeof value === "number" && typeof baselineValue === "number") {
          deltas[key] = round(value - baselineValue);
        }
      }

      return {
        framework: sample.framework,
        profile: sample.profile,
        environment: sample.environment,
        cache: sample.cache,
        runs: sample.runs,
        initialJsReduced:
          typeof deltas["initial.jsTransferBytes"] === "number" &&
          deltas["initial.jsTransferBytes"] < 0,
        deltas,
      };
    });
};

const main = async () => {
  const smoke = process.argv.includes("--smoke");
  const profileArgument = process.argv.find((argument) =>
    argument.startsWith("--profile="),
  );
  const selectedProfile = profileArgument?.slice("--profile=".length);
  if (
    selectedProfile !== undefined &&
    !optimizedProfiles.includes(selectedProfile)
  ) {
    throw new TypeError(
      `Unknown profile "${selectedProfile}". Choose ${optimizedProfiles.join(", ")}.`,
    );
  }
  const selectedProfiles =
    selectedProfile === undefined
      ? profiles
      : ["baseline", selectedProfile];
  const repetitions = smoke
    ? 1
    : Number(process.env.PUZZLE_RENDERING_BENCHMARK_RUNS ?? 3);
  if (!Number.isInteger(repetitions) || repetitions < 1) {
    throw new RangeError(
      "PUZZLE_RENDERING_BENCHMARK_RUNS must be a positive integer.",
    );
  }

  const browser = await chromium.launch({ headless: true });
  const runningServers = [];
  const serverByFramework = new Map();
  try {
    for (const framework of frameworks) {
      const app = await startApplication(framework);
      runningServers.push(app);
      serverByFramework.set(framework.id, app);
    }

    const seoAudits = {};
    for (const framework of frameworks) {
      seoAudits[framework.id] = await validateSeoAndNoJavaScript(
        browser,
        framework,
        serverByFramework.get(framework.id).baseUrl,
      );
    }

    const samples = [];
    for (const framework of frameworks) {
      const app = serverByFramework.get(framework.id);
      for (const profile of selectedProfiles) {
        for (let run = 0; run < repetitions; run += 1) {
          const cacheContext = await browser.newContext({
            viewport: {
              width: primaryEnvironment.width,
              height: primaryEnvironment.height,
            },
            isMobile: primaryEnvironment.mobile,
            deviceScaleFactor: 1,
            serviceWorkers: "block",
          });
          try {
            const coldPage = await measurePage({
              browser,
              baseUrl: app.baseUrl,
              framework,
              profile,
              environment: primaryEnvironment,
              cache: "cold",
              sharedContext: cacheContext,
            });
            samples.push({ ...coldPage, run: run + 1 });

            if (!smoke) {
              const warmPage = await measurePage({
                browser,
                baseUrl: app.baseUrl,
                framework,
                profile,
                environment: primaryEnvironment,
                cache: "warm",
                sharedContext: cacheContext,
              });
              samples.push({ ...warmPage, run: run + 1 });
            }
          } finally {
            await cacheContext.close();
          }
        }
      }
    }

    if (!smoke) {
      for (const environment of supplementalEnvironments) {
        for (const framework of frameworks) {
          const app = serverByFramework.get(framework.id);
          for (const profile of ["baseline", "balanced", "aggressive"]) {
            const sample = await measurePage({
              browser,
              baseUrl: app.baseUrl,
              framework,
              profile,
              environment,
              cache: "cold",
            });
            samples.push({ ...sample, run: 1 });
          }
        }
      }
    }

    const summary = summarizeSamples(samples);
    const report = {
      benchmark: "Puzzle rendering optimization",
      selectedProfiles,
      measuredAt: new Date().toISOString(),
      runtime: process.version,
      browser: {
        engine: "Chromium",
        version: browser.version(),
      },
      host: {
        platform: `${platform()} ${release()}`,
        architecture: process.arch,
        cpu: cpus()[0]?.model ?? "unknown",
        logicalCpuCount: cpus().length,
        totalMemoryBytes: totalmem(),
      },
      applicationVersions: await appVersions(),
      methodology: {
        repetitions,
        smoke,
        cache: "cold uses a fresh browser context; warm uses a new page in the same context after the cold page has loaded and activated the module",
        primaryEnvironment,
        supplementalEnvironments: smoke ? [] : supplementalEnvironments,
        metrics: {
          ttfbMs: "Navigation responseStart - navigation startTime.",
          fcpMs: "First Contentful Paint from the browser paint timeline.",
          lcpMs: "Largest Contentful Paint entry observed before scripted scrolling.",
          inpMs: "Not measured; one lab interaction cannot be reported as field INP.",
          maxEventTimingMs:
            "Maximum Event Timing duration for the scripted table-search interaction; a lab proxy, not INP.",
          cls: "Cumulative layout shift before scripted scrolling, excluding shifts with recent input.",
          labTbtMs:
            "Long-task blocking time after FCP through the initial settled snapshot; a lab metric, not field data.",
          scriptDurationMs:
            "Chromium CDP ScriptDuration; cumulative renderer script execution duration.",
          activationLatencyMs:
            "Custom metric from the loading fallback appearing to the deferred table DOM marker.",
          hydrationDuration:
            "Not measured; no hydration-duration claim is made.",
        },
      },
      seoAudits,
      bundleAnalysis: await inspectBuiltBundles(),
      samples,
      summary,
      profileComparisons: compareProfilesToBaseline(summary),
      conclusions: {
        initialJavaScriptReduction:
          "See profileComparisons.initialJsReduced and the initial.jsTransferBytes deltas; values are measured for each framework, environment, and cache group.",
        prefetching:
          "Profile prefetch settings are recorded, but this fixture does not attach scheduled resources; scheduler prefetch transfer and waste are not measured.",
        fieldMetrics:
          "No field data or reliable INP is available from this local lab run.",
      },
    };

    const outputPath =
      process.env.PUZZLE_RENDERING_BENCHMARK_OUTPUT ??
      (smoke ? undefined : join(repositoryRoot, "reports/rendering-benchmark.json"));
    if (outputPath) {
      const absoluteOutputPath = isAbsolute(outputPath)
        ? outputPath
        : join(repositoryRoot, outputPath);
      await mkdir(dirname(absoluteOutputPath), { recursive: true });
      await writeFile(
        absoluteOutputPath,
        `${JSON.stringify(report, null, 2)}\n`,
      );
      console.error(`Benchmark report written to ${absoluteOutputPath}`);
    }
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
    for (const app of runningServers.reverse()) {
      await stopApplication(app);
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
