import { classifyComponent } from "./classification";
import type {
  ComponentClassification,
  FoldPrediction,
  FoldPredictionInput,
  FoldPredictionResult,
  FoldPredictionSource,
} from "./types";

type PositionDecision = Readonly<{
  result: FoldPredictionResult;
  confidence: number;
  source: FoldPredictionSource;
  reason: string;
}>;

const assertNonNegativeFinite = (name: string, value: number | undefined) => {
  if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
    throw new RangeError(`${name} must be a non-negative finite number.`);
  }
};

const validateInput = (input: FoldPredictionInput) => {
  const positionHint =
    input.positionHint ??
    input.pageStructure?.positionHint ??
    input.component?.positionHint;
  if (
    positionHint !== undefined &&
    positionHint !== "above-fold" &&
    positionHint !== "below-fold"
  ) {
    throw new TypeError("Unsupported fold position hint.");
  }

  const region = input.pageStructure?.region;
  if (
    region !== undefined &&
    !["header", "hero", "main", "content", "footer"].includes(region)
  ) {
    throw new TypeError("Unsupported page structure region.");
  }

  const documentOrder =
    input.documentOrder ??
    input.pageStructure?.documentOrder ??
    input.component?.documentOrder;
  if (
    documentOrder !== undefined &&
    (!Number.isSafeInteger(documentOrder) || documentOrder < 0)
  ) {
    throw new RangeError("documentOrder must be a non-negative safe integer.");
  }

  const dimensions = input.dimensions ?? input.component?.dimensions;
  assertNonNegativeFinite("dimensions.width", dimensions?.width);
  assertNonNegativeFinite("dimensions.height", dimensions?.height);
  assertNonNegativeFinite("dimensions.aspectRatio", dimensions?.aspectRatio);

  const layout = input.parentLayout ?? input.component?.parentLayout;
  assertNonNegativeFinite("parentLayout.documentOffset", layout?.documentOffset);
  assertNonNegativeFinite(
    "parentLayout.precedingContentHeight",
    layout?.precedingContentHeight,
  );
  assertNonNegativeFinite("parentLayout.paddingTop", layout?.paddingTop);
  assertNonNegativeFinite("parentLayout.gap", layout?.gap);
  for (const height of layout?.precedingSiblingHeights ?? []) {
    assertNonNegativeFinite("parentLayout.precedingSiblingHeights[]", height);
  }
};

const sum = (values: readonly number[]) =>
  values.reduce((total, value) => total + value, 0);

const estimateDocumentOffset = (input: FoldPredictionInput) => {
  const layout = input.parentLayout ?? input.component?.parentLayout;
  if (!layout) return undefined;

  const documentOrder =
    input.documentOrder ??
    input.pageStructure?.documentOrder ??
    input.component?.documentOrder;
  const hasLayoutEvidence =
    layout.documentOffset !== undefined ||
    layout.paddingTop !== undefined ||
    layout.precedingContentHeight !== undefined ||
    layout.precedingSiblingHeights !== undefined ||
    (layout.gap !== undefined && documentOrder !== undefined);
  if (!hasLayoutEvidence) return undefined;

  const precedingSiblingHeights = layout.precedingSiblingHeights;
  const precedingHeight =
    precedingSiblingHeights !== undefined
      ? sum(precedingSiblingHeights) +
        (layout.gap ?? 0) * precedingSiblingHeights.length
      : (layout.precedingContentHeight ??
        (layout.gap !== undefined && documentOrder !== undefined
          ? layout.gap * documentOrder
          : 0));

  return (
    (layout.documentOffset ?? 0) +
    (layout.paddingTop ?? 0) +
    precedingHeight
  );
};

const selectPositionDecision = (
  input: FoldPredictionInput,
  classification: ComponentClassification,
): PositionDecision => {
  if (classification.priority === "critical") {
    return Object.freeze({
      result: "known-critical",
      confidence: 1,
      source: "critical-metadata",
      reason: "The component is explicitly classified as critical.",
    });
  }

  const positionHint =
    input.positionHint ??
    input.pageStructure?.positionHint ??
    input.component?.positionHint;
  if (positionHint !== undefined) {
    const layoutKnown =
      input.parentLayout !== undefined ||
      input.component?.parentLayout !== undefined;
    return Object.freeze({
      result:
        positionHint === "above-fold"
          ? "predicted-above-fold"
          : "predicted-below-fold",
      confidence: layoutKnown ? 0.85 : 0.75,
      source:
        input.positionHint !== undefined ||
        input.component?.positionHint !== undefined
          ? "component-position-hint"
          : "page-structure",
      reason:
        "A declared position hint is treated as a prediction, never as viewport certainty.",
    });
  }

  const region = input.pageStructure?.region;
  if (region === "footer") {
    return Object.freeze({
      result: "predicted-below-fold",
      confidence: 0.65,
      source: "page-structure",
      reason: "The page structure identifies this region as the footer.",
    });
  }
  if (region === "header" || region === "hero") {
    return Object.freeze({
      result: "predicted-above-fold",
      confidence: 0.6,
      source: "page-structure",
      reason: `The page structure identifies this as the ${region} region.`,
    });
  }

  if (classification.role === "footer") {
    return Object.freeze({
      result: "predicted-below-fold",
      confidence: 0.65,
      source: "page-structure",
      reason: "The declared footer role weakly predicts a later page position.",
    });
  }

  const documentOrder =
    input.documentOrder ??
    input.pageStructure?.documentOrder ??
    input.component?.documentOrder;
  if (documentOrder !== undefined) {
    return Object.freeze({
      result:
        documentOrder === 0
          ? "predicted-above-fold"
          : "predicted-below-fold",
      confidence: documentOrder === 0 ? 0.35 : 0.25,
      source: "document-order",
      reason:
        documentOrder === 0
          ? "First in document order is weak evidence for above-fold placement."
          : "Later document order is weak evidence for below-fold placement.",
    });
  }

  return Object.freeze({
    result: "unknown",
    confidence: 0.1,
    source: "unknown",
    reason: "No position evidence is available on the server.",
  });
};

export const predictFoldPosition = (
  input: FoldPredictionInput = {},
  classification: ComponentClassification = classifyComponent(
    input.component,
  ),
): FoldPrediction => {
  validateInput(input);
  const decision = selectPositionDecision(input, classification);
  const estimatedDocumentOffset = estimateDocumentOffset(input);
  const height = input.dimensions?.height ?? input.component?.dimensions?.height;
  const estimatedBottomOffset =
    estimatedDocumentOffset === undefined || height === undefined
      ? undefined
      : estimatedDocumentOffset + height;

  return Object.freeze({
    ...decision,
    ...(estimatedDocumentOffset === undefined
      ? {}
      : { estimatedDocumentOffset }),
    ...(estimatedBottomOffset === undefined ? {} : { estimatedBottomOffset }),
  });
};
