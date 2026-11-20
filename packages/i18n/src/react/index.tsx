"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

import type { ComponentType, ReactNode } from "react";
import type {
  I18nInstance,
  MessageAtPath,
  MessageCatalog,
  MessageKeys,
  MessageValue,
  MessageValues,
  RichMessageValues,
  RichTranslationArgs,
  Translator,
} from "../runtime";
import type {
  DateTimeFormatOptions,
  ListFormatOptions,
  NumberFormatOptions,
  RelativeTimeFormatOptions,
} from "../format";

export interface I18nProviderProps {
  locale: string;
  children: ReactNode;
}

export interface LocaleSwitcherProps {
  label?: string;
  onLocaleChange(locale: string): void;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  selectClassName?: string;
  "aria-describedby"?: string;
}

type TrimMessageVariable<Name extends string> = Name extends
  | ` ${infer Rest}`
  | `\n${infer Rest}`
  | `\t${infer Rest}`
  ? TrimMessageVariable<Rest>
  : Name extends `${infer Rest} `
    | `${infer Rest}\n`
    | `${infer Rest}\t`
    ? TrimMessageVariable<Rest>
    : Name;

type ValidMessageVariable<Name extends string> = Name extends
  | ""
  | `#${string}`
  | `${string} ${string}`
  ? never
  : Name;

type MessageVariables<Message extends string> =
  Message extends `${string}{${infer Token}}${infer Rest}`
    ? ValidMessageVariable<
        Token extends `${infer Name},${string}`
          ? TrimMessageVariable<Name>
          : TrimMessageVariable<Token>
      > |
        MessageVariables<Rest>
    : never;

type TranslationValuesProps<Message> = [Message] extends [string]
  ? [MessageVariables<Extract<Message, string>>] extends [never]
    ? { values?: never }
    : {
        values: Readonly<
          Record<
            MessageVariables<Extract<Message, string>>,
            MessageValue
          >
        >;
      }
  : { values?: never };

type RichTranslationValuesProps<Message> = [Message] extends [string]
  ? [MessageVariables<Extract<Message, string>>] extends [never]
    ? { values?: RichMessageValues<ReactNode> }
    : {
        values: RichTranslationArgs<Message, ReactNode> extends [
          infer Values,
        ]
          ? Values
          : never;
      }
  : { values?: never };

export type TranslationComponentProps<
  Catalog extends MessageCatalog,
  Key extends MessageKeys<Catalog>,
> = {
  id: Key;
  children?: (translation: string) => ReactNode;
} & TranslationValuesProps<MessageAtPath<Catalog, Key>>;

export type RichTranslationComponentProps<
  Catalog extends MessageCatalog,
  Key extends MessageKeys<Catalog>,
> = {
  id: Key;
  children?: (translation: ReactNode) => ReactNode;
} & RichTranslationValuesProps<MessageAtPath<Catalog, Key>>;

export interface FormattedNumberProps {
  value: number;
  options?: NumberFormatOptions;
  children?: (formatted: string) => ReactNode;
}

export interface FormattedCurrencyProps {
  value: number;
  currency: string;
  options?: Omit<NumberFormatOptions, "style" | "currency">;
  children?: (formatted: string) => ReactNode;
}

export interface FormattedDateProps {
  value: Date | number;
  options?: DateTimeFormatOptions;
  children?: (formatted: string) => ReactNode;
}

export interface FormattedRelativeTimeProps {
  value: number;
  unit: Intl.RelativeTimeFormatUnit;
  options?: RelativeTimeFormatOptions;
  children?: (formatted: string) => ReactNode;
}

export interface FormattedListProps {
  value: readonly string[];
  options?: ListFormatOptions;
  children?: (formatted: string) => ReactNode;
}

interface I18nContextValue<Catalog extends MessageCatalog> {
  locale: string;
  translator: Translator<Catalog>;
}

export interface I18nReactBindings<Catalog extends MessageCatalog> {
  Provider: ComponentType<I18nProviderProps>;
  LocaleSwitcher: ComponentType<LocaleSwitcherProps>;
  Translation<Key extends MessageKeys<Catalog>>(
    props: TranslationComponentProps<Catalog, Key>,
  ): ReactNode;
  RichTranslation<Key extends MessageKeys<Catalog>>(
    props: RichTranslationComponentProps<Catalog, Key>,
  ): ReactNode;
  FormattedNumber: ComponentType<FormattedNumberProps>;
  FormattedCurrency: ComponentType<FormattedCurrencyProps>;
  FormattedDate: ComponentType<FormattedDateProps>;
  FormattedRelativeTime: ComponentType<FormattedRelativeTimeProps>;
  FormattedList: ComponentType<FormattedListProps>;
  useLocale(): string;
  useLocaleAttributes(): { lang: string; dir: "ltr" | "rtl" };
  useTranslation(): Translator<Catalog>;
  useRichTranslation(): ReactRichTranslator<Catalog>;
  useNamespace(namespace: string): NamespaceLoadState;
  useNumberFormat(options?: NumberFormatOptions): Intl.NumberFormat;
  useCurrencyFormat(
    currency: string,
    options?: Omit<NumberFormatOptions, "style" | "currency">,
  ): Intl.NumberFormat;
  useDateFormat(options?: DateTimeFormatOptions): Intl.DateTimeFormat;
  useRelativeTimeFormat(
    options?: RelativeTimeFormatOptions,
  ): Intl.RelativeTimeFormat;
  useListFormat(options?: ListFormatOptions): Intl.ListFormat;
}

export type ReactRichTranslator<Catalog extends MessageCatalog> = <
  Key extends MessageKeys<Catalog>,
>(
  key: Key,
  ...args: RichTranslationArgs<MessageAtPath<Catalog, Key>, ReactNode>
) => ReactNode;

export type NamespaceLoadState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; error: unknown };

const rtlScripts = new Set([
  "adlm",
  "aran",
  "arab",
  "hebr",
  "mand",
  "mend",
  "nkoo",
  "phli",
  "phlp",
  "prti",
  "rohg",
  "samr",
  "syrc",
  "thaa",
]);
const rtlLanguages = new Set([
  "arc",
  "ar",
  "ckb",
  "dv",
  "fa",
  "he",
  "nqo",
  "ps",
  "sd",
  "syr",
  "ug",
  "ur",
  "yi",
]);

const getLocaleDirection = (
  locale: string,
  configuredDirection?: "ltr" | "rtl",
): "ltr" | "rtl" => {
  if (configuredDirection) {
    return configuredDirection;
  }

  const localeInfo =
    typeof Intl.Locale === "function"
      ? (new Intl.Locale(locale) as Intl.Locale & {
          textInfo?: { direction?: string };
        })
      : undefined;
  const textInfoDirection = localeInfo?.textInfo?.direction;

  if (textInfoDirection === "rtl" || textInfoDirection === "ltr") {
    return textInfoDirection;
  }

  const subtags = locale.split("-");
  const script =
    localeInfo?.script ??
    subtags.slice(1).find((subtag) => /^[A-Za-z]{4}$/.test(subtag));

  if (script) {
    return rtlScripts.has(script.toLowerCase()) ? "rtl" : "ltr";
  }

  const language = localeInfo?.language ?? subtags[0] ?? "";
  return rtlLanguages.has(language.toLowerCase()) ? "rtl" : "ltr";
};

interface NamespaceLoadSnapshot {
  key: string;
  state: NamespaceLoadState;
}

export const createI18nReact = <Catalog extends MessageCatalog>(
  instance: I18nInstance<Catalog>,
): I18nReactBindings<Catalog> => {
  const Context = createContext<I18nContextValue<Catalog> | null>(null);

  const useI18n = (): I18nContextValue<Catalog> => {
    const context = useContext(Context);

    if (!context) {
      throw new Error(
        "Puzzle I18n hooks must be used within the matching I18n Provider.",
      );
    }

    return context;
  };

  const Provider = ({ locale, children }: I18nProviderProps) => {
    const translator = useMemo(
      () => instance.createTranslator(locale),
      [instance, locale],
    );
    const value = useMemo(
      () => ({ locale: translator.locale, translator }),
      [translator],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const LocaleSwitcher = ({
    label = "Language",
    onLocaleChange,
    className,
    id,
    name,
    disabled,
    required,
    selectClassName,
    "aria-describedby": ariaDescribedBy,
  }: LocaleSwitcherProps) => {
    const { locale } = useI18n();
    const generatedId = useId();
    const selectId = id?.trim() ? id : generatedId;
    const direction = getLocaleDirection(
      locale,
      instance.registry.get(locale)?.direction,
    );

    return (
      <label
        className={className}
        dir={direction}
        htmlFor={selectId}
        lang={locale}
      >
        {label}
        <select
          aria-describedby={ariaDescribedBy}
          className={selectClassName}
          dir={direction}
          disabled={disabled}
          id={selectId}
          lang={locale}
          name={name}
          required={required}
          value={locale}
          onChange={(event) => onLocaleChange(event.currentTarget.value)}
        >
          {instance.registry.locales.map((definition) => (
            <option
              key={definition.locale}
              dir={getLocaleDirection(definition.locale, definition.direction)}
              lang={definition.locale}
              value={definition.locale}
            >
              {definition.nativeName ?? definition.name ?? definition.locale}
            </option>
          ))}
        </select>
      </label>
    );
  };

  const Translation = <Key extends MessageKeys<Catalog>>({
    id,
    values,
    children,
  }: TranslationComponentProps<Catalog, Key>) => {
    const { translator } = useI18n();
    const translate = translator.t as unknown as (
      key: Key,
      values?: MessageValues,
    ) => string;
    const text = translate(id, values);

    return children ? children(text) : text;
  };

  const RichTranslation = <Key extends MessageKeys<Catalog>>({
    id,
    values,
    children,
  }: RichTranslationComponentProps<Catalog, Key>) => {
    const { translator } = useI18n();
    const translate = translator.rich as unknown as (
      key: Key,
      values?: RichMessageValues<ReactNode>,
    ) => ReactNode;
    const result = translate(
      id,
      values as RichMessageValues<ReactNode> | undefined,
    );

    return children ? children(result) : result;
  };

  const FormattedNumber = ({
    value,
    options,
    children,
  }: FormattedNumberProps) => {
    const formatted = useNumberFormat(options).format(value);
    return children ? children(formatted) : formatted;
  };

  const FormattedCurrency = ({
    value,
    currency,
    options,
    children,
  }: FormattedCurrencyProps) => {
    const formatted = useCurrencyFormat(currency, options).format(value);
    return children ? children(formatted) : formatted;
  };

  const FormattedDate = ({
    value,
    options,
    children,
  }: FormattedDateProps) => {
    const formatted = useDateFormat(options).format(value);
    return children ? children(formatted) : formatted;
  };

  const FormattedRelativeTime = ({
    value,
    unit,
    options,
    children,
  }: FormattedRelativeTimeProps) => {
    const formatted = useRelativeTimeFormat(options).format(value, unit);
    return children ? children(formatted) : formatted;
  };

  const FormattedList = ({
    value,
    options,
    children,
  }: FormattedListProps) => {
    const formatted = useListFormat(options).format(value);
    return children ? children(formatted) : formatted;
  };

  const useNamespace = (namespace: string): NamespaceLoadState => {
    const { locale } = useI18n();
    const key = `${locale}\u0000${namespace}`;
    const [snapshot, setSnapshot] = useState<NamespaceLoadSnapshot>(() => ({
      key,
      state: instance.isNamespaceLoaded(locale, namespace)
        ? { status: "ready" }
        : { status: "loading" },
    }));

    useEffect(() => {
      if (instance.isNamespaceLoaded(locale, namespace)) {
        setSnapshot({ key, state: { status: "ready" } });
        return;
      }

      const controller = new AbortController();
      let active = true;
      setSnapshot({ key, state: { status: "loading" } });

      void instance.loadNamespace(locale, namespace, {
        signal: controller.signal,
      }).then(
        () => {
          if (active) {
            setSnapshot({ key, state: { status: "ready" } });
          }
        },
        (error: unknown) => {
          if (active) {
            setSnapshot({ key, state: { status: "error", error } });
          }
        },
      );

      return () => {
        active = false;
        controller.abort();
      };
    }, [instance, key, locale, namespace]);

    if (snapshot.key !== key) {
      return instance.isNamespaceLoaded(locale, namespace)
        ? { status: "ready" }
        : { status: "loading" };
    }

    return snapshot.state;
  };

  const useRichTranslation = (): ReactRichTranslator<Catalog> => {
    const translator = useI18n().translator;

    return useMemo(
      () =>
        <Key extends MessageKeys<Catalog>>(
          key: Key,
          ...args: RichTranslationArgs<MessageAtPath<Catalog, Key>, ReactNode>
        ): ReactNode => translator.rich<Key, ReactNode>(key, ...args),
      [translator],
    );
  };

  const useLocaleAttributes = () => {
    const locale = useI18n().locale;

    return useMemo(
      () => ({
        lang: locale,
        dir: getLocaleDirection(
          locale,
          instance.registry.get(locale)?.direction,
        ),
      }),
      [instance, locale],
    );
  };

  const useNumberFormat = (options?: NumberFormatOptions) => {
    const locale = useI18n().locale;
    return useMemo(() => new Intl.NumberFormat(locale, options), [locale, options]);
  };

  const useCurrencyFormat = (
    currency: string,
    options?: Omit<NumberFormatOptions, "style" | "currency">,
  ) => {
    const locale = useI18n().locale;
    return useMemo(
      () => new Intl.NumberFormat(locale, { ...options, style: "currency", currency }),
      [currency, locale, options],
    );
  };

  const useDateFormat = (options?: DateTimeFormatOptions) => {
    const locale = useI18n().locale;
    return useMemo(() => new Intl.DateTimeFormat(locale, options), [locale, options]);
  };

  const useRelativeTimeFormat = (
    options?: RelativeTimeFormatOptions,
  ) => {
    const locale = useI18n().locale;
    return useMemo(
      () => new Intl.RelativeTimeFormat(locale, options),
      [locale, options],
    );
  };

  const useListFormat = (options?: ListFormatOptions) => {
    const locale = useI18n().locale;
    return useMemo(() => new Intl.ListFormat(locale, options), [locale, options]);
  };

  return Object.freeze({
    Provider,
    LocaleSwitcher,
    Translation,
    RichTranslation,
    FormattedNumber,
    FormattedCurrency,
    FormattedDate,
    FormattedRelativeTime,
    FormattedList,
    useLocale: () => useI18n().locale,
    useLocaleAttributes,
    useTranslation: () => useI18n().translator,
    useRichTranslation,
    useNamespace,
    useNumberFormat,
    useCurrencyFormat,
    useDateFormat,
    useRelativeTimeFormat,
    useListFormat,
  });
};
