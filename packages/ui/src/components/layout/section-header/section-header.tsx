import { Children } from "react";
import { cn } from "@puzzle-ui/core";
import { Heading } from "../../typography/heading";
import { Text } from "../../typography/text";
import type { SectionHeaderProps } from "./section-header.types";

import "./section-header.css";

const hasContent = (content: SectionHeaderProps["title"]) =>
  Children.toArray(content).length > 0;

const SectionHeader = ({
  actions,
  alignment = "start",
  className,
  description,
  eyebrow,
  style,
  title,
  titleAs = "h2",
  titleId,
  titleLevel = "headline2",
  ...props
}: SectionHeaderProps) => {
  const hasEyebrow = hasContent(eyebrow);
  const hasTitle = hasContent(title);
  const hasDescription = hasContent(description);
  const hasActions = hasContent(actions);

  if (!hasEyebrow && !hasTitle && !hasDescription && !hasActions) {
    return null;
  }

  return (
    <header
      {...props}
      className={cn("puzzle-section-header", className)}
      data-alignment={alignment}
      style={style}
    >
      {hasEyebrow && (
        <Text
          as="div"
          className="puzzle-section-header__eyebrow"
          type="overline"
        >
          {eyebrow}
        </Text>
      )}

      {hasTitle && (
        <Heading
          as={titleAs}
          className="puzzle-section-header__title"
          id={titleId}
          level={titleLevel}
        >
          {title}
        </Heading>
      )}

      {hasDescription && (
        <Text
          as="div"
          className="puzzle-section-header__description"
          type="body1"
        >
          {description}
        </Text>
      )}

      {hasActions && (
        <div className="puzzle-section-header__actions">{actions}</div>
      )}
    </header>
  );
};

export { SectionHeader };
