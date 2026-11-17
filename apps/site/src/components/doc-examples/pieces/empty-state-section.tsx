import { EmptyStateSection, type EmptyStateSectionVariant } from "@puzzle-ui/pieces";
import { Button } from "@puzzle-ui/ui";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const emptyStateVariants: SectionVariantPreview<EmptyStateSectionVariant>[] = [
  { variant: "centered", useCase: "Give an empty collection a clear focal point." },
  { variant: "illustration", useCase: "Pair the message with decorative media." },
  { variant: "minimal", useCase: "Use a quiet message inside a larger layout." },
  { variant: "card", useCase: "Contain the message and action on a surface." },
  { variant: "split", useCase: "Place supporting content beside the message." },
  { variant: "search", useCase: "Explain a search with no matching results." },
  { variant: "error", useCase: "Describe a failed operation and next step." },
  { variant: "success", useCase: "Confirm an empty-state transition." },
  { variant: "onboarding", useCase: "Invite a first-time user to begin." },
  { variant: "full-page", useCase: "Fill a route with no primary content." },
  { variant: "compact", useCase: "Show a smaller empty result inline." },
  { variant: "action", useCase: "Emphasize a primary next step." },
];

export const EmptyStateSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="EmptyStateSection"
    variants={emptyStateVariants}
    buildCode={(variant) =>
      `<EmptyStateSection variant="${variant}" title="No projects yet" primaryAction={<Button>Create project</Button>} />`
    }
    renderVariant={(variant) => (
      <EmptyStateSection
        variant={variant}
        title={
          variant === "error"
            ? "Reports could not be loaded"
            : variant === "success"
              ? "You're all caught up"
              : "No projects yet"
        }
        description={
          variant === "error"
            ? "Try again or contact your workspace administrator."
            : "Create a project to give your team a place to start."
        }
        icon={<span aria-hidden="true">+</span>}
        primaryAction={
          <Button
            href={
              variant === "error"
                ? "/docs/pieces/components/feedback"
                : "/docs/pieces/components/project"
            }
          >
            {variant === "error" ? "View feedback patterns" : "Explore projects"}
          </Button>
        }
        errorDetails={
          variant === "error" ? "Request ID: rpt-2026-114" : undefined
        }
        status={variant === "success" ? "status" : undefined}
      />
    )}
  />
);
