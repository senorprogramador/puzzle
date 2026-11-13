const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isValidContext = (context) => {
  if (typeof context === "string") {
    return context.length > 0;
  }

  if (Array.isArray(context)) {
    return (
      context.length > 0 && context.every((entry) => isValidContext(entry))
    );
  }

  return isRecord(context);
};

/**
 * Validates the minimum JSON-LD structure required by the Schema.org
 * generator. Invalid or incomplete source data must fail before generation.
 *
 * @param {unknown} document
 * @returns {asserts document is Record<string, unknown>}
 */
export const assertValidSchemaSource = (document) => {
  if (!isRecord(document)) {
    throw new TypeError("Schema.org source must be a JSON object.");
  }

  if (!isValidContext(document["@context"])) {
    throw new TypeError("Schema.org source does not contain a valid @context.");
  }

  if (!Array.isArray(document["@graph"])) {
    throw new TypeError(
      "Schema.org source does not contain a valid @graph array.",
    );
  }

  if (document["@graph"].length === 0) {
    throw new TypeError("Schema.org source contains an empty @graph.");
  }

  const seenIds = new Set();

  for (let index = 0; index < document["@graph"].length; index += 1) {
    const node = document["@graph"][index];

    if (!isRecord(node)) {
      throw new TypeError(
        `Schema.org source contains an invalid graph node at index ${index}.`,
      );
    }

    if (typeof node["@id"] !== "string" || node["@id"].trim().length === 0) {
      throw new TypeError(
        `Schema.org graph node at index ${index} has no valid @id.`,
      );
    }

    const types = Array.isArray(node["@type"])
      ? node["@type"]
      : [node["@type"]];

    if (
      types.length === 0 ||
      types.some((type) => typeof type !== "string" || type.trim().length === 0)
    ) {
      throw new TypeError(
        `Schema.org graph node "${node["@id"]}" has no valid @type.`,
      );
    }

    if (seenIds.has(node["@id"])) {
      throw new TypeError(
        `Schema.org source contains duplicate @id "${node["@id"]}".`,
      );
    }

    seenIds.add(node["@id"]);
  }
};
