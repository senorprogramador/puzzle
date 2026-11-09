"use client";

import {
  Fragment,
  useId,
  useState,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "@puzzle-ui/core";
import { Transition } from "../../utilities/transition";
import "./accordion.css";

type AccordionType = "single" | "multiple";
type AccordionItemId = string | number;
type AccordionValue =
  | AccordionItemId
  | readonly AccordionItemId[]
  | null;

type AccordionItemData = {
  /** Stable key for the item when the list is reordered. */
  id?: string | number;

  /** Visible title of the accordion item. */
  title: ReactNode;

  /** Content shown when the item is expanded. */
  content: ReactNode;

  /** Prevents the item from being toggled by the user. */
  disabled?: boolean;
};

type AccordionProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  /** Items displayed by the accordion. */
  items: AccordionItemData[];

  /** Initial expanded indexes for uncontrolled usage. Defaults to []. */
  initialOpenItemIndexes?: number[];

  /** Expanded indexes for controlled usage. */
  openItemIndexes?: number[];

  /** Called with the next expanded indexes after user interaction. */
  onChange?: (openItemIndexes: number[]) => void;

  /** Expanded item ID(s). Requires an ID on every item. */
  value?: AccordionValue;

  /** Initially expanded item ID(s). Requires an ID on every item. */
  defaultValue?: AccordionValue;

  /** Called with the next expanded item ID(s). */
  onValueChange?: (value: AccordionItemId | AccordionItemId[] | null) => void;

  /** Whether multiple items can be expanded simultaneously. */
  type?: AccordionType;

  /** Allow the currently expanded item to collapse in single mode. */
  collapsible?: boolean;

  /** Semantic heading level used for each item. Defaults to 3. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;

  /** Adds region landmarks to the panels. Defaults to true for <= 6 items. */
  region?: boolean;

  /** Class applied to each trigger button. */
  triggerClassName?: string;

  /** Class applied to each animated panel. */
  panelClassName?: string;

  /** Class applied to the panel content wrapper. */
  contentClassName?: string;

  /** Unmount panel content after its closing animation completes. Defaults to false. */
  unMountOnClose?: boolean;
};

const normalizeOpenItemIndexes = (
  indexes: number[] | undefined,
  itemCount: number,
  type: AccordionType,
): number[] => {
  const validIndexes = Array.from(
    new Set(
      (indexes ?? []).filter(
        (index) => Number.isInteger(index) && index >= 0 && index < itemCount,
      ),
    ),
  );

  if (type === "single") {
    return validIndexes.slice(0, 1);
  }

  return validIndexes.sort((a, b) => a - b);
};

const normalizeOpenItemIds = (
  value: AccordionValue | undefined,
  type: AccordionType,
): AccordionItemId[] => {
  const ids =
    value == null ? [] : Array.isArray(value) ? [...value] : [value];
  const uniqueIds = Array.from(new Set(ids));

  return type === "single" ? uniqueIds.slice(0, 1) : uniqueIds;
};

const Accordion = ({
  items,
  initialOpenItemIndexes,
  openItemIndexes,
  onChange,
  value,
  defaultValue,
  onValueChange,
  type = "multiple",
  collapsible = true,
  headingLevel = 3,
  region,
  className,
  triggerClassName,
  panelClassName,
  contentClassName,
  unMountOnClose = false,
  ...rootProps
}: AccordionProps) => {
  const generatedId = useId();
  const isValueMode = value !== undefined || defaultValue !== undefined;
  const isValueControlled = value !== undefined;
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (isValueMode) {
    const itemIds = new Set<string>();

    for (const item of items) {
      if (item.id === undefined) {
        throw new Error(
          "Accordion value and defaultValue require an id on every item.",
        );
      }

      const key = `${typeof item.id}:${item.id}`;

      if (itemIds.has(key)) {
        throw new Error("Accordion item IDs must be unique.");
      }

      itemIds.add(key);
    }
  }

  const [uncontrolledOpenItemIndexes, setUncontrolledOpenItemIndexes] =
    useState<number[]>(() =>
      normalizeOpenItemIndexes(initialOpenItemIndexes, items.length, type),
    );

  const [uncontrolledOpenItemIds, setUncontrolledOpenItemIds] = useState<
    AccordionItemId[]
  >(() => normalizeOpenItemIds(defaultValue, type));

  const requestedOpenItemIds = normalizeOpenItemIds(
    isValueControlled ? value : uncontrolledOpenItemIds,
    type,
  );
  const currentOpenItemIndexes = isValueMode
    ? items.flatMap((item, index) =>
        requestedOpenItemIds.includes(item.id as AccordionItemId) ? [index] : [],
      )
    : normalizeOpenItemIndexes(
        openItemIndexes ?? uncontrolledOpenItemIndexes,
        items.length,
        type,
      );

  const HeadingTag = `h${headingLevel}` as
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";

  // Avoid excessive landmark regions in long accordions.
  const useRegions = region ?? items.length <= 6;

  const handleToggle = (index: number, disabled = false) => {
    if (disabled) {
      return;
    }

    const isOpen = currentOpenItemIndexes.includes(index);

    if (type === "single" && isOpen && !collapsible) {
      return;
    }

    const nextOpenItemIndexes = normalizeOpenItemIndexes(
      type === "single"
        ? isOpen
          ? []
          : [index]
        : isOpen
          ? currentOpenItemIndexes.filter((openIndex) => openIndex !== index)
          : [...currentOpenItemIndexes, index],
      items.length,
      type,
    );

    if (isValueMode) {
      const nextIds = nextOpenItemIndexes.map(
        (openIndex) => items[openIndex]!.id as AccordionItemId,
      );

      if (!isValueControlled) {
        setUncontrolledOpenItemIds(nextIds);
      }

      onValueChange?.(
        type === "single" ? (nextIds[0] ?? null) : nextIds,
      );
    } else if (openItemIndexes === undefined) {
      setUncontrolledOpenItemIndexes(nextOpenItemIndexes);
    }

    onChange?.(nextOpenItemIndexes);
  };

  return (
    <div className={cn("puzzle-accordion", className)} {...rootProps}>
      {items.map((item, index) => {
        const isOpen = currentOpenItemIndexes.includes(index);
        const cannotCollapse = type === "single" && isOpen && !collapsible;

        const triggerId = `${generatedId}-trigger-${index}`;
        const panelId = `${generatedId}-panel-${index}`;

        return (
          <Fragment
            key={
              item.id === undefined
                ? index
                : `${typeof item.id}:${item.id}`
            }
          >
            <HeadingTag className="puzzle-accordion__heading">
              <button
                ref={(node) => {
                  triggerRefs.current[index] = node;
                }}
                id={triggerId}
                type="button"
                className={cn("puzzle-accordion__trigger", triggerClassName)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-disabled={cannotCollapse || undefined}
                data-state={isOpen ? "open" : "closed"}
                disabled={item.disabled}
                onClick={() => handleToggle(index, item.disabled)}
              >
                {item.title}
              </button>
            </HeadingTag>

            <Transition
              visible={isOpen}
              template="accordion"
              duration={300}
              unmountOnExit={unMountOnClose}
              className={panelClassName}
              id={panelId}
              role={useRegions ? "region" : undefined}
              aria-labelledby={useRegions ? triggerId : undefined}
              aria-hidden={!isOpen}
              inert={!isOpen}
              data-state={isOpen ? "open" : "closed"}
            >
              <div
                ref={(node) => {
                  contentRefs.current[index] = node;
                }}
                className="puzzle-accordion__panel"
              >
                <div className="puzzle-accordion__panel-inner">
                  <div
                    className={cn(
                      "puzzle-accordion__content",
                      contentClassName,
                    )}
                  >
                    {item.content}
                  </div>
                </div>
              </div>
            </Transition>
          </Fragment>
        );
      })}
    </div>
  );
};

export {
  Accordion,
  type AccordionProps,
  type AccordionItemData,
  type AccordionType,
  type AccordionItemId,
  type AccordionValue,
};
