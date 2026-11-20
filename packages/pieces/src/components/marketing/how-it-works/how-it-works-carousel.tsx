"use client";

import { Button, Carousel, CarouselController } from "@puzzle-ui/ui";
import { Icon } from "@puzzle-ui/icons";
import { useState, type KeyboardEvent, type ReactNode } from "react";
import type { HowItWorksItem } from "./how-it-works.types";

type HowItWorksCarouselProps = {
  steps: readonly HowItWorksItem[];
  carouselLabel: string;
  renderStep: (step: HowItWorksItem, index: number) => ReactNode;
};

export const HowItWorksCarousel = ({
  steps,
  carouselLabel,
  renderStep,
}: HowItWorksCarouselProps) => {
  const [currentPanel, setCurrentPanel] = useState(0);

  const handleCarouselKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setCurrentPanel((current) =>
      Math.min(
        Math.max(0, steps.length - 1),
        current + (event.key === "ArrowRight" ? 1 : -1),
      ),
    );
  };

  return (
    <div
      className="puzzle-how-it-works__keyboard"
      role="group"
      tabIndex={0}
      aria-label={`${carouselLabel}. Use the left and right arrow keys to navigate.`}
      onKeyDown={handleCarouselKeyDown}
    >
      <CarouselController
        items={[...steps]}
        currentPanel={currentPanel}
        onPanelChange={setCurrentPanel}
      >
        <Carousel<HowItWorksItem>
          ariaLabel={carouselLabel}
          className="puzzle-how-it-works__carousel"
          panelsPerView={1}
          renderItem={renderStep}
          getItemKey={(step) => step.id}
          backButton={
            <Button variant="primary" size="sm" aria-label="Previous step">
              <Icon name="bx:caret-left" aria-hidden="true" />
            </Button>
          }
          nextButton={
            <Button variant="primary" size="sm" aria-label="Next step">
              <Icon name="bx:caret-right" aria-hidden="true" />
            </Button>
          }
        />
      </CarouselController>
    </div>
  );
};
