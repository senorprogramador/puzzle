import {
  suggestTranslation,
  type SuggestTranslationOptions,
  type TranslationQualityReport,
  TranslationSuggestionError,
  type TranslationSuggestionProvider,
  type TranslationSuggestionRequest,
} from "./index";

export type TranslationReviewStatus = "pending" | "approved" | "rejected";

export interface VersionedTranslation {
  readonly key: string;
  readonly locale: string;
  readonly value: string;
  readonly revision: number;
}

export interface TranslationReviewRecord {
  readonly id: string;
  readonly key: string;
  readonly locale: string;
  readonly sourceLocale: string;
  readonly sourceMessage: string;
  readonly value: string;
  readonly baseRevision: number;
  readonly status: TranslationReviewStatus;
  readonly createdAt: string;
  readonly quality?: TranslationQualityReport;
  readonly reviewedAt?: string;
  readonly reviewedBy?: string;
  readonly rejectionReason?: string;
}

export interface TranslationReviewAuditRecord {
  readonly suggestionId: string;
  readonly key: string;
  readonly locale: string;
  readonly action: "suggested" | "approved" | "rejected";
  readonly actor: string;
  readonly at: string;
  readonly previousRevision: number;
  readonly revision: number;
  readonly previousValue?: string;
  readonly value: string;
  readonly reason?: string;
}

export class TranslationReviewConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TranslationReviewConflictError";
  }
}

export interface TranslationReviewStore {
  getTranslation(
    locale: string,
    key: string,
  ): Promise<VersionedTranslation | undefined>;
  getSuggestion(id: string): Promise<TranslationReviewRecord | undefined>;
  createPendingSuggestion(record: TranslationReviewRecord): Promise<void>;
  approveSuggestion(
    id: string,
    reviewer: string,
    expectedRevision: number,
  ): Promise<{
    suggestion: TranslationReviewRecord;
    translation: VersionedTranslation;
  }>;
  rejectSuggestion(
    id: string,
    reviewer: string,
    reason?: string,
  ): Promise<TranslationReviewRecord>;
  listAuditTrail(): Promise<readonly TranslationReviewAuditRecord[]>;
}

export interface TransactionalTranslationReviewTransaction {
  getTranslation(
    locale: string,
    key: string,
  ): Promise<VersionedTranslation | undefined>;
  getSuggestion(id: string): Promise<TranslationReviewRecord | undefined>;
  /** Atomically inserts the record only when its ID is unused. */
  insertSuggestionIfAbsent(
    record: TranslationReviewRecord,
  ): Promise<boolean>;
  /** Atomically updates the record only while its stored status is pending. */
  updateSuggestionIfPending(
    id: string,
    record: TranslationReviewRecord,
  ): Promise<boolean>;
  /** Atomically writes only when the current revision equals expectedRevision. */
  compareAndSetTranslation(
    locale: string,
    key: string,
    expectedRevision: number,
    translation: VersionedTranslation,
  ): Promise<boolean>;
  appendAuditRecord(record: TranslationReviewAuditRecord): Promise<void>;
  listAuditTrail(): Promise<readonly TranslationReviewAuditRecord[]>;
}

export interface TransactionalTranslationReviewPersistence {
  /** Commits all callback writes together and rolls them back if it throws. */
  transaction<Result>(
    operation: (
      transaction: TransactionalTranslationReviewTransaction,
    ) => Promise<Result>,
  ): Promise<Result>;
}

export interface CreateInMemoryTranslationReviewStoreOptions {
  clock?: () => Date;
}

const translationId = (locale: string, key: string): string =>
  `${locale}\u0000${key}`;

const immutable = <Value extends object>(value: Value): Readonly<Value> =>
  Object.freeze({ ...value });

const requireReviewer = (reviewer: string): string => {
  const normalized = reviewer.trim();

  if (!normalized) {
    throw new Error("A reviewer identity is required.");
  }

  return normalized;
};

const timestamp = (clock: () => Date): string => clock().toISOString();

const canonicalLocale = (locale: string): string => {
  try {
    const [canonical] = Intl.getCanonicalLocales(locale);

    if (canonical) {
      return canonical;
    }
  } catch {
    // Let the caller handle invalid locale values as a typed suggestion error.
  }

  throw new TranslationSuggestionError(
    "invalid-source",
    `Invalid BCP 47 locale "${locale}".`,
  );
};

const assertServerOnly = (): void => {
  if (typeof window !== "undefined") {
    throw new TranslationSuggestionError(
      "server-only",
      "Translation review workflows must only be used from a server environment.",
    );
  }
};

export const createInMemoryTranslationReviewStore = (
  options: CreateInMemoryTranslationReviewStoreOptions = {},
): TranslationReviewStore => {
  const clock = options.clock ?? (() => new Date());
  const translations = new Map<string, VersionedTranslation>();
  const suggestions = new Map<string, TranslationReviewRecord>();
  const auditTrail: TranslationReviewAuditRecord[] = [];

  return {
    async getTranslation(locale, key) {
      const current = translations.get(translationId(locale, key));
      return current ? immutable(current) : undefined;
    },

    async getSuggestion(id) {
      const record = suggestions.get(id);
      return record ? immutable(record) : undefined;
    },

    async createPendingSuggestion(record) {
      if (suggestions.has(record.id)) {
        throw new TranslationReviewConflictError(
          `Suggestion "${record.id}" already exists.`,
        );
      }

      const current =
        translations.get(translationId(record.locale, record.key));
      const revision = current?.revision ?? 0;

      if (revision !== record.baseRevision) {
        throw new TranslationReviewConflictError(
          `Translation "${record.key}" changed while its suggestion was being created.`,
        );
      }

      suggestions.set(record.id, immutable(record));
      auditTrail.push(
        immutable({
          suggestionId: record.id,
          key: record.key,
          locale: record.locale,
          action: "suggested" as const,
          actor: "ai",
          at: timestamp(clock),
          previousRevision: revision,
          revision,
          value: record.value,
        }),
      );
    },

    async approveSuggestion(id, reviewer, expectedRevision) {
      const record = suggestions.get(id);

      if (!record) {
        throw new Error(`Unknown translation suggestion "${id}".`);
      }

      if (record.status !== "pending") {
        throw new TranslationReviewConflictError(
          `Suggestion "${id}" is already ${record.status}.`,
        );
      }

      const currentKey = translationId(record.locale, record.key);
      const current = translations.get(currentKey);
      const currentRevision = current?.revision ?? 0;

      if (
        record.baseRevision !== expectedRevision ||
        currentRevision !== expectedRevision
      ) {
        throw new TranslationReviewConflictError(
          `Translation "${record.key}" changed after the suggestion was created.`,
        );
      }

      const at = timestamp(clock);
      const normalizedReviewer = requireReviewer(reviewer);
      const translation = immutable({
        key: record.key,
        locale: record.locale,
        value: record.value,
        revision: currentRevision + 1,
      });
      const suggestion = immutable({
        ...record,
        status: "approved" as const,
        reviewedAt: at,
        reviewedBy: normalizedReviewer,
      });

      translations.set(currentKey, translation);
      suggestions.set(id, suggestion);
      auditTrail.push(
        immutable({
          suggestionId: id,
          key: record.key,
          locale: record.locale,
          action: "approved" as const,
          actor: normalizedReviewer,
          at,
          previousRevision: currentRevision,
          revision: translation.revision,
          previousValue: current?.value,
          value: translation.value,
        }),
      );

      return {
        suggestion: immutable(suggestion),
        translation: immutable(translation),
      };
    },

    async rejectSuggestion(id, reviewer, reason) {
      const record = suggestions.get(id);

      if (!record) {
        throw new Error(`Unknown translation suggestion "${id}".`);
      }

      if (record.status !== "pending") {
        throw new TranslationReviewConflictError(
          `Suggestion "${id}" is already ${record.status}.`,
        );
      }

      const normalizedReviewer = requireReviewer(reviewer);
      const at = timestamp(clock);
      const normalizedReason = reason?.trim() || undefined;
      const suggestion = immutable({
        ...record,
        status: "rejected" as const,
        reviewedAt: at,
        reviewedBy: normalizedReviewer,
        rejectionReason: normalizedReason,
      });

      suggestions.set(id, suggestion);
      auditTrail.push(
        immutable({
          suggestionId: id,
          key: record.key,
          locale: record.locale,
          action: "rejected" as const,
          actor: normalizedReviewer,
          at,
          previousRevision: record.baseRevision,
          revision: record.baseRevision,
          value: record.value,
          reason: normalizedReason,
        }),
      );

      return immutable(suggestion);
    },

    async listAuditTrail() {
      return Object.freeze(auditTrail.map((record) => immutable(record)));
    },
  };
};

export interface CreateTransactionalTranslationReviewStoreOptions {
  clock?: () => Date;
}

export const createTransactionalTranslationReviewStore = (
  persistence: TransactionalTranslationReviewPersistence,
  options: CreateTransactionalTranslationReviewStoreOptions = {},
): TranslationReviewStore => {
  const clock = options.clock ?? (() => new Date());

  return {
    getTranslation(locale, key) {
      assertServerOnly();
      return persistence.transaction(async (transaction) => {
        const translation = await transaction.getTranslation(locale, key);
        return translation ? immutable(translation) : undefined;
      });
    },

    getSuggestion(id) {
      assertServerOnly();
      return persistence.transaction(async (transaction) => {
        const suggestion = await transaction.getSuggestion(id);
        return suggestion ? immutable(suggestion) : undefined;
      });
    },

    async createPendingSuggestion(record) {
      assertServerOnly();
      await persistence.transaction(async (transaction) => {
        if (await transaction.getSuggestion(record.id)) {
          throw new TranslationReviewConflictError(
            `Suggestion "${record.id}" already exists.`,
          );
        }

        const current = await transaction.getTranslation(
          record.locale,
          record.key,
        );
        const revision = current?.revision ?? 0;

        if (revision !== record.baseRevision) {
          throw new TranslationReviewConflictError(
            `Translation "${record.key}" changed while its suggestion was being created.`,
          );
        }

        if (!(await transaction.insertSuggestionIfAbsent(immutable(record)))) {
          throw new TranslationReviewConflictError(
            `Suggestion "${record.id}" already exists.`,
          );
        }

        await transaction.appendAuditRecord(
          immutable({
            suggestionId: record.id,
            key: record.key,
            locale: record.locale,
            action: "suggested" as const,
            actor: "ai",
            at: timestamp(clock),
            previousRevision: revision,
            revision,
            value: record.value,
          }),
        );
      });
    },

    approveSuggestion(id, reviewer, expectedRevision) {
      assertServerOnly();
      return persistence.transaction(async (transaction) => {
        const record = await transaction.getSuggestion(id);

        if (!record) {
          throw new Error(`Unknown translation suggestion "${id}".`);
        }

        if (record.status !== "pending") {
          throw new TranslationReviewConflictError(
            `Suggestion "${id}" is already ${record.status}.`,
          );
        }

        const current = await transaction.getTranslation(
          record.locale,
          record.key,
        );
        const currentRevision = current?.revision ?? 0;

        if (
          record.baseRevision !== expectedRevision ||
          currentRevision !== expectedRevision
        ) {
          throw new TranslationReviewConflictError(
            `Translation "${record.key}" changed after the suggestion was created.`,
          );
        }

        const normalizedReviewer = requireReviewer(reviewer);
        const at = timestamp(clock);
        const translation = immutable({
          key: record.key,
          locale: record.locale,
          value: record.value,
          revision: currentRevision + 1,
        });
        const suggestion = immutable({
          ...record,
          status: "approved" as const,
          reviewedAt: at,
          reviewedBy: normalizedReviewer,
        });

        if (
          !(await transaction.compareAndSetTranslation(
            record.locale,
            record.key,
            expectedRevision,
            translation,
          ))
        ) {
          throw new TranslationReviewConflictError(
            `Translation "${record.key}" changed after the suggestion was created.`,
          );
        }

        if (!(await transaction.updateSuggestionIfPending(id, suggestion))) {
          throw new TranslationReviewConflictError(
            `Suggestion "${id}" is no longer pending.`,
          );
        }

        await transaction.appendAuditRecord(
          immutable({
            suggestionId: id,
            key: record.key,
            locale: record.locale,
            action: "approved" as const,
            actor: normalizedReviewer,
            at,
            previousRevision: currentRevision,
            revision: translation.revision,
            previousValue: current?.value,
            value: translation.value,
          }),
        );

        return {
          suggestion: immutable(suggestion),
          translation: immutable(translation),
        };
      });
    },

    rejectSuggestion(id, reviewer, reason) {
      assertServerOnly();
      return persistence.transaction(async (transaction) => {
        const record = await transaction.getSuggestion(id);

        if (!record) {
          throw new Error(`Unknown translation suggestion "${id}".`);
        }

        if (record.status !== "pending") {
          throw new TranslationReviewConflictError(
            `Suggestion "${id}" is already ${record.status}.`,
          );
        }

        const normalizedReviewer = requireReviewer(reviewer);
        const at = timestamp(clock);
        const normalizedReason = reason?.trim() || undefined;
        const suggestion = immutable({
          ...record,
          status: "rejected" as const,
          reviewedAt: at,
          reviewedBy: normalizedReviewer,
          rejectionReason: normalizedReason,
        });

        if (!(await transaction.updateSuggestionIfPending(id, suggestion))) {
          throw new TranslationReviewConflictError(
            `Suggestion "${id}" is no longer pending.`,
          );
        }

        await transaction.appendAuditRecord(
          immutable({
            suggestionId: id,
            key: record.key,
            locale: record.locale,
            action: "rejected" as const,
            actor: normalizedReviewer,
            at,
            previousRevision: record.baseRevision,
            revision: record.baseRevision,
            value: record.value,
            reason: normalizedReason,
          }),
        );

        return immutable(suggestion);
      });
    },

    listAuditTrail() {
      assertServerOnly();
      return persistence.transaction(async (transaction) =>
        Object.freeze(
          (await transaction.listAuditTrail()).map((record) =>
            immutable(record),
          ),
        ),
      );
    },
  };
};

export interface CreateTranslationReviewWorkflowOptions {
  idFactory?: () => string;
  clock?: () => Date;
  quality?: SuggestTranslationOptions["quality"];
}

export interface TranslationReviewWorkflow {
  suggest(
    request: TranslationSuggestionRequest,
    signal?: AbortSignal,
  ): Promise<TranslationReviewRecord>;
  approve(
    id: string,
    reviewer: string,
  ): Promise<{
    suggestion: TranslationReviewRecord;
    translation: VersionedTranslation;
  }>;
  reject(
    id: string,
    reviewer: string,
    reason?: string,
  ): Promise<TranslationReviewRecord>;
  getSuggestion(id: string): Promise<TranslationReviewRecord | undefined>;
  getTranslation(
    locale: string,
    key: string,
  ): Promise<VersionedTranslation | undefined>;
  listAuditTrail(): Promise<readonly TranslationReviewAuditRecord[]>;
}

const createId = (): string => {
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.randomUUID) {
    throw new Error(
      "A secure random UUID implementation is required to create suggestions.",
    );
  }

  return cryptoApi.randomUUID();
};

export const createTranslationReviewWorkflow = (
  provider: TranslationSuggestionProvider,
  store: TranslationReviewStore,
  options: CreateTranslationReviewWorkflowOptions = {},
): TranslationReviewWorkflow => {
  const idFactory = options.idFactory ?? createId;
  const clock = options.clock ?? (() => new Date());

  return {
    async suggest(request, signal) {
      assertServerOnly();
      const sourceLocale = canonicalLocale(request.sourceLocale);
      const targetLocale = canonicalLocale(request.targetLocale);
      const workflowRequest = Object.freeze({
        ...request,
        sourceLocale,
        targetLocale,
        terminology: request.terminology
          ? Object.freeze([...request.terminology])
          : undefined,
      });
      const current = await store.getTranslation(
        targetLocale,
        workflowRequest.key,
      );
      const suggestion = await suggestTranslation(provider, workflowRequest, signal, {
        quality: options.quality,
      });
      const id = idFactory();

      if (!id.trim()) {
        throw new Error("Suggestion IDs must not be empty.");
      }

      const record = immutable({
        id,
        key: suggestion.key,
        locale: suggestion.locale,
        sourceLocale,
        sourceMessage: workflowRequest.sourceMessage,
        value: suggestion.value,
        baseRevision: current?.revision ?? 0,
        status: "pending" as const,
        createdAt: timestamp(clock),
        ...(suggestion.quality ? { quality: suggestion.quality } : {}),
      });

      await store.createPendingSuggestion(record);
      return record;
    },

    async approve(id, reviewer) {
      assertServerOnly();
      const suggestion = await store.getSuggestion(id);

      if (!suggestion) {
        throw new Error(`Unknown translation suggestion "${id}".`);
      }

      return store.approveSuggestion(id, reviewer, suggestion.baseRevision);
    },

    reject(id, reviewer, reason) {
      assertServerOnly();
      return store.rejectSuggestion(id, reviewer, reason);
    },

    getSuggestion(id) {
      assertServerOnly();
      return store.getSuggestion(id);
    },

    getTranslation(locale, key) {
      assertServerOnly();
      return store.getTranslation(locale, key);
    },

    listAuditTrail() {
      assertServerOnly();
      return store.listAuditTrail();
    },
  };
};
