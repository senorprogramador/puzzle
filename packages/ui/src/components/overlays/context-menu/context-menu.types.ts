import type {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  Ref,
} from "react";

export type ContextMenuItemVariant = "default" | "danger";
export type ContextMenuCheckedState = boolean | "indeterminate";

export type ContextMenuProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
};

export type ContextMenuTriggerProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> & {
  children: ReactNode;
  asChild?: boolean;
  disabled?: boolean;
  ref?: Ref<HTMLElement>;
};

export type ContextMenuContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
  maxHeight?: CSSProperties["maxHeight"];
};

export type ContextMenuItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onSelect"
> & {
  children: ReactNode;
  textValue?: string;
  closeOnSelect?: boolean;
  variant?: ContextMenuItemVariant;
  onSelect?: (event: MouseEvent<HTMLElement>) => void;
};

export type ContextMenuGroupProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
};

export type ContextMenuLabelProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
};

export type ContextMenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

export type ContextMenuCheckboxItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onSelect"
> & {
  children: ReactNode;
  checked?: ContextMenuCheckedState;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  closeOnSelect?: boolean;
  textValue?: string;
  onSelect?: (event: MouseEvent<HTMLElement>) => void;
};

export type ContextMenuRadioGroupProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export type ContextMenuRadioItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onSelect"
> & {
  children: ReactNode;
  value: string;
  closeOnSelect?: boolean;
  textValue?: string;
  onSelect?: (event: MouseEvent<HTMLElement>) => void;
};

export type ContextMenuSubProps = {
  children: ReactNode;
  defaultOpen?: boolean;
};

export type ContextMenuSubTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: ReactNode;
};

export type ContextMenuSubContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
  maxHeight?: CSSProperties["maxHeight"];
};
