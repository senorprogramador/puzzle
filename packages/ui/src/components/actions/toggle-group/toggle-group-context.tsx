import { createContext, useContext } from "react";

import type { ToggleGroupOrientation } from "./toggle-group.types";

type ToggleGroupContextValue = {
  selectedValues: Set<string>;
  orientation: ToggleGroupOrientation;
  disabled: boolean;
  loop: boolean;

  toggleValue: (value: string) => void;

  register: (value: string, element: HTMLButtonElement | null) => void;

  moveFocus: (
    currentValue: string,
    key: string,
    direction: "ltr" | "rtl",
  ) => void;
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

const useToggleGroupContext = () => {
  const context = useContext(ToggleGroupContext);

  if (!context) {
    throw new Error("ToggleGroup.Item must be used within ToggleGroup.");
  }

  return context;
};

export {
  ToggleGroupContext,
  useToggleGroupContext,
  type ToggleGroupContextValue,
};
