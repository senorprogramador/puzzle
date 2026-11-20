import IntlMessageFormat from "intl-messageformat";

export interface TranslationSuggestionRequest {
  sourceLocale: string;
  targetLocale: string;
  key: string;
  sourceMessage: string;
  context?: string;
  terminology?: readonly string[];
}

export interface TranslationTerminologyRule {
  /** Source substring that must be present before the target term is required. */
  source: string;
  /** Required, case-insensitive target substring in the suggestion. */
  target: string;
  weight?: number;
}

export interface TranslationQualityCheckInput {
  request: Readonly<TranslationSuggestionRequest>;
  suggestion: string;
}

export interface TranslationQualityCheckOutput {
  /** Quality score from 0 to 100. */
  score: number;
  message?: string;
}

export interface TranslationQualityCheck {
  id: string;
  weight?: number;
  evaluate(
    input: Readonly<TranslationQualityCheckInput>,
  ):
    | number
    | TranslationQualityCheckOutput
    | Promise<number | TranslationQualityCheckOutput>;
}

export interface TranslationQualityOptions {
  terminology?: readonly TranslationTerminologyRule[];
  /** Custom checks receive the request, including its optional context. */
  checks?: readonly TranslationQualityCheck[];
}

export interface TranslationQualityCheckResult {
  id: string;
  score: number;
  weight: number;
  passed: boolean;
  message?: string;
}

export interface TranslationQualityReport {
  /** Weighted mean of all applicable checks, rounded to the nearest integer. */
  score: number;
  checks: readonly TranslationQualityCheckResult[];
}

export interface SuggestTranslationOptions {
  quality?: TranslationQualityOptions;
}

export interface TranslationSuggestionProvider {
  suggest(
    request: Readonly<TranslationSuggestionRequest>,
    signal?: AbortSignal,
  ): Promise<string>;
}

export type TranslationSuggestionAuthorizer = (
  request: Readonly<TranslationSuggestionRequest>,
  signal?: AbortSignal,
) => boolean | Promise<boolean>;

export interface TranslationSuggestion {
  key: string;
  locale: string;
  value: string;
  approved: false;
  quality?: TranslationQualityReport;
}

export type TranslationSuggestionErrorCode =
  | "invalid-source"
  | "invalid-output"
  | "placeholder-mismatch"
  | "provider-failed"
  | "rate-limited"
  | "server-only"
  | "unauthorized"
  | "authorization-failed"
  | "invalid-quality-config"
  | "quality-check-failed"
  | "aborted";

export class TranslationSuggestionError extends Error {
  constructor(
    public readonly code: TranslationSuggestionErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "TranslationSuggestionError";
  }
}

const canonicalize = (locale: string): string => {
  try {
    const [canonical] = Intl.getCanonicalLocales(locale);

    if (!canonical) {
      throw new Error();
    }

    return canonical;
  } catch {
    throw new TranslationSuggestionError(
      "invalid-source",
      `Invalid BCP 47 locale "${locale}".`,
    );
  }
};

const getPlaceholders = (message: string): string[] =>
  [...message.matchAll(/\{\s*([A-Za-z_][\w.-]*)/g)]
    .map((match) => match[1])
    .filter((name): name is string => name !== undefined)
    .sort();

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === "AbortError";

const assertServerOnly = (): void => {
  if (typeof window !== "undefined") {
    throw new TranslationSuggestionError(
      "server-only",
      "Translation providers must only be called from a server environment.",
    );
  }
};

const createQualityReport = async (
  request: Readonly<TranslationSuggestionRequest>,
  suggestion: string,
  options: TranslationQualityOptions,
): Promise<TranslationQualityReport> => {
  const checks: Array<{
    id: string;
    weight: number;
    evaluate: (
      input: Readonly<TranslationQualityCheckInput>,
    ) => number | TranslationQualityCheckOutput | Promise<number | TranslationQualityCheckOutput>;
  }> = [];
  const addCheck = (
    id: string,
    weight: number | undefined,
    evaluate: (input: Readonly<TranslationQualityCheckInput>) =>
      | number
      | TranslationQualityCheckOutput
      | Promise<number | TranslationQualityCheckOutput>,
  ): void => {
    const normalizedWeight = weight ?? 1;

    if (!Number.isFinite(normalizedWeight) || normalizedWeight <= 0) {
      throw new TranslationSuggestionError(
        "invalid-quality-config",
        "Translation quality check weights must be positive finite numbers.",
      );
    }

    if (!id.trim() || checks.some((check) => check.id === id)) {
      throw new TranslationSuggestionError(
        "invalid-quality-config",
        "Translation quality check IDs must be unique and non-empty.",
      );
    }

    checks.push({ id, weight: normalizedWeight, evaluate });
  };

  for (const [index, rule] of (options.terminology ?? []).entries()) {
    if (!rule.source.trim() || !rule.target.trim()) {
      throw new TranslationSuggestionError(
        "invalid-quality-config",
        "Translation terminology rules require source and target terms.",
      );
    }

    const sourceTerm = rule.source.toLocaleLowerCase(request.sourceLocale);
    const targetTerm = rule.target.toLocaleLowerCase(request.targetLocale);

    if (request.sourceMessage.toLocaleLowerCase(request.sourceLocale).includes(sourceTerm)) {
      addCheck(
        `terminology-${index + 1}`,
        rule.weight,
        () =>
          suggestion.toLocaleLowerCase(request.targetLocale).includes(targetTerm)
            ? 100
            : {
                score: 0,
                message: "The required target term is missing from the suggestion.",
              },
      );
    }
  }

  for (const check of options.checks ?? []) {
    addCheck(check.id, check.weight, check.evaluate);
  }

  const input = Object.freeze({ request, suggestion });
  const results = await Promise.all(
    checks.map(async (check): Promise<TranslationQualityCheckResult> => {
      let output: number | TranslationQualityCheckOutput;

      try {
        output = await check.evaluate(input);
      } catch (error) {
        throw new TranslationSuggestionError(
          "quality-check-failed",
          `Translation quality check "${check.id}" failed.`,
          { cause: error },
        );
      }

      const details =
        typeof output === "object" && output !== null ? output : undefined;
      const score = typeof output === "number" ? output : details?.score;

      if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 100) {
        throw new TranslationSuggestionError(
          "quality-check-failed",
          `Translation quality check "${check.id}" returned an invalid score.`,
        );
      }

      return Object.freeze({
        id: check.id,
        score,
        weight: check.weight,
        passed: score === 100,
        ...(details?.message ? { message: details.message } : {}),
      });
    }),
  );
  const totalWeight = checks.reduce((total, check) => total + check.weight, 0);
  const score =
    totalWeight === 0
      ? 100
      : Math.round(
          results.reduce(
            (total, result) => total + result.score * result.weight,
            0,
          ) / totalWeight,
        );

  return Object.freeze({ score, checks: Object.freeze(results) });
};

export const suggestTranslation = async (
  provider: TranslationSuggestionProvider,
  request: TranslationSuggestionRequest,
  signal?: AbortSignal,
  options: SuggestTranslationOptions = {},
): Promise<TranslationSuggestion> => {
  assertServerOnly();

  if (!request.key.trim() || !request.sourceMessage.trim()) {
    throw new TranslationSuggestionError(
      "invalid-source",
      "A translation key and non-empty source message are required.",
    );
  }

  const sourceLocale = canonicalize(request.sourceLocale);
  const targetLocale = canonicalize(request.targetLocale);
  const normalizedRequest = Object.freeze({
    ...request,
    sourceLocale,
    targetLocale,
    terminology: request.terminology
      ? Object.freeze([...request.terminology])
      : undefined,
  });
  const qualityOptions = options.quality;

  if (qualityOptions) {
    const checkIds = new Set<string>();
    for (const [index, rule] of (qualityOptions.terminology ?? []).entries()) {
      if (
        typeof rule.source !== "string" ||
        typeof rule.target !== "string" ||
        !rule.source.trim() ||
        !rule.target.trim() ||
        (rule.weight !== undefined &&
          (!Number.isFinite(rule.weight) || rule.weight <= 0))
      ) {
        throw new TranslationSuggestionError(
          "invalid-quality-config",
          "Translation terminology rules require non-empty terms and positive finite weights.",
        );
      }

      if (
        normalizedRequest.sourceMessage
          .toLocaleLowerCase(sourceLocale)
          .includes(rule.source.toLocaleLowerCase(sourceLocale))
      ) {
        checkIds.add(`terminology-${index + 1}`);
      }
    }

    for (const check of qualityOptions.checks ?? []) {
      const id = check.id;

      if (
        typeof id !== "string" ||
        !id.trim() ||
        checkIds.has(id) ||
        typeof check.evaluate !== "function"
      ) {
        throw new TranslationSuggestionError(
          "invalid-quality-config",
          "Translation quality checks require unique non-empty IDs and an evaluator.",
        );
      }

      checkIds.add(id);

      if (
        check.weight !== undefined &&
        (!Number.isFinite(check.weight) || check.weight <= 0)
      ) {
        throw new TranslationSuggestionError(
          "invalid-quality-config",
          "Translation quality check weights must be positive finite numbers.",
        );
      }
    }
  }

  try {
    new IntlMessageFormat(normalizedRequest.sourceMessage, sourceLocale);
  } catch (error) {
    throw new TranslationSuggestionError(
      "invalid-source",
      `The source message for "${request.key}" has invalid ICU syntax.`,
      { cause: error },
    );
  }

  if (signal?.aborted) {
    throw new TranslationSuggestionError(
      "aborted",
      `Translation suggestion for "${request.key}" was aborted.`,
      { cause: signal.reason },
    );
  }

  let suggestion: string;

  try {
    suggestion = await provider.suggest(normalizedRequest, signal);
  } catch (error) {
    if (error instanceof TranslationSuggestionError) {
      throw error;
    }

    if (signal?.aborted || isAbortError(error)) {
      throw new TranslationSuggestionError(
        "aborted",
        `Translation suggestion for "${request.key}" was aborted.`,
        { cause: error },
      );
    }

    throw new TranslationSuggestionError(
      "provider-failed",
      `The translation provider failed for "${request.key}".`,
      { cause: error },
    );
  }

  if (typeof suggestion !== "string" || !suggestion.trim()) {
    throw new TranslationSuggestionError(
      "invalid-output",
      `The translation provider returned an empty or non-text suggestion for "${request.key}".`,
    );
  }

  try {
    new IntlMessageFormat(suggestion, targetLocale);
  } catch (error) {
    throw new TranslationSuggestionError(
      "invalid-output",
      `The translation provider returned invalid message syntax for "${request.key}".`,
      { cause: error },
    );
  }

  const sourcePlaceholders = getPlaceholders(normalizedRequest.sourceMessage);
  const translatedPlaceholders = getPlaceholders(suggestion);

  if (
    sourcePlaceholders.length !== translatedPlaceholders.length ||
    sourcePlaceholders.some(
      (placeholder, index) => placeholder !== translatedPlaceholders[index],
    )
  ) {
    throw new TranslationSuggestionError(
      "placeholder-mismatch",
      `The translation provider changed placeholders for "${request.key}".`,
    );
  }

  const quality = qualityOptions
    ? await createQualityReport(normalizedRequest, suggestion, qualityOptions)
    : undefined;

  return Object.freeze({
    key: normalizedRequest.key,
    locale: targetLocale,
    value: suggestion,
    approved: false,
    ...(quality ? { quality } : {}),
  });
};

/** Calls authorize for every server-side suggestion and fails closed. */
export const createAuthorizedSuggestionProvider = (
  provider: TranslationSuggestionProvider,
  authorize: TranslationSuggestionAuthorizer,
): TranslationSuggestionProvider => ({
  async suggest(request, signal) {
    assertServerOnly();

    if (signal?.aborted) {
      throw new TranslationSuggestionError(
        "aborted",
        "Translation suggestion authorization was aborted.",
        { cause: signal.reason },
      );
    }

    const authorizedRequest = Object.freeze({
      ...request,
      terminology: request.terminology
        ? Object.freeze([...request.terminology])
        : undefined,
    });
    let authorized: boolean;

    try {
      authorized = await authorize(authorizedRequest, signal);
    } catch (error) {
      if (signal?.aborted || isAbortError(error)) {
        throw new TranslationSuggestionError(
          "aborted",
          "Translation suggestion authorization was aborted.",
          { cause: error },
        );
      }

      throw new TranslationSuggestionError(
        "authorization-failed",
        "Translation suggestion authorization failed.",
      );
    }

    if (signal?.aborted) {
      throw new TranslationSuggestionError(
        "aborted",
        "Translation suggestion authorization was aborted.",
        { cause: signal.reason },
      );
    }

    if (authorized !== true) {
      throw new TranslationSuggestionError(
        "unauthorized",
        "The caller is not authorized to request this translation suggestion.",
      );
    }

    return provider.suggest(authorizedRequest, signal);
  },
});

export interface RateLimitedProviderOptions {
  maxConcurrent?: number;
  minIntervalMs?: number;
}

const abortableDelay = (delay: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(
        new TranslationSuggestionError(
          "aborted",
          "Translation provider request was aborted.",
          { cause: signal.reason },
        ),
      );
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(
        new TranslationSuggestionError(
          "aborted",
          "Translation provider request was aborted.",
          { cause: signal?.reason },
        ),
      );
    };

    timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, delay);
    signal?.addEventListener("abort", onAbort, { once: true });
  });

export const createRateLimitedSuggestionProvider = (
  provider: TranslationSuggestionProvider,
  options: RateLimitedProviderOptions = {},
): TranslationSuggestionProvider => {
  const maxConcurrent = options.maxConcurrent ?? 2;
  const minIntervalMs = options.minIntervalMs ?? 0;

  if (!Number.isInteger(maxConcurrent) || maxConcurrent < 1) {
    throw new Error("maxConcurrent must be a positive integer.");
  }

  if (!Number.isFinite(minIntervalMs) || minIntervalMs < 0) {
    throw new Error("minIntervalMs must be a non-negative finite number.");
  }

  let activeRequests = 0;
  let nextStartAt = 0;

  return {
    async suggest(request, signal) {
      assertServerOnly();

      if (activeRequests >= maxConcurrent) {
        throw new TranslationSuggestionError(
          "rate-limited",
          "The translation provider concurrency limit was reached.",
        );
      }

      activeRequests += 1;
      const startAt = Math.max(Date.now(), nextStartAt);
      nextStartAt = startAt + minIntervalMs;

      try {
        const delay = startAt - Date.now();

        if (delay > 0) {
          await abortableDelay(delay, signal);
        } else if (signal?.aborted) {
          throw new TranslationSuggestionError(
            "aborted",
            "Translation provider request was aborted.",
            { cause: signal.reason },
          );
        }

        return await provider.suggest(request, signal);
      } finally {
        activeRequests -= 1;
      }
    },
  };
};

export {
  createInMemoryTranslationReviewStore,
  createTransactionalTranslationReviewStore,
  createTranslationReviewWorkflow,
  TranslationReviewConflictError,
} from "./review";
export type {
  TransactionalTranslationReviewPersistence,
  TransactionalTranslationReviewTransaction,
  TranslationReviewAuditRecord,
  TranslationReviewRecord,
  TranslationReviewStatus,
  TranslationReviewStore,
  TranslationReviewWorkflow,
  CreateTransactionalTranslationReviewStoreOptions,
  VersionedTranslation,
} from "./review";
