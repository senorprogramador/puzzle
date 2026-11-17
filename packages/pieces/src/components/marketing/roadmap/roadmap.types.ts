import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type RoadmapVariant =
  | "timeline"
  | "quarters"
  | "columns"
  | "cards"
  | "list"
  | "progress"
  | "horizontal"
  | "vertical"
  | "grouped"
  | "kanban"
  | "milestones"
  | "release";

export type RoadmapStatus =
  | "planned"
  | "in-progress"
  | "completed"
  | "delayed"
  | "on-hold";

export type RoadmapItem = {
  id: string;
  title: string;
  status: RoadmapStatus;
  date?: ReactNode;
  statusLabel?: ReactNode;
  group?: string;
  release?: string;
  description?: ReactNode;
  progress?: number;
};

export type RoadmapSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: RoadmapVariant;
    items: readonly RoadmapItem[];
  };
