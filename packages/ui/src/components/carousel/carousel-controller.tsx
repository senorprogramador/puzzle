"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CarouselContextValue<T> = {
  currentPanel: number;
  setPanel: (panel: number) => void;
  items: T[];
};

export type CarouselControllerProps<T> = {
  items: T[];
  children: ReactNode;
  currentPanel?: number;
  defaultPanel?: number;
  onPanelChange?: (panel: number) => void;
};

const CarouselContext = createContext<CarouselContextValue<unknown> | null>(
  null,
);

const normalizePanel = (panel: number) => {
  if (!Number.isFinite(panel)) {
    return 0;
  }

  return Math.max(0, Math.floor(panel));
};

const CarouselController = <T,>({
  items,
  children,
  currentPanel: controlledPanel,
  defaultPanel = 0,
  onPanelChange,
}: CarouselControllerProps<T>) => {
  const isControlled = controlledPanel !== undefined;

  const [internalPanel, setInternalPanel] = useState(() =>
    normalizePanel(defaultPanel),
  );

  const currentPanel = normalizePanel(
    isControlled ? controlledPanel : internalPanel,
  );

  const setPanel = useCallback(
    (panel: number) => {
      const nextPanel = normalizePanel(panel);

      if (nextPanel === currentPanel) {
        return;
      }

      if (!isControlled) {
        setInternalPanel(nextPanel);
      }

      onPanelChange?.(nextPanel);
    },
    [currentPanel, isControlled, onPanelChange],
  );

  const contextValue = useMemo<CarouselContextValue<T>>(
    () => ({
      currentPanel,
      setPanel,
      items,
    }),
    [currentPanel, setPanel, items],
  );

  return (
    <CarouselContext.Provider
      value={contextValue as CarouselContextValue<unknown>}
    >
      {children}
    </CarouselContext.Provider>
  );
};

const useCarouselContext = <T,>() => {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error(
      "useCarouselContext must be used within a CarouselController.",
    );
  }

  return context as CarouselContextValue<T>;
};

export { CarouselController, useCarouselContext };
