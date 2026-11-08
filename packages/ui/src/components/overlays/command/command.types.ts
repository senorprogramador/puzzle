import type { HTMLAttributes, ReactNode } from "react";

type CommandItem = {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  group?: string;
  shortcut?: string;
  icon?: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
};

type CommandProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSelect" | "children"
> & {
  commands: CommandItem[];
  placeholder?: string;
  label?: string;
  emptyMessage?: ReactNode;
  loading?: boolean;
  loadingMessage?: ReactNode;
  filter?: (command: CommandItem, query: string) => boolean;
  onSelect?: (command: CommandItem) => void;
  onQueryChange?: (query: string) => void;
  query?: string;
  defaultQuery?: string;
  loop?: boolean;
  autoFocus?: boolean;
};

type CommandDialogProps = Omit<CommandProps, "autoFocus"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: string;
  shortcut?: string | false;
};

export type { CommandItem, CommandProps, CommandDialogProps };
