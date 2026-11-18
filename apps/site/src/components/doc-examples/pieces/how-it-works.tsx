import { HowItWorksSection } from "@puzzle-ui/pieces";
import type { HowItWorksItem, HowItWorksVariant } from "@puzzle-ui/pieces";
import { Icon } from "@puzzle-ui/icons";
import { sectionPreviewImages, SectionPreviewImage, SectionPreviewVideo } from "../shared/section-preview-media";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";

const steps: HowItWorksItem[] = [
  {
    id: "connect",
    title: "Gather the right people",
    description:
      "Invite the teammates and partners who need a clear view of the work.",
    icon: <Icon name="heroicons:users-20-solid" size={28} aria-hidden="true" />,
  },
  {
    id: "organize",
    title: "Shape a plan together",
    description:
      "Turn a great idea into shared milestones, owners, and next steps.",
    icon: <Icon name="boxicons:workflow" size={28} aria-hidden="true" />,
  },
  {
    id: "improve",
    title: "Keep progress in sight",
    description:
      "See what is moving and adjust the plan before small blockers grow.",
    icon: (
      <Icon name="coolicons:chart-line-sharp" size={28} aria-hidden="true" />
    ),
  },
  {
    id: "celebrate",
    title: "Make the next launch better",
    description:
      "Capture what worked, share the win, and carry the learning forward.",
    icon: (
      <Icon
        name="heroicons:check-circle-20-solid"
        size={28}
        aria-hidden="true"
      />
    ),
  },
];

const numberedSteps: HowItWorksItem[] = [
  {
    id: "direction",
    title: "Set a clear direction",
    description: "Agree on what success should look like before the work begins.",
  },
  {
    id: "context",
    title: "Bring the right context",
    description: "Gather the people, research, and decisions the team needs.",
  },
  {
    id: "plan",
    title: "Make a simple plan",
    description: "Turn the goal into milestones that everyone can move forward.",
  },
  {
    id: "learn",
    title: "Review and improve",
    description: "Share what worked and carry the learning into the next launch.",
  },
];

const timelineSteps: HowItWorksItem[] = [
  {
    id: "october",
    title: "October - Discover",
    description: "Listen to customers and find the opportunity worth pursuing.",
  },
  {
    id: "november",
    title: "November - Shape",
    description: "Bring the team together around a focused, testable direction.",
  },
  {
    id: "december",
    title: "December - Build",
    description: "Create, review, and refine the experience as a team.",
  },
  {
    id: "january",
    title: "January - Launch",
    description: "Share the result, learn from the response, and plan what is next.",
  },
];

const processSteps: HowItWorksItem[] = [
  {
    id: "brief",
    title: "Write the brief",
    description: "Capture the audience, objective, and one key message.",
  },
  {
    id: "concept",
    title: "Explore a direction",
    description: "Bring a few promising ideas to the table and choose one.",
  },
  {
    id: "create",
    title: "Make it real",
    description: "Build the experience, review together, and polish the details.",
  },
  {
    id: "release",
    title: "Share the launch",
    description: "Go live with confidence and keep learning from what happens.",
  },
];

const howItWorksVariants: SectionVariantPreview<HowItWorksVariant>[] = [
  {
    variant: "steps",
    useCase: "A direct sequence of instructions or milestones.",
  },
  {
    variant: "numbered",
    useCase: "Steps whose order is central to the process.",
  },
  {
    variant: "timeline",
    useCase: "A process described along a chronological line.",
  },
  { variant: "cards", useCase: "Each step explained in its own card." },
  {
    variant: "alternating",
    useCase: "A staggered sequence for a short process story.",
  },
  { variant: "horizontal", useCase: "A concise row of steps on wide screens." },
  {
    variant: "vertical",
    useCase: "A stacked process suitable for narrow pages.",
  },
  {
    variant: "connected",
    useCase: "A sequence where visual connectors clarify order.",
  },
  {
    variant: "image-steps",
    useCase: "Steps that rely on consumer-supplied images.",
  },
  {
    variant: "video-steps",
    useCase: "Steps that include consumer-supplied video.",
  },
  { variant: "process", useCase: "A compact overview of a business process." },
  {
    variant: "split",
    useCase: "A process paired with explanatory content or media.",
  },
  {
    variant: "carousel",
    useCase: "A keyboard-navigable step presented one at a time.",
  },
  {
    variant: "editorial",
    useCase: "A detailed, text-led process explanation.",
  },
];

export const HowItWorksSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="HowItWorksSection"
    variants={howItWorksVariants}
    buildCode={(variant) =>
      variant === "video-steps"
        ? `<HowItWorksSection variant="video-steps" steps={[{ id: "preview", title: "See the process", media: <video controls poster="${sectionPreviewImages.team}"><source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" /></video> }]} />`
        : variant === "image-steps" || variant === "split"
          ? `<HowItWorksSection variant="${variant}" steps={[{ id: "plan", title: "Shape a plan", media: <img src="${sectionPreviewImages.team}" alt="A team planning together" /> }]} />`
          : `<HowItWorksSection variant="${variant}" steps={steps} />`
    }
    renderVariant={(variant) => {
      const variantSteps =
        variant === "numbered"
          ? numberedSteps
          : variant === "timeline"
            ? timelineSteps
            : variant === "process"
              ? processSteps
              : steps;
      const stepImages = [
        sectionPreviewImages.team,
        sectionPreviewImages.dashboard,
        sectionPreviewImages.product,
        sectionPreviewImages.workspace,
      ];
      const mediaSteps =
        variant === "image-steps" || variant === "split"
          ? variantSteps.map((step, index) => ({
              ...step,
              icon: undefined,
              media: (
                <SectionPreviewImage
                  src={stepImages[index]!}
                  alt={`Team workflow, step ${index + 1}`}
                />
              ),
            }))
          : variant === "video-steps"
            ? variantSteps.map((step, index) => ({
                ...step,
                icon: undefined,
                media:
                  index === 1 ? (
                    <SectionPreviewVideo />
                  ) : (
                    <SectionPreviewImage
                      src={stepImages[index]!}
                      alt={`Team workflow, step ${index + 1}`}
                    />
                  ),
              }))
            : variantSteps;
      const copy: Record<
        HowItWorksVariant,
        { eyebrow: string; title: string; description: string }
      > = {
        steps: {
          eyebrow: "A simple process",
          title: "From first idea to first win",
          description:
            "Gather the people and context, shape a plan, then keep the momentum going.",
        },
        numbered: {
          eyebrow: "A four-part framework",
          title: "Four clear moves toward launch",
          description:
            "A practical sequence for turning a good idea into work your team can share.",
        },
        timeline: {
          eyebrow: "The next few months",
          title: "A launch plan with room to breathe",
          description:
            "Make the milestones visible, from early discovery to the lessons after launch.",
        },
        cards: {
          eyebrow: "A connected team",
          title: "Every part of the process, in view",
          description:
            "Make each stage easy to understand and easy to pick up.",
        },
        alternating: {
          eyebrow: "A little rhythm",
          title: "The work behind the work",
          description:
            "Keep the story moving as your team moves from question to outcome.",
        },
        horizontal: {
          eyebrow: "A focused sprint",
          title: "A plan everyone can scan",
          description:
            "Give the team a quick, shared view of the next four milestones.",
        },
        vertical: {
          eyebrow: "Start where you are",
          title: "A gentle path to getting started",
          description:
            "A simple sequence for teams who want to make progress without extra process.",
        },
        connected: {
          eyebrow: "One thing leads to another",
          title: "A path from first thought to shipped work",
          description:
            "Show how each stage connects to the next, without losing the bigger picture.",
        },
        "image-steps": {
          eyebrow: "A more visual guide",
          title: "See the work take shape",
          description:
            "Use real imagery to help people picture each stage of the experience.",
        },
        "video-steps": {
          eyebrow: "A process in motion",
          title: "See the process, not just the promise",
          description:
            "Pair a short video with clear steps so the flow feels tangible.",
        },
        process: {
          eyebrow: "From brief to launch",
          title: "A repeatable creative process",
          description:
            "Keep the essentials visible while leaving space for the details to evolve.",
        },
        split: {
          eyebrow: "Make the complex feel simple",
          title: "Good work happens one step at a time",
          description:
            "Pair the overview with real moments from the people doing the work.",
        },
        carousel: {
          eyebrow: "One step at a time",
          title: "Take the next step with confidence",
          description:
            "A focused walkthrough keeps each part of the journey easy to follow.",
        },
        editorial: {
          eyebrow: "A considered way to work",
          title: "Great work is built one decision at a time",
          description:
            "Tell a richer process story with enough room for every important detail.",
        },
      };

      return (
        <HowItWorksSection
          variant={variant}
          eyebrow={copy[variant].eyebrow}
          title={copy[variant].title}
          description={copy[variant].description}
          steps={mediaSteps}
        />
      );
    }}
  />
);
