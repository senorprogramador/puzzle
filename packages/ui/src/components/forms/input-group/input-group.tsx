import { cn } from "@puzzle-ui/core";

import { resolveInputGroupAddonAlign } from "./input-group.utils";
import type {
  InputGroupAddonProps,
  InputGroupProps,
} from "./input-group.types";

import "./input-group.css";

const InputGroupAddon = ({
  align,
  className,
  ...props
}: InputGroupAddonProps) => (
  <div
    {...props}
    className={cn("puzzle-input-group__addon", className)}
    data-align={resolveInputGroupAddonAlign(align)}
  />
);

const InputGroupRoot = ({ className, ...props }: InputGroupProps) => (
  <div {...props} className={cn("puzzle-input-group", className)} />
);

const InputGroup = Object.assign(InputGroupRoot, {
  Addon: InputGroupAddon,
});

export { InputGroup };
