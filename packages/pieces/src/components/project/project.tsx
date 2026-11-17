import { useId } from "react";
import { LinearProgress } from "@puzzle-ui/ui";

import "./project.css";

import type {
  ProjectCardProps,
  ProjectCollectionProps,
  ProjectHeaderProps,
  ProjectMembersProps,
  ProjectProgressProps,
  ProjectStatusBadgeProps,
} from "./project.types";

export const ProjectStatusBadge = ({
  label,
  tone = "default",
  className,
}: ProjectStatusBadgeProps) => (
  <span
    className={["puzzle-project-status-badge", className]
      .filter(Boolean)
      .join(" ")}
    data-tone={tone}
  >
    {label}
  </span>
);

export const ProjectProgress = ({
  label,
  value,
  className,
}: ProjectProgressProps) => {
  const labelId = useId();

  return (
    <div
      className={["puzzle-project-progress", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="puzzle-project-progress__header">
        <span id={labelId}>{label}</span>
        <span>{value}%</span>
      </div>
      <LinearProgress
        className="puzzle-project-progress__bar"
        value={value}
        aria-labelledby={labelId}
      />
    </div>
  );
};

export const ProjectMembers = ({
  members,
  label = "Project members",
  className,
}: ProjectMembersProps) => (
  <ul
    className={["puzzle-project-members", className]
      .filter(Boolean)
      .join(" ")}
    aria-label={label}
  >
    {members.map((member) => (
      <li className="puzzle-project-members__member" key={member.id}>
        {member.avatar && (
          <span className="puzzle-project-members__avatar" aria-hidden="true">
            {member.avatar}
          </span>
        )}
        <span>{member.name}</span>
      </li>
    ))}
  </ul>
);

export const ProjectCard = ({
  title,
  description,
  status,
  progress,
  members,
  href,
  actions,
  className,
}: ProjectCardProps) => {
  const titleId = useId();
  const heading = href ? <a href={href}>{title}</a> : title;

  return (
    <article
      className={["puzzle-project-card", className]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={titleId}
    >
      <div className="puzzle-project-card__header">
        <h3 id={titleId} className="puzzle-project-card__title">
          {heading}
        </h3>
        {status && (
          <div className="puzzle-project-card__status">{status}</div>
        )}
      </div>
      {description && (
        <p className="puzzle-project-card__description">{description}</p>
      )}
      {progress !== undefined && (
        <ProjectProgress label="Progress" value={progress} />
      )}
      {members && <ProjectMembers members={members} />}
      {actions && (
        <div className="puzzle-project-card__actions">{actions}</div>
      )}
    </article>
  );
};

export const ProjectGrid = ({
  children,
  label = "Projects",
  className,
}: ProjectCollectionProps) => (
  <section
    className={["puzzle-project-grid", className].filter(Boolean).join(" ")}
    aria-label={label}
  >
    {children}
  </section>
);

export const ProjectList = ({
  children,
  label = "Projects",
  className,
}: ProjectCollectionProps) => (
  <section
    className={["puzzle-project-list", className].filter(Boolean).join(" ")}
    aria-label={label}
  >
    {children}
  </section>
);

export const ProjectHeader = ({
  title,
  description,
  status,
  actions,
  meta,
  className,
}: ProjectHeaderProps) => (
  <header
    className={["puzzle-project-header", className]
      .filter(Boolean)
      .join(" ")}
  >
    <div className="puzzle-project-header__content">
      <div className="puzzle-project-header__title-row">
        <h1 className="puzzle-project-header__title">{title}</h1>
        {status}
      </div>
      {description && (
        <p className="puzzle-project-header__description">{description}</p>
      )}
      {meta && <div className="puzzle-project-header__meta">{meta}</div>}
    </div>
    {actions && (
      <div className="puzzle-project-header__actions">{actions}</div>
    )}
  </header>
);
