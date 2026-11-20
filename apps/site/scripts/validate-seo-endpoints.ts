import assert from "node:assert/strict";

const canonicalOrigin = "https://puzzle-ui.com";
const siteOrigin = new URL(process.env.SITE_URL ?? canonicalOrigin);
const failures: string[] = [];

type FetchResult = {
  response: Response;
  finalUrl: string;
  redirects: string[];
};

type PageResult = {
  canonicalUrl: string;
  html: string;
  title: string;
  description: string;
  ids: Set<string>;
};

const fetchFollowingRedirects = async (url: string): Promise<FetchResult> => {
  let currentUrl = url;
  const redirects: string[] = [];

  for (let attempt = 0; attempt <= 8; attempt += 1) {
    const response = await fetch(currentUrl, {
      headers: { "user-agent": "Puzzle-SEO-validation/1.0" },
      redirect: "manual",
      signal: AbortSignal.timeout(20_000),
    });

    if (response.status < 300 || response.status >= 400) {
      return { response, finalUrl: currentUrl, redirects };
    }

    const location = response.headers.get("location");
    if (!location) return { response, finalUrl: currentUrl, redirects };

    redirects.push(new URL(location, currentUrl).href);
    await response.body?.cancel();
    currentUrl = redirects.at(-1)!;
  }

  throw new Error(`Too many redirects while requesting ${url}`);
};

const requestUrl = (canonicalUrl: string) => {
  const url = new URL(canonicalUrl);
  return new URL(`${url.pathname}${url.search}${url.hash}`, siteOrigin).href;
};

const decodeHtml = (value: string) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

const getAttributes = (tag: string) => {
  const attributes: Record<string, string> = {};
  const pattern =
    /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;

  for (const match of tag.matchAll(pattern)) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match;
    const value = doubleQuoted ?? singleQuoted ?? unquoted;
    if (name && value !== undefined) attributes[name.toLowerCase()] = decodeHtml(value);
  }

  return attributes;
};

const getMetaValues = (html: string) => {
  const values = new Map<string, string[]>();

  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = getAttributes(match[0]);
    const key = attributes.name ?? attributes.property;
    const content = attributes.content;
    if (!key || content === undefined) continue;

    const normalizedKey = key.toLowerCase();
    values.set(normalizedKey, [...(values.get(normalizedKey) ?? []), content]);
  }

  return values;
};

const getUniqueMeta = (
  values: Map<string, string[]>,
  name: string,
  pageUrl: string,
) => {
  const matches = values.get(name) ?? [];
  if (matches.length !== 1 || !matches[0]?.trim()) {
    failures.push(`${pageUrl}: expected one nonempty meta ${name}, found ${matches.length}`);
  }
  return matches[0] ?? "";
};

const getJsonLd = (html: string, pageUrl: string) => {
  const values: unknown[] = [];

  for (const match of html.matchAll(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
  )) {
    const attributes = getAttributes(`<script ${match[1] ?? ""}>`);
    if (attributes.type?.toLowerCase() !== "application/ld+json") continue;

    try {
      values.push(JSON.parse(match[2] ?? "") as unknown);
    } catch (error) {
      failures.push(`${pageUrl}: invalid JSON-LD (${String(error)})`);
    }
  }

  if (values.length === 0) failures.push(`${pageUrl}: no JSON-LD found`);
  return values;
};

const getGraphEntities = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    );
  }

  if (typeof value !== "object" || value === null) return [];
  const record = value as Record<string, unknown>;
  const graph = record["@graph"];

  if (Array.isArray(graph)) {
    return graph.filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    );
  }

  return [record];
};

const getTypes = (entity: Record<string, unknown>) => {
  const type = entity["@type"];
  const types = Array.isArray(type) ? type : typeof type === "string" ? [type] : [];
  return types
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.replace(/^https?:\/\/schema\.org\//, ""));
};

const getReferenceIds = (value: unknown): string[] => {
  const references = Array.isArray(value) ? value : [value];
  return references.flatMap((reference) => {
    if (typeof reference !== "object" || reference === null) return [];
    const id = (reference as Record<string, unknown>)["@id"];
    return typeof id === "string" ? [id] : [];
  });
};

const getPageResult = async (
  canonicalUrl: string,
): Promise<PageResult | null> => {
  const request = requestUrl(canonicalUrl);

  try {
    const { response, finalUrl, redirects } =
      await fetchFollowingRedirects(request);
    const html = await response.text();
    const metas = getMetaValues(html);
    const canonicalValues = Array.from(html.matchAll(/<link\b[^>]*>/gi))
      .map((match) => getAttributes(match[0]))
      .filter((attributes) => attributes.rel?.toLowerCase().split(/\s+/).includes("canonical"))
      .map((attributes) => attributes.href ?? "");
    const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const title = decodeHtml(titleMatch?.[1]?.replace(/<[^>]*>/g, "").trim() ?? "");
    const description = getUniqueMeta(metas, "description", canonicalUrl);
    const isNoindex = [
      ...(metas.get("robots") ?? []),
      ...(metas.get("googlebot") ?? []),
      response.headers.get("x-robots-tag") ?? "",
    ].some((value) => /(?:^|[\s,])noindex(?:$|[\s,])/i.test(value));

    if (response.status !== 200 || redirects.length > 0) {
      failures.push(
        `${canonicalUrl}: status=${response.status}, redirects=${redirects.length}, final=${finalUrl}`,
      );
    }
    if (!response.headers.get("content-type")?.toLowerCase().includes("text/html")) {
      failures.push(`${canonicalUrl}: unexpected content type`);
    }
    if (!title) failures.push(`${canonicalUrl}: missing title`);
    if (canonicalValues.length !== 1 || canonicalValues[0] !== canonicalUrl) {
      failures.push(`${canonicalUrl}: canonical mismatch (${canonicalValues.join(", ")})`);
    }
    if (isNoindex) failures.push(`${canonicalUrl}: sitemap page is noindex`);

    for (const name of [
      "og:title",
      "og:description",
      "og:image",
      "og:url",
      "twitter:card",
      "twitter:title",
      "twitter:description",
      "twitter:image",
    ]) {
      const value = getUniqueMeta(metas, name, canonicalUrl);
      if (name === "og:url" && value !== canonicalUrl) {
        failures.push(`${canonicalUrl}: og:url does not match canonical`);
      }
    }

    const jsonLdValues = getJsonLd(html, canonicalUrl);
    const entities = jsonLdValues.flatMap(getGraphEntities);
    const types = new Set(entities.flatMap(getTypes));
    const expectedTypes = canonicalUrl === `${canonicalOrigin}/`
      ? ["WebSite", "Organization", "Person", "SoftwareSourceCode"]
      : ["WebPage", "TechArticle", "BreadcrumbList"];

    for (const type of expectedTypes) {
      if (!types.has(type)) failures.push(`${canonicalUrl}: JSON-LD is missing ${type}`);
    }

    const entityIds = entities
      .map((entity) => entity["@id"])
      .filter((id): id is string => typeof id === "string");
    if (new Set(entityIds).size !== entityIds.length) {
      failures.push(`${canonicalUrl}: duplicate JSON-LD entity IDs`);
    }

    if (canonicalUrl === `${canonicalOrigin}/`) {
      const software = entities.find((entity) =>
        getTypes(entity).includes("SoftwareSourceCode"),
      );
      if (software) {
        const ids = new Set(entityIds);
        for (const relation of ["author", "publisher"]) {
          const references = getReferenceIds(software[relation]);
          if (references.length === 0 || references.some((id) => !ids.has(id))) {
            failures.push(`Homepage SoftwareSourceCode has unresolved ${relation} reference`);
          }
        }
      }
    } else {
      const article = entities.find((entity) =>
        getTypes(entity).includes("TechArticle"),
      );
      if (article) {
        for (const relation of ["author", "publisher"]) {
          if (getReferenceIds(article[relation]).length === 0) {
            failures.push(`${canonicalUrl}: TechArticle has no ${relation} reference`);
          }
        }
      }

      const entityById = new Map(
        entities.flatMap((entity) =>
          typeof entity["@id"] === "string" ? [[entity["@id"], entity] as const] : [],
        ),
      );
      const visibleText = decodeHtml(
        html
          .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
          .replace(/<[^>]+>/g, " "),
      ).replace(/\s+/g, " ");
      const isVisible = (value: unknown) =>
        typeof value === "string" &&
        visibleText.includes(value.replace(/\s+/g, " "));

      for (const faqPage of entities.filter((entity) =>
        getTypes(entity).includes("FAQPage"),
      )) {
        const questionIds = getReferenceIds(faqPage.mainEntity);
        if (questionIds.length === 0) {
          failures.push(`${canonicalUrl}: FAQPage has no questions`);
        }

        for (const questionId of questionIds) {
          const question = entityById.get(questionId);
          const answer = entityById.get(
            getReferenceIds(question?.acceptedAnswer)[0] ?? "",
          );
          if (!questionId.startsWith(`${canonicalUrl}#`)) {
            failures.push(`${canonicalUrl}: FAQ question ${questionId} is not page-scoped`);
          }
          if (!isVisible(question?.name) || !isVisible(answer?.text)) {
            failures.push(`${canonicalUrl}: FAQ ${questionId} is not visible on the page`);
          }
        }
      }
    }

    console.log(
      `URL ${canonicalUrl} status=${response.status} redirects=${redirects.length} canonical=${canonicalValues.length === 1 && canonicalValues[0] === canonicalUrl ? "ok" : "mismatch"}`,
    );

    const ids = new Set(
      Array.from(html.matchAll(/\bid=["']([^"']+)["']/gi), (match) =>
        decodeHtml(match[1] ?? ""),
      ),
    );

    return { canonicalUrl, html, title, description, ids };
  } catch (error) {
    failures.push(`${canonicalUrl}: request failed (${String(error)})`);
    return null;
  }
};

const assertTextEndpoint = async (path: string) => {
  const url = new URL(path, siteOrigin).href;
  const first = await fetchFollowingRedirects(url);
  const firstBody = await first.response.text();
  const second = await fetchFollowingRedirects(url);
  const secondBody = await second.response.text();
  const contentType = first.response.headers.get("content-type")?.toLowerCase() ?? "";

  assert.equal(first.response.status, 200, `${path} must return HTTP 200`);
  assert.equal(first.redirects.length, 0, `${path} must not redirect`);
  assert.match(contentType, /^text\/plain\b/, `${path} must be text/plain`);
  assert.equal(firstBody, secondBody, `${path} output must be deterministic`);
  assert.match(
    first.response.headers.get("cache-control") ?? "",
    /\bpublic\b/,
    `${path} should be publicly cacheable`,
  );

  return { body: firstBody, headers: first.response.headers };
};

const run = async () => {
  assert.equal(siteOrigin.pathname, "/", "SITE_URL must be an origin");
  assert.equal(siteOrigin.search, "");
  assert.equal(siteOrigin.hash, "");

  const sitemapResponse = await fetchFollowingRedirects(
    new URL("/sitemap.xml", siteOrigin).href,
  );
  const sitemapContentType =
    sitemapResponse.response.headers.get("content-type")?.toLowerCase() ?? "";
  const sitemapXml = await sitemapResponse.response.text();

  assert.equal(sitemapResponse.response.status, 200, "sitemap.xml must return HTTP 200");
  assert.equal(sitemapResponse.redirects.length, 0, "sitemap.xml must not redirect");
  assert.match(sitemapContentType, /^application\/xml\b/);
  assert.match(sitemapXml, /<urlset\b[^>]*xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/);
  assert.match(sitemapXml, /<\/urlset>\s*$/);

  const urls = Array.from(
    sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g),
    (match) => decodeHtml(match[1] ?? ""),
  );
  assert.ok(urls.length > 0, "sitemap must include URLs");
  assert.equal(new Set(urls).size, urls.length, "sitemap URLs must be unique");

  for (const url of urls) {
    const parsed = new URL(url);
    assert.equal(parsed.protocol, "https:", `${url} must use HTTPS`);
    assert.equal(parsed.origin, canonicalOrigin, `${url} must use the canonical host`);
    assert.equal(parsed.search, "", `${url} must not contain query parameters`);
    assert.equal(parsed.hash, "", `${url} must not contain fragments`);
  }

  const pages = await Promise.all(urls.map(getPageResult));
  const validPages = pages.filter((page): page is PageResult => page !== null);
  const uniqueTitles = new Set(validPages.map((page) => page.title.toLowerCase()));
  const uniqueDescriptions = new Set(
    validPages.map((page) => page.description.trim().toLowerCase()),
  );
  if (uniqueTitles.size !== validPages.length) failures.push("Page titles are not unique");
  if (uniqueDescriptions.size !== validPages.length) {
    failures.push("Page descriptions are not unique");
  }

  const pageByUrl = new Map(validPages.map((page) => [page.canonicalUrl, page]));
  const edges = new Set<string>();
  const incoming = new Map(urls.map((url) => [url, 0]));
  const missingTargets = new Set<string>();

  for (const page of validPages) {
    for (const match of page.html.matchAll(/<a\b[^>]*>/gi)) {
      const href = getAttributes(match[0]).href;
      if (!href || /^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;

      let target: URL;
      try {
        target = new URL(href, `${canonicalOrigin}${new URL(page.canonicalUrl).pathname}`);
      } catch {
        failures.push(`${page.canonicalUrl}: invalid link ${href}`);
        continue;
      }

      if (
        target.origin !== canonicalOrigin ||
        (target.pathname !== "/docs" && !target.pathname.startsWith("/docs/"))
      ) {
        continue;
      }
      if (target.search) failures.push(`${page.canonicalUrl}: internal docs link has query ${href}`);

      const targetUrl = `${canonicalOrigin}${target.pathname}`;
      const targetPage = pageByUrl.get(targetUrl);
      if (!targetPage) {
        missingTargets.add(targetUrl);
        continue;
      }

      if (target.hash) {
        let fragment = target.hash.slice(1);
        try {
          fragment = decodeURIComponent(fragment);
        } catch {
          failures.push(`${page.canonicalUrl}: malformed fragment ${target.hash}`);
        }
        if (!targetPage.ids.has(fragment)) {
          failures.push(`${page.canonicalUrl}: missing anchor ${targetUrl}#${fragment}`);
        }
      }

      if (targetUrl !== page.canonicalUrl) {
        const edge = `${page.canonicalUrl} -> ${targetUrl}`;
        if (!edges.has(edge)) {
          edges.add(edge);
          incoming.set(targetUrl, (incoming.get(targetUrl) ?? 0) + 1);
        }
      }
    }
  }

  for (const target of missingTargets) {
    const result = await fetchFollowingRedirects(requestUrl(target));
    console.log(
      `LINK ${target} status=${result.response.status} redirects=${result.redirects.length} final=${result.finalUrl}`,
    );
    failures.push(
      `Internal docs link is not in the sitemap: ${target} (status=${result.response.status}, redirects=${result.redirects.length})`,
    );
    await result.response.body?.cancel();
  }

  const orphanedPages = urls.filter(
    (url) => url !== `${canonicalOrigin}/` && (incoming.get(url) ?? 0) === 0,
  );
  if (orphanedPages.length > 0) {
    failures.push(`Documentation pages have no internal links: ${orphanedPages.join(", ")}`);
  }

  const robotsUrl = new URL("/robots.txt", siteOrigin).href;
  const robots = await fetchFollowingRedirects(robotsUrl);
  const robotsBody = await robots.response.text();
  assert.equal(robots.response.status, 200, "robots.txt must return HTTP 200");
  assert.equal(robots.redirects.length, 0, "robots.txt must not redirect");
  assert.match(
    robots.response.headers.get("content-type")?.toLowerCase() ?? "",
    /^text\/plain\b/,
  );
  assert.match(robotsBody, new RegExp(`^Sitemap:\\s*${canonicalOrigin}/sitemap\\.xml\\s*$`, "m"));
  assert.match(robotsBody, /^User-agent:\s*\*\s*[\r\n]+Allow:\s*\/\s*$/m);
  assert.doesNotMatch(robotsBody, /^Disallow:\s*\//im);

  const llms = await assertTextEndpoint("/llms.txt");
  const llmsFull = await assertTextEndpoint("/llms-full.txt");
  const docUrls = urls.filter((url) => new URL(url).pathname.startsWith("/docs/"));
  const linkedLlmsUrls = Array.from(
    llms.body.matchAll(/\]\((https:\/\/puzzle-ui\.com\/docs\/[^)\s]+)\)/g),
    (match) => match[1] ?? "",
  );
  const uniqueLlmsUrls = new Set(linkedLlmsUrls);
  assert.equal(uniqueLlmsUrls.size, linkedLlmsUrls.length, "llms.txt links must be unique");
  assert.deepEqual(
    [...uniqueLlmsUrls].sort(),
    [...docUrls].sort(),
    "llms.txt must list every sitemap documentation page once",
  );
  assert.ok(llms.body.includes(`${canonicalOrigin}/llms-full.txt`));
  assert.ok(llms.body.includes("https://github.com/senorprogramador/puzzle"));

  const sourceUrls = Array.from(
    llmsFull.body.matchAll(/^Source:\s+(https:\/\/puzzle-ui\.com\/docs\/\S+)\s*$/gm),
    (match) => match[1] ?? "",
  );
  assert.equal(new Set(sourceUrls).size, sourceUrls.length, "llms-full pages must be unique");
  assert.deepEqual(
    [...new Set(sourceUrls)].sort(),
    [...docUrls].sort(),
    "llms-full must include every sitemap documentation page",
  );

  console.log(
    `Sitemap: ${urls.length} unique HTTPS URLs; pages checked: ${validPages.length}; unique titles/descriptions: ${uniqueTitles.size}/${uniqueDescriptions.size}.`,
  );
  console.log(
    `Documentation graph: ${docUrls.length} pages, ${edges.size} distinct internal edges, ${orphanedPages.length} orphan pages.`,
  );
  console.log(
    `Robots and GEO endpoints: passed; llms.txt ${Buffer.byteLength(llms.body)} bytes; llms-full.txt ${Buffer.byteLength(llmsFull.body)} bytes.`,
  );

  if (failures.length > 0) {
    console.error(`SEO endpoint validation found ${failures.length} issue(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  }
};

await run();
