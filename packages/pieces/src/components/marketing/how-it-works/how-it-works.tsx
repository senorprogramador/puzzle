"use client";

import { Heading, Text } from "@puzzle-ui/ui";
import { lazy, Suspense, type ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type {
  HowItWorksItem,
  HowItWorksSectionProps,
} from "./how-it-works.types";
import "./how-it-works.css";

const HowItWorksCarousel = lazy(() =>
  import("./how-it-works-carousel").then(({ HowItWorksCarousel }) => ({
    default: HowItWorksCarousel,
  })),
);

const StepContent = ({
  step,
  index,
  showNumber,
}: {
  step: HowItWorksItem;
  index: number;
  showNumber: boolean;
}) => (
  <article className="puzzle-how-it-works__step">
    {showNumber ? (
      <span className="puzzle-how-it-works__number" aria-hidden="true">
        {index + 1}
      </span>
    ) : null}
    {step.media ? <div className="puzzle-how-it-works__media">{step.media}</div> : null}
    {step.icon ? <div className="puzzle-how-it-works__icon">{step.icon}</div> : null}
    <Heading level="headline3" as="h3">{step.title}</Heading>
    {step.description ? <Text as="p">{step.description}</Text> : null}
    {step.content}
    {step.action ? <div className="puzzle-how-it-works__action">{step.action}</div> : null}
  </article>
);

const HowItWorksSection = <C extends ElementType = "section">({
  variant = "steps",
  steps,
  carouselLabel = "Process steps",
  children,
  className,
  ...sectionProps
}: HowItWorksSectionProps<C>) => {
  const showNumbers =
    variant === "numbered" ||
    variant === "timeline" ||
    variant === "connected" ||
    variant === "process";
  const renderStep = (step: HowItWorksItem, index: number) => (
    <StepContent step={step} index={index} showNumber={showNumbers} />
  );

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-how-it-works ${className ?? ""}`.trim()}
      family="how-it-works"
      variant={variant}
    >
      {steps.length && variant === "carousel" ? (
        <Suspense
          fallback={
            <ol className="puzzle-how-it-works__list">
              {steps.map((step, index) => (
                <li key={step.id}>{renderStep(step, index)}</li>
              ))}
            </ol>
          }
        >
          <HowItWorksCarousel
            steps={steps}
            carouselLabel={carouselLabel}
            renderStep={renderStep}
          />
        </Suspense>
      ) : steps.length ? (
        <ol className="puzzle-how-it-works__list">
          {steps.map((step, index) => (
            <li key={step.id}>
              <StepContent
                step={step}
                index={index}
                showNumber={showNumbers}
              />
            </li>
          ))}
        </ol>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { HowItWorksSection };
