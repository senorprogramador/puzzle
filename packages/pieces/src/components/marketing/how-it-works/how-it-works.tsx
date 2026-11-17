"use client";

import { Button, Carousel, CarouselController } from "@puzzle-ui/ui";
import { Icon } from "@puzzle-ui/icons/icon";
import {
  useState,
  type ElementType,
  type KeyboardEvent,
} from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type {
  HowItWorksItem,
  HowItWorksSectionProps,
} from "./how-it-works.types";
import "./how-it-works.css";

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
    <h3>{step.title}</h3>
    {step.description ? <p>{step.description}</p> : null}
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
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-how-it-works ${className ?? ""}`.trim()}
      family="how-it-works"
      variant={variant}
    >
      {steps.length && variant === "carousel" ? (
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
              renderItem={(step, index) => (
                <StepContent
                  step={step}
                  index={index}
                  showNumber={showNumbers}
                />
              )}
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
