"use client";

import { createContext, useContext } from "react";
import type { MutableRefObject } from "react";

type FocusPosition = "first" | "last";

type DropdownMenuContextValue = {
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
  triggerRef: MutableRefObject<HTMLElement | null>;
  focusPositionRef: MutableRefObject<FocusPosition>;
  changeOpen: (nextOpen: boolean) => void;
  openFromKeyboard: (position: FocusPosition) => void;
  close: (restoreFocus: boolean) => void;
};

type RadioGroupContextValue = {
  value: string | undefined;
  setValue: (value: string) => void;
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);
const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const useDropdownMenuContext = () => {
  const context = useContext(DropdownMenuContext);

  if (!context) {
    throw new Error(
      "DropdownMenu components must be rendered inside DropdownMenu.",
    );
  }

  return context;
};

const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error(
      "DropdownMenu.RadioItem must be rendered inside DropdownMenu.RadioGroup.",
    );
  }

  return context;
};

export {
  DropdownMenuContext,
  RadioGroupContext,
  useDropdownMenuContext,
  useRadioGroupContext,
};

export type {
  DropdownMenuContextValue,
  FocusPosition,
  RadioGroupContextValue,
};
