import { PassThrough } from "node:stream";
import { Suspense } from "react";
import {
  renderToPipeableStream,
  renderToStaticMarkup,
} from "react-dom/server";
import { describe, expect, it } from "vitest";

import { createI18n } from "../runtime";
import { createI18nReact } from "../react";

describe("React bindings", () => {
  it("provides request-specific translations and an accessible language control", () => {
    const i18n = createI18n({
      locales: [
        { locale: "en", nativeName: "English" },
        { locale: "nl", nativeName: "Nederlands" },
        { locale: "ar", nativeName: "العربية" },
      ],
      defaultLocale: "en",
      catalogs: {
        en: { greeting: "Hello {name}" },
        nl: { greeting: "Hallo {name}" },
      },
    });
    const { Provider, LocaleSwitcher, useTranslation } =
      createI18nReact(i18n);
    const Greeting = () => (
      <p>{useTranslation().t("greeting", { name: "Ada" })}</p>
    );

    const html = renderToStaticMarkup(
      <Provider locale="nl">
        <Greeting />
        <span id="language-help">Choose a language.</span>
        <LocaleSwitcher
          id="language-select"
          name="language"
          aria-describedby="language-help"
          onLocaleChange={() => undefined}
        />
      </Provider>,
    );

    expect(html).toContain("Hallo Ada");
    expect(html).toContain('for="language-select"');
    expect(html).toContain('id="language-select"');
    expect(html).toContain('aria-describedby="language-help"');
    expect(html).toContain('lang="nl"');
    expect(html).toContain("Nederlands");
    expect(html).toContain(
      '<option dir="rtl" lang="ar" value="ar">العربية</option>',
    );
  });

  it("throws when hooks are used without their provider", () => {
    const i18n = createI18n({
      locales: [{ locale: "en" }],
      defaultLocale: "en",
      catalogs: { en: { title: "Title" } },
    });
    const { useTranslation } = createI18nReact(i18n);
    const Outside = () => <>{useTranslation().t("title")}</>;

    expect(() => renderToStaticMarkup(<Outside />)).toThrow(/within the matching/);
  });

  it("renders rich ICU tags through typed React components", () => {
    const i18n = createI18n({
      locales: [{ locale: "en" }],
      defaultLocale: "en",
      catalogs: {
        en: {
          announcement: "Welcome, <strong>{name}</strong>!",
        },
      },
    });
    const { Provider, useRichTranslation } = createI18nReact(i18n);
    const Announcement = () => {
      const rich = useRichTranslation();

      return (
        <p>
          {rich("announcement", {
            name: "Ada",
            strong: (children) => <strong>{children}</strong>,
          })}
        </p>
      );
    };

    expect(
      renderToStaticMarkup(
        <Provider locale="en">
          <Announcement />
        </Provider>,
      ),
    ).toContain("<p>Welcome, <strong>Ada</strong>!</p>");
  });

  it("renders typed translation and rich-text components without injecting HTML", () => {
    const i18n = createI18n({
      locales: [{ locale: "en" }],
      defaultLocale: "en",
      catalogs: {
        en: {
          greeting: "Hello {name}",
          announcement: "Welcome, <strong>{name}</strong>!",
          echoed: "You said: {value}",
        },
      },
    });
    const { Provider, Translation, RichTranslation } = createI18nReact(i18n);
    const html = renderToStaticMarkup(
      <Provider locale="en">
        <p>
          <Translation id="greeting" values={{ name: "Ada" }} />
        </p>
        <p>
          <RichTranslation
            id="announcement"
            values={{
              name: "Ada",
              strong: (children) => <strong>{children}</strong>,
            }}
          />
        </p>
        <Translation
          id="echoed"
          values={{ value: "<img src=x onerror=alert(1)>" }}
        />
      </Provider>,
    );

    expect(html).toContain("<p>Hello Ada</p>");
    expect(html).toContain("<p>Welcome, <strong>Ada</strong>!</p>");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).not.toContain("<img");
  });

  it("renders Intl formatting components and supports render-prop composition", () => {
    const i18n = createI18n({
      locales: [{ locale: "en-US" }],
      defaultLocale: "en-US",
      catalogs: { "en-US": { title: "Title" } },
    });
    const {
      Provider,
      FormattedNumber,
      FormattedCurrency,
      FormattedDate,
      FormattedRelativeTime,
      FormattedList,
    } = createI18nReact(i18n);
    const html = renderToStaticMarkup(
      <Provider locale="en-US">
        <div>
          <FormattedNumber
            value={1234.5}
            options={{ maximumFractionDigits: 0 }}
          />
          <FormattedCurrency value={12.5} currency="USD" />
          <FormattedDate
            value={Date.UTC(2020, 0, 2)}
            options={{
              day: "numeric",
              month: "long",
              timeZone: "UTC",
              year: "numeric",
            }}
          />
          <FormattedRelativeTime
            value={-1}
            unit="day"
            options={{ numeric: "auto" }}
          />
          <FormattedList value={["A", "B"]} />
          <FormattedNumber value={4}>
            {(formatted) => <strong>{formatted}</strong>}
          </FormattedNumber>
        </div>
      </Provider>,
    );

    expect(html).toContain("1,235");
    expect(html).toContain("$12.50");
    expect(html).toContain("January 2, 2020");
    expect(html).toContain("yesterday");
    expect(html).toContain("A and B");
    expect(html).toContain("<strong>4</strong>");
  });

  it("exposes namespace loading state to React consumers", () => {
    const i18n = createI18n({
      locales: [{ locale: "en" }],
      defaultLocale: "en",
      catalogs: { en: { dashboard: { title: "" } } },
      namespaceLoader: {
        async load() {
          return { title: "Dashboard" };
        },
      },
    });
    const { Provider, useNamespace } = createI18nReact(i18n);
    const NamespaceStatus = () => {
      const namespace = useNamespace("dashboard");
      return <output>{namespace.status}</output>;
    };

    expect(
      renderToStaticMarkup(
        <Provider locale="en">
          <NamespaceStatus />
        </Provider>,
      ),
    ).toContain("<output>loading</output>");
  });

  it("provides locale attributes and memoized Intl formatters", () => {
    const i18n = createI18n({
      locales: [
        { locale: "en", direction: "ltr" },
        { locale: "ar" },
      ],
      defaultLocale: "en",
      catalogs: { en: { title: "Title" }, ar: { title: "العنوان" } },
    });
    const { Provider, useLocaleAttributes, useNumberFormat, useListFormat } =
      createI18nReact(i18n);
    const Formatted = () => {
      const { lang, dir } = useLocaleAttributes();
      const number = useNumberFormat({ maximumFractionDigits: 0 });
      const list = useListFormat();

      return (
        <section lang={lang} dir={dir}>
          {number.format(1234.5)} {list.format(["A", "B"])}
        </section>
      );
    };

    expect(
      renderToStaticMarkup(
        <Provider locale="en">
          <Formatted />
        </Provider>,
      ),
    ).toContain('<section lang="en" dir="ltr">1,235 A and B</section>');
    expect(
      renderToStaticMarkup(
        <Provider locale="ar">
          <Formatted />
        </Provider>,
      ),
    ).toContain('lang="ar" dir="rtl"');
  });

  it("keeps nested providers scoped to their own render tree", () => {
    const i18n = createI18n({
    locales: [{ locale: "en" }, { locale: "nl" }],
    defaultLocale: "en",
    catalogs: {
      en: { greeting: "Hello" },
      nl: { greeting: "Hallo" },
    },
    });
    const { Provider, useLocale, useTranslation } = createI18nReact(i18n);
    const Greeting = () => (
      <p>
        {useLocale()}: {useTranslation().t("greeting")}
      </p>
    );
    const html = renderToStaticMarkup(
      <Provider locale="en">
        <Greeting />
        <Provider locale="nl">
          <Greeting />
        </Provider>
        <Greeting />
      </Provider>
    );

    expect(html).toBe("<p>en: Hello</p><p>nl: Hallo</p><p>en: Hello</p>");
  });

  it("isolates locale translators across parallel streaming server renders", async () => {
    const i18n = createI18n({
      locales: [{ locale: "en" }, { locale: "nl" }],
      defaultLocale: "en",
      catalogs: {
        en: { greeting: "Hello {name}" },
        nl: { greeting: "Hallo {name}" },
      },
    });
    const { Provider, useTranslation } = createI18nReact(i18n);
    const requests = [
      { id: "en-ada", locale: "en", name: "Ada" },
      { id: "nl-bram", locale: "nl", name: "Bram" },
      { id: "en-grace", locale: "en", name: "Grace" },
      { id: "nl-noor", locale: "nl", name: "Noor" },
    ] as const;
    const gates = new Map<
      string,
      { promise: Promise<void>; resolve(): void }
    >();
    const completed = new Set<string>();

    for (const { id } of requests) {
      let resolve!: () => void;
      const promise = new Promise<void>((done) => {
        resolve = done;
      });
      gates.set(id, { promise, resolve });
    }

    const DelayedGreeting = ({ id, name }: { id: string; name: string }) => {
      const translator = useTranslation();

      if (!completed.has(id)) {
        throw gates.get(id)?.promise;
      }

      return <p>{translator.t("greeting", { name })}</p>;
    };
    const renderForRequest = (
      request: (typeof requests)[number],
    ): { shellReady: Promise<void>; result: Promise<string> } => {
      let resolveShell!: () => void;
      let rejectShell!: (error: unknown) => void;
      const shellReady = new Promise<void>((resolve, reject) => {
        resolveShell = resolve;
        rejectShell = reject;
      });
      const result = new Promise<string>((resolve, reject) => {
        const output = new PassThrough();
        let markup = "";
        output.setEncoding("utf8");
        output.on("data", (chunk: string) => {
          markup += chunk;
        });
        output.on("end", () => resolve(markup));
        output.on("error", reject);

        let stream: ReturnType<typeof renderToPipeableStream> | undefined;
        let allReady = false;
        let didPipe = false;
        const pipeWhenReady = () => {
          if (allReady && stream && !didPipe) {
            didPipe = true;
            stream.pipe(output);
          }
        };

        stream = renderToPipeableStream(
          <Provider locale={request.locale}>
            <Suspense fallback={<i>Loading</i>}>
              <DelayedGreeting id={request.id} name={request.name} />
            </Suspense>
          </Provider>,
          {
            onAllReady() {
              allReady = true;
              pipeWhenReady();
            },
            onError: reject,
            onShellError(error) {
              reject(error);
              rejectShell(error);
            },
            onShellReady: resolveShell,
          },
        );
        pipeWhenReady();
      });

      return { shellReady, result };
    };
    const renders = requests.map(renderForRequest);

    await Promise.all(renders.map(({ shellReady }) => shellReady));

    for (const request of [...requests].reverse()) {
      completed.add(request.id);
      gates.get(request.id)?.resolve();
    }

    const results = await Promise.all(renders.map(({ result }) => result));

    expect(results[0]).toContain("<p>Hello Ada</p>");
    expect(results[1]).toContain("<p>Hallo Bram</p>");
    expect(results[2]).toContain("<p>Hello Grace</p>");
    expect(results[3]).toContain("<p>Hallo Noor</p>");
  });
});
