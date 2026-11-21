"use client";

import { Fragment, type ReactNode } from "react";
import { PiecesCarousel } from "../../shared/pieces-carousel";
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
  return (
    <PiecesCarousel
      itemKeys={steps.map((step) => step.id)}
      slides={steps.map((step, index) => (
        <Fragment key={step.id}>{renderStep(step, index)}</Fragment>
      ))}
      ariaLabel={carouselLabel}
      itemLabel="step"
      className="puzzle-how-it-works__carousel"
      panelsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
      gap="var(--puzzle-space-6, 1.5rem)"
    />
  );
};
