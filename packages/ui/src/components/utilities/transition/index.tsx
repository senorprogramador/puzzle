"use client";

import { cn } from "@puzzle/core";
import {
  Children,
  cloneElement,
  type AnimationEventHandler,
  type ComponentPropsWithoutRef,
  createElement,
  type ElementType,
  isValidElement,
  type PropsWithoutRef,
  type ReactNode,
  type TransitionEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./transition.css";

type TransitionPhase = "enterFrom" | "enterTo" | "exitTo";

type TransitionTemplate =
  | "fade"
  | "slide-in-up"
  | "slide-in-down"
  | "slide-in-left"
  | "slide-in-right"
  | "accordion";

type TransitionProps<T extends ElementType = "div"> = {
  visible: boolean;
  children: ReactNode;

  /**
   * Element rendered around the children, which receives the transition
   * classes, handlers and remaining props. When omitted, the single child
   * element is animated directly and receives those props instead.
   */
  as?: T;

  enterFrom?: string;
  enterTo?: string;
  exitTo?: string;

  template?: TransitionTemplate;

  className?: string;

  duration?: number;
  unmountOnExit?: boolean;
  forceMount?: boolean;

  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const resolveTemplate = (
  template?: TransitionTemplate,
  enterFromProp?: string,
  enterToProp?: string,
  exitToProp?: string,
) => {
  switch (template) {
    case "slide-in-up":
      return {
        enterFrom: enterFromProp ?? "puzzle-transition-slide-in-up-from",
        enterTo: enterToProp ?? "puzzle-transition-slide-in-up-active",
        exitTo: exitToProp ?? "puzzle-transition-slide-in-up-exit",
      };
    case "slide-in-down":
      return {
        enterFrom: enterFromProp ?? "puzzle-transition-slide-in-down-from",
        enterTo: enterToProp ?? "puzzle-transition-slide-in-down-active",
        exitTo: exitToProp ?? "puzzle-transition-slide-in-down-exit",
      };
    case "slide-in-left":
      return {
        enterFrom: enterFromProp ?? "puzzle-transition-slide-in-left-from",
        enterTo: enterToProp ?? "puzzle-transition-slide-in-left-active",
        exitTo: exitToProp ?? "puzzle-transition-slide-in-left-exit",
      };
    case "slide-in-right":
      return {
        enterFrom: enterFromProp ?? "puzzle-transition-slide-in-right-from",
        enterTo: enterToProp ?? "puzzle-transition-slide-in-right-active",
        exitTo: exitToProp ?? "puzzle-transition-slide-in-right-exit",
      };
    case "accordion":
      return {
        enterFrom: enterFromProp ?? "puzzle-transition-accordion-from",
        enterTo: enterToProp ?? "puzzle-transition-accordion-active",
        exitTo: exitToProp ?? "puzzle-transition-accordion-exit",
      };
    case "fade":
    default:
      return {
        enterFrom: enterFromProp ?? "puzzle-transition-fade-from",
        enterTo: enterToProp ?? "puzzle-transition-fade-active",
        exitTo: exitToProp ?? "puzzle-transition-fade-exit",
      };
  }
};

type ChildProps = PropsWithoutRef<HTMLElement> & {
  onAnimationEnd?: AnimationEventHandler<HTMLElement>;
  onTransitionEnd?: TransitionEventHandler<HTMLElement>;
};

const Transition = <T extends ElementType = "div">({
  visible,
  children,
  as,
  template,
  enterFrom: enterFromProp,
  enterTo: enterToProp,
  exitTo: exitToProp,
  className = "",
  duration = 300,
  unmountOnExit = true,
  forceMount = false,
  onEnter,
  onEntered,
  onExit,
  onExited,
  ...restProps
}: TransitionProps<T>) => {
  const {
    onAnimationEnd: propsOnAnimationEnd,
    onTransitionEnd: propsOnTransitionEnd,
    ...props
  } = restProps as {
    onAnimationEnd?: AnimationEventHandler<HTMLElement>;
    onTransitionEnd?: TransitionEventHandler<HTMLElement>;
  } & Record<string, unknown>;

  const [mounted, setMounted] = useState(
    () => visible || forceMount || !unmountOnExit,
  );

  const { enterFrom, enterTo, exitTo } = resolveTemplate(
    template,
    enterFromProp,
    enterToProp,
    exitToProp,
  );

  const [phase, setPhase] = useState<TransitionPhase>(() =>
    visible || forceMount || !unmountOnExit ? "enterFrom" : "exitTo",
  );

  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialRenderRef = useRef(true);

  // Always call the latest callbacks without making them effect dependencies,
  // so passing a new callback never restarts a running transition.
  const callbacksRef = useRef({ onEnter, onEntered, onExit, onExited });

  useLayoutEffect(() => {
    callbacksRef.current = { onEnter, onEntered, onExit, onExited };
  });

  const clearTimers = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    clearTimers();

    /*
     * A permanently mounted, initially hidden transition should start in its
     * closed phase without firing onExit or starting an exit timer.
     */
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;

      if (!visible) {
        if (forceMount || !unmountOnExit) {
          setMounted(true);
          setPhase("enterFrom");
        }

        return clearTimers;
      }
    }

    /*
     * Keep the child mounted whenever exit unmounting is disabled.
     * This also covers changing unmountOnExit dynamically.
     */
    if (!unmountOnExit || forceMount) {
      setMounted(true);
    }

    if (visible) {
      setMounted(true);
      setPhase("enterFrom");

      callbacksRef.current.onEnter?.();

      // Ensure the browser applies the initial phase before entering.
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = requestAnimationFrame(() => {
          setPhase("enterTo");
        });
      });
    } else {
      if (!mounted && unmountOnExit && !forceMount) {
        return clearTimers;
      }

      setPhase("exitTo");

      callbacksRef.current.onExit?.();

      // Fallback when transitionend/animationend does not fire.
      timeoutRef.current = setTimeout(() => {
        if (unmountOnExit && !forceMount) {
          setMounted(false);
        }

        setPhase("enterFrom");
        callbacksRef.current.onExited?.();
      }, duration);
    }

    return clearTimers;
  }, [visible, unmountOnExit, duration, forceMount]);

  // animationend and transitionend can both fire for one phase; run each callback once.
  const settledPhaseRef = useRef<TransitionPhase | null>(null);

  useEffect(() => {
    settledPhaseRef.current = null;
  }, [phase, visible]);

  const handleEnd = (event: React.SyntheticEvent) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (settledPhaseRef.current === phase) {
      return;
    }

    if (phase === "enterTo") {
      settledPhaseRef.current = phase;
      callbacksRef.current.onEntered?.();
    }

    if (phase === "exitTo" && !visible) {
      settledPhaseRef.current = phase;
      clearTimers();

      if (unmountOnExit && !forceMount) {
        setMounted(false);
      }

      setPhase("enterFrom");
      callbacksRef.current.onExited?.();
    }
  };

  const handleAnimationEnd = handleEnd;
  const handleTransitionEnd = handleEnd;

  if (!mounted && !forceMount) {
    return null;
  }

  const phaseClass = {
    enterFrom,
    enterTo,
    exitTo,
  }[phase];

  if (as) {
    return createElement(
      as,
      {
        ...props,
        className: cn(className, phaseClass),
        onAnimationEnd: (event: React.AnimationEvent<HTMLElement>) => {
          propsOnAnimationEnd?.(event);
          handleAnimationEnd(event);
        },
        onTransitionEnd: (event: React.TransitionEvent<HTMLElement>) => {
          propsOnTransitionEnd?.(event);
          handleTransitionEnd(event);
        },
      },
      children,
    );
  }

  const clonedChildren = Children.map(children, (child) => {
    if (!isValidElement<ChildProps>(child)) {
      return child;
    }

    // Preserve handlers already set on the child or passed to Transition.
    return cloneElement(child, {
      ...child.props,
      ...props,
      className: cn(child.props?.className, className, phaseClass),
      onAnimationEnd: (event: React.AnimationEvent<HTMLElement>) => {
        child.props.onAnimationEnd?.(event);
        propsOnAnimationEnd?.(event);
        handleAnimationEnd(event);
      },
      onTransitionEnd: (event: React.TransitionEvent<HTMLElement>) => {
        child.props.onTransitionEnd?.(event);
        propsOnTransitionEnd?.(event);
        handleTransitionEnd(event);
      },
    });
  });

  return clonedChildren;
};

export {
  Transition,
  type TransitionProps,
  type TransitionPhase,
  type TransitionTemplate,
};
