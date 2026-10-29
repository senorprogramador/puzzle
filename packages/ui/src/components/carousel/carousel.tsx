import { cn } from "@puzzle/core";
import {
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { useCarouselContext } from "./carousel-controller";
import "./carousel.css";

type ResponsiveConfig<T> = {
  mobile: T;
  tablet?: T;
  desktop?: T;
};

type ResponsiveValue<T> = T | ResponsiveConfig<T>;

type CarouselAlignment = "left" | "center" | "right";

type CarouselButtonAlignment = "aside" | "over";

type CarouselPagerAlignment = "under" | "over";

type CarouselAlignmentConfig = ResponsiveValue<CarouselButtonAlignment>;

type PagerAlignmentConfig = ResponsiveValue<CarouselPagerAlignment>;

type CarouselLayout = {
  itemsPerPage: number;
  numberOfPages: number;
  maxStartIndex: number;
  maxOffset: number;
  itemOffsets: number[];
};

type DragSample = {
  x: number;
  time: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startOffset: number;
  currentOffset: number;
  renderedOffset: number;
  hasMoved: boolean;
  interruptedAnimation: boolean;
  samples: DragSample[];
};

type CarouselProps<T> = {
  renderItem: (item: T, index: number) => ReactNode;

  panelsPerView?: ResponsiveValue<number>;
  itemWidth?: ResponsiveValue<CSSProperties["width"]>;
  gap?: ResponsiveValue<CSSProperties["gap"]>;

  className?: string;
  viewportClassName?: string;
  viewportStyle?: CSSProperties;
  ariaLabel?: string;

  singlePageAlignment?: CarouselAlignment;

  backButton?: ReactElement;
  nextButton?: ReactElement;

  buttonAlignment?: CarouselAlignmentConfig;
  pagerAlignment?: PagerAlignmentConfig;
  renderPager?: (currentPage: number, numberOfPages: number) => ReactNode;
};

const defaultLayout: CarouselLayout = {
  itemsPerPage: 1,
  numberOfPages: 0,
  maxStartIndex: 0,
  maxOffset: 0,
  itemOffsets: [],
};

const rubberBandDistance = (distance: number, dimension: number): number => {
  const size = Math.max(1, dimension);
  const resistance = 0.55;

  return (distance * resistance * size) / (size + resistance * distance);
};

const rubberBandOffset = (
  offset: number,
  maxOffset: number,
  viewportWidth: number,
): number => {
  if (offset < 0) {
    return -rubberBandDistance(-offset, viewportWidth);
  }

  if (offset > maxOffset) {
    return maxOffset + rubberBandDistance(offset - maxOffset, viewportWidth);
  }

  return offset;
};

const readRenderedOffset = (element: HTMLElement, fallback: number): number => {
  const ownerWindow = element.ownerDocument.defaultView ?? window;
  const transform = ownerWindow.getComputedStyle(element).transform;

  if (!transform || transform === "none") {
    return fallback;
  }

  const isMatrix3d = transform.startsWith("matrix3d(");
  const values = transform
    .slice(isMatrix3d ? 9 : 7, -1)
    .split(",")
    .map(Number);

  const translateX = values[isMatrix3d ? 12 : 4];

  return Number.isFinite(translateX) ? -translateX : fallback;
};

const estimatePointerVelocity = (samples: DragSample[]): number => {
  if (samples.length < 2) {
    return 0;
  }

  const end = samples[samples.length - 1];
  const cutoff = end.time - 100;

  let start = samples[0];

  for (const sample of samples) {
    if (sample.time <= cutoff) {
      start = sample;
    } else {
      break;
    }
  }

  const elapsedSeconds = (end.time - start.time) / 1000;

  if (elapsedSeconds <= 0) {
    return 0;
  }

  // Convert pointer movement to content movement.
  return -(end.x - start.x) / elapsedSeconds;
};

const resolveResponsiveValue = <T,>(
  value: ResponsiveValue<T> | undefined,
  fallback: T,
): ResponsiveConfig<T> => {
  if (value === undefined) {
    return {
      mobile: fallback,
      tablet: fallback,
      desktop: fallback,
    };
  }

  if (typeof value === "object" && value !== null && "mobile" in value) {
    const responsive = value as ResponsiveConfig<T>;
    const mobile = responsive.mobile ?? fallback;
    const tablet = responsive.tablet ?? mobile;

    return {
      mobile,
      tablet,
      desktop: responsive.desktop ?? tablet,
    };
  }

  return {
    mobile: value as T,
    tablet: value as T,
    desktop: value as T,
  };
};

const resolveAlignmentConfig = <T,>(
  config: ResponsiveValue<T> | undefined,
  fallback: T,
): ResponsiveConfig<T> => {
  if (config === undefined) {
    return {
      mobile: fallback,
      tablet: fallback,
      desktop: fallback,
    };
  }

  if (typeof config === "object" && config !== null && "mobile" in config) {
    const responsive = config as ResponsiveConfig<T>;
    const mobile = responsive.mobile ?? fallback;
    const tablet = responsive.tablet ?? mobile;

    return {
      mobile,
      tablet,
      desktop: responsive.desktop ?? tablet,
    };
  }

  return {
    mobile: config as T,
    tablet: config as T,
    desktop: config as T,
  };
};

const toCssLength = (
  value: CSSProperties["width"] | CSSProperties["gap"] | undefined,
): string => {
  if (typeof value === "number") {
    return `${value}px`;
  }

  return value ?? "0px";
};

const getItemBasis = (itemsPerPage: number, gap: string): string => {
  const count = Math.max(1, Math.floor(itemsPerPage || 1));

  if (count === 1) {
    return "100%";
  }

  if (gap === "" || gap === "0px" || gap === "0") {
    return `calc((100% / ${count}) - (1px / ${count}))`;
  }

  const gapTerms = Array.from({ length: count - 1 }, () => `(${gap})`).join(
    " + ",
  );

  return `calc((100% - (${gapTerms})) / ${count})`;
};

const getPagerDataAttribute = (alignment: CarouselPagerAlignment) =>
  alignment === "under" ? "under" : "over";

const cloneNavigationButton = (
  button: ReactElement | undefined,
  disabled: boolean,
  onNavigate: () => void,
): ReactNode => {
  if (!button) {
    return null;
  }

  const originalProps = button.props as {
    disabled?: boolean;
    onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  };

  const isDisabled = disabled || originalProps.disabled === true;

  return cloneElement(button as ReactElement<Record<string, unknown>>, {
    disabled: isDisabled,
    "aria-disabled": isDisabled,
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }

      originalProps.onClick?.(event);
      onNavigate();
    },
  });
};

const Carousel = <T,>({
  renderItem,
  panelsPerView,
  itemWidth,
  gap = 0,
  className,
  viewportClassName,
  viewportStyle,
  ariaLabel = "Carousel",
  singlePageAlignment = "left",
  backButton,
  nextButton,
  buttonAlignment,
  pagerAlignment,
  renderPager,
}: CarouselProps<T>) => {
  const { items, currentPanel, setPanel } = useCarouselContext<T>();

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const dragRef = useRef<DragState | null>(null);
  const pointerCleanupRef = useRef<(() => void) | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const visualOffsetRef = useRef(0);
  const suppressClickRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [layout, setLayout] = useState<CarouselLayout>(defaultLayout);

  const sizingMode = itemWidth !== undefined ? "item-width" : "panels";

  const panelCounts = resolveResponsiveValue(panelsPerView, 1);
  const itemWidths = resolveResponsiveValue(itemWidth, "100%");
  const gaps = resolveResponsiveValue(gap, 0);

  const buttonAlignments = resolveAlignmentConfig<CarouselButtonAlignment>(
    buttonAlignment,
    "over",
  );

  const pagerAlignments = resolveAlignmentConfig<CarouselPagerAlignment>(
    pagerAlignment,
    "under",
  );

  const cssVariables = {
    "--puzzle-carousel-gap-mobile": toCssLength(gaps.mobile),
    "--puzzle-carousel-gap-tablet": toCssLength(gaps.tablet),
    "--puzzle-carousel-gap-desktop": toCssLength(gaps.desktop),

    "--puzzle-carousel-basis-mobile": getItemBasis(
      panelCounts.mobile,
      toCssLength(gaps.mobile),
    ),
    "--puzzle-carousel-basis-tablet": getItemBasis(
      panelCounts.tablet ?? panelCounts.mobile,
      toCssLength(gaps.tablet),
    ),
    "--puzzle-carousel-basis-desktop": getItemBasis(
      panelCounts.desktop ?? panelCounts.tablet ?? panelCounts.mobile,
      toCssLength(gaps.desktop),
    ),

    "--puzzle-carousel-item-width-mobile": toCssLength(itemWidths.mobile),
    "--puzzle-carousel-item-width-tablet": toCssLength(itemWidths.tablet),
    "--puzzle-carousel-item-width-desktop": toCssLength(itemWidths.desktop),
  } as CSSProperties;

  /**
   * Read the actual rendered widths and positions of the items.
   * This supports both panelsPerView and itemWidth sizing.
   */
  const measureLayout = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track || items.length === 0) {
      setLayout(defaultLayout);
      return;
    }

    const viewportRect = viewport.getBoundingClientRect();
    const viewportWidth = viewportRect.width;
    const itemNodes = itemRefs.current
      .slice(0, items.length)
      .filter((item): item is HTMLDivElement => item !== null);

    if (viewportWidth <= 0 || itemNodes.length === 0) {
      return;
    }

    // Relative positions preserve fractional CSS pixels and cancel the
    // track's current translate transform.
    const trackRect = track.getBoundingClientRect();
    const itemRects = itemNodes.map((item) => item.getBoundingClientRect());

    const itemOffsets = itemRects.map((rect) => rect.left - trackRect.left);

    let itemsPerPage = 0;

    for (const rect of itemRects) {
      const itemEnd = rect.right - trackRect.left;

      if (itemEnd <= viewportWidth + 0.01) {
        itemsPerPage += 1;
      } else {
        break;
      }
    }

    itemsPerPage = Math.max(1, itemsPerPage);

    const numberOfPages = Math.ceil(items.length / itemsPerPage);
    const maxStartIndex = Math.max(0, items.length - itemsPerPage);
    const lastItemEnd = itemRects[itemRects.length - 1].right - trackRect.left;
    const maxOffset = Math.max(0, lastItemEnd - viewportWidth);

    setLayout((previous) => {
      const unchanged =
        previous.itemsPerPage === itemsPerPage &&
        previous.numberOfPages === numberOfPages &&
        previous.maxStartIndex === maxStartIndex &&
        previous.maxOffset === maxOffset &&
        previous.itemOffsets.length === itemOffsets.length &&
        previous.itemOffsets.every(
          (offset, index) => offset === itemOffsets[index],
        );

      if (unchanged) {
        return previous;
      }

      return {
        itemsPerPage,
        numberOfPages,
        maxStartIndex,
        maxOffset,
        itemOffsets,
      };
    });
  }, [items.length]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track) {
      return;
    }

    const ownerWindow = viewport.ownerDocument.defaultView ?? window;

    measureLayout();

    if (typeof ResizeObserver === "undefined") {
      ownerWindow.addEventListener("resize", measureLayout);

      return () => {
        ownerWindow.removeEventListener("resize", measureLayout);
      };
    }

    const observer = new ResizeObserver(measureLayout);

    observer.observe(viewport);
    observer.observe(track);

    itemRefs.current.slice(0, items.length).forEach((item) => {
      if (item) {
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, [items.length, measureLayout]);

  /**
   * currentPanel is always an item index.
   *
   * Restrict it to the last position from which the viewport can be
   * completely filled without scrolling beyond the end of the track.
   */
  const activePanel = Math.min(
    Math.max(0, Math.floor(currentPanel)),
    layout.maxStartIndex,
  );

  /**
   * Logical page starts can overlap at the end.
   *
   * Example: 5 items with 3 visible per page:
   * [0, 2], not [0, 3].
   *
   * Example: 8 items with 3 visible per page:
   * [0, 3, 5].
   */
  const pageStartIndices = useMemo(
    () =>
      Array.from({ length: layout.numberOfPages }, (_, pageIndex) => {
        if (pageIndex === layout.numberOfPages - 1) {
          return layout.maxStartIndex;
        }

        return Math.min(pageIndex * layout.itemsPerPage, layout.maxStartIndex);
      }),
    [layout.itemsPerPage, layout.maxStartIndex, layout.numberOfPages],
  );

  /**
   * Map the active item to the nearest logical page.
   * This lets swipe-to-panel and page-based navigation coexist.
   */
  const activePageIndex = useMemo(() => {
    if (pageStartIndices.length === 0) {
      return 0;
    }

    return pageStartIndices.reduce((closestIndex, pageStart, index) => {
      const closestStart = pageStartIndices[closestIndex];

      return Math.abs(pageStart - activePanel) <
        Math.abs(closestStart - activePanel)
        ? index
        : closestIndex;
    }, 0);
  }, [activePanel, pageStartIndices]);

  const clampOffset = useCallback(
    (offset: number) => Math.min(layout.maxOffset, Math.max(0, offset)),
    [layout.maxOffset],
  );

  const activeOffset = clampOffset(layout.itemOffsets[activePanel] ?? 0);

  useEffect(() => {
    if (dragRef.current || animationFrameRef.current !== null) {
      return;
    }

    visualOffsetRef.current = activeOffset;
  }, [activeOffset]);

  useEffect(
    () => () => {
      pointerCleanupRef.current?.();

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  /**
   * Only correct the controller after layout measurement has completed.
   * This avoids forcing currentPanel to 0 during the initial render.
   */
  useEffect(() => {
    if (layout.numberOfPages > 0 && currentPanel !== activePanel) {
      setPanel(activePanel);
    }
  }, [activePanel, currentPanel, layout.numberOfPages, setPanel]);

  const goToPage = useCallback(
    (pageIndex: number) => {
      const targetPage = Math.max(
        0,
        Math.min(pageIndex, pageStartIndices.length - 1),
      );

      const targetPanel = pageStartIndices[targetPage];

      if (targetPanel !== undefined) {
        setPanel(targetPanel);
      }
    },
    [pageStartIndices, setPanel],
  );

  const goToPreviousPage = useCallback(() => {
    goToPage(activePageIndex - 1);
  }, [activePageIndex, goToPage]);

  const goToNextPage = useCallback(() => {
    goToPage(activePageIndex + 1);
  }, [activePageIndex, goToPage]);

  /**
   * Start tracking a swipe or mouse drag.
   *
   * Capture on the original element rather than always on the viewport,
   * so a normal click on an interactive child can still work.
   */

  const writeTrackOffset = useCallback((offset: number) => {
    visualOffsetRef.current = offset;

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }
  }, []);

  const getNearestPanelIndex = useCallback(
    (offset: number) => {
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (let index = 0; index <= layout.maxStartIndex; index += 1) {
        const candidateOffset = clampOffset(layout.itemOffsets[index] ?? 0);

        const distance = Math.abs(candidateOffset - offset);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      }

      return nearestIndex;
    },
    [clampOffset, layout.itemOffsets, layout.maxStartIndex],
  );

  /**
   * Animate to a panel using a damped spring.
   *
   * A little underdamping gives the motion a natural overshoot.
   * The target remains a real, reachable item offset.
   */
  const animateToPanel = useCallback(
    (fromOffset: number, targetPanel: number, initialVelocity: number) => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      const track = trackRef.current;
      const ownerWindow =
        viewportRef.current?.ownerDocument.defaultView ?? window;
      const targetOffset = clampOffset(layout.itemOffsets[targetPanel] ?? 0);

      if (
        !track ||
        ownerWindow.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        writeTrackOffset(targetOffset);
        track?.style.removeProperty("transition");
        setPanel(targetPanel);
        setIsDragging(false);
        setIsAnimating(false);
        return;
      }

      track.style.transition = "none";

      setIsDragging(false);
      setIsAnimating(true);

      let position = fromOffset;

      // Preserve some release momentum without allowing extreme fling speeds.
      let velocity = Math.max(-1800, Math.min(1800, initialVelocity * 0.4));

      let previousTime = performance.now();

      const stiffness = 230;
      const damping = 24;

      const animate = (now: number) => {
        const deltaSeconds = Math.min((now - previousTime) / 1000, 1 / 30);

        previousTime = now;

        const springAcceleration = (targetOffset - position) * stiffness;

        const dampingAcceleration = velocity * damping;

        velocity += (springAcceleration - dampingAcceleration) * deltaSeconds;

        position += velocity * deltaSeconds;

        const viewportWidth = viewportRef.current?.clientWidth ?? 1;

        writeTrackOffset(
          rubberBandOffset(position, layout.maxOffset, viewportWidth),
        );

        const positionSettled = Math.abs(targetOffset - position) < 0.5;

        const velocitySettled = Math.abs(velocity) < 10;

        if (positionSettled && velocitySettled) {
          animationFrameRef.current = null;

          writeTrackOffset(targetOffset);
          track.style.removeProperty("transition");

          setPanel(targetPanel);
          setIsAnimating(false);

          return;
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [
      clampOffset,
      layout.itemOffsets,
      layout.maxOffset,
      setPanel,
      writeTrackOffset,
    ],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!event.isPrimary || dragRef.current) {
        return;
      }

      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      if (layout.maxOffset <= 0) {
        return;
      }

      const track = trackRef.current;
      const viewport = viewportRef.current;
      const ownerWindow = viewport?.ownerDocument.defaultView ?? window;

      if (!track || !viewport || !ownerWindow) {
        return;
      }

      const interruptedAnimation = animationFrameRef.current !== null;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      /*
       * Read the currently displayed offset before disabling the CSS
       * transition. This also handles starting a drag during an animation.
       */
      const startOffset = readRenderedOffset(track, visualOffsetRef.current);

      track.style.transition = "none";
      writeTrackOffset(startOffset);

      setIsAnimating(false);
      setIsDragging(true);

      const startTime = performance.now();

      const drag: DragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startOffset,
        currentOffset: startOffset,
        renderedOffset: startOffset,
        hasMoved: false,
        interruptedAnimation,
        samples: [
          {
            x: event.clientX,
            time: startTime,
          },
        ],
      };

      dragRef.current = drag;

      const updatePointerPosition = (pointerEvent: PointerEvent) => {
        const deltaX = pointerEvent.clientX - drag.startX;

        if (!drag.hasMoved && Math.abs(deltaX) <= 4) {
          return;
        }

        drag.hasMoved = true;

        // Positive offset means the content moves to the left.
        drag.currentOffset = drag.startOffset - deltaX;

        drag.renderedOffset = rubberBandOffset(
          drag.currentOffset,
          layout.maxOffset,
          viewport.clientWidth,
        );

        const now = performance.now();

        drag.samples.push({
          x: pointerEvent.clientX,
          time: now,
        });

        // Retain a short history for release-velocity estimation.
        while (drag.samples.length > 2 && now - drag.samples[1].time > 120) {
          drag.samples.shift();
        }

        writeTrackOffset(drag.renderedOffset);

        if (pointerEvent.cancelable) {
          pointerEvent.preventDefault();
        }
      };

      const cleanup = () => {
        ownerWindow.removeEventListener("pointermove", handleWindowPointerMove);
        ownerWindow.removeEventListener("pointerup", handleWindowPointerUp);
        ownerWindow.removeEventListener(
          "pointercancel",
          handleWindowPointerCancel,
        );
        ownerWindow.removeEventListener("blur", handleWindowBlur);

        if (pointerCleanupRef.current === cleanup) {
          pointerCleanupRef.current = null;
        }
      };

      const settleCancelledDrag = () => {
        if (dragRef.current !== drag) {
          return;
        }

        cleanup();
        dragRef.current = null;
        setIsDragging(false);

        const targetPanel = getNearestPanelIndex(
          clampOffset(drag.currentOffset),
        );

        animateToPanel(drag.renderedOffset, targetPanel, 0);
      };

      const handleWindowPointerMove = (pointerEvent: PointerEvent) => {
        if (pointerEvent.pointerId !== drag.pointerId) {
          return;
        }

        updatePointerPosition(pointerEvent);
      };

      const handleWindowPointerUp = (pointerEvent: PointerEvent) => {
        if (pointerEvent.pointerId !== drag.pointerId) {
          return;
        }

        // Include the final pointer position, even if no final move fired.
        updatePointerPosition(pointerEvent);

        cleanup();
        dragRef.current = null;
        setIsDragging(false);

        if (!drag.hasMoved) {
          if (drag.interruptedAnimation) {
            const targetPanel = getNearestPanelIndex(
              clampOffset(drag.startOffset),
            );

            animateToPanel(drag.startOffset, targetPanel, 0);
          } else {
            track.style.removeProperty("transition");
            writeTrackOffset(drag.startOffset);
          }

          return;
        }

        suppressClickRef.current = true;

        ownerWindow.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);

        const velocity = estimatePointerVelocity(drag.samples);

        /*
         * Project the release position forward. A fast swipe can skip
         * multiple items, while a slow drag generally snaps nearby.
         */
        const projectedOffset = clampOffset(
          clampOffset(drag.currentOffset) + velocity * 0.18,
        );

        const targetPanel = getNearestPanelIndex(projectedOffset);

        animateToPanel(drag.renderedOffset, targetPanel, velocity);
      };

      const handleWindowPointerCancel = (pointerEvent: PointerEvent) => {
        if (pointerEvent.pointerId === drag.pointerId) {
          settleCancelledDrag();
        }
      };

      const handleWindowBlur = () => {
        settleCancelledDrag();
      };

      pointerCleanupRef.current = cleanup;

      /*
       * Listen on window instead of relying on events staying inside the
       * viewport. Releasing outside the carousel still completes the drag.
       */
      ownerWindow.addEventListener("pointermove", handleWindowPointerMove);
      ownerWindow.addEventListener("pointerup", handleWindowPointerUp);
      ownerWindow.addEventListener("pointercancel", handleWindowPointerCancel);
      ownerWindow.addEventListener("blur", handleWindowBlur);
    },
    [
      animateToPanel,
      clampOffset,
      getNearestPanelIndex,
      layout.maxOffset,
      setIsAnimating,
      writeTrackOffset,
    ],
  );

  const handleClickCapture = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!suppressClickRef.current) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      suppressClickRef.current = false;
    },
    [],
  );

  const isFirstPage = activePageIndex === 0;
  const isLastPage =
    layout.numberOfPages <= 1 || activePageIndex >= layout.numberOfPages - 1;

  const currentPage = layout.numberOfPages > 0 ? activePageIndex : 0;

  return (
    <div
      className={cn("puzzle-carousel", className)}
      style={cssVariables}
      data-sizing={sizingMode}
      data-dragging={isDragging ? "true" : "false"}
      data-animating={isAnimating ? "true" : "false"}
      data-single-page={layout.numberOfPages <= 1 ? "true" : "false"}
      data-single-page-alignment={singlePageAlignment}
      data-button-mobile={buttonAlignments.mobile}
      data-button-tablet={buttonAlignments.tablet}
      data-button-desktop={buttonAlignments.desktop}
      data-pager-mobile={getPagerDataAttribute(pagerAlignments.mobile)}
      data-pager-tablet={getPagerDataAttribute(
        pagerAlignments.tablet ?? pagerAlignments.mobile,
      )}
      data-pager-desktop={getPagerDataAttribute(
        pagerAlignments.desktop ??
          pagerAlignments.tablet ??
          pagerAlignments.mobile,
      )}
    >
      <div className="puzzle-carousel__stage">
        <div className="puzzle-carousel__navigation puzzle-carousel__navigation--previous">
          {cloneNavigationButton(backButton, isFirstPage, goToPreviousPage)}
        </div>

        <div
          ref={viewportRef}
          className={cn("puzzle-carousel__viewport", viewportClassName)}
          style={viewportStyle}
          role="group"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
          onPointerDown={handlePointerDown}
          onClickCapture={handleClickCapture}
          onDragStart={(event) => event.preventDefault()}
        >
          <div
            ref={trackRef}
            className="puzzle-carousel__track"
            style={{
              transform: `translate3d(${-activeOffset}px, 0, 0)`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className="puzzle-carousel__item"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${items.length}`}
              >
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        </div>

        <div className="puzzle-carousel__navigation puzzle-carousel__navigation--next">
          {cloneNavigationButton(nextButton, isLastPage, goToNextPage)}
        </div>
      </div>

      {renderPager && layout.numberOfPages > 0 && (
        <div className="puzzle-carousel__pager">
          {renderPager(currentPage, layout.numberOfPages)}
        </div>
      )}
    </div>
  );
};

export {
  Carousel,
  type CarouselProps,
  type CarouselAlignment,
  type CarouselButtonAlignment,
  type CarouselPagerAlignment,
  type CarouselAlignmentConfig,
  type PagerAlignmentConfig,
};
