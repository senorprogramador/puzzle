export interface DocumentMetadata {
  title: string;
  description: string;
  locale: string;
  direction: "ltr" | "rtl";
}

interface MetadataMatch {
  data: unknown;
  handle: unknown;
}

interface MetadataHandle {
  metadata?: (data: unknown) => Partial<DocumentMetadata>;
}

export const getDocumentMetadata = (
  matches: readonly MetadataMatch[],
): DocumentMetadata => {
  let metadata: DocumentMetadata = {
    title: "Puzzle multilingual workspace",
    description: "A React Router 7 localized data-router fixture.",
    locale: "en",
    direction: "ltr",
  };

  for (const match of matches) {
    const handle = match.handle as MetadataHandle | undefined;
    const routeMetadata = handle?.metadata?.(match.data);
    if (routeMetadata) metadata = { ...metadata, ...routeMetadata };
  }

  return metadata;
};
