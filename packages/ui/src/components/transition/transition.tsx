"use client";

import { cn } from "@puzzle/core";
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type TransitionPhase = "enterFrom" | "enterTo" | "exitTo";

type Template = "fade";

type TransitionProps<T extends ElementType = "div"> = {
  visible: boolean;
  children: ReactNode;

  as?: T;

  enterFrom?: string;
  enterTo?: string;
  exitTo?: string;

  template?: Template;

  className?: string;

  duration?: number;
  unmountOnExit?: boolean;

  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const Transition = <T extends ElementType = "div">({
  visible,
  children,
  as,
  template,
  enterFrom = template === "fade" ? "puzzle-transition-fade-from" : "",
  enterTo = template === "fade" ? "puzzle-transition-fade-active" : "",
  exitTo = template === "fade" ? "puzzle-transition-fade-exit" : "",
  className = "",
  duration = 300,
  unmountOnExit = true,
  onEnter,
  onEntered,
  onExit,
  onExited,
  ...props
}: TransitionProps<T>) => {
  const Component = as ?? "div";

  const [mounted, setMounted] = useState(visible);

  const [phase, setPhase] = useState<TransitionPhase>(
    visible ? "enterFrom" : "exitTo",
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

      if (!unmountOnExit) {
        return;
      }

      // Fallback wanneer transitionend/animationend niet afgaat.
      timeoutRef.current = setTimeout(() => {
        setMounted(false);
        onExited?.();
      }, duration);
    }

    return clearTimers;
  }, [visible, unmountOnExit, duration]);

  const handleAnimationEnd = (event: React.AnimationEvent) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (phase === "enterTo") {
      onEntered?.();
    }

    if (phase === "exitTo" && !visible && unmountOnExit) {
      clearTimers();
      setMounted(false);
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

    if (phase === "exitTo" && !visible && unmountOnExit) {
      clearTimers();
      setMounted(false);
      onExited?.();
    }
  };

  if (!mounted) {
    return null;
  }

  const phaseClass = {
    enterFrom,
    enterTo,
    exitTo,
  }[phase];

  return (
    <Component
      {...props}
      className={cn(className, phaseClass)}
      onAnimationEnd={handleAnimationEnd}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </Component>
  );
};

export { Transition, type TransitionProps };
