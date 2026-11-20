import {
  compareResourcePriority,
  getResourcePriorityRank,
  RESOURCE_PRIORITY_ORDER,
} from "../resources/priority";
import type { FoldPriority } from "./types";

export const FOLD_PRIORITY_ORDER = RESOURCE_PRIORITY_ORDER;

export type ResourcePriority = FoldPriority;

export const getFoldPriorityRank = getResourcePriorityRank;

export const compareFoldPriority = (
  left: FoldPriority,
  right: FoldPriority,
): -1 | 0 | 1 => compareResourcePriority(left, right);
