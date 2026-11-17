import { AnnouncementSection } from "@puzzle-ui/pieces";
import type { AnnouncementVariant } from "@puzzle-ui/pieces";
import { Button } from "@puzzle-ui/ui";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";

const announcementVariants: SectionVariantPreview<AnnouncementVariant>[] = [
  {
    variant: "bar",
    useCase: "A compact notice at the top or bottom of a page.",
  },
  {
    variant: "dismissible",
    useCase: "A temporary notice that visitors can close.",
  },
  {
    variant: "centered",
    useCase: "A short, centered message with one clear action.",
  },
  {
    variant: "split",
    useCase: "A message and action that need separate alignment.",
  },
  {
    variant: "promotional",
    useCase: "A promotion with a prominent call to action.",
  },
  {
    variant: "countdown",
    useCase: "A time-bound offer with a live countdown.",
  },
  { variant: "ticker", useCase: "A long, scrollable strip of brief updates." },
  {
    variant: "multi-message",
    useCase: "Several independent notices in one region.",
  },
  {
    variant: "floating",
    useCase: "A contained notice above surrounding content.",
  },
  {
    variant: "minimal",
    useCase: "A low-emphasis message with minimal decoration.",
  },
];

const announcementCopy: Record<
  AnnouncementVariant,
  { message: string; action: string }
> = {
  bar: {
    message: "New: bring your projects and conversations into one workspace.",
    action: "See what's new",
  },
  dismissible: {
    message: "The spring collection is here. Explore the new arrivals.",
    action: "Shop the collection",
  },
  centered: {
    message: "Your first month is on us.",
    action: "Start a free trial",
  },
  split: {
    message: "A better way to plan the work ahead.",
    action: "Explore the platform",
  },
  promotional: {
    message: "Launch week: save 25% on your first year.",
    action: "Claim the offer",
  },
  countdown: {
    message: "Early access pricing ends soon.",
    action: "Reserve your place",
  },
  ticker: {
    message:
      "Free shipping over $75 | New colors just landed | Made for everyday use",
    action: "Explore the collection",
  },
  "multi-message": {
    message: "Several updates for your visitors.",
    action: "Read the update",
  },
  floating: {
    message: "Need a hand choosing the right plan?",
    action: "Talk to our team",
  },
  minimal: {
    message: "Thoughtful tools for your next big idea.",
    action: "Discover Puzzle",
  },
};

export const AnnouncementSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="AnnouncementSection"
    variants={announcementVariants}
    buildCode={(variant) => {
      const { message, action } = announcementCopy[variant];

      return variant === "countdown"
        ? `<AnnouncementSection variant="countdown" countdownTarget="2026-12-01T00:00:00Z" message="${message}" action={<Button variant="link">${action}</Button>} />`
        : variant === "multi-message"
          ? `<AnnouncementSection variant="multi-message" announcements={[{ id: "launch", message: "A fresh collection is ready to explore." }, { id: "shipping", message: "Complimentary shipping through Sunday." }]} />`
          : `<AnnouncementSection variant="${variant}" message="${message}" action={<Button variant="link">${action}</Button>} />`;
    }}
    renderVariant={(variant) => {
      const { message, action } = announcementCopy[variant];

      return variant === "countdown" ? (
        <AnnouncementSection
          variant={variant}
          countdownTarget="2026-12-01T00:00:00Z"
          message={message}
          action={<Button variant="link">{action}</Button>}
        />
      ) : variant === "multi-message" ? (
        <AnnouncementSection
          variant={variant}
          announcements={[
            {
              id: "launch",
              message: "A fresh collection is ready to explore.",
              action: <Button variant="link">See new arrivals</Button>,
            },
            { id: "shipping", message: "Complimentary shipping through Sunday." },
          ]}
        />
      ) : (
        <AnnouncementSection
          variant={variant}
          message={message}
          action={<Button variant="link">{action}</Button>}
        />
      );
    }}
  />
);
