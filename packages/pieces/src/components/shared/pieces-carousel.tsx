"use client";

import { Icon } from "@puzzle-ui/icons";
import {
  Button,
  Carousel,
  CarouselController,
  type CarouselProps,
} from "@puzzle-ui/ui";
import {
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import "./pieces-carousel.css";

type PiecesCarouselProps = {
  itemKeys: readonly string[];
  slides: readonly ReactNode[];
  ariaLabel: string;
  itemLabel: string;
  panelsPerView: NonNullable<CarouselProps<string>["panelsPerView"]>;
  currentPanel?: number;
  onPanelChange?: (panel: number) => void;
  gap?: CarouselProps<string>["gap"];
  className?: string;
};

const PiecesCarousel = ({
  itemKeys,
  slides,
  ariaLabel,
  itemLabel,
  panelsPerView,
  currentPanel: controlledPanel,
  onPanelChange,
  gap,
  className,
}: PiecesCarouselProps) => {
  const [internalPanel, setInternalPanel] = useState(0);
  const currentPanel = controlledPanel ?? internalPanel;

  const handlePanelChange = (panel: number) => {
    if (controlledPanel === undefined) {
      setInternalPanel(panel);
    }
    onPanelChange?.(panel);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    handlePanelChange(
      Math.min(
        Math.max(0, itemKeys.length - 1),
        currentPanel + (event.key === "ArrowRight" ? 1 : -1),
      ),
    );
  };

  return (
    <div
      className={`puzzle-pieces-carousel ${className ?? ""}`.trim()}
      role="group"
      tabIndex={0}
      aria-label={`${ariaLabel}. Use the left and right arrow keys to navigate.`}
      onKeyDown={handleKeyDown}
    >
      <CarouselController
        items={[...itemKeys]}
        currentPanel={currentPanel}
        onPanelChange={handlePanelChange}
      >
        <Carousel<string>
          ariaLabel={ariaLabel}
          className={className}
          panelsPerView={panelsPerView}
          gap={gap}
          buttonAlignment="aside"
          pagerAlignment="under"
          renderItem={(_, index) => slides[index] ?? null}
          backButton={
            <Button
              type="button"
              variant="primary"
              size="sm"
              aria-label={`Previous ${itemLabel}`}
            >
              <Icon name="bx:caret-left" aria-hidden="true" />
            </Button>
          }
          nextButton={
            <Button
              type="button"
              variant="primary"
              size="sm"
              aria-label={`Next ${itemLabel}`}
            >
              <Icon name="bx:caret-right" aria-hidden="true" />
            </Button>
          }
          renderPager={(currentPage, numberOfPages) => (
            <span aria-live="polite">
              Page {currentPage + 1} of {numberOfPages}
            </span>
          )}
        />
      </CarouselController>
    </div>
  );
};

export { PiecesCarousel, type PiecesCarouselProps };
