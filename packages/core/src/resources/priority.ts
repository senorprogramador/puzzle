export type ResourcePriority = "critical" | "high" | "normal" | "low";

export const RESOURCE_PRIORITY_ORDER = [
  "critical",
  "high",
  "normal",
  "low",
] as const satisfies readonly ResourcePriority[];

const priorityRank: Readonly<Record<ResourcePriority, number>> = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export const getResourcePriorityRank = (
  priority: ResourcePriority,
): number => {
  if (!Object.hasOwn(priorityRank, priority)) {
    throw new TypeError(`Unsupported resource priority: ${String(priority)}.`);
  }

  return priorityRank[priority];
};

export const compareResourcePriority = (
  left: ResourcePriority,
  right: ResourcePriority,
): -1 | 0 | 1 => {
  const difference =
    getResourcePriorityRank(left) - getResourcePriorityRank(right);

  return difference < 0 ? -1 : difference > 0 ? 1 : 0;
};
