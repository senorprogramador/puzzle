import type { ComponentPropsWithRef } from "react";

type InputGroupAddonAlign = "start" | "end";

type InputGroupProps = ComponentPropsWithRef<"div">;

type InputGroupAddonProps = Omit<ComponentPropsWithRef<"div">, "align"> & {
  align?: InputGroupAddonAlign;
};

export type { InputGroupAddonAlign, InputGroupAddonProps, InputGroupProps };
