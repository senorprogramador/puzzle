import type { ElementType } from "react";

import { HeroVideo } from "./hero-video";

import type { HeroProps } from "./hero.types";

import styles from "./hero.module.css";

const Hero = ({
  as: Component = "section",
  titleAs = "h1",

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

  const Heading = titleAs as ElementType;

  const rootClassName = [styles.hero, className].filter(Boolean).join(" ");

  const contentClasses = [styles.content, contentClassName]
    .filter(Boolean)
    .join(" ");

  const mediaClasses = [styles.media, mediaClassName].filter(Boolean).join(" ");

  return (
    <Component
      id={id}
      data-testid={testId}
      className={rootClassName}
      style={style}
      data-hero
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
        <div className={styles.background} aria-hidden="true">
          {backgroundImage && (
            <img
              className={styles.backgroundImage}
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
              className={styles.backgroundVideo}
            />
          )}

          {mediaPosition === "background" && media && (
            <div className={styles.backgroundMedia}>{media}</div>
          )}

          <div className={styles.overlay} />
        </div>
      )}

      <div className={styles.inner} data-hero-inner>
        {media && mediaPosition !== "background" && (
          <div className={mediaClasses} data-hero-media>
            {media}
          </div>
        )}

        <div className={contentClasses} data-hero-content>
          {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}

          {title && <Heading className={styles.title}>{title}</Heading>}

          {description && (
            <div className={styles.description}>{description}</div>
          )}

          {children && <div className={styles.children}>{children}</div>}

          {actions && <div className={styles.actions}>{actions}</div>}

          {search && <div className={styles.search}>{search}</div>}

          {meta && <div className={styles.meta}>{meta}</div>}
        </div>
      </div>
    </Component>
  );
};

export { Hero };
