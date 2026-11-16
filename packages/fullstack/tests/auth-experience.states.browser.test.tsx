import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "../src/auth/client/react";
import { AuthExperience } from "../src/auth/client/experience";
import type { AuthClientSnapshot } from "../src/auth/shared";

const unauthenticatedSnapshot: AuthClientSnapshot = {
  status: "unauthenticated",
  user: null,
};
const authenticatedSnapshot: AuthClientSnapshot = {
  status: "authenticated",
  user: {
    id: "user-1",
    email: "person@example.com",
    name: "Example",
    image: null,
    emailVerified: true,
  },
};

const createClient = () => ({
  getSnapshot: vi.fn(async () => unauthenticatedSnapshot),
  signIn: vi.fn(async () => unauthenticatedSnapshot),
  register: vi.fn(async () => unauthenticatedSnapshot),
  signOut: vi.fn(async () => {}),
  verifyMfaTotp: vi.fn(async () => unauthenticatedSnapshot),
  verifyMfaRecoveryCode: vi.fn(async () => unauthenticatedSnapshot),
  signInWithPasskey: vi.fn(async () => unauthenticatedSnapshot),
  verifyMfaWithPasskey: vi.fn(async () => unauthenticatedSnapshot),
  requestEmailVerification: vi.fn(async () => {}),
  verifyEmail: vi.fn(async () => {}),
  requestPasswordReset: vi.fn(async () => {}),
  resetPassword: vi.fn(async () => {}),
  changePassword: vi.fn(async () => {}),
  isPasskeySupported: vi.fn(() => false),
  listMfaFactors: vi.fn(async () => ({ factors: [], recoveryCodeCount: 0 })),
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

const renderSignUp = (
  props: Pick<
    React.ComponentProps<typeof AuthExperience>,
    "onSubmit" | "onSuccess" | "config"
  >,
) => {
  const client = createClient();
  render(
    <AuthProvider client={client} initialSnapshot={unauthenticatedSnapshot}>
      <AuthExperience mode="sign-up" {...props} />
    </AuthProvider>,
  );
  return client;
};

const fillSignUpForm = async () => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Email/), "person@example.com");
  await user.type(screen.getByLabelText(/^Password/), "correct-password");
  await user.type(screen.getByLabelText(/Confirm password/), "correct-password");
  return user;
};

afterEach(cleanup);

describe("AuthExperience submission states", () => {
  it("shows loading state, disables repeated submission, and invokes success once", async () => {
    let finish!: (snapshot: AuthClientSnapshot) => void;
    const onSubmit = vi.fn(
      () => new Promise<AuthClientSnapshot>((resolve) => { finish = resolve; }),
    );
    const onSuccess = vi.fn();
    renderSignUp({ onSubmit, onSuccess });
    const user = await fillSignUpForm();
    const submit = screen.getByRole("button", { name: "Create an account" });

    await user.click(submit);
    expect(await screen.findByRole("button", { name: "Creating account..." })).toBeDisabled();
    expect(onSubmit).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: "Creating account..." }));
    expect(onSubmit).toHaveBeenCalledOnce();

    finish(authenticatedSnapshot);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(screen.getByRole("button", { name: "Create an account" })).toBeEnabled();
  });

  it("shows a rejected submission as an alert and restores the form", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Registration unavailable"));
    renderSignUp({ onSubmit });
    const user = await fillSignUpForm();

    await user.click(screen.getByRole("button", { name: "Create an account" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());

    expect(await screen.findByText("Registration unavailable")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create an account" })).toBeEnabled();
  });

  it("runs a safe same-origin redirect after successful registration", async () => {
    const onSubmit = vi.fn(async () => authenticatedSnapshot);
    const target = `${window.location.pathname}${window.location.search}#signup-complete`;
    renderSignUp({
      onSubmit,
      config: { redirects: { afterSignUp: target } },
    });
    const user = await fillSignUpForm();

    await user.click(screen.getByRole("button", { name: "Create an account" }));

    await waitFor(() => expect(window.location.hash).toBe("#signup-complete"));
  });

  it("does not navigate to protocol-relative or backslash redirects", async () => {
    const initialHash = window.location.hash;
    const onSubmit = vi.fn(async () => authenticatedSnapshot);
    renderSignUp({
      onSubmit,
      config: { redirects: { afterSignUp: "//attacker.example/path" } },
    });
    const user = await fillSignUpForm();

    await user.click(screen.getByRole("button", { name: "Create an account" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(window.location.hash).toBe(initialHash);
  });
});
