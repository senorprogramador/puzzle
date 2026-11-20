import { useCallback, useEffect, useId, useState } from "react";

import {
  GOOGLE_FONT_FAMILIES,
  createGoogleFontUrl,
  type GoogleFontFamily,
} from "@puzzle-ui/theme";
import {
  Autocomplete,
  type AutocompleteOption,
} from "@puzzle-ui/ui";

const fontOptions: readonly AutocompleteOption<GoogleFontFamily>[] =
  GOOGLE_FONT_FAMILIES.map((family) => ({
    value: family,
    label: family,
  }));

const googleFontFamilySet = new Set<string>(GOOGLE_FONT_FAMILIES);
const previewFontRequests = new Map<GoogleFontFamily, Promise<void>>();

const isGoogleFontFamily = (value: string): value is GoogleFontFamily =>
  googleFontFamilySet.has(value);

const loadFontPreview = (family: GoogleFontFamily): Promise<void> => {
  const cachedRequest = previewFontRequests.get(family);

  if (cachedRequest) return cachedRequest;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = createGoogleFontUrl({
    family,
    weights: [400],
    display: "swap",
  });
  link.dataset.themeStudioFontPreview = family;

  const request = new Promise<void>((resolve, reject) => {
    link.addEventListener("load", () => resolve(), { once: true });
    link.addEventListener(
      "error",
      () => reject(new Error(`Unable to load the ${family} font preview.`)),
      { once: true },
    );
    document.head.append(link);
  }).catch((error: unknown) => {
    link.remove();
    previewFontRequests.delete(family);
    throw error;
  });

  previewFontRequests.set(family, request);
  return request;
};

type GoogleFontPickerProps = {
  value?: GoogleFontFamily;
  onChange: (value: GoogleFontFamily | undefined) => void;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
};

const GoogleFontPicker = ({
  value,
  onChange,
  label,
  description,
  placeholder = "Search Google Fonts",
  disabled = false,
  clearable = true,
}: GoogleFontPickerProps) => {
  const [open, setOpen] = useState(false);
  const [loadedFamilies, setLoadedFamilies] = useState<
    ReadonlySet<GoogleFontFamily>
  >(() => new Set());
  const [previewUnavailable, setPreviewUnavailable] = useState(false);
  const listboxClass = `theme-studio-google-font-picker-${useId().replace(
    /[^a-zA-Z0-9_-]/g,
    "",
  )}`;

  useEffect(() => {
    if (!open || typeof window === "undefined") return;

    let observer: IntersectionObserver | undefined;
    let frame = 0;

    frame = window.requestAnimationFrame(() => {
      const listboxes = document.querySelectorAll<HTMLElement>(
        `.${listboxClass}`,
      );
      const listbox = [...listboxes].find((element) =>
        element.querySelector("[data-google-font-preview]"),
      );

      if (!listbox) return;

      if (typeof window.IntersectionObserver !== "function") {
        setPreviewUnavailable(true);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;

            observer?.unobserve(entry.target);
            const familyName = entry.target.getAttribute(
              "data-google-font-preview",
            );

            if (!familyName || !isGoogleFontFamily(familyName)) continue;

            void loadFontPreview(familyName)
              .then(() => {
                setLoadedFamilies((previous) => {
                  if (previous.has(familyName)) return previous;
                  return new Set([...previous, familyName]);
                });
              })
              .catch(() => {
                setPreviewUnavailable(true);
              });
          }
        },
        {
          root: listbox,
          rootMargin: "40px 0px",
          threshold: 0,
        },
      );

      listbox
        .querySelectorAll("[data-google-font-preview]")
        .forEach((option) => observer?.observe(option));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [open, listboxClass]);

  const renderOption = useCallback(
    (option: AutocompleteOption<GoogleFontFamily>) => {
      const loaded = loadedFamilies.has(option.value);

      return (
        <span
          className="theme-studio__font-option"
          data-google-font-preview={option.value}
          data-font-loaded={loaded || undefined}
          style={{
            fontFamily: `"${option.value}", var(--puzzle-font-family-body), sans-serif`,
          }}
        >
          <span>{option.label}</span>
          {loaded ? (
            <span className="theme-studio__font-option-badge">Aa</span>
          ) : null}
        </span>
      );
    },
    [loadedFamilies],
  );

  return (
    <div className="theme-studio__font-picker">
      <Autocomplete
        label={label}
        description={description}
        options={fontOptions}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        clearable={clearable}
        open={open}
        onOpenChange={setOpen}
        openOnFocus
        autoHighlight
        maxOptions={100}
        menuMaxHeight="20rem"
        menuClassName={`theme-studio-google-font-picker__listbox ${listboxClass}`}
        renderOption={renderOption}
      />
      {previewUnavailable ? (
        <p className="theme-studio__font-preview-note" role="status">
          Some font previews could not load. All font names remain selectable.
        </p>
      ) : null}
    </div>
  );
};

export { GoogleFontPicker, type GoogleFontPickerProps };
