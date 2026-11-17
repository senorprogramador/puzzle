import type { ReactNode } from "react";

export type ProjectStatusTone =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type ProjectStatusBadgeProps = {
  label: ReactNode;
  tone?: ProjectStatusTone;
  className?: string;
};

export type ProjectProgressProps = {
  label: ReactNode;
  value: number;
  className?: string;
};

export type ProjectMember = {
  id: string;
  name: string;
  avatar?: ReactNode;
};

export type ProjectMembersProps = {
  members: readonly ProjectMember[];
  label?: string;
  className?: string;
};

export type ProjectCardProps = {
  title: ReactNode;
  description?: ReactNode;
  status?: ReactNode;
  progress?: number;
  members?: readonly ProjectMember[];
  href?: string;
  actions?: ReactNode;
  className?: string;
};

export type ProjectCollectionProps = {
  children: ReactNode;
  label?: string;
  className?: string;
};

export type ProjectHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
};
