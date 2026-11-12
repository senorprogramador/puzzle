const LOCAL_FONT_STYLESHEET_NAME = "puzzle-fonts.css";

export const createLocalFontStylesheetUrl = (basePath = "/fonts"): string => {
  if (
    typeof basePath !== "string" ||
    !basePath.startsWith("/") ||
    basePath.startsWith("//") ||
    /[\u0000-\u0020\u007f?#\\]/.test(basePath)
  ) {
    throw new TypeError(
      'fontBasePath must be a root-relative URL path, such as "/fonts".',
    );
  }

  const segments = basePath.split("/").filter(Boolean);

  if (segments.some((segment) => segment === "." || segment === "..")) {
    throw new TypeError(
      "fontBasePath must not contain relative path segments.",
    );
  }

  const normalizedBasePath = basePath.replace(/\/+$/, "");

  return `${normalizedBasePath}/${LOCAL_FONT_STYLESHEET_NAME}`;
};
