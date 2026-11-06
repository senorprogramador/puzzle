import type { HTMLAttributes, ReactNode } from "react";

type AlertSeverity = "success" | "info" | "warning" | "error";

type AlertVariant = "standard" | "outlined" | "filled";

type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  severity?: AlertSeverity;
  variant?: AlertVariant;
  title?: ReactNode;
  icon?: ReactNode | false;
  closable?: boolean;
  closeLabel?: string;
  onClose?: () => void;
  children?: ReactNode;
};

export type { AlertSeverity, AlertVariant, AlertProps };
