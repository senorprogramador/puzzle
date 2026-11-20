import { describe, expect, it, vi } from "vitest";

import {
  createAuthorizedSuggestionProvider,
  createInMemoryTranslationReviewStore,
  createRateLimitedSuggestionProvider,
  createTransactionalTranslationReviewStore,
  createTranslationReviewWorkflow,
  suggestTranslation,
  TranslationReviewConflictError,
  TranslationSuggestionError,
  type TranslationReviewAuditRecord,
  type TranslationReviewRecord,
  type TransactionalTranslationReviewPersistence,
  type TransactionalTranslationReviewTransaction,
  type VersionedTranslation,
} from "../ai";

describe("translation suggestions", () => {
  it("validates a candidate and never marks it approved", async () => {
    const provider = {
      suggest: vi.fn(async () => "Bonjour {name}"),
    };

    await expect(
      suggestTranslation(provider, {
        sourceLocale: "en",
        targetLocale: "fr",
        key: "greeting",
        sourceMessage: "Hello {name}",
      }),
    ).resolves.toEqual({
      key: "greeting",
      locale: "fr",
      value: "Bonjour {name}",
      approved: false,
    });
  });

  it("rejects invalid ICU syntax and placeholder changes", async () => {
    await expect(
      suggestTranslation(
        { suggest: async () => "Bonjour {name" },
        {
          sourceLocale: "en",
          targetLocale: "fr",
          key: "greeting",
          sourceMessage: "Hello {name}",
        },
      ),
    ).rejects.toThrow(/invalid message syntax/);

    await expect(
      suggestTranslation(
        { suggest: async () => "Bonjour {person}" },
        {
          sourceLocale: "en",
          targetLocale: "fr",
          key: "greeting",
          sourceMessage: "Hello {name}",
        },
      ),
    ).rejects.toThrow(/changed placeholders/);
  });

  it("classifies provider failures and preserves their cause", async () => {
    const cause = new Error("provider unavailable");

    await expect(
      suggestTranslation(
        { suggest: async () => Promise.reject(cause) },
        {
          sourceLocale: "en",
          targetLocale: "fr",
          key: "greeting",
          sourceMessage: "Hello",
        },
      ),
    ).rejects.toMatchObject({
      code: "provider-failed",
      cause,
    });
  });

  it("prevents provider calls from browser runtimes", async () => {
    const provider = { suggest: vi.fn(async () => "Bonjour") };
    vi.stubGlobal("window", {});

    try {
      await expect(
        suggestTranslation(provider, {
          sourceLocale: "en",
          targetLocale: "fr",
          key: "greeting",
          sourceMessage: "Hello",
        }),
      ).rejects.toMatchObject({ code: "server-only" });
      expect(provider.suggest).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("authorizes each provider suggestion on the server", async () => {
    const provider = { suggest: vi.fn(async () => "Bonjour") };
    const authorize = vi.fn(async () => true);
    const authorizedProvider = createAuthorizedSuggestionProvider(
      provider,
      authorize,
    );
    const request = {
      sourceLocale: "en",
      targetLocale: "fr",
      key: "greeting",
      sourceMessage: "Hello",
    };

    await suggestTranslation(authorizedProvider, request);
    await suggestTranslation(authorizedProvider, request);

    expect(authorize).toHaveBeenCalledTimes(2);
    expect(provider.suggest).toHaveBeenCalledTimes(2);

    const deniedProvider = createAuthorizedSuggestionProvider(
      provider,
      async () => false,
    );

    await expect(suggestTranslation(deniedProvider, request)).rejects.toMatchObject({
      code: "unauthorized",
    });
    expect(provider.suggest).toHaveBeenCalledTimes(2);

    const failingAuthorization = createAuthorizedSuggestionProvider(
      provider,
      async () => {
        throw new Error("sensitive authorization detail");
      },
    );
    const authorizationError = await suggestTranslation(
      failingAuthorization,
      request,
    ).catch((error: unknown) => error);
    expect(authorizationError).toMatchObject({ code: "authorization-failed" });
    expect(authorizationError).not.toHaveProperty("cause");
    expect(provider.suggest).toHaveBeenCalledTimes(2);

    vi.stubGlobal("window", {});
    try {
      await expect(
        suggestTranslation(authorizedProvider, request),
      ).rejects.toMatchObject({ code: "server-only" });
      expect(authorize).toHaveBeenCalledTimes(2);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("scores configured terminology and context quality without approving", async () => {
    const suggestion = await suggestTranslation(
      { suggest: async () => "Nous sommes là pour vous aider." },
      {
        sourceLocale: "en",
        targetLocale: "fr",
        key: "support",
        sourceMessage: "Contact Support for help",
        context: "A concise label for a customer-support button.",
      },
      undefined,
      {
        quality: {
          terminology: [{ source: "Support", target: "Assistance" }],
          checks: [
            {
              id: "button-context",
              evaluate: ({ request }) =>
                request.context?.includes("button") ? 100 : 0,
            },
          ],
        },
      },
    );

    expect(suggestion).toMatchObject({
      approved: false,
      quality: {
        score: 50,
        checks: [
          {
            id: "terminology-1",
            score: 0,
            passed: false,
          },
          {
            id: "button-context",
            score: 100,
            passed: true,
          },
        ],
      },
    });
  });

  it("enforces provider concurrency limits and releases capacity", async () => {
    let finishRequest: ((value: string) => void) | undefined;
    const provider = createRateLimitedSuggestionProvider(
      {
        suggest: () =>
          new Promise<string>((resolve) => {
            finishRequest = resolve;
          }),
      },
      { maxConcurrent: 1 },
    );
    const first = provider.suggest({
      sourceLocale: "en",
      targetLocale: "fr",
      key: "greeting",
      sourceMessage: "Hello",
    });

    await expect(
      provider.suggest({
        sourceLocale: "en",
        targetLocale: "fr",
        key: "farewell",
        sourceMessage: "Goodbye",
      }),
    ).rejects.toMatchObject({ code: "rate-limited" });

    finishRequest?.("Bonjour");
    await expect(first).resolves.toBe("Bonjour");
  });

  it("requires human approval, records audit history, and checks versions", async () => {
    const store = createInMemoryTranslationReviewStore({
      clock: () => new Date("2025-01-01T00:00:00.000Z"),
    });
    const workflow = createTranslationReviewWorkflow(
      { suggest: async () => "Bonjour {name}" },
      store,
      { idFactory: () => "suggestion-1" },
    );
    const request = {
      sourceLocale: "en",
      targetLocale: "fr",
      key: "greeting",
      sourceMessage: "Hello {name}",
    };

    const suggestion = await workflow.suggest(request);

    expect(suggestion.status).toBe("pending");
    expect(await workflow.getTranslation("fr", "greeting")).toBeUndefined();

    const { suggestion: approved, translation } = await workflow.approve(
      suggestion.id,
      "reviewer@example.com",
    );

    expect(approved.status).toBe("approved");
    expect(translation).toMatchObject({
      locale: "fr",
      key: "greeting",
      value: "Bonjour {name}",
      revision: 1,
    });
    expect((await workflow.listAuditTrail()).map(({ action }) => action)).toEqual([
      "suggested",
      "approved",
    ]);

    await expect(
      workflow.approve(suggestion.id, "reviewer@example.com"),
    ).rejects.toBeInstanceOf(TranslationReviewConflictError);
  });

  it("rejects stale suggestions without changing the approved translation", async () => {
    const store = createInMemoryTranslationReviewStore();
    let nextId = 0;
    const workflow = createTranslationReviewWorkflow(
      { suggest: async () => `Bonjour ${++nextId}` },
      store,
      { idFactory: () => `suggestion-${nextId}` },
    );
    const request = {
      sourceLocale: "en",
      targetLocale: "fr",
      key: "greeting",
      sourceMessage: "Hello",
    };
    const first = await workflow.suggest(request);
    const stale = await workflow.suggest(request);

    await workflow.approve(first.id, "reviewer");

    await expect(workflow.approve(stale.id, "reviewer")).rejects.toBeInstanceOf(
      TranslationReviewConflictError,
    );
    expect(await workflow.getTranslation("fr", "greeting")).toMatchObject({
      revision: 1,
      value: "Bonjour 1",
    });
  });

  it("supports durable review stores through injected atomic persistence", async () => {
    const translations = new Map<string, VersionedTranslation>();
    const suggestions = new Map<string, TranslationReviewRecord>();
    const auditTrail: TranslationReviewAuditRecord[] = [];
    let rejectNextTranslationWrite = false;
    const translationKey = (locale: string, key: string) =>
      `${locale}\u0000${key}`;
    const transaction: TransactionalTranslationReviewTransaction = {
      async getTranslation(locale, key) {
        return translations.get(translationKey(locale, key));
      },
      async getSuggestion(id) {
        return suggestions.get(id);
      },
      async insertSuggestionIfAbsent(record) {
        if (suggestions.has(record.id)) {
          return false;
        }

        suggestions.set(record.id, record);
        return true;
      },
      async updateSuggestionIfPending(id, record) {
        if (suggestions.get(id)?.status !== "pending") {
          return false;
        }

        suggestions.set(id, record);
        return true;
      },
      async compareAndSetTranslation(locale, key, expectedRevision, next) {
        if (rejectNextTranslationWrite) {
          rejectNextTranslationWrite = false;
          return false;
        }

        const current = translations.get(translationKey(locale, key));

        if ((current?.revision ?? 0) !== expectedRevision) {
          return false;
        }

        translations.set(translationKey(locale, key), next);
        return true;
      },
      async appendAuditRecord(record) {
        auditTrail.push(record);
      },
      async listAuditTrail() {
        return auditTrail;
      },
    };
    const transactionCalls: string[] = [];
    const persistence: TransactionalTranslationReviewPersistence = {
      async transaction<Result>(
        operation: (
          transaction: TransactionalTranslationReviewTransaction,
        ) => Promise<Result>,
      ) {
        transactionCalls.push("transaction");
        return operation(transaction);
      },
    };
    const store = createTransactionalTranslationReviewStore(persistence, {
      clock: () => new Date("2025-01-01T00:00:00.000Z"),
    });
    const workflow = createTranslationReviewWorkflow(
      { suggest: async () => "Bonjour" },
      store,
      { idFactory: () => "durable-suggestion" },
    );
    const suggestion = await workflow.suggest({
      sourceLocale: "en",
      targetLocale: "fr",
      key: "greeting",
      sourceMessage: "Hello",
    });

    rejectNextTranslationWrite = true;
    await expect(
      workflow.approve(suggestion.id, "reviewer"),
    ).rejects.toBeInstanceOf(TranslationReviewConflictError);
    expect(await workflow.getSuggestion(suggestion.id)).toMatchObject({
      status: "pending",
    });
    expect(await workflow.getTranslation("fr", "greeting")).toBeUndefined();
    expect((await workflow.listAuditTrail()).map(({ action }) => action)).toEqual([
      "suggested",
    ]);

    await workflow.approve(suggestion.id, "reviewer");
    expect(await workflow.getTranslation("fr", "greeting")).toMatchObject({
      value: "Bonjour",
      revision: 1,
    });
    expect((await workflow.listAuditTrail()).map(({ action }) => action)).toEqual([
      "suggested",
      "approved",
    ]);
    expect(transactionCalls.length).toBeGreaterThan(0);
  });
});
