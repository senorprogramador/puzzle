export type AuthReadinessCheck = {
  readonly name: string;
  readonly check: () => boolean | void | Promise<boolean | void>;
};

export type AuthReadinessOptions = {
  readonly checks: readonly AuthReadinessCheck[];
};

export type AuthReadinessResult = {
  readonly status: "ready" | "unavailable";
  readonly checks: readonly {
    readonly name: string;
    readonly status: "ok" | "unavailable";
  }[];
};

const isValidCheckName = (value: string): boolean =>
  /^[a-z][a-z0-9_-]{0,63}$/.test(value);

const responseHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  Pragma: "no-cache",
};

export const createAuthReadinessHandler = (options: AuthReadinessOptions) => {
  if (!Array.isArray(options.checks) || options.checks.length === 0) {
    throw new TypeError(
      "At least one authentication readiness check is required.",
    );
  }

  const names = new Set<string>();

  for (const check of options.checks) {
    if (
      !check ||
      typeof check.name !== "string" ||
      !isValidCheckName(check.name) ||
      typeof check.check !== "function"
    ) {
      throw new TypeError(
        "Every readiness check requires a valid name and check function.",
      );
    }

    if (names.has(check.name)) {
      throw new TypeError(`Duplicate readiness check name: ${check.name}.`);
    }

    names.add(check.name);
  }

  return async (request: Request): Promise<Response> => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(null, {
        status: 405,
        headers: {
          ...responseHeaders,
          Allow: "GET, HEAD",
        },
      });
    }

    const results = await Promise.all(
      options.checks.map(async (check) => {
        try {
          const result = await check.check();

          return {
            name: check.name,
            status: result === false ? "unavailable" : "ok",
          } as const;
        } catch {
          return {
            name: check.name,
            status: "unavailable",
          } as const;
        }
      }),
    );

    const ready = results.every((result) => result.status === "ok");

    const payload: AuthReadinessResult = {
      status: ready ? "ready" : "unavailable",
      checks: results,
    };

    return new Response(
      request.method === "HEAD" ? null : JSON.stringify(payload),
      {
        status: ready ? 200 : 503,
        headers: responseHeaders,
      },
    );
  };
};
