import type {
  ComponentPropsWithoutRef,
  Key,
  ReactNode,
} from "react";

type FieldArrayItemContext<T> = {
  item: T;
  index: number;
  count: number;
};

type FieldArrayProps<T> = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue" | "onChange"
> & {
  /** Current items. Field state remains controlled by the caller. */
  items: readonly T[];

  /** Called with the next item list after an add, remove, or move action. */
  onChange: (items: T[]) => void;

  /** Creates the value for a newly added item. */
  createItem: () => T;

  /** Renders the fields for one item. */
  renderItem: (context: FieldArrayItemContext<T>) => ReactNode;

  /** Visible name for this group of fields. */
  label: ReactNode;

  /** Supporting text associated with the array. */
  description?: ReactNode;

  /** External validation message. `true` uses the default message. */
  error?: ReactNode | boolean;

  /** Explicitly marks the array invalid. */
  invalid?: boolean;

  /** Optional synchronous validation; return an error message or `null`. */
  validate?: (items: readonly T[]) => string | null;

  /** Label for each item fieldset. Defaults to `Item {index + 1}`. */
  itemLabel?: (item: T, index: number) => ReactNode;

  /** Stable React key for each item, recommended when items can be reordered. */
  getItemKey?: (item: T, index: number) => Key;

  /** Accessible and visible label for the add button. */
  addLabel?: string;

  /** Accessible name for each remove button. */
  removeLabel?: (index: number) => string;

  /** Accessible name for each move-up button. */
  moveUpLabel?: (index: number) => string;

  /** Accessible name for each move-down button. */
  moveDownLabel?: (index: number) => string;

  /** Text shown when the array has no items. */
  emptyMessage?: ReactNode;

  /** Prevents removing items while the list has this many entries or fewer. */
  minItems?: number;

  /** Prevents adding items when this limit is reached. */
  maxItems?: number;

  /** Shows built-in keyboard-operable move-up and move-down buttons. */
  reorderable?: boolean;
};

export type { FieldArrayItemContext, FieldArrayProps };
