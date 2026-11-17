import { useState } from "react";
import { CTASection } from "@puzzle-ui/pieces";
import type { CTAVariant } from "@puzzle-ui/pieces";
import { Button } from "@puzzle-ui/ui";
import { sectionPreviewImages, SectionPreviewImage } from "../shared/section-preview-media";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";

const ctaVariants: SectionVariantPreview<CTAVariant>[] = [
  { variant: "centered", useCase: "A focused message with centered actions." },
  {
    variant: "split",
    useCase: "A call to action beside consumer-provided media.",
  },
  { variant: "banner", useCase: "A compact banner near the end of a page." },
  {
    variant: "card",
    useCase: "A contained action within a card-like surface.",
  },
  {
    variant: "full-width",
    useCase: "A broad call to action spanning the section.",
  },
  {
    variant: "image",
    useCase: "A message paired with an image or illustration.",
  },
  {
    variant: "background",
    useCase: "A call to action with consumer-styled background media.",
  },
  {
    variant: "gradient",
    useCase: "A themed gradient treatment using design tokens.",
  },
  {
    variant: "newsletter",
    useCase: "A prompt whose form is supplied by the consumer.",
  },
  {
    variant: "trial",
    useCase: "A product trial invitation with a clear next step.",
  },
  {
    variant: "download",
    useCase: "A download prompt with consumer-provided actions.",
  },
  {
    variant: "contact",
    useCase: "A direct invitation to contact the organization.",
  },
  {
    variant: "app",
    useCase: "A promotion for a mobile or desktop application.",
  },
  {
    variant: "minimal",
    useCase: "A restrained final prompt with little decoration.",
  },
  {
    variant: "editorial",
    useCase: "A text-led call to action in an article layout.",
  },
  {
    variant: "floating",
    useCase: "A compact, contained prompt separated from page content.",
  },
];

const ctaCopy: Record<
  CTAVariant,
  { title: string; description: string; primary: string; secondary: string }
> = {
  centered: {
    title: "Make room for your next big idea.",
    description: "Start with a clearer plan and bring your whole team along.",
    primary: "Get started",
    secondary: "Explore the platform",
  },
  split: {
    title: "A workspace that grows with your team.",
    description: "Bring people, plans, and progress into one shared place.",
    primary: "See how it works",
    secondary: "Meet the team",
  },
  banner: {
    title: "Ready for a calmer way to work?",
    description: "Make your next project the one that changes everything.",
    primary: "Start a free trial",
    secondary: "View the guide",
  },
  card: {
    title: "Take the next step.",
    description: "See what a more connected workflow can do for you.",
    primary: "Explore Puzzle",
    secondary: "Talk to us",
  },
  "full-width": {
    title: "Build what comes next.",
    description: "Give your best work the space and momentum it deserves.",
    primary: "Get started",
    secondary: "See customer stories",
  },
  image: {
    title: "A fresh perspective for every project.",
    description: "Bring the right people and the right ideas together.",
    primary: "Find your flow",
    secondary: "See the details",
  },
  background: {
    title: "Make good work feel effortless.",
    description: "One clear home for the ideas and details that move you forward.",
    primary: "Discover Puzzle",
    secondary: "Explore the workspace",
  },
  gradient: {
    title: "Your next chapter starts here.",
    description: "Build a more thoughtful way to bring ambitious ideas to life.",
    primary: "Start building",
    secondary: "See what's possible",
  },
  newsletter: {
    title: "A little inspiration for your inbox.",
    description: "Monthly notes on better teamwork, thoughtful tools, and good ideas.",
    primary: "Subscribe",
    secondary: "Read the journal",
  },
  trial: {
    title: "Try a better workflow for free.",
    description: "Invite your team, bring a real project, and see the difference.",
    primary: "Start your 14-day trial",
    secondary: "Compare plans",
  },
  download: {
    title: "Take your workspace with you.",
    description: "Keep ideas moving with Puzzle on desktop and mobile.",
    primary: "Download for desktop",
    secondary: "Get the mobile app",
  },
  contact: {
    title: "Let's find the right fit.",
    description: "Tell us what your team is working on. We can help you get started.",
    primary: "Talk to an expert",
    secondary: "Browse the guide",
  },
  app: {
    title: "Great work goes wherever you go.",
    description: "Pick up the plan, share a thought, and keep the momentum going.",
    primary: "Explore the app",
    secondary: "See the features",
  },
  minimal: {
    title: "Make your next move.",
    description: "A simpler way to bring your best work together.",
    primary: "Get started",
    secondary: "Learn more",
  },
  editorial: {
    title: "The best work begins with a better question.",
    description: "Start a conversation about the kind of work your team wants to make.",
    primary: "Start a conversation",
    secondary: "Read our story",
  },
  floating: {
    title: "Have a project in mind?",
    description: "Bring it to life with a team that sees the whole picture.",
    primary: "Let's talk",
    secondary: "See examples",
  },
};

const NewsletterSignupExample = () => {
  const [submitted, setSubmitted] = useState(false);

  return submitted ? (
    <p role="status">Thanks — the studio notes are on their way.</p>
  ) : (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label>
        Email address
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <Button type="submit">Subscribe</Button>
    </form>
  );
};

export const CTASectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="CTASection"
    variants={ctaVariants}
    buildCode={(variant) =>
      variant === "newsletter"
        ? `<CTASection variant="newsletter" title="A little inspiration for your inbox."><NewsletterSignupExample /></CTASection>`
        : ["split", "image", "background"].includes(variant)
        ? `<CTASection variant="${variant}" title="Make good work feel effortless." media={<img src="${sectionPreviewImages.workspace}" alt="A welcoming studio" />} primaryAction={<Button>Explore Puzzle</Button>} />`
        : variant === "app"
          ? `<CTASection variant="app" title="Great work goes wherever you go." media={<img src="${sectionPreviewImages.mobile}" alt="Puzzle mobile app" />} primaryAction={<Button>Explore the app</Button>} />`
          : `<CTASection variant="${variant}" title="Make room for your next big idea." primaryAction={<Button>Get started</Button>} />`
    }
    renderVariant={(variant) => {
      const { title, description, primary, secondary } = ctaCopy[variant];
      const media =
        variant === "split" ? (
          <SectionPreviewImage
            src={sectionPreviewImages.team}
            alt="A team working together around a table"
          />
        ) : variant === "image" ? (
          <SectionPreviewImage
            src={sectionPreviewImages.landscape}
            alt="A dramatic landscape at the edge of a lake"
          />
        ) : variant === "background" ? (
          <SectionPreviewImage
            src={sectionPreviewImages.workspace}
            alt="A welcoming studio filled with natural light"
          />
        ) : variant === "app" ? (
          <SectionPreviewImage
            src={sectionPreviewImages.mobile}
            alt="A mobile phone showing a clean app interface"
            aspectRatio="9 / 16"
          />
        ) : undefined;

      return (
        <CTASection
          variant={variant}
          eyebrow={
            variant === "newsletter"
              ? "The Sunday Edit"
              : variant === "trial"
                ? "No credit card required"
                : "Make your next move"
          }
          title={title}
          description={description}
          media={media}
          primaryAction={
            variant === "newsletter" ? undefined : (
              <Button href="/docs/pieces/components/cta">{primary}</Button>
            )
          }
          secondaryAction={
            <Button
              variant="outline"
              href="/docs/pieces/components/cta"
            >
              {secondary}
            </Button>
          }
        >
          {variant === "newsletter" ? (
            <NewsletterSignupExample />
          ) : null}
        </CTASection>
      );
    }}
  />
);
