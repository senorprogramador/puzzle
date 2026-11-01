// @vitest-environment jsdom

import { act } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import { Portal } from "./index";

Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
});

describe("Portal", () => {
  let root: Root | null = null;

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root?.unmount();
      });

      root = null;
    }

    document.body.innerHTML = "";
  });

  it("does not render portal children during server rendering", () => {
    const markup = renderToString(
      <Portal>
        <span>Portal content</span>
      </Portal>,
    );

    expect(markup).toBe("");
  });

  it("renders its children in document.body after hydration", async () => {
    const container = document.createElement("div");

    document.body.append(container);

    const element = (
      <Portal>
        <span id="portal-child">Portal content</span>
      </Portal>
    );

    const serverMarkup = renderToString(element);

    container.innerHTML = serverMarkup;

    expect(container.querySelector("#portal-child")).toBeNull();

    await act(async () => {
      root = hydrateRoot(container, element);
    });

    expect(document.body.querySelector("#portal-child")).not.toBeNull();

    expect(container.querySelector("#portal-child")).toBeNull();
  });

  it("renders its children in the requested target", async () => {
    const target = document.createElement("div");

    target.id = "custom-portal-target";

    document.body.append(target);

    const container = document.createElement("div");

    document.body.append(container);

    const element = (
      <Portal targetId="custom-portal-target">
        <span id="custom-portal-child">Custom portal content</span>
      </Portal>
    );

    const serverMarkup = renderToString(element);

    container.innerHTML = serverMarkup;

    await act(async () => {
      root = hydrateRoot(container, element);
    });

    expect(target.querySelector("#custom-portal-child")).not.toBeNull();

    expect(document.body.querySelector("#custom-portal-child")).not.toBeNull();

    expect(container.querySelector("#custom-portal-child")).toBeNull();
  });

  it("falls back to document.body when the target does not exist", async () => {
    const container = document.createElement("div");

    document.body.append(container);

    const element = (
      <Portal targetId="missing-portal-target">
        <span id="fallback-portal-child">Fallback content</span>
      </Portal>
    );

    const serverMarkup = renderToString(element);

    container.innerHTML = serverMarkup;

    await act(async () => {
      root = hydrateRoot(container, element);
    });

    expect(
      document.body.querySelector("#fallback-portal-child"),
    ).not.toBeNull();

    expect(container.querySelector("#fallback-portal-child")).toBeNull();
  });
});
