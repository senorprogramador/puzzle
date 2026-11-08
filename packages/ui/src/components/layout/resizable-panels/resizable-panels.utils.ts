export type PanelSizeConstraint = {
  minSize?: number;
  maxSize?: number;
};

type NormalizedPanelSizeConstraint = {
  minSize: number;
  maxSize: number;
};

type PanelPairBounds = {
  minSize: number;
  maxSize: number;
};

const normalizePanelConstraints = (
  constraints: readonly PanelSizeConstraint[],
): NormalizedPanelSizeConstraint[] => {
  if (constraints.length < 2) {
    throw new RangeError("ResizablePanels requires at least two panels.");
  }

  const normalized = constraints.map((constraint, index) => {
    const minSize = constraint.minSize ?? 0;
    const maxSize = constraint.maxSize ?? 100;

    if (
      !Number.isFinite(minSize) ||
      !Number.isFinite(maxSize) ||
      minSize < 0 ||
      maxSize > 100 ||
      minSize > maxSize
    ) {
      throw new RangeError(`Invalid size constraints for panel ${index}.`);
    }

    return { minSize, maxSize };
  });

  const minimumTotal = normalized.reduce(
    (total, constraint) => total + constraint.minSize,
    0,
  );

  const maximumTotal = normalized.reduce(
    (total, constraint) => total + constraint.maxSize,
    0,
  );

  if (minimumTotal > 100 || maximumTotal < 100) {
    throw new RangeError(
      "Panel size constraints cannot produce a layout totaling 100%.",
    );
  }

  return normalized;
};

/**
 * Normalizes panel sizes to 100% while respecting every panel constraint.
 *
 * When a panel reaches its minimum or maximum, the remaining space is
 * distributed proportionally between the other panels.
 */
const normalizePanelSizes = (
  sizes: readonly number[] | undefined,
  constraints: readonly PanelSizeConstraint[],
): number[] => {
  const normalizedConstraints = normalizePanelConstraints(constraints);

  if (sizes && sizes.length !== constraints.length) {
    throw new RangeError(
      "The number of panel sizes must match the number of panels.",
    );
  }

  const weights = normalizedConstraints.map((_, index) => {
    const size = sizes?.[index] ?? 1;

    return Number.isFinite(size) ? Math.max(0, size) : 0;
  });

  const result = new Array<number>(constraints.length).fill(0);

  const unresolved = normalizedConstraints.map((_, index) => index);

  let remainingSize = 100;

  while (unresolved.length > 0) {
    const activeWeightTotal = unresolved.reduce(
      (total, index) => total + weights[index],
      0,
    );

    const useEqualDistribution = activeWeightTotal === 0;

    const candidates = unresolved.map((index) => ({
      index,
      size:
        (remainingSize * (useEqualDistribution ? 1 : weights[index])) /
        (useEqualDistribution ? unresolved.length : activeWeightTotal),
    }));

    const violations = candidates.filter(({ index, size }) => {
      const constraint = normalizedConstraints[index];

      return size < constraint.minSize || size > constraint.maxSize;
    });

    if (violations.length === 0) {
      for (const candidate of candidates) {
        result[candidate.index] = candidate.size;
      }

      break;
    }

    const clampedViolations = violations.map(({ index, size }) => {
      const constraint = normalizedConstraints[index];

      return {
        index,
        size,
        fixedSize: Math.min(
          constraint.maxSize,
          Math.max(constraint.minSize, size),
        ),
      };
    });

    // Only clamp in the direction of the net correction; clamping both
    // directions at once can overshoot or undershoot 100%.
    const totalCorrection = clampedViolations.reduce(
      (total, { size, fixedSize }) => total + fixedSize - size,
      0,
    );

    const fixedIndexes = new Set<number>();

    for (const { index, size, fixedSize } of clampedViolations) {
      if (
        (totalCorrection > 0 && fixedSize < size) ||
        (totalCorrection < 0 && fixedSize > size)
      ) {
        continue;
      }

      result[index] = fixedSize;
      remainingSize -= fixedSize;
      fixedIndexes.add(index);
    }

    for (let index = unresolved.length - 1; index >= 0; index--) {
      if (fixedIndexes.has(unresolved[index])) {
        unresolved.splice(index, 1);
      }
    }
  }

  return result;
};

/**
 * Returns the allowed size range of the first panel in a pair.
 *
 * Both panels retain their combined size during resizing.
 */
const getPanelPairBounds = (
  sizes: readonly number[],
  constraints: readonly PanelSizeConstraint[],
  panelIndex: number,
): PanelPairBounds => {
  const normalizedConstraints = normalizePanelConstraints(constraints);

  const normalizedSizes = normalizePanelSizes(sizes, normalizedConstraints);

  if (
    !Number.isInteger(panelIndex) ||
    panelIndex < 0 ||
    panelIndex >= normalizedSizes.length - 1
  ) {
    throw new RangeError("Invalid panel resize index.");
  }

  const first = normalizedConstraints[panelIndex];
  const second = normalizedConstraints[panelIndex + 1];

  const combinedSize =
    normalizedSizes[panelIndex] + normalizedSizes[panelIndex + 1];

  return {
    minSize: Math.max(first.minSize, combinedSize - second.maxSize),
    maxSize: Math.min(first.maxSize, combinedSize - second.minSize),
  };
};

/**
 * Resizes two adjacent panels while keeping their combined size unchanged.
 *
 * A positive delta increases the first panel.
 * A negative delta decreases the first panel.
 */
const resizePanelPair = (
  sizes: readonly number[],
  constraints: readonly PanelSizeConstraint[],
  panelIndex: number,
  delta: number,
): number[] => {
  if (!Number.isFinite(delta)) {
    throw new RangeError("Resize delta must be a finite number.");
  }

  const normalizedSizes = normalizePanelSizes(sizes, constraints);

  const bounds = getPanelPairBounds(normalizedSizes, constraints, panelIndex);

  const combinedSize =
    normalizedSizes[panelIndex] + normalizedSizes[panelIndex + 1];

  const nextFirstSize = Math.min(
    bounds.maxSize,
    Math.max(bounds.minSize, normalizedSizes[panelIndex] + delta),
  );

  const nextSizes = [...normalizedSizes];

  nextSizes[panelIndex] = nextFirstSize;
  nextSizes[panelIndex + 1] = combinedSize - nextFirstSize;

  return nextSizes;
};

export { normalizePanelSizes, getPanelPairBounds, resizePanelPair };
