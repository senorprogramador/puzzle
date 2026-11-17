import React from "react";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent as browserUserEvent } from "vitest/browser";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";

import { AuthProvider } from "../src/auth/client/react";
import { AuthExperience } from "../src/auth/client/experience";
import type { AuthClientFactorList, AuthClientSnapshot } from "../src/auth/shared";

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
  listMfaFactors: vi.fn(async (): Promise<AuthClientFactorList> => ({
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
  demoTotpCode,
  ...props
}: {
  client?: ReturnType<typeof createClient>;
  demoTotpCode?: string;
  mode?: "sign-in" | "sign-up";
  config?: React.ComponentProps<typeof AuthExperience>["config"];
  onSubmit?: React.ComponentProps<typeof AuthExperience>["onSubmit"];
  onSuccess?: React.ComponentProps<typeof AuthExperience>["onSuccess"];
} = {}) =>
  render(
    <AuthProvider
      client={client}
      initialSnapshot={unauthenticatedSnapshot}
      demoTotpCode={demoTotpCode}
    >
      <AuthExperience {...props} />
    </AuthProvider>,
  );

afterEach(() => {
  cleanup();
});

describe("AuthExperience browser behavior", () => {
  const signIn = async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Email address/), "person@example.com");
    await user.type(screen.getByLabelText(/Password/), "correct-password");
    await user.click(screen.getByRole("button", { name: "Continue", exact: true }));
    return user;
  };

  it("offers passkey enrollment before completing login and allows skipping", async () => {
    const client = createClient();
    client.isPasskeySupported.mockReturnValue(true);
    client.signIn.mockResolvedValue(authenticatedSnapshot);
    const onSuccess = vi.fn();
    renderExperience({ client, onSuccess, config: { offerPasskeyAfterSignIn: true } });

    const user = await signIn();
    expect(await screen.findByRole("heading", { name: "Add passkey" })).toBeInTheDocument();
    expect(await screen.findByLabelText("Current password")).toHaveValue("");
    expect(onSuccess).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Skip for now" }));
    expect(onSuccess).toHaveBeenCalledOnce();
    expect(client.registerPasskey).not.toHaveBeenCalled();
  });

  it("keeps recovery codes visible until the user continues after enrollment", async () => {
    const client = createClient();
    client.isPasskeySupported.mockReturnValue(true);
    client.signIn.mockResolvedValue(authenticatedSnapshot);
    client.registerPasskey.mockResolvedValue({ recoveryCodes: ["recovery-one", "recovery-two"] });
    const onSuccess = vi.fn();
    renderExperience({ client, onSuccess, config: { offerPasskeyAfterSignIn: true } });

    const user = await signIn();
    await user.type(await screen.findByLabelText("Current password"), "confirmed-password");
    await user.click(screen.getByRole("button", { name: "Add passkey" }));
    expect(client.registerPasskey).toHaveBeenCalledWith("confirmed-password");
    expect(await screen.findByRole("heading", { name: "Passkey added" })).toBeInTheDocument();
    expect(screen.getByText("recovery-one")).toBeInTheDocument();
    expect(screen.getByText("recovery-two")).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Continue", exact: true }));
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it("reports registration errors, clears the password and still allows skipping", async () => {
    const client = createClient();
    client.isPasskeySupported.mockReturnValue(true);
    client.signIn.mockResolvedValue(authenticatedSnapshot);
    client.registerPasskey.mockRejectedValue(new Error("Passkey registration cancelled"));
    const onSuccess = vi.fn();
    renderExperience({ client, onSuccess, config: { offerPasskeyAfterSignIn: true } });

    const user = await signIn();
    await user.type(await screen.findByLabelText("Current password"), "confirmed-password");
    await user.click(screen.getByRole("button", { name: "Add passkey" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Passkey registration cancelled");
    expect(screen.getByLabelText("Current password")).toHaveValue("");
    expect(onSuccess).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Skip for now" }));
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it.each([false, true])("preserves immediate login when disabled or unsupported (%s)", async (enabled) => {
    const client = createClient();
    client.isPasskeySupported.mockReturnValue(!enabled);
    client.signIn.mockResolvedValue(authenticatedSnapshot);
    const onSuccess = vi.fn();
    renderExperience({ client, onSuccess, config: { offerPasskeyAfterSignIn: enabled } });
    await signIn();
    expect(onSuccess).toHaveBeenCalledOnce();
    expect(client.listMfaFactors).not.toHaveBeenCalled();
    expect(screen.queryByRole("heading", { name: "Add passkey" })).not.toBeInTheDocument();
  });

  it("continues immediately for users who already have an active passkey", async () => {
    const client = createClient();
    client.isPasskeySupported.mockReturnValue(true);
    client.signIn.mockResolvedValue(authenticatedSnapshot);
    client.listMfaFactors.mockResolvedValue({
      factors: [{
        id: "passkey-1", type: "passkey", status: "active", label: "Existing passkey",
        createdAt: new Date().toISOString(), lastUsedAt: null,
      }],
      recoveryCodeCount: 5,
    });
    const onSuccess = vi.fn();
    renderExperience({ client, onSuccess, config: { offerPasskeyAfterSignIn: true } });
    await signIn();
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(client.registerPasskey).not.toHaveBeenCalled();
  });

  it("reports factor lookup errors rather than silently completing login", async () => {
    const client = createClient();
    client.isPasskeySupported.mockReturnValue(true);
    client.signIn.mockResolvedValue(authenticatedSnapshot);
    client.listMfaFactors.mockRejectedValue(new Error("Cannot load passkeys"));
    const onSuccess = vi.fn();
    renderExperience({ client, onSuccess, config: { offerPasskeyAfterSignIn: true } });
    const user = await signIn();
    expect(await screen.findByRole("alert")).toHaveTextContent("Cannot load passkeys");
    expect(onSuccess).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Skip for now" }));
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it("waits for MFA before offering a passkey", async () => {
    const client = createClient();
    client.isPasskeySupported.mockReturnValue(true);
    client.signIn.mockResolvedValue({
      status: "mfa-pending", user: null,
      mfa: {
        purpose: "sign-in", challengeId: "challenge-1",
        expiresAt: new Date(Date.now() + 60_000).toISOString(),
        availableFactors: ["totp"],
      },
    });
    client.verifyMfaTotp.mockResolvedValue(authenticatedSnapshot);
    const onSuccess = vi.fn();
    renderExperience({
      client,
      onSuccess,
      demoTotpCode: "123456",
      config: { offerPasskeyAfterSignIn: true },
    });
    const user = await signIn();
    expect(await screen.findByRole("heading", { name: "Verify your identity" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your authentication code to continue. Demo authentication code: 123456.",
      ),
    ).toBeInTheDocument();
    expect(client.listMfaFactors).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText(/Authentication code/), "123456");
    await user.click(screen.getByRole("button", { name: "Verify", exact: true }));
    expect(await screen.findByLabelText("Current password")).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("shows the MFA challenge after password sign-in requires a passkey", async () => {
    const user = userEvent.setup();
    const client = createClient();
    client.isPasskeySupported.mockReturnValue(true);
    client.signIn.mockResolvedValue({
      status: "mfa-pending",
      user: null,
      mfa: {
        purpose: "sign-in",
        challengeId: "challenge-1",
        expiresAt: new Date(Date.now() + 60_000).toISOString(),
        availableFactors: ["passkey", "recovery-code"],
      },
    });
    client.verifyMfaWithPasskey.mockResolvedValue(authenticatedSnapshot);

    renderExperience({ client, mode: "sign-in" });
    await user.type(screen.getByLabelText(/Email address/), "person@example.com");
    await user.type(screen.getByLabelText(/Password/), "correct-password");
    await user.click(screen.getByRole("button", { name: "Continue", exact: true }));

    expect(await screen.findByRole("heading", { name: "Verify your identity" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continue with passkey" }));
    expect(client.verifyMfaWithPasskey).toHaveBeenCalledOnce();
  });

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

  it("rejects an invalid email address before calling the submit callback", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => authenticatedSnapshot);

    renderExperience({
      mode: "sign-up",
      onSubmit,
    });

    const email = screen.getByLabelText(/Email/);

    await user.type(email, "not-an-email");
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
      await screen.findByText("Enter a valid email address."),
    ).toBeInTheDocument();

    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute(
      "aria-describedby",
      "puzzle-auth-experience-email-error",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("clears the email validation error when the address is corrected", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => authenticatedSnapshot);

    renderExperience({
      mode: "sign-up",
      onSubmit,
    });

    const email = screen.getByLabelText(/Email/);

    await user.type(email, "not-an-email");
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
      await screen.findByText("Enter a valid email address."),
    ).toBeInTheDocument();

    await user.clear(email);
    await user.type(email, "person@example.com");

    expect(
      screen.queryByText("Enter a valid email address."),
    ).not.toBeInTheDocument();

    expect(email).not.toHaveAttribute("aria-invalid", "true");

    await user.click(
      screen.getByRole("button", {
        name: "Create an account",
      }),
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it("preserves, initializes and removes custom field values when config.fields changes", async () => {
    const user = userEvent.setup();
    const client = createClient();
    const onSubmit = vi.fn(async () => authenticatedSnapshot);

    const initialConfig = {
      fields: [
        {
          name: "company",
          label: "Company",
          type: "text" as const,
          defaultValue: "Puzzle",
        },
      ],
    };

    const { rerender } = render(
      <AuthProvider
        client={client as never}
        initialSnapshot={unauthenticatedSnapshot}
      >
        <AuthExperience
          mode="sign-up"
          config={initialConfig}
          onSubmit={onSubmit}
        />
      </AuthProvider>,
    );

    const company = screen.getByLabelText("Company");

    await user.clear(company);
    await user.type(company, "Puzzle Labs");

    rerender(
      <AuthProvider
        client={client as never}
        initialSnapshot={unauthenticatedSnapshot}
      >
        <AuthExperience
          mode="sign-up"
          config={{
            fields: [
              {
                name: "company",
                label: "Company",
                type: "text",
                defaultValue: "Another company",
              },
              {
                name: "department",
                label: "Department",
                type: "text",
                defaultValue: "Engineering",
              },
            ],
          }}
          onSubmit={onSubmit}
        />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Company")).toHaveValue("Puzzle Labs");
      expect(screen.getByLabelText("Department")).toHaveValue("Engineering");
    });

    rerender(
      <AuthProvider
        client={client as never}
        initialSnapshot={unauthenticatedSnapshot}
      >
        <AuthExperience
          mode="sign-up"
          config={{
            fields: [
              {
                name: "company",
                label: "Company",
                type: "text",
              },
            ],
          }}
          onSubmit={onSubmit}
        />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByLabelText("Department")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Company")).toHaveValue("Puzzle Labs");
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

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: { company: "Puzzle Labs" },
      }),
    );
  });

  it("submits values from Puzzle UI custom controls and native input types", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => authenticatedSnapshot);

    renderExperience({
      mode: "sign-up",
      onSubmit,
      config: {
        fields: [
          { name: "notes", label: "Notes", type: "textarea" },
          { name: "terms", label: "Accept terms", type: "checkbox", required: true },
          {
            name: "country",
            label: "Country",
            type: "select",
            options: [{ label: "Netherlands", value: "nl" }],
          },
          { name: "phone", label: "Phone", type: "tel" },
          { name: "website", label: "Website", type: "url" },
          { name: "seats", label: "Seats", type: "number" },
        ],
      },
    });

    await user.type(screen.getByLabelText(/Email/), "person@example.com");
    await user.type(screen.getByLabelText(/^Password/), "a-strong-password");
    await user.type(screen.getByLabelText(/Confirm password/), "a-strong-password");
    await user.type(screen.getByLabelText("Notes"), "Hello Puzzle");
    await user.click(screen.getByRole("checkbox", { name: "Accept terms" }));
    await user.click(screen.getByRole("combobox", { name: "Country" }));
    await user.click(await screen.findByRole("option", { name: "Netherlands" }));
    await user.type(screen.getByLabelText("Phone"), "123456");
    await user.type(screen.getByLabelText("Website"), "https://example.com");
    await user.type(screen.getByLabelText("Seats"), "3");

    expect(screen.getByLabelText("Website")).toHaveAttribute("type", "url");
    expect(screen.getByLabelText("Seats")).toHaveAttribute("type", "number");

    await user.click(screen.getByRole("button", { name: "Create an account" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fields: {
            notes: "Hello Puzzle",
            terms: true,
            country: "nl",
            phone: "123456",
            website: "https://example.com",
            seats: "3",
          },
        }),
      );
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

  it("shows browser-only passkey sign-in after hydration without a mismatch", async () => {
    const client = createClient(unauthenticatedSnapshot);
    client.isPasskeySupported.mockReturnValue(true);
    const onRecoverableError = vi.fn();

    const app = (
      <AuthProvider
        client={client as never}
        initialSnapshot={unauthenticatedSnapshot}
      >
        <AuthExperience mode="sign-in" />
      </AuthProvider>
    );

    const markup = renderToString(app);
    const container = document.createElement("div");

    container.innerHTML = markup;
    document.body.append(container);

    expect(markup).not.toContain("Continue with passkey");

    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, app, {
        onRecoverableError,
      });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(container.textContent).toContain("Continue with passkey");

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
