import type { ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { AvailabilityDayStatus } from "../availability-calendar";

/**
 * A price whose amount is expressed in the currency's minor unit (for
 * example, 1250 USD is $12.50).
 */
export type AvailabilityManagerPrice = {
  amount: number;
  currency: string;
};

export type AvailabilityManagerDay = {
  date: Date;
  status?: AvailabilityDayStatus;
  price?: AvailabilityManagerPrice;
  label?: ReactNode;
  indicator?: ReactNode;
  disabled?: boolean;
};

export type AvailabilityManagerResource = {
  id: string;
  label?: ReactNode;
  name?: ReactNode;
  description?: ReactNode;
  days?: readonly AvailabilityManagerDay[];
  availability?: readonly AvailabilityManagerDay[];
};

export type AvailabilityManagerCell = {
  resourceId: string;
  date: Date;
};

export type AvailabilityManagerRange = {
  start: Date;
  end: Date;
  resourceId?: string;
};

export type AvailabilityManagerSelection = {
  cells: readonly AvailabilityManagerCell[];
  anchor?: AvailabilityManagerCell | null;
  range?: AvailabilityManagerRange | null;
};

export type AvailabilityManagerSelectionMode = "single" | "range" | "multiple";

export type AvailabilityManagerBulkEdit = {
  status?: AvailabilityDayStatus;
  price?: AvailabilityManagerPrice | null;
};

export type AvailabilityManagerDaySlotContext = {
  day: AvailabilityManagerDay | undefined;
  date: Date;
  resource: AvailabilityManagerResource;
  selected: boolean;
  inRange: boolean;
  disabled: boolean;
};

export type AvailabilityManagerSlots = {
  toolbar?: (context: {
    month: Date;
    months: number;
    selectedCells: readonly AvailabilityManagerCell[];
  }) => ReactNode;
  resourceLabel?: (resource: AvailabilityManagerResource) => ReactNode;
  day?: (context: AvailabilityManagerDaySlotContext) => ReactNode;
  bulkActions?: (context: {
    selection: AvailabilityManagerSelection;
    cells: readonly AvailabilityManagerCell[];
    clearSelection: () => void;
    applyBulkEdit: (edit: AvailabilityManagerBulkEdit) => void;
  }) => ReactNode;
  bulkEdit?: (context: {
    selection: AvailabilityManagerSelection;
    cells: readonly AvailabilityManagerCell[];
    clearSelection: () => void;
    applyBulkEdit: (edit: AvailabilityManagerBulkEdit) => void;
  }) => ReactNode;
  emptyState?: ReactNode;
};

export type AvailabilityManagerProps = Omit<
  MarketingSectionBaseProps<"section">,
  "children" | "onChange" | "defaultValue" | "value"
> & {
  resources: readonly AvailabilityManagerResource[];
  value?: AvailabilityManagerSelection | null;
  defaultValue?: AvailabilityManagerSelection | null;
  /** Alias for value, useful when the manager is embedded in an editor. */
  selection?: AvailabilityManagerSelection | null;
  onChange?: (selection: AvailabilityManagerSelection) => void;
  onSelectionChange?: (selection: AvailabilityManagerSelection) => void;
  initialMonth?: Date;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  months?: 1 | 2 | 3;
  selectionMode?: AvailabilityManagerSelectionMode;
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  loading?: boolean;
  error?: ReactNode;
  disabled?: boolean;
  emptyState?: ReactNode;
  bulkActions?: ReactNode;
  bulkEdit?: ReactNode;
  onCellClick?: (
    cell: AvailabilityManagerCell,
    day: AvailabilityManagerDay | undefined,
  ) => void;
  onBulkEdit?: (
    cells: readonly AvailabilityManagerCell[],
    edit: AvailabilityManagerBulkEdit,
  ) => void;
  slots?: AvailabilityManagerSlots;
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  className?: string;
};
