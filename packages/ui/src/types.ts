import type { ComponentPropsWithoutRef, ElementType } from "react";

export type ElementProp<
  C extends ElementType,
  K extends PropertyKey,
> = K extends keyof ComponentPropsWithoutRef<C>
  ? ComponentPropsWithoutRef<C>[K]
  : never;
