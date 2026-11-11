import React from "react";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent as browserUserEvent } from "vitest/browser";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";

import { AuthProvider } from "../src/auth/client/react";
import { AuthExperience } from "../src/auth/client/experience";
import type { AuthClientSnapshot } from "../src/auth/shared";

const unauthenticatedSnapshot = {
  status: "unauthenticated" as const,
  user: null,
};

const authenticatedSnapshot = {
  status: "authenticated" as const,
  user: {
    id: "user-1",
    email: "person@example.com",
    name: "Example",
    image: null,
    emailVerified: true,
  },
};

const createClient = (
  snapshot: AuthClientSnapshot = unauthenticatedSnapshot,
) => ({
  getSnapshot: vi.fn(async () => snapshot),
  signIn: vi.fn(async () => snapshot),
  register: vi.fn(async () => snapshot),
  signOut: vi.fn(async () => {}),
  verifyMfaTotp: vi.fn(async () => snapshot),
  verifyMfaRecoveryCode: vi.fn(async () => snapshot),
  signInWithPasskey: vi.fn(async () => snapshot),
  verifyMfaWithPasskey: vi.fn(async () => snapshot),
  requestEmailVerification: vi.fn(async () => {}),
  verifyEmail: vi.fn(async () => {}),
  requestPasswordReset: vi.fn(async () => {}),
  resetPassword: vi.fn(async () => {}),
  changePassword: vi.fn(async () => {}),
  isPasskeySupported: vi.fn(() => false),
  listMfaFactors: vi.fn(async () => ({
    factors: [],
    recoveryCodeCount: 0,
  })),
  beginTotpEnrollment: vi.fn(),
  verifyTotpEnrollment: vi.fn(),
  registerPasskey: vi.fn(),
  beginRequiredTotpEnrollment: vi.fn(),
  verifyRequiredTotpEnrollment: vi.fn(),
  registerRequiredPasskey: vi.fn(),
  removeMfaFactor: vi.fn(),
  regenerateRecoveryCodes: vi.fn(),
  beginStepUp: vi.fn(),
  verifyStepUpTotp: vi.fn(),
  verifyStepUpRecoveryCode: vi.fn(),
  verifyStepUpWithPasskey: vi.fn(),
});

const renderExperience = ({
  client = createClient(),
  ...props
}: {
  client?: ReturnType<typeof createClient>;
  mode?: "sign-in" | "sign-up";
  config?: React.ComponentProps<typeof AuthExperience>["config"];
  onSubmit?: React.ComponentProps<typeof AuthExperience>["onSubmit"];
} = {}) =>
  render(
    <AuthProvider
      client={client as never}
      initialSnapshot={unauthenticatedSnapshot}
    >
      <AuthExperience {...props} />
    </AuthProvider>,
  );

afterEach(() => {
  cleanup();
});

describe("AuthExperience browser behavior", () => {
  it("supports keyboard navigation through registration controls", async () => {
    const user = userEvent.setup();

    renderExperience({
      mode: "sign-up",
      config: {
        fields: [
          {
            name: "company",
            label: "Company",
            type: "text",
          },
        ],
      },
    });

    await user.tab();
    expect(screen.getByLabelText("Name")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/Email/)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/Password/)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/Confirm password/)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("Company")).toHaveFocus();
  });

  it("supports keyboard entry in custom fields", async () => {
    const user = userEvent.setup();

    renderExperience({
      mode: "sign-up",
      config: {
        fields: [
          {
            name: "company",
            label: "Company",
            type: "text",
          },
        ],
      },
    });

    await user.type(screen.getByLabelText("Company"), "Puzzle Labs");

    expect(screen.getByLabelText("Company")).toHaveValue("Puzzle Labs");
  });

  it("exposes custom field descriptions to assistive technology", () => {
    renderExperience({
      mode: "sign-up",
      config: {
        fields: [
          {
            name: "company",
            label: "Company",
            type: "text",
            description: "Enter your organization name.",
          },
        ],
      },
    });

    expect(
      screen.getByRole("textbox", {
        name: "Company",
      }),
    ).toHaveAccessibleDescription("Enter your organization name.");
  });

  it("marks required custom fields accessibly", () => {
    renderExperience({
      mode: "sign-up",
      config: {
        fields: [
          {
            name: "company",
            label: "Company",
            type: "text",
            required: true,
          },
        ],
      },
    });

    expect(screen.getByLabelText(/Company/)).toBeRequired();
  });

  it("reports custom validation errors and links them to the field", async () => {
    const user = userEvent.setup();

    renderExperience({
      mode: "sign-up",
      config: {
        fields: [
          {
            name: "inviteCode",
            label: "Invitation code",
            type: "text",
            validate: (value) =>
              value === "PUZZLE"
                ? undefined
                : "The invitation code is invalid.",
          },
        ],
      },
      onSubmit: vi.fn(async () => authenticatedSnapshot),
    });

    await user.type(screen.getByLabelText("Invitation code"), "INVALID");

    await user.type(screen.getByLabelText(/Email/), "person@example.com");
    await user.type(screen.getByLabelText(/^Password/), "a-strong-password");
    await user.type(
      screen.getByLabelText(/Confirm password/),
      "a-strong-password",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create an account",
      }),
    );

    expect(
      await screen.findByText("The invitation code is invalid."),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Invitation code")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("does not call the submit callback when custom validation fails", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => authenticatedSnapshot);

    renderExperience({
      mode: "sign-up",
      config: {
        fields: [
          {
            name: "terms",
            label: "Accept terms",
            type: "checkbox",
            required: true,
          },
        ],
      },
      onSubmit,
    });

    await user.type(screen.getByLabelText(/Email/), "person@example.com");
    await user.type(screen.getByLabelText(/^Password/), "a-strong-password");
    await user.type(
      screen.getByLabelText(/Confirm password/),
      "a-strong-password",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create an account",
      }),
    );

    expect(
      await screen.findByText("Accept terms is required."),
    ).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("passes custom values and the existing sign-up action to the callback", async () => {
    const user = userEvent.setup();
    const client = createClient();
    const onSubmit = vi.fn(
      async ({
        signUp,
        registration,
        fields,
      }: Parameters<
        NonNullable<React.ComponentProps<typeof AuthExperience>["onSubmit"]>
      >[0]) => {
        expect(registration.email).toBe("person@example.com");
        expect(fields.company).toBe("Puzzle Labs");

        return signUp(registration);
      },
    );

    renderExperience({
      mode: "sign-up",
      client,
      config: {
        fields: [
          {
            name: "company",
            label: "Company",
            type: "text",
          },
        ],
      },
      onSubmit,
    });

    await user.type(screen.getByLabelText(/Email/), "person@example.com");
    await user.type(screen.getByLabelText(/^Password/), "a-strong-password");
    await user.type(
      screen.getByLabelText(/Confirm password/),
      "a-strong-password",
    );
    await user.type(screen.getByLabelText("Company"), "Puzzle Labs");

    await user.click(
      screen.getByRole("button", {
        name: "Create an account",
      }),
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(client.register).toHaveBeenCalledTimes(1);
    });
  });

  it("uses the real browser keyboard event path", async () => {
    renderExperience({
      mode: "sign-up",
      config: {
        fields: [
          {
            name: "company",
            label: "Company",
            type: "text",
          },
        ],
      },
    });

    await browserUserEvent.tab();
    await browserUserEvent.tab();
    await browserUserEvent.tab();
    await browserUserEvent.tab();
    await browserUserEvent.tab();

    expect(screen.getByLabelText("Company")).toHaveFocus();
  });

  it("does not submit when the password confirmation differs", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => authenticatedSnapshot);

    renderExperience({
      mode: "sign-up",
      onSubmit,
    });

    await user.type(screen.getByLabelText(/Email/), "person@example.com");
    await user.type(screen.getByLabelText(/^Password/), "first-password");
    await user.type(
      screen.getByLabelText(/Confirm password/),
      "different-password",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create an account",
      }),
    );

    expect(
      await screen.findByText("Passwords do not match."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("hydrates using the same initial snapshot as the server", async () => {
    const client = createClient(unauthenticatedSnapshot);
    const onRecoverableError = vi.fn();

    const app = (
      <AuthProvider
        client={client as never}
        initialSnapshot={unauthenticatedSnapshot}
      >
        <AuthExperience mode="sign-up" />
      </AuthProvider>
    );

    const markup = renderToString(app);
    const container = document.createElement("div");

    container.innerHTML = markup;
    document.body.append(container);

    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, app, {
        onRecoverableError,
      });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(container.querySelector('input[type="email"]')).not.toBeNull();

    await act(async () => {
      root?.unmount();
    });

    container.remove();
  });

  it("updates the snapshot after hydration without a markup mismatch", async () => {
    const client = createClient(authenticatedSnapshot);
    const onRecoverableError = vi.fn();

    const app = (
      <AuthProvider
        client={client as never}
        initialSnapshot={unauthenticatedSnapshot}
      >
        <AuthExperience mode="sign-up" />
      </AuthProvider>
    );

    const markup = renderToString(app);
    const container = document.createElement("div");

    container.innerHTML = markup;

    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, app, {
        onRecoverableError,
      });
    });

    await waitFor(() => {
      expect(client.getSnapshot).toHaveBeenCalled();
    });

    expect(onRecoverableError).not.toHaveBeenCalled();

    await act(async () => {
      root?.unmount();
    });

    container.remove();
  });
});
