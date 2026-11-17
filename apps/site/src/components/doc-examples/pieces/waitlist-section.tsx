import { useState } from "react";
import { WaitlistSection, type WaitlistSectionVariant } from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const variants: SectionVariantPreview<WaitlistSectionVariant>[] = [
  { variant: "centered", useCase: "Keep a short launch message and signup together." },
  { variant: "split", useCase: "Pair signup with launch information or media." },
  { variant: "countdown", useCase: "Show a static countdown supplied by the app." },
  { variant: "progress", useCase: "Show current signup progress." },
  { variant: "referral", useCase: "Explain a caller-owned referral benefit." },
  { variant: "launch", useCase: "Introduce a product launch." },
  { variant: "early-access", useCase: "Offer a focused early-access signup." },
  { variant: "card", useCase: "Contain the signup in a card surface." },
  { variant: "social-proof", useCase: "Pair signup with community proof." },
  { variant: "multi-step", useCase: "Compose a caller-provided staged signup flow." },
];

export const WaitlistSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="WaitlistSection"
    variants={variants}
    buildCode={(variant) =>
      `<WaitlistSection variant="${variant}" onSubmit={handleSignup} />`
    }
    renderVariant={(variant) => (
      <WaitlistSection
        title="Be first to try Northstar"
        description="A calmer way for growing teams to plan what comes next."
        variant={variant}
        countdown={{ days: 12, hours: 3, minutes: 20 }}
        progress={{ value: 240, max: 500, label: "240 founders already joined" }}
        socialProof={<p>Built with feedback from independent product teams.</p>}
        referralInfo={<p>Invite a colleague when your access is confirmed.</p>}
        onSubmit={() => {}}
      />
    )}
  />
);

export const InteractiveWaitlistExample = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <WaitlistSection
      title="Get early access to Northstar"
      description="Leave your email and see the local submission state."
      variant="launch"
      countdown={{ days: 12, hours: 3, minutes: 20 }}
      progress={{ value: 240, max: 500, label: "240 of 500 preview places claimed" }}
      socialProof={<p>Product teams at Northstar, Morrow, and Fieldwork are interested.</p>}
      onSubmit={async (email) => {
        await new Promise<void>((resolve) => setTimeout(resolve, 300));
        setSubmitted(email.length > 0);
      }}
      success={submitted ? "You're on the Northstar early-access list." : undefined}
    />
  );
};
