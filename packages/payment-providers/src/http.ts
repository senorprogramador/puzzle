import {
  PaymentError,
  type NormalizedPaymentError,
} from "@puzzle-ui/commerce";

export type ProviderFetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export class ProviderHttpError extends Error {
  readonly status: number;
  readonly providerCode?: string;
  readonly details?: Readonly<Record<string, string>>;

  constructor(
    status: number,
    message: string,
    providerCode?: string,
    details?: Readonly<Record<string, string>>,
  ) {
    super(message);
    this.name = "ProviderHttpError";
    this.status = status;
    this.providerCode = providerCode;
    this.details = details;
  }
}

export const createProviderError = (
  error: unknown,
  fallback: NormalizedPaymentError["code"] = "unknown",
): PaymentError => {
  if (error instanceof PaymentError) return error;
  if (error instanceof ProviderHttpError) {
    return new PaymentError({
      code:
        error.status === 401 || error.status === 403
          ? "authentication"
          : error.status === 408 || error.status === 429 || error.status >= 500
            ? "network"
            : fallback,
      message: error.message,
      providerCode: error.providerCode,
      details: error.details,
      retryable: error.status === 408 || error.status === 429 || error.status >= 500,
    });
  }
  return new PaymentError({
    code: fallback,
    message: error instanceof Error ? error.message : "Payment provider request failed.",
    retryable: fallback === "network" || fallback === "timeout",
  });
};

const readJson = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

const record = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};

export const requestJson = async (
  fetcher: ProviderFetcher,
  url: string,
  init: RequestInit,
): Promise<Record<string, unknown>> => {
  const response = await fetcher(url, init);
  const body = record(await readJson(response));
  if (!response.ok) {
    const error = record(body.error);
    const details: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") details[key] = value;
    }
    throw new ProviderHttpError(
      response.status,
      typeof error.message === "string"
        ? error.message
        : typeof body.message === "string"
          ? body.message
          : `Payment provider request failed with status ${response.status}.`,
      typeof error.code === "string"
        ? error.code
        : typeof body.code === "string"
          ? body.code
          : undefined,
      details,
    );
  }
  return body;
};

export const jsonHeaders = (headers: HeadersInit = {}): HeadersInit => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  ...headers,
});

export const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value.length > 0 ? value : undefined;

export const requireString = (value: unknown, label: string): string => {
  const result = asString(value);
  if (!result) throw new ProviderHttpError(502, `Provider response omitted ${label}.`);
  return result;
};

export const now = () => new Date();

export const encodeBasicAuth = (username: string, password = "") =>
  `Basic ${btoa(`${username}:${password}`)}`;
