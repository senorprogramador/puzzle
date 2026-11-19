import { ProfileCard, Heading } from "@puzzle-ui/ui";
import { useId, type ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { validateContentIds } from "../../content/shared";
import type { BusinessDepartment, BusinessProfile } from "../shared.types";
import type {
  TeamSectionProps,
  TeamSectionVariant,
} from "./team-section.types";

import "../shared.css";
import "./team-section.css";

const groupMembers = (members: readonly BusinessProfile[]) => {
  const groups = new Map<string, BusinessProfile[]>();

  for (const member of members) {
    const department = member.department ?? "Team";
    groups.set(department, [...(groups.get(department) ?? []), member]);
  }

  return [...groups].map(([name, groupMembers]) => ({
    id: name,
    name,
    members: groupMembers,
  }));
};

const renderMemberList = (
  members: readonly BusinessProfile[],
  className = "",
  scrollable = false,
) =>
  members.length ? (
    <ul
      className={`puzzle-business-section__list ${className}`.trim()}
      aria-label="Team members"
      tabIndex={scrollable ? 0 : undefined}
    >
      {members.map((member) => (
        <li key={member.id}>
          <ProfileCard {...member} />
        </li>
      ))}
    </ul>
  ) : null;

const renderDepartments = (
  departments: readonly BusinessDepartment[],
  idPrefix: string,
) =>
  departments.length ? (
    <div className="puzzle-team-section__departments">
      {departments.map((department, index) => (
        <section
          className="puzzle-team-section__department"
          key={department.id}
          aria-labelledby={`${idPrefix}-department-${index}`}
        >
          <Heading level="headline3" as="h3" id={`${idPrefix}-department-${index}`}>{department.name}</Heading>
          {renderMemberList(
            department.members,
            "puzzle-team-section__members",
          )}
        </section>
      ))}
    </div>
  ) : null;

const TeamSection = <C extends ElementType = "section">({
  variant = "grid",
  items = [],
  departments = [],
  featuredMember,
  children,
  className,
  ...sectionProps
}: TeamSectionProps<C>) => {
  const idPrefix = useId();
  const groupedMembers = departments.length ? departments : groupMembers(items);
  const members =
    departments.length > 0
      ? departments.flatMap((department) => department.members)
      : items;

  validateContentIds(members, "Team member");
  if (departments.length) {
    validateContentIds(departments, "Team department");
  }

  const featured =
    typeof featuredMember === "string"
      ? members.find((member) => member.id === featuredMember)
      : featuredMember ??
        (variant === "featured" || variant === "leadership"
          ? members.find((member) => member.featured) ?? members[0]
          : undefined);
  const remainingMembers = featured
    ? members.filter((member) => member.id !== featured.id)
    : members;

  let content = renderMemberList(members, "puzzle-team-section__members");
  if (variant === "departments") {
    content = renderDepartments(groupedMembers, idPrefix);
  } else if (variant === "featured" || variant === "leadership") {
    content = featured || remainingMembers.length ? (
      <div className="puzzle-team-section__featured-layout">
        {featured ? (
          <ProfileCard
            {...featured}
            className="puzzle-team-section__featured"
            featured
          />
        ) : null}
        {renderMemberList(
          remainingMembers,
          "puzzle-team-section__members",
        )}
      </div>
    ) : null;
  } else if (variant === "horizontal" || variant === "carousel") {
    content = renderMemberList(
      members,
      "puzzle-team-section__members",
      true,
    );
  }

  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-team-section ${className ?? ""}`.trim()}
      family="team"
      variant={variant satisfies TeamSectionVariant}
    >
      {content}
      {children}
    </MarketingSection>
  );
};

export { TeamSection };
