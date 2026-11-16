/**
 * A minimal browser stand-in: keeps cookies between requests and sends the
 * Origin header the generated CSRF protection expects on state changes.
 */
export class HttpClient {
  readonly #cookies = new Map<string, string>();

  constructor(
    readonly baseUrl: string,
    readonly origin: string,
  ) {}

  get cookieNames() {
    return [...this.#cookies.keys()];
  }

  async request(pathname: string, init: RequestInit = {}) {
    const headers = new Headers(init.headers);
    const method = (init.method ?? "GET").toUpperCase();

    if (this.#cookies.size > 0) {
      headers.set(
        "cookie",
        [...this.#cookies]
          .map(([name, value]) => `${name}=${value}`)
          .join("; "),
      );
    }

    if (method !== "GET" && method !== "HEAD") {
      headers.set("origin", this.origin);
    }

    const response = await fetch(new URL(pathname, this.baseUrl), {
      ...init,
      headers,
      redirect: "manual",
    });

    for (const cookie of response.headers.getSetCookie()) {
      const [pair = "", ...attributes] = cookie.split(";");
      const separator = pair.indexOf("=");
      const name = pair.slice(0, separator).trim();
      const value = pair.slice(separator + 1).trim();
      const expired = attributes.some((attribute) =>
        /^\s*max-age=0\s*$/i.test(attribute),
      );

      if (expired || !value) {
        this.#cookies.delete(name);
      } else {
        this.#cookies.set(name, value);
      }
    }

    return response;
  }

  postJson(pathname: string, body: unknown) {
    return this.request(pathname, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  }
}
