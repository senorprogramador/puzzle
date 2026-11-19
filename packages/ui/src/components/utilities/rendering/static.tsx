import type { ReactNode } from "react";

export type StaticBoundaryProps = Readonly<{
  children: ReactNode;
  interactiveChildren: "none";
}>;

export const StaticBoundary = ({
  children,
  interactiveChildren: _interactiveChildren,
}: StaticBoundaryProps) => children;
