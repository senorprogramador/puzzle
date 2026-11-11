import { HeroVideo } from "./hero-video";

import type { HeroProps } from "./hero.types";

import "./hero.css";

const Hero = ({
  as: Component = "section",
  titleAs: Heading = "h1",

  id,
  testId,
  className,
  contentClassName,
  mediaClassName,
  style,

  layout = "split",
  mediaPosition = "right",
  alignment = "start",
  height = "auto",
  theme = "light",
  overlay = "none",
  contentWidth = "normal",

  reverseOnMobile = true,

  eyebrow,
  title,
  description,

  media,
  backgroundImage,
  backgroundVideo,

  actions,
  search,
  meta,

  children,

  role,
  ariaLabel,
  ariaLabelledBy,
}: HeroProps) => {
  const hasMedia = Boolean(media || backgroundImage || backgroundVideo);

  const hasBackground = Boolean(
    backgroundImage ||
    backgroundVideo ||
    (mediaPosition === "background" && media),
  );

  const rootClassName = ["puzzle-hero", className].filter(Boolean).join(" ");

  const contentClasses = ["puzzle-hero__content", contentClassName]
    .filter(Boolean)
    .join(" ");

  const mediaClasses = ["puzzle-hero__media", mediaClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      id={id}
      data-testid={testId}
      className={rootClassName}
      style={style}
      data-layout={layout}
      data-media-position={mediaPosition}
      data-alignment={alignment}
      data-height={height}
      data-theme={theme}
      data-overlay={overlay}
      data-content-width={contentWidth}
      data-has-media={hasMedia}
      data-has-background={hasBackground}
      data-reverse-mobile={reverseOnMobile}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      role={role}
    >
      {hasBackground && (
        <div
          className="puzzle-hero__background"
          aria-hidden="true"
          data-hero-background
        >
          {backgroundImage && (
            <img
              className="puzzle-hero__background-image"
              src={backgroundImage}
              alt=""
              loading="eager"
              decoding="async"
              draggable={false}
            />
          )}

          {backgroundVideo && (
            <HeroVideo
              source={backgroundVideo}
              className="puzzle-hero__background-video"
            />
          )}

          {mediaPosition === "background" && media && (
            <div className="puzzle-hero__background-media">{media}</div>
          )}

          <div className="puzzle-hero__overlay" />
        </div>
      )}

      <div className="puzzle-hero__inner" data-hero-inner>
        {media && mediaPosition !== "background" && (
          <div className={mediaClasses} data-hero-media>
            {media}
          </div>
        )}

        <div className={contentClasses} data-hero-content>
          {eyebrow && <div className="puzzle-hero__eyebrow">{eyebrow}</div>}

          {title && <Heading className="puzzle-hero__title">{title}</Heading>}

          {description && (
            <div className="puzzle-hero__description">{description}</div>
          )}

          {children && <div className="puzzle-hero__children">{children}</div>}

          {actions && <div className="puzzle-hero__actions">{actions}</div>}

          {search && <div className="puzzle-hero__search">{search}</div>}

          {meta && <div className="puzzle-hero__meta">{meta}</div>}
        </div>
      </div>
    </Component>
  );
};

export { Hero };
