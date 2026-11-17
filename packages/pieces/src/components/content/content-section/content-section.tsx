import type { ElementType, ReactNode } from "react";
import {
  EditorialFigure,
  type EditorialImage,
} from "../shared";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import type {
  ContentSectionProps,
  ContentSectionVariant,
} from "./content-section.types";
import "./content-section.css";

const ContentMedia = ({
  media,
  image,
}: {
  media?: ReactNode;
  image?: EditorialImage;
}) => {
  if (media !== undefined && media !== null) {
    return <>{media}</>;
  }

  return image ? (
    <EditorialFigure
      image={image}
      className="puzzle-content-section__figure"
    />
  ) : null;
};

const ContentSection = <C extends ElementType = "section">({
  variant = "single-column",
  image,
  media,
  columns,
  sidebar,
  attribution,
  children,
  className,
  ...sectionProps
}: ContentSectionProps<C>) => {
  const content = columns?.length ? (
    <div className="puzzle-content-section__columns">
      {columns.map((column, index) => (
        <div className="puzzle-content-section__column" key={index}>
          {column}
        </div>
      ))}
    </div>
  ) : (
    children
  );

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-content-section ${className ?? ""}`.trim()}
      family="content"
      variant={variant satisfies ContentSectionVariant}
    >
      {variant === "quote" ? (
        <blockquote className="puzzle-content-section__quote">
          {content}
          {attribution ? <cite>{attribution}</cite> : null}
        </blockquote>
      ) : (
        <div className="puzzle-content-section__layout">
          <div className="puzzle-content-section__body">
            <ContentMedia media={media} image={image} />
            {content}
          </div>
          {sidebar ? (
            <aside
              className="puzzle-content-section__sidebar"
              aria-label="Related content"
            >
              {sidebar}
            </aside>
          ) : null}
        </div>
      )}
    </MarketingSection>
  );
};

export { ContentSection };
