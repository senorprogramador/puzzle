"use client";

import {
  Fragment,
  useId,
  useState,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "@puzzle/core";
import { Transition } from "../transition/transition";
import "./accordion.css";

type AccordionType = "single" | "multiple";

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

const Accordion = ({
  items,
  initialOpenItemIndexes,
  openItemIndexes,
  onChange,
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
  const isControlled = openItemIndexes !== undefined;
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [uncontrolledOpenItemIndexes, setUncontrolledOpenItemIndexes] =
    useState<number[]>(() =>
      normalizeOpenItemIndexes(initialOpenItemIndexes, items.length, type),
    );

  const currentOpenItemIndexes = normalizeOpenItemIndexes(
    isControlled ? openItemIndexes : uncontrolledOpenItemIndexes,
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

    if (!isControlled) {
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
          <Fragment key={item.id ?? index}>
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
};
