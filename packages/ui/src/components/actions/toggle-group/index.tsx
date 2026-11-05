"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  Fragment,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  isValidElement,
  Children,
} from "react";

import { useRovingFocus, type UseRovingFocusReturn } from "@puzzle/hooks";
import { cn } from "@puzzle/core";

import { Button } from "../button";

import type {
  ToggleGroupItemProps,
  ToggleGroupMultipleProps,
  ToggleGroupProps,
  ToggleGroupSingleProps,
  ToggleGroupOrientation,
} from "./toggle-group.types";

import "./toggle-group.css";

type ToggleGroupContextValue = {
  selectedValues: string[];
  disabled: boolean;
  toggleValue: (value: string) => void;
  rovingFocus: UseRovingFocusReturn<HTMLButtonElement>;
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

const useToggleGroupContext = () => {
  const context = useContext(ToggleGroupContext);

  if (!context) {
    throw new Error("ToggleGroup.Item must be rendered inside a ToggleGroup.");
  }

  return context;
};

const ToggleGroupItem = ({
  value,
  disabled = false,
  onClick,
  onFocus,
  onKeyDown,
  children,
  ...buttonProps
}: ToggleGroupItemProps) => {
  const context = useToggleGroupContext();

  const isDisabled = context.disabled || disabled;
  const isSelected = context.selectedValues.includes(value);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      context.toggleValue(value);
    }
  };

  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    context.rovingFocus.onItemFocus(value);
    onFocus?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);

    if (!event.defaultPrevented) {
      context.rovingFocus.onItemKeyDown(event, value);
    }
  };

  return (
    <Button
      {...buttonProps}
      ref={context.rovingFocus.getItemRef(value)}
      type="button"
      variant={isSelected ? "toggle-active" : "toggle"}
      disabled={isDisabled}
      tabIndex={context.rovingFocus.getItemTabIndex(value, isDisabled)}
      aria-pressed={isSelected}
      data-state={isSelected ? "on" : "off"}
      data-disabled={isDisabled ? "true" : undefined}
      onClick={handleClick}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
    >
      {children}
    </Button>
  );
};

type ToggleGroupItemElement = ReactElement<
  ToggleGroupItemProps,
  typeof ToggleGroupItem
>;

const isToggleGroupItem = (child: ReactNode): child is ToggleGroupItemElement =>
  isValidElement<ToggleGroupItemProps>(child) && child.type === ToggleGroupItem;

const getToggleGroupItems = (children: ReactNode): ToggleGroupItemElement[] =>
  Children.toArray(children).flatMap((child): ToggleGroupItemElement[] => {
    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === Fragment
    ) {
      return getToggleGroupItems(child.props.children);
    }

    return isToggleGroupItem(child) ? [child] : [];
  });

const ToggleGroupRoot = (props: ToggleGroupProps): ReactElement => {
  const {
    type: groupType = "single",
    value,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    dir = "ltr",
    disabled = false,
    loop = true,
    required = false,
    attached = false,
    fullWidth = false,
    spacing,
    children,
    className,
    style,
    role,
    ...rootProps
  } = props;

  const isMultiple = groupType === "multiple";

  const [uncontrolledValues, setUncontrolledValues] = useState<string[]>(() => {
    if (isMultiple) {
      return [...((defaultValue as string[] | undefined) ?? [])];
    }

    return defaultValue == null ? [] : [defaultValue as string];
  });

  const controlledValue = isMultiple
    ? (value as string[] | undefined)
    : (value as string | null | undefined);

  const isControlled = controlledValue !== undefined;

  const selectedValues = isControlled
    ? isMultiple
      ? (controlledValue as string[])
      : controlledValue == null
        ? []
        : [controlledValue as string]
    : uncontrolledValues;

  const toggleValue = useCallback(
    (nextValue: string) => {
      const isSelected = selectedValues.includes(nextValue);

      let nextValues: string[];

      if (isMultiple) {
        if (isSelected && required && selectedValues.length === 1) {
          return;
        }

        nextValues = isSelected
          ? selectedValues.filter((item) => item !== nextValue)
          : [...selectedValues, nextValue];
      } else {
        if (isSelected && required) {
          return;
        }

        nextValues = isSelected ? [] : [nextValue];
      }

      const hasChanged =
        nextValues.length !== selectedValues.length ||
        nextValues.some((item, index) => item !== selectedValues[index]);

      if (!hasChanged) {
        return;
      }

      if (!isControlled) {
        setUncontrolledValues(nextValues);
      }

      if (isMultiple) {
        (onValueChange as ToggleGroupMultipleProps["onValueChange"])?.(
          nextValues,
        );
      } else {
        (onValueChange as ToggleGroupSingleProps["onValueChange"])?.(
          nextValues[0],
        );
      }
    },
    [isControlled, isMultiple, onValueChange, required, selectedValues],
  );

  const groupItems = getToggleGroupItems(children);

  const rovingItems = groupItems.map((item) => ({
    id: item.props.value,
    disabled: disabled || item.props.disabled,
  }));

  const rovingFocus = useRovingFocus<HTMLButtonElement>({
    items: rovingItems,
    orientation,
    dir,
    loop,
    initialActiveId: selectedValues[0],
  });

  const contextValue: ToggleGroupContextValue = {
    selectedValues,
    disabled,
    toggleValue,
    rovingFocus,
  };

  const groupStyle: CSSProperties | undefined =
    spacing === undefined
      ? style
      : ({
          ...style,
          "--puzzle-toggle-group-gap":
            typeof spacing === "number" ? `${spacing}px` : spacing,
        } as CSSProperties);

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <div
        {...rootProps}
        className={cn("puzzle-toggle-group", className)}
        style={groupStyle}
        role={role ?? "group"}
        dir={dir}
        aria-disabled={disabled || undefined}
        data-orientation={orientation}
        data-attached={attached ? "true" : undefined}
        data-full-width={fullWidth ? "true" : undefined}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
};

type ToggleGroupComponent = {
  (props: ToggleGroupSingleProps): ReactElement;
  (props: ToggleGroupMultipleProps): ReactElement;
  Item: typeof ToggleGroupItem;
};

const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item: ToggleGroupItem,
}) as ToggleGroupComponent;

export {
  ToggleGroup,
  type ToggleGroupProps,
  type ToggleGroupSingleProps,
  type ToggleGroupMultipleProps,
  type ToggleGroupItemProps,
  type ToggleGroupOrientation,
};
