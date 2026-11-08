import type {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  Ref,
} from "react";

import type { PopoutAlignment, PopoutPosition } from "../popout";

export type DropdownMenuPosition = PopoutPosition;
export type DropdownMenuAlignment = PopoutAlignment;
export type DropdownMenuItemVariant = "default" | "danger";
export type DropdownMenuCheckedState = boolean | "indeterminate";

export type DropdownMenuProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  position?: DropdownMenuPosition;
  align?: DropdownMenuAlignment;
  offset?: number;
  collisionPadding?: number;
  matchTriggerWidth?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
};

export type DropdownMenuTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  asChild?: boolean;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
};

export type DropdownMenuContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
  maxHeight?: CSSProperties["maxHeight"];
};

export type DropdownMenuItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onSelect"
> & {
  asChild?: boolean;
  children: ReactNode;
  textValue?: string;
  closeOnSelect?: boolean;
  variant?: DropdownMenuItemVariant;
  onSelect?: (event: MouseEvent<HTMLElement>) => void;
};

export type DropdownMenuGroupProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
};

export type DropdownMenuLabelProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
};

export type DropdownMenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

export type DropdownMenuCheckboxItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onSelect"
> & {
  children: ReactNode;
  checked?: DropdownMenuCheckedState;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  closeOnSelect?: boolean;
  textValue?: string;
  onSelect?: (event: MouseEvent<HTMLElement>) => void;
};

export type DropdownMenuRadioGroupProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export type DropdownMenuRadioItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onSelect"
> & {
  children: ReactNode;
  value: string;
  closeOnSelect?: boolean;
  textValue?: string;
  onSelect?: (event: MouseEvent<HTMLElement>) => void;
};
