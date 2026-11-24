import { describe, expect, it } from "bun:test";
import type { StorageAdapter } from "@puzzle-ui/storage";
import {
  collection,
  createCms,
  defineCMS,
  fields,
  toCmsPresentation,
  type CmsDocument,
  type CmsInstance,
  type CmsMutationOptions,
  type CmsScheduler,
  type FieldsCreateInput,
} from "../src";
import { normalizeWhere } from "../src/collections/query";

const config = defineCMS({
  collections: {
    posts: collection({
      name: "Blog post",
      fields: {
        title: fields.text({ required: true }),
        subtitle: fields.text({ required: true, defaultValue: "Untitled" }),
        slug: fields.slug({ from: "title" }),
        author: fields.relationship({ collection: "authors" }),
        seo: fields.object({
          fields: {
            description: fields.text(),
          },
        }),
      },
    }),
    authors: collection({
      fields: {
        name: fields.text({ required: true }),
      },
    }),
    settings: collection.singleton({
      fields: {
        siteName: fields.text({ required: true }),
      },
    }),
  },
});

const lifecycleConfig = defineCMS({
  collections: {
    articles: collection({
      drafts: true,
      timestamps: true,
      localization: {
        locales: ["en-US", "fr-FR"],
        defaultLocale: "en-US",
      },
      access: {
        read: async ({ user }) => user !== null,
      },
      hooks: {
        beforeChange: ({ operation, fields, context }) => {
          void operation;
          void fields;
          void context.actor;
        },
        afterChange: ({ entry }) => {
          void entry.status;
        },
      },
      fields: {
        title: fields.text({ required: true }),
        slug: fields.slug({ from: "title" }),
        summary: fields.text({
          access: { read: () => true },
          validate: () => "server-only",
        }),
        computedLabel: fields.computed({ compute: () => "server-only" }),
        customLabel: fields.custom({
          name: "label",
          is: (value): value is string => typeof value === "string",
        }),
        details: fields.object({
          fields: {
            caption: fields.text({ validate: () => "nested-server-only" }),
          },
        }),
        content: fields.blocks({
          blocks: [
            {
              type: "quote",
              label: "Quote",
              fields: {
                quote: fields.text({ validate: () => "block-server-only" }),
              },
            },
          ] as const,
        }),
      },
    }),
    pages: collection({
      fields: { title: fields.text({ required: true }) },
    }),
  },
});

type PostFields = typeof config.collections.posts.fields;
type PostCreateInput = FieldsCreateInput<PostFields>;

const checkInferredApi = (cms: CmsInstance<typeof config.collections>): void => {
  const validInput: PostCreateInput = { title: "Typed post" };
  void validInput;
  void cms.posts.create({ title: "Typed post" });
  void cms.posts.findBySlug("typed-post");
  // @ts-expect-error locale fallbacks require localization config
  void cms.posts.findBySlug("typed-post", { fallbackLocales: ["fr-FR"] });
  void cms.authors.create({ name: "Author" }, { slug: "author" });
  // @ts-expect-error collections without a generated or required slug need an explicit slug
  void cms.authors.create({ name: "Author" });
  void cms.settings.create({ siteName: "Example" });
  void cms.posts.find({
    where: {
      title: { contains: "Typed" },
      "seo.description": { contains: "text" },
      and: [{ status: { in: ["draft", "published"] } }],
    },
    sort: "-seo.description",
    limit: 10,
    page: 1,
  });
  void cms.settings.find();
  void cms.settings.purge({ expectedRevision: 2 });
  // @ts-expect-error required field is inferred from the schema
  void cms.posts.create({});
  // @ts-expect-error filter keys are inferred from the schema
  void cms.posts.find({ where: { missing: { equals: "value" } } });
  // @ts-expect-error relationships can target only configured collection keys
  defineCMS({
    collections: {
      broken: collection({
        fields: {
          target: fields.relationship({ target: "missing" }),
        },
      }),
    },
  });
  // @ts-expect-error singleton APIs do not expose arbitrary entry IDs
  void cms.settings.findById("unavailable");
};

void checkInferredApi;

const checkLifecycleApi = (
  cms: CmsInstance<typeof lifecycleConfig.collections, true>,
): void => {
  const mutationOptions: CmsMutationOptions = { expectedRevision: 1 };
  void cms.articles.publish("article-id", mutationOptions);
  void cms.articles.unpublish("article-id");
  void cms.articles.archive("article-id");
  void cms.articles.delete("article-id");
  void cms.articles.purge("article-id", { expectedRevision: 3 });
  void cms.articles.listRevisions("article-id", { first: 20 });
  void cms.articles.restoreRevision("article-id", "revision-id");
  void cms.articles.findBySlug("article", {
    locale: "en-US",
    fallbackLocales: ["fr-FR"],
  });
  void cms.articles.schedulePublish("article-id", {
    expectedRevision: 1,
    publishAt: new Date("2026-11-25T10:00:00.000Z"),
    timeZone: "UTC",
  });
  void cms.articles.unschedule("article-id");
  void cms.articles.createTranslation(
    "article-id",
    { title: "French title" },
    { locale: "fr-FR" },
  );
  void cms.articles.listLocaleVariants("article-id", { limit: 20 });
  void cms.$scheduler.publishScheduled({
    entryId: "article-id",
    scheduledRevisionNumber: 2,
    publishAt: new Date("2026-11-25T10:00:00.000Z"),
    timeZone: "UTC",
  });
  const timestamped: CmsDocument<
    typeof lifecycleConfig.collections.articles.fields,
    typeof lifecycleConfig.collections.articles
  > = {} as CmsDocument<
    typeof lifecycleConfig.collections.articles.fields,
    typeof lifecycleConfig.collections.articles
  >;
  void timestamped.createdAt;
  void cms.pages.create({ title: "No draft config" }, { slug: "no-draft" });
  // @ts-expect-error draft lifecycle APIs require `drafts: true`
  void cms.pages.publish("page-id");
  // @ts-expect-error localization APIs require a localization config
  void cms.pages.listLocaleVariants("page-id");
};

const checkNoSchedulerApi = (
  cms: CmsInstance<typeof lifecycleConfig.collections, false>,
): void => {
  // @ts-expect-error scheduling requires an instance configured with a scheduler
  void cms.pages.schedulePublish("page-id", {
    publishAt: new Date(),
    timeZone: "UTC",
  });
};

void checkLifecycleApi;
void checkNoSchedulerApi;

const checkSchedulerInference = (
  storage: StorageAdapter,
  scheduler: CmsScheduler,
): void => {
  const withScheduler = createCms({
    config: lifecycleConfig,
    storage,
    accessPolicy: () => true,
    scheduler,
  });
  void withScheduler.$scheduler.publishScheduled({
    entryId: "article-id",
    scheduledRevisionNumber: 1,
    publishAt: new Date("2026-11-25T10:00:00.000Z"),
    timeZone: "UTC",
  });
  const withoutScheduler = createCms({
    config: lifecycleConfig,
    storage,
    accessPolicy: () => true,
  });
  // @ts-expect-error the scheduler worker API requires an explicit scheduler
  void withoutScheduler.$scheduler.publishScheduled({
    entryId: "article-id",
    scheduledRevisionNumber: 1,
    publishAt: new Date(),
    timeZone: "UTC",
  });
};

void checkSchedulerInference;

const checkOutboxApi = (storage: StorageAdapter): void => {
  const withEvents = createCms({
    config: lifecycleConfig,
    storage,
    accessPolicy: () => true,
    emitChangeEvents: true,
  });
  void withEvents.events.list({ first: 10 });
  void withEvents.events.acknowledge("event-id", { expectedRevision: 1 });
  const withoutEvents = createCms({
    config: lifecycleConfig,
    storage,
    accessPolicy: () => true,
  });
  // @ts-expect-error outbox operations require emitChangeEvents
  void withoutEvents.events.list();
};

void checkOutboxApi;

const checkTrustedContextPolicy = (
  config: typeof lifecycleConfig,
  storage: StorageAdapter,
): void => {
  void createCms({ config, storage });
  void createCms({
    config,
    storage,
    context: { tenantId: "tenant-1", user: { id: "editor" } },
    accessPolicy: () => true,
  });
  // @ts-expect-error request-bound context requires an explicit host access policy
  void createCms({ config, storage, context: { tenantId: "tenant-1" } });
};

void checkTrustedContextPolicy;

const createTypedExample = (
  storage: StorageAdapter,
  scheduler: CmsScheduler,
) => {
  const cms = createCms({
    config: lifecycleConfig,
    storage,
    scheduler,
    context: { tenantId: "tenant-1", user: { id: "editor-1" } },
    accessPolicy: async ({ actor }) => actor?.id === "editor-1",
  });
  return cms.articles.create({ title: "First article" }, { locale: "en-US" })
    .then(async (article) => {
      const draft = await cms.articles.update(
        article.id,
        { title: "Revised article" },
        { expectedRevision: article.revision },
      );
      return cms.articles.publish(draft.id, {
        expectedRevision: draft.revision,
      });
    });
};

void createTypedExample;

describe("code-first CMS configuration", () => {
  it("preserves keyed collection and singleton definitions", () => {
    expect(config.collections.posts.kind).toBe("collection");
    expect(config.collections.posts.name).toBe("Blog post");
    expect(config.collections.settings.kind).toBe("singleton");
  });

  it("normalizes field operators and nested boolean groups", () => {
    expect(normalizeWhere<PostFields>(undefined)).toEqual([]);
    expect(
      normalizeWhere<PostFields>({
        title: { contains: "CMS" },
        "seo.description": { equals: "Page" },
        and: [
          { status: { notEquals: "draft" } },
          { or: [{ author: { exists: true } }] },
        ],
      }),
    ).toEqual([
      { field: "title", operator: "contains", value: "CMS" },
      { field: "seo.description", operator: "equals", value: "Page" },
      {
        and: [
          { field: "status", operator: "notEquals", value: "draft" },
          {
            or: [{ field: "author", operator: "exists", value: true }],
          },
        ],
      },
    ]);
  });

  it("rejects slug sources that do not exist in their field map", () => {
    expect(() =>
      defineCMS({
        collections: {
          posts: collection({
            fields: {
              title: fields.text(),
              slug: fields.slug({ from: "missing" }),
            },
          }),
        },
      }),
    ).toThrow(/unknown source field/);
  });

  it("projects code-first config to a callback-free serializable presentation", () => {
    const presentation = toCmsPresentation(lifecycleConfig);
    const article = presentation.collections.articles;
    expect(article).not.toHaveProperty("access");
    expect(article).not.toHaveProperty("hooks");
    expect(article.fields.summary).not.toHaveProperty("access");
    expect(article.fields.summary).not.toHaveProperty("validate");
    expect(article.fields.computedLabel).not.toHaveProperty("compute");
    expect(article.fields.customLabel).not.toHaveProperty("is");
    expect(article.fields.details.fields.caption).not.toHaveProperty("validate");
    const content = article.fields.content;
    if (content.type !== "blocks") throw new Error("Expected block field.");
    expect(content.blocks[0]?.fields.quote).not.toHaveProperty("validate");
    expect(() => JSON.stringify(presentation)).not.toThrow();
    expect(JSON.stringify(presentation)).not.toContain("server-only");
  });
});
