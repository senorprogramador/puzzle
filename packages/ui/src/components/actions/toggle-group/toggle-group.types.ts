import type {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";

import type { ButtonNativeProps } from "../button/button.types";

type ToggleGroupOrientation = "horizontal" | "vertical";

type ToggleGroupBaseProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "dir"
> & {
  /** Layout direction of the items. Defaults to horizontal. */
  orientation?: ToggleGroupOrientation;

  /** Text direction, used to interpret horizontal arrow keys. */
  dir?: "ltr" | "rtl";

  /** Disables every item in the group. */
  disabled?: boolean;

  /** Whether keyboard navigation wraps at the first and last item. */
  loop?: boolean;

  /**
   * Prevents the last selected value from being deselected.
   * It does not force an initial selection.
   */
  required?: boolean;

  /** Joins the item borders and removes the inner corner radii. */
  attached?: boolean;

  /** Makes the group fill its available inline size. */
  fullWidth?: boolean;

  /**
   * Space between items. A number is interpreted as pixels.
   * Defaults to the Puzzle spacing token.
   */
  spacing?: number | string;

  children: ReactNode;
};

type ToggleGroupSingleProps = ToggleGroupBaseProps & {
  type?: "single";
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
};

type ToggleGroupMultipleProps = ToggleGroupBaseProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

type ToggleGroupItemProps = Omit<
  ButtonNativeProps,
  | "value"
  | "variant"
  | "disabled"
  | "onClick"
  | "onFocus"
  | "onKeyDown"
  | "tabIndex"
  | "aria-pressed"
  | "type"
  | "ref"
> & {
  /** Unique value identifying this item within the group. */
  value: string;

  /** Disables this item without disabling the rest of the group. */
  disabled?: boolean;

  onClick?: MouseEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
};

export type {
  ToggleGroupOrientation,
  ToggleGroupBaseProps,
  ToggleGroupSingleProps,
  ToggleGroupMultipleProps,
  ToggleGroupProps,
  ToggleGroupItemProps,
};
