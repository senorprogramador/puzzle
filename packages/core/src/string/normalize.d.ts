/** Normalizes a search string by removing diacritics and converting to lowercase */
export declare const normalizeSearchString: (value: string) => string;
/** Removes unsafe characters from a string */
export declare const withSafeCharacters: (input: string) => string;
/** Escapes special characters in a string for use in CSS strings */
export declare const escapeCssString: (value: string) => string;
