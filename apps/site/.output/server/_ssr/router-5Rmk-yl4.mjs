import { Theme } from "./theme-CdO4PIrK.mjs";
import { basename, extname, source } from "./source-itr-2aM3.mjs";
import { addSearchablePropertyToIndex, addSortablePropertyToSorter, create, createError, getInternalDocumentId, getNested, isArrayType, isAsyncFunction, isGeoPointType, isVectorType, runMultipleHook, runSingleHook, save, searchAdvanced, searchSimple, yieldToEventLoop } from "./advanced-8SKrWgR9-D5hjLeTM.mjs";
import { createEndpoint, defaultReadOptions } from "./endpoint-H7rb4eeq-e9k_OSbI.mjs";
import { Route as Route$4 } from "../_-Cy3QkNsp.mjs";
import { HeadContent, Scripts, createRouter } from "../_libs/@tanstack/react-router+[3...].mjs";
import { Link, createFileRoute, createRootRoute, lazyRouteComponent } from "../_libs/@tanstack/react-router+[2...].mjs";
import { Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/router-5Rmk-yl4.js
var import_jsx_runtime = require_jsx_runtime();
var app_default = "/assets/app-DuDcm_1e.css";
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Puzzle UI" }
		],
		links: [
			{
				rel: "stylesheet",
				href: app_default
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "96x96",
				href: "/favicon-96x96.png"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png"
			},
			{
				rel: "shortcut icon",
				href: "/favicon.ico"
			},
			{
				rel: "manifest",
				href: "/site.webmanifest"
			}
		]
	}),
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootDocument, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("body", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Theme, {
			theme: "light",
			fonts: {
				heading: {
					family: "Geist",
					weights: [600, 700]
				},
				body: {
					family: "Inter",
					weights: [400, 600]
				},
				accent: {
					family: "Geist",
					weights: [400, 500]
				}
			},
			components: { link: {
				component: Link,
				hrefProp: "to"
			} },
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		}) })]
	});
}
var $$splitComponentImporter = () => import("./routes-CDFy51cb.mjs");
var Route$2 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var CACHE_DURATION_SECONDS = 86400;
var escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
var createSitemapHandler = (getPaths) => {
	let cache;
	return (request) => {
		const origin = new URL(request.url).origin;
		const now = Date.now();
		if (!cache || cache.origin !== origin || now >= cache.expiresAt) cache = {
			origin,
			body: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(getPaths().map((path) => new URL(path, origin).href))].sort().map((location) => `  <url><loc>${escapeXml(location)}</loc></url>`).join("\n")}\n</urlset>\n`,
			expiresAt: now + CACHE_DURATION_SECONDS * 1e3
		};
		return new Response(cache.body, { headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": `public, max-age=${CACHE_DURATION_SECONDS}, s-maxage=${CACHE_DURATION_SECONDS}`
		} });
	};
};
var sitemap = createSitemapHandler(() => ["/", ...source.getPages().map((page) => page.url)]);
var Route$1 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: ({ request }) => sitemap(request) } } });
async function buildIndexDefault(page) {
	let structuredData;
	if (page.data.structuredData) structuredData = typeof page.data.structuredData === "function" ? await page.data.structuredData() : page.data.structuredData;
	else if ("load" in page.data && typeof page.data.load === "function") structuredData = (await page.data.load()).structuredData;
	if (!structuredData) throw new Error("Cannot find structured data from page, please define the page to index function.");
	return {
		title: page.data.title ?? basename(page.path, extname(page.path)),
		description: page.data.description,
		url: page.url,
		id: page.url,
		structuredData
	};
}
function isBreadcrumbItem(item) {
	return typeof item === "string" && item.length > 0;
}
/**
* Get the breadcrumbs of pages, each page tree is walked once.
*/
function createBreadcrumbs(source) {
	const trees = /* @__PURE__ */ new Map();
	return (page) => {
		const tree = source.getPageTree(page.locale);
		let breadcrumbs = trees.get(tree);
		if (!breadcrumbs) trees.set(tree, breadcrumbs = collectBreadcrumbs(tree, [], /* @__PURE__ */ new Map()));
		return breadcrumbs.get(page.url);
	};
}
/** like `findPath()`, a page takes its first path, with the separator above it */
function collectBreadcrumbs(folder, parents, out) {
	const path = isBreadcrumbItem(folder.name) ? [...parents, folder.name] : parents;
	if (folder.type === "folder" && folder.index && !out.has(folder.index.url)) out.set(folder.index.url, path);
	let current = path;
	for (const node of folder.children) if (node.type === "separator") current = isBreadcrumbItem(node.name) ? [...path, node.name] : path;
	else if (node.type === "folder") collectBreadcrumbs(node, current, out);
	else if (!out.has(node.url)) out.set(node.url, current);
	return out;
}
function inferTypeFromValue(value) {
	switch (typeof value) {
		case "string": return "string";
		case "number": return "number";
		case "boolean": return "boolean";
	}
	if (Array.isArray(value)) {
		if (value.length === 0) return;
		const innerType = inferTypeFromValue(value[0]);
		if (innerType === "string" || innerType === "number" || innerType === "boolean") return `${innerType}[]`;
		return;
	}
	if (typeof value === "object" && value !== null) {
		const point = value;
		if (typeof point.lat === "number" && typeof point.lon === "number") return "geopoint";
	}
}
function flattenDocument(doc, prefix, leaves) {
	for (const [key, value] of Object.entries(doc)) {
		if (key === "id" || key === "__vector") continue;
		if (value === null || typeof value === "undefined") continue;
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === "object" && !Array.isArray(value)) {
			if (typeof value.lat === "number" && typeof value.lon === "number") {
				leaves.push([path, value]);
				continue;
			}
			flattenDocument(value, path, leaves);
			continue;
		}
		leaves.push([path, value]);
	}
}
function hasPathConflict(knownProperties, path) {
	for (const known of Object.keys(knownProperties)) if (path.startsWith(`${known}.`) || known.startsWith(`${path}.`)) return true;
	return false;
}
function setNestedSchemaProperty(schema, path, type) {
	const tokens = path.split(".");
	const lastToken = tokens[tokens.length - 1];
	let current = schema;
	for (let i = 0; i < tokens.length - 1; i++) {
		const token = tokens[i];
		const next = current[token];
		if (typeof next !== "object" || next === null || Array.isArray(next)) current[token] = {};
		current = current[token];
	}
	current[lastToken] = type;
}
function inferSchemaFromDocument(zbsearch, doc) {
	if (!zbsearch.inferSchema) return false;
	const leaves = [];
	flattenDocument(doc, "", leaves);
	const index = zbsearch.data.index;
	const sorter = zbsearch.data.sorting;
	const knownProperties = zbsearch.index.getSearchablePropertiesWithTypes(index);
	let changed = false;
	for (const [path, value] of leaves) {
		const knownType = knownProperties[path];
		if (knownType) {
			if (getNested(zbsearch.schema, path) !== knownType) setNestedSchemaProperty(zbsearch.schema, path, knownType);
			continue;
		}
		const type = inferTypeFromValue(value);
		if (!type) continue;
		if (hasPathConflict(knownProperties, path)) continue;
		addSearchablePropertyToIndex(zbsearch, index, path, type);
		addSortablePropertyToSorter(sorter, path, type);
		setNestedSchemaProperty(zbsearch.schema, path, type);
		knownProperties[path] = type;
		changed = true;
	}
	if (changed) zbsearch.caches = {};
	return changed;
}
function insert(zbsearch, doc, language, skipHooks, options) {
	inferSchemaFromDocument(zbsearch, doc);
	const errorProperty = zbsearch.validateSchema(doc, zbsearch.schema);
	if (errorProperty) throw createError("SCHEMA_VALIDATION_FAILURE", errorProperty);
	if (isAsyncFunction(zbsearch.beforeInsert) || isAsyncFunction(zbsearch.afterInsert) || isAsyncFunction(zbsearch.index.beforeInsert) || isAsyncFunction(zbsearch.index.insert) || isAsyncFunction(zbsearch.index.afterInsert)) return innerInsertAsync(zbsearch, doc, language, skipHooks, options);
	return innerInsertSync(zbsearch, doc, language, skipHooks, options);
}
var ENUM_TYPE = /* @__PURE__ */ new Set(["enum", "enum[]"]);
var STRING_NUMBER_TYPE = /* @__PURE__ */ new Set(["string", "number"]);
async function innerInsertAsync(zbsearch, doc, language, skipHooks, options) {
	const { index, docs } = zbsearch.data;
	const id = zbsearch.getDocumentIndexId(doc);
	if (typeof id !== "string") throw createError("DOCUMENT_ID_MUST_BE_STRING", typeof id);
	const internalId = getInternalDocumentId(zbsearch.internalDocumentIDStore, id);
	if (!skipHooks) await runSingleHook(zbsearch.beforeInsert, zbsearch, id, doc);
	if (!zbsearch.documentsStore.store(docs, id, internalId, doc)) throw createError("DOCUMENT_ALREADY_EXISTS", id);
	const docsCount = zbsearch.documentsStore.count(docs);
	const indexableProperties = zbsearch.index.getSearchableProperties(index);
	const indexablePropertiesWithTypes = zbsearch.index.getSearchablePropertiesWithTypes(index);
	const indexableValues = zbsearch.getDocumentProperties(doc, indexableProperties);
	for (const [key, value] of Object.entries(indexableValues)) {
		if (typeof value === "undefined") continue;
		const actualType = typeof value;
		const expectedType = indexablePropertiesWithTypes[key];
		validateDocumentProperty(actualType, expectedType, key, value);
	}
	await indexAndSortDocument(zbsearch, id, indexableProperties, indexableValues, docsCount, language, doc, options);
	if (!skipHooks) await runSingleHook(zbsearch.afterInsert, zbsearch, id, doc);
	return id;
}
function getInsertMetadata(zbsearch) {
	let indexableProperties = zbsearch.caches["indexableProperties"];
	let indexablePropertiesWithTypes = zbsearch.caches["indexablePropertiesWithTypes"];
	let sortableProperties = zbsearch.caches["sortableProperties"];
	let sortablePropertiesWithTypes = zbsearch.caches["sortablePropertiesWithTypes"];
	if (!indexableProperties) {
		indexableProperties = zbsearch.index.getSearchableProperties(zbsearch.data.index);
		indexablePropertiesWithTypes = zbsearch.index.getSearchablePropertiesWithTypes(zbsearch.data.index);
		sortableProperties = zbsearch.sorter.getSortableProperties(zbsearch.data.sorting);
		sortablePropertiesWithTypes = zbsearch.sorter.getSortablePropertiesWithTypes(zbsearch.data.sorting);
		zbsearch.caches["indexableProperties"] = indexableProperties;
		zbsearch.caches["indexablePropertiesWithTypes"] = indexablePropertiesWithTypes;
		zbsearch.caches["sortableProperties"] = sortableProperties;
		zbsearch.caches["sortablePropertiesWithTypes"] = sortablePropertiesWithTypes;
	}
	return {
		indexableProperties,
		indexablePropertiesWithTypes,
		sortableProperties,
		sortablePropertiesWithTypes
	};
}
function innerInsertSync(zbsearch, doc, language, skipHooks, options) {
	const { index: _index, docs } = zbsearch.data;
	const id = zbsearch.getDocumentIndexId(doc);
	if (typeof id !== "string") throw createError("DOCUMENT_ID_MUST_BE_STRING", typeof id);
	const internalId = getInternalDocumentId(zbsearch.internalDocumentIDStore, id);
	if (!skipHooks && zbsearch.beforeInsert?.length) runSingleHook(zbsearch.beforeInsert, zbsearch, id, doc);
	if (!zbsearch.documentsStore.store(docs, id, internalId, doc)) throw createError("DOCUMENT_ALREADY_EXISTS", id);
	const docsCount = zbsearch.documentsStore.count(docs);
	const { indexableProperties, indexablePropertiesWithTypes, sortableProperties, sortablePropertiesWithTypes } = getInsertMetadata(zbsearch);
	const indexableValues = zbsearch.getDocumentProperties(doc, indexableProperties);
	for (const [key, value] of Object.entries(indexableValues)) {
		if (typeof value === "undefined") continue;
		const actualType = typeof value;
		const expectedType = indexablePropertiesWithTypes[key];
		validateDocumentProperty(actualType, expectedType, key, value);
	}
	indexAndSortDocumentSync(zbsearch, id, indexableProperties, indexableValues, docsCount, language, doc, options, indexablePropertiesWithTypes, sortableProperties, sortablePropertiesWithTypes);
	if (!skipHooks && zbsearch.afterInsert?.length) runSingleHook(zbsearch.afterInsert, zbsearch, id, doc);
	return id;
}
function validateDocumentProperty(actualType, expectedType, key, value) {
	if (isGeoPointType(expectedType) && typeof value === "object" && typeof value.lon === "number" && typeof value.lat === "number") return;
	if (isVectorType(expectedType) && Array.isArray(value)) return;
	if (isArrayType(expectedType) && Array.isArray(value)) return;
	if (ENUM_TYPE.has(expectedType) && STRING_NUMBER_TYPE.has(actualType)) return;
	if (actualType !== expectedType) throw createError("INVALID_DOCUMENT_PROPERTY", key, expectedType, actualType);
}
async function indexAndSortDocument(zbsearch, id, indexableProperties, indexableValues, docsCount, language, doc, options) {
	for (const prop of indexableProperties) {
		const value = indexableValues[prop];
		if (typeof value === "undefined") continue;
		const expectedType = zbsearch.index.getSearchablePropertiesWithTypes(zbsearch.data.index)[prop];
		await zbsearch.index.beforeInsert?.(zbsearch.data.index, prop, id, value, expectedType, language, zbsearch.tokenizer, docsCount);
		const internalId = zbsearch.internalDocumentIDStore.idToInternalId.get(id);
		await zbsearch.index.insert(zbsearch.index, zbsearch.data.index, prop, id, internalId, value, expectedType, language, zbsearch.tokenizer, docsCount, options);
		await zbsearch.index.afterInsert?.(zbsearch.data.index, prop, id, value, expectedType, language, zbsearch.tokenizer, docsCount);
	}
	const sortableProperties = zbsearch.sorter.getSortableProperties(zbsearch.data.sorting);
	const sortableValues = zbsearch.getDocumentProperties(doc, sortableProperties);
	for (const prop of sortableProperties) {
		const value = sortableValues[prop];
		if (typeof value === "undefined") continue;
		const expectedType = zbsearch.sorter.getSortablePropertiesWithTypes(zbsearch.data.sorting)[prop];
		zbsearch.sorter.insert(zbsearch.data.sorting, prop, id, value, expectedType, language);
	}
}
function indexAndSortDocumentSync(zbsearch, id, indexableProperties, indexableValues, docsCount, language, doc, options, cachedIndexTypes, cachedSortableProperties, cachedSortableTypes) {
	const indexTypes = cachedIndexTypes ?? zbsearch.index.getSearchablePropertiesWithTypes(zbsearch.data.index);
	const internalDocumentId = getInternalDocumentId(zbsearch.internalDocumentIDStore, id);
	for (const prop of indexableProperties) {
		const value = indexableValues[prop];
		if (typeof value === "undefined") continue;
		const expectedType = indexTypes[prop];
		zbsearch.index.beforeInsert?.(zbsearch.data.index, prop, id, value, expectedType, language, zbsearch.tokenizer, docsCount);
		zbsearch.index.insert(zbsearch.index, zbsearch.data.index, prop, id, internalDocumentId, value, expectedType, language, zbsearch.tokenizer, docsCount, options);
		zbsearch.index.afterInsert?.(zbsearch.data.index, prop, id, value, expectedType, language, zbsearch.tokenizer, docsCount);
	}
	const sortableProperties = cachedSortableProperties ?? zbsearch.sorter.getSortableProperties(zbsearch.data.sorting);
	const sortableTypes = cachedSortableTypes ?? zbsearch.sorter.getSortablePropertiesWithTypes(zbsearch.data.sorting);
	const sortableValues = zbsearch.getDocumentProperties(doc, sortableProperties);
	for (const prop of sortableProperties) {
		const value = sortableValues[prop];
		if (typeof value === "undefined") continue;
		const expectedType = sortableTypes[prop];
		zbsearch.sorter.insert(zbsearch.data.sorting, prop, id, value, expectedType, language);
	}
}
function insertBatchSync(zbsearch, batch, ids, language, skipHooks) {
	let { indexableProperties, indexablePropertiesWithTypes, sortableProperties, sortablePropertiesWithTypes } = getInsertMetadata(zbsearch);
	const batchOptions = { avlRebalanceThreshold: batch.length };
	const { docs: docsStore } = zbsearch.data;
	for (const doc of batch) {
		if (inferSchemaFromDocument(zbsearch, doc)) ({indexableProperties, indexablePropertiesWithTypes, sortableProperties, sortablePropertiesWithTypes} = getInsertMetadata(zbsearch));
		const errorProperty = zbsearch.validateSchema(doc, zbsearch.schema);
		if (errorProperty) throw createError("SCHEMA_VALIDATION_FAILURE", errorProperty);
		const id = zbsearch.getDocumentIndexId(doc);
		if (typeof id !== "string") throw createError("DOCUMENT_ID_MUST_BE_STRING", typeof id);
		const internalId = getInternalDocumentId(zbsearch.internalDocumentIDStore, id);
		if (!skipHooks && zbsearch.beforeInsert?.length) runSingleHook(zbsearch.beforeInsert, zbsearch, id, doc);
		if (!zbsearch.documentsStore.store(docsStore, id, internalId, doc)) throw createError("DOCUMENT_ALREADY_EXISTS", id);
		const docsCount = zbsearch.documentsStore.count(docsStore);
		const indexableValues = zbsearch.getDocumentProperties(doc, indexableProperties);
		indexAndSortDocumentSync(zbsearch, id, indexableProperties, indexableValues, docsCount, language, doc, batchOptions, indexablePropertiesWithTypes, sortableProperties, sortablePropertiesWithTypes);
		if (!skipHooks && zbsearch.afterInsert?.length) runSingleHook(zbsearch.afterInsert, zbsearch, id, doc);
		ids.push(id);
	}
}
function needsAsyncInsert(zbsearch) {
	return isAsyncFunction(zbsearch.beforeInsert) || isAsyncFunction(zbsearch.afterInsert) || isAsyncFunction(zbsearch.index.beforeInsert) || isAsyncFunction(zbsearch.index.insert) || isAsyncFunction(zbsearch.index.afterInsert);
}
async function insertMultipleAsync(zbsearch, docs, options = {}) {
	const { batchSize = 100, language, skipHooks, onProgress } = options;
	if (!Number.isInteger(batchSize) || batchSize < 1) throw createError("INVALID_BATCH_SIZE", batchSize);
	const asyncNeeded = needsAsyncInsert(zbsearch);
	const total = docs.length;
	const ids = [];
	for (let start = 0; start < total; start += batchSize) {
		const batch = docs.slice(start, start + batchSize);
		if (asyncNeeded) {
			const insertOptions = { avlRebalanceThreshold: batch.length };
			for (const doc of batch) ids.push(await insert(zbsearch, doc, language, skipHooks, insertOptions));
		} else insertBatchSync(zbsearch, batch, ids, language, skipHooks);
		onProgress?.({
			processed: ids.length,
			total
		});
		if (start + batchSize < total) await yieldToEventLoop();
	}
	if (!skipHooks && zbsearch.afterInsertMultiple?.length) await runMultipleHook(zbsearch.afterInsertMultiple, zbsearch, docs);
	return ids;
}
function buildDocuments(indexes) {
	const docs = [];
	for (const page of indexes) {
		const pageTag = page.tag ?? [];
		const tags = Array.isArray(pageTag) ? pageTag : [pageTag];
		const data = page.structuredData;
		let id = 0;
		docs.push({
			id: page.id,
			page_id: page.id,
			type: "page",
			content: page.title,
			breadcrumbs: page.breadcrumbs,
			tags,
			url: page.url,
			locale: page.locale
		});
		const nextId = () => `${page.id}-${id++}`;
		if (page.description && !data.contents.some((item) => item.content === page.description)) docs.push({
			id: nextId(),
			page_id: page.id,
			tags,
			type: "text",
			url: page.url,
			content: page.description,
			locale: page.locale
		});
		for (const heading of data.headings) docs.push({
			id: nextId(),
			page_id: page.id,
			type: "heading",
			tags,
			url: `${page.url}#${heading.id}`,
			content: heading.content,
			locale: page.locale
		});
		for (const content of data.contents) docs.push({
			id: nextId(),
			page_id: page.id,
			tags,
			type: "text",
			url: content.heading ? `${page.url}#${content.heading}` : page.url,
			content: content.content,
			locale: page.locale,
			table: content.table
		});
	}
	return docs;
}
var simpleSchema = {
	url: "string",
	title: "string",
	breadcrumbs: "string[]",
	description: "string",
	content: "string",
	keywords: "string",
	locale: "enum"
};
var advancedSchema = {
	content: "string",
	page_id: "string",
	type: "string",
	breadcrumbs: "string[]",
	tags: "enum[]",
	url: "string",
	locale: "enum",
	embeddings: "vector[512]"
};
var DefaultLanguage = "multilingual";
async function createDB({ indexes, tokenizer, language = DefaultLanguage, search: _, localeFilter: __, ...rest }) {
	const items = typeof indexes === "function" ? await indexes() : indexes;
	const resolvedTokenizer = tokenizer ?? rest.components?.tokenizer;
	const db = create({
		schema: advancedSchema,
		language: resolvedTokenizer ? void 0 : language,
		...rest,
		components: {
			...rest.components,
			tokenizer: resolvedTokenizer
		}
	});
	await insertMultipleAsync(db, buildDocuments(items));
	return db;
}
async function createDBSimple({ indexes, tokenizer, language = DefaultLanguage, search: _, localeFilter: __, ...rest }) {
	const items = typeof indexes === "function" ? await indexes() : indexes;
	const resolvedTokenizer = tokenizer ?? rest.components?.tokenizer;
	const db = create({
		schema: simpleSchema,
		language: resolvedTokenizer ? void 0 : language,
		...rest,
		components: {
			...rest.components,
			tokenizer: resolvedTokenizer
		}
	});
	await insertMultipleAsync(db, items.map((page) => ({
		title: page.title,
		description: page.description,
		breadcrumbs: page.breadcrumbs,
		url: page.url,
		content: page.content,
		keywords: page.keywords,
		locale: page.locale
	})));
	return db;
}
function initSimpleSearch(options) {
	const doc = createDBSimple(options);
	return {
		async export() {
			return {
				type: "simple",
				...options.localeFilter ? { i18n: true } : null,
				...save(await doc)
			};
		},
		async search(query, searchOptions = {}) {
			const db = await doc;
			const { limit, locale } = searchOptions;
			return searchSimple(db, query, {
				limit,
				...options.search
			}, options.localeFilter && locale ? locale : void 0);
		}
	};
}
function initAdvancedSearch(options) {
	const get = createDB(options);
	return {
		async export() {
			return {
				type: "advanced",
				...options.localeFilter ? { i18n: true } : null,
				...save(await get)
			};
		},
		async search(query, searchOptions = {}) {
			const db = await get;
			const { limit, tag, mode, locale } = searchOptions;
			return searchAdvanced(db, query, tag, {
				...options.search,
				limit: limit ?? options.search?.limit,
				mode: mode === "vector" ? "vector" : "fulltext"
			}, options.localeFilter && locale ? locale : void 0).catch((err) => {
				if (mode === "vector") throw new Error("failed to search, make sure your indexes include `embeddings` and a plugin/proxy is configured to vectorize search terms.", { cause: err });
				throw err;
			});
		}
	};
}
function createI18nSearchAPI(...[type, options]) {
	if (options.localeMap) return createI18nSearchAPILegacy(type, options);
	const server = type === "simple" ? initSimpleSearch({
		...options,
		localeFilter: true
	}) : initAdvancedSearch({
		...options,
		localeFilter: true
	});
	return toAPI({
		export: server.export,
		async search(query, searchOptions) {
			return server.search(query, {
				...searchOptions,
				locale: searchOptions?.locale ?? options.i18n.defaultLanguage
			});
		}
	});
}
function createI18nSearchAPILegacy(type, options) {
	async function initSearchServers() {
		const map = /* @__PURE__ */ new Map();
		if (options.i18n.languages.length === 0) return map;
		const indexes = typeof options.indexes === "function" ? await options.indexes() : options.indexes;
		for (const locale of options.i18n.languages) {
			const localeIndexes = indexes.filter((index) => index.locale === locale);
			const mapped = options.localeMap?.[locale] ?? "multilingual";
			if (type === "simple") map.set(locale, typeof mapped === "object" ? initSimpleSearch({
				...options,
				...mapped,
				indexes: localeIndexes
			}) : initSimpleSearch({
				...options,
				language: mapped,
				indexes: localeIndexes
			}));
			else map.set(locale, typeof mapped === "object" ? initAdvancedSearch({
				...options,
				indexes: localeIndexes,
				...mapped
			}) : initAdvancedSearch({
				...options,
				language: mapped,
				indexes: localeIndexes
			}));
		}
		return map;
	}
	const get = initSearchServers();
	return toAPI({
		async export() {
			const map = await get;
			const entries = Array.from(map.entries()).map(async ([k, v]) => [k, await v.export()]);
			return {
				type: "i18n",
				data: Object.fromEntries(await Promise.all(entries))
			};
		},
		async search(query, searchOptions) {
			const map = await get;
			const locale = searchOptions?.locale ?? options.i18n.defaultLanguage;
			const handler = map.get(locale);
			if (handler) return handler.search(query, searchOptions);
			return [];
		}
	});
}
/**
* create server from loader, if passed as function, the server will re-index all records once a different instance of loader is returned.
*/
function createFromSource(loader, options = {}) {
	const { buildIndex = buildIndexDefault } = options;
	const cache = /* @__PURE__ */ new WeakMap();
	async function initServer(loader) {
		const getBreadcrumbs = createBreadcrumbs(loader);
		const indexes = await Promise.all(loader.getPages().map(async (page) => {
			const index = await buildIndex(page);
			return {
				...index,
				breadcrumbs: index.breadcrumbs ?? getBreadcrumbs(page),
				locale: page.locale
			};
		}));
		if (loader._i18n) return createI18nSearchAPI("advanced", {
			...options,
			indexes,
			i18n: loader._i18n
		});
		return initAdvancedSearch({
			indexes,
			...options
		});
	}
	async function getCurrentServer() {
		const l = typeof loader === "function" ? await loader() : loader;
		let server = cache.get(l);
		if (!server) {
			const promise = initServer(l);
			promise.catch(() => {
				if (cache.get(l) === promise) cache.delete(l);
			});
			cache.set(l, promise);
			server = promise;
		}
		return await server;
	}
	return toAPI({
		async export() {
			return (await getCurrentServer()).export();
		},
		async search(query, options) {
			return (await getCurrentServer()).search(query, options);
		}
	});
}
function toAPI(server) {
	return createEndpoint(server, { readOptions(url) {
		return {
			...defaultReadOptions(url),
			mode: url.searchParams.get("mode") === "vector" ? "vector" : "full"
		};
	} });
}
var server = createFromSource(source);
var Route = createFileRoute("/api/search")({ server: { handlers: { GET: async ({ request }) => server.GET(request) } } });
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	SitemapDotxmlRoute: Route$1.update({
		id: "/sitemap.xml",
		path: "/sitemap.xml",
		getParentRoute: () => Route$3
	}),
	ApiSearchRoute: Route.update({
		id: "/api/search",
		path: "/api/search",
		getParentRoute: () => Route$3
	}),
	DocsSplatRoute: Route$4.update({
		id: "/docs/$",
		path: "/docs/$",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultNotFoundComponent: () => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not found!" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Go home"
			})] });
		}
	});
}
export { getRouter };
