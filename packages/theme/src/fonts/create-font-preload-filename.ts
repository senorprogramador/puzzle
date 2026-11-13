export const createFontPreloadFilename = (family: string): string => {
  const normalizedFamily = family
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!normalizedFamily) {
    throw new TypeError(
      "A valid font family is required to create a preload filename.",
    );
  }

  return `puzzle-font-${normalizedFamily}.woff2`;
};
