"use client";

import { cn } from "@puzzle/core";
import {
  Children,
  cloneElement,
  type ComponentPropsWithoutRef,
  type ElementType,
  isValidElement,
  type PropsWithoutRef,
  type ReactNode,
  useEffect,
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
  | "slide-in-right";

type TransitionProps<T extends ElementType = "div"> = {
  visible: boolean;
  children: ReactNode;

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
    case "fade":
    default:
      return {
        enterFrom: enterFromProp ?? "puzzle-transition-fade-from",
        enterTo: enterToProp ?? "puzzle-transition-fade-active",
        exitTo: exitToProp ?? "puzzle-transition-fade-exit",
      };
  }
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
  ...props
}: TransitionProps<T>) => {
  const Component = as ?? "div";

  const [mounted, setMounted] = useState(visible);

  const { enterFrom, enterTo, exitTo } = resolveTemplate(
    template,
    enterFromProp,
    enterToProp,
    exitToProp,
  );

  const [phase, setPhase] = useState<TransitionPhase>(
    visible || forceMount ? "enterFrom" : "exitTo",
  );

  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    if (visible) {
      setMounted(true);
      setPhase("enterFrom");

      onEnter?.();

      // Zorg dat de browser eerst de beginstatus kan toepassen.
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = requestAnimationFrame(() => {
          setPhase("enterTo");
        });
      });
    } else {
      if (!mounted) {
        return;
      }

      setPhase("exitTo");

      onExit?.();

      // Fallback wanneer transitionend/animationend niet afgaat.
      timeoutRef.current = setTimeout(() => {
        if (unmountOnExit && !forceMount) {
          setMounted(false);
        }
        setPhase("enterFrom");
        onExited?.();
      }, duration);
    }

    return clearTimers;
  }, [visible, unmountOnExit, duration, forceMount]);

  const handleAnimationEnd = (event: React.AnimationEvent) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (phase === "enterTo") {
      onEntered?.();
    }

    if (phase === "exitTo" && !visible) {
      clearTimers();
      if (unmountOnExit && !forceMount) {
        setMounted(false);
      }
      setPhase("enterFrom");
      onExited?.();
    }
  };

  const handleTransitionEnd = (event: React.TransitionEvent) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (phase === "enterTo") {
      onEntered?.();
    }

    if (phase === "exitTo" && !visible) {
      clearTimers();
      if (unmountOnExit && !forceMount) {
        setMounted(false);
      }
      setPhase("enterFrom");
      onExited?.();
    }
  };

  if (!mounted && !forceMount) {
    return null;
  }

  const phaseClass = {
    enterFrom,
    enterTo,
    exitTo,
  }[phase];

  const clonedChildren = Children.map(children, (child) => {
    // TODO: validate child as a React element that can accept className prop
    if (!isValidElement<PropsWithoutRef<HTMLElement>>(child)) {
      return child;
    }
    return cloneElement(child, {
      ...child.props,
      ...props,
      className: cn(child.props?.className, className, phaseClass),
      onAnimationEnd: handleAnimationEnd,
      onTransitionEnd: handleTransitionEnd,
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
