import type { ComponentPropsWithRef, ReactNode } from "react";
import type { LinkProps } from "../../navigation/link/types";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link"
  | "toggle"
  | "toggle-active";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;

  leading?: ReactNode;
  trailing?: ReactNode;

  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;

  className?: string;
  children?: ReactNode;
};

/**
 * Props for a native button element.
 */
type ButtonNativeProps = ButtonBaseProps &
  Omit<ComponentPropsWithRef<"button">, keyof ButtonBaseProps> & {
    href?: never;
  };

/**
 * Props for a button rendered as a Puzzle Link.
 */
type ButtonLinkProps = ButtonBaseProps &
  Omit<LinkProps, keyof ButtonBaseProps | "href" | "type"> & {
    href: LinkProps["href"];
    type?: never;
  };

type ButtonProps = ButtonNativeProps | ButtonLinkProps;

export type {
  ButtonVariant,
  ButtonSize,
  ButtonNativeProps,
  ButtonLinkProps,
  ButtonProps,
};
