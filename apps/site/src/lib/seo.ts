export const SITE_URL = "https://puzzle-ui.com";

export const getCanonicalUrl = (path: string) =>
  new URL(path, SITE_URL).toString();
