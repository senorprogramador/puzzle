import { Heading } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import { TeamSection } from "../team-section";
import type { BusinessProfile } from "../shared.types";
import type { HostProfileSectionProps } from "./host-profile-section.types";
import "./host-profile-section.css";

const HostProfileSection = <C extends ElementType = "section">({
  host,
  variant = "profile",
  languagesLabel = "Languages",
  storyLabel = "A little about your host",
  className,
  children,
  ...sectionProps
}: HostProfileSectionProps<C>) => {
  const {
    languages,
    story,
    contactAction,
    role,
    ...profileFields
  } = host;
  const profile: BusinessProfile = {
    ...profileFields,
    role: role ?? "Host",
  };
  const hasAdditionalContent =
    Boolean(languages?.length) || Boolean(story) || Boolean(contactAction);
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <TeamSection<C>
      {...nativeProps}
      className={`puzzle-host-profile-section ${className ?? ""}`.trim()}
      variant={variant}
      items={[profile]}
    >
      {hasAdditionalContent ? (
        <div className="puzzle-host-profile-section__details">
          {languages?.length ? (
            <div className="puzzle-host-profile-section__languages">
              <strong>{languagesLabel}</strong>
              <ul aria-label={languagesLabel}>
                {languages.map((language) => (
                  <li key={language}>{language}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {story ? (
            <div className="puzzle-host-profile-section__story">
              <Heading level="headline3" as="h3">
                {storyLabel}
              </Heading>
              <div>{story}</div>
            </div>
          ) : null}
          {contactAction ? (
            <div className="puzzle-host-profile-section__contact">
              {contactAction}
            </div>
          ) : null}
        </div>
      ) : null}
      {children}
    </TeamSection>
  );
};

export { HostProfileSection };
