import test from "node:test";
import assert from "node:assert/strict";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  AuthProvider,
  AuthScreen,
  SignInForm,
  SignUpForm,
  MfaChallengeForm,
  useAuth,
  useSession,
  useUser,
  MfaSettings,
  resolveAuthMessages,
  getAuthLocale,
} from "../dist/auth/client/index.js";

const createClient = (
  snapshot = {
    status: "unauthenticated",
    user: null,
  },
) => ({
  async getSnapshot() {
    return snapshot;
  },

  async signIn() {
    return snapshot;
  },

  async register() {
    return snapshot;
  },

  async signOut() {},

  async verifyMfaTotp() {
    return snapshot;
  },

  async verifyMfaRecoveryCode() {
    return snapshot;
  },

  async signInWithPasskey() {
    return snapshot;
  },

  async verifyMfaWithPasskey() {
    return snapshot;
  },

  isPasskeySupported() {
    return false;
  },

  async listMfaFactors() {
    return {
      factors: [],
      recoveryCodeCount: 0,
    };
  },

  async beginTotpEnrollment() {
    return {
      status: "totp-enrollment-pending",
      factorId: "factor-1",
      secret: "SECRET",
      otpauthUrl: "otpauth://totp/example",
      expiresAt: new Date().toISOString(),
    };
  },

  async verifyTotpEnrollment() {
    return {
      status: "mfa-factor-added",
      factor: {},
      recoveryCodes: [],
    };
  },

  async registerPasskey() {
    return {
      status: "mfa-factor-added",
      factor: {},
      recoveryCodes: [],
    };
  },

  async removeMfaFactor() {},

  async regenerateRecoveryCodes() {
    return {
      status: "recovery-codes-regenerated",
      recoveryCodes: [],
    };
  },
});

const renderWithAuth = (children, snapshot) =>
  renderToStaticMarkup(
    React.createElement(
      AuthProvider,
      {
        client: createClient(snapshot),
        initialSnapshot: snapshot,
      },
      children,
    ),
  );

test("useAuth throws when used outside AuthProvider", () => {
  const Probe = () => {
    useAuth();
    return null;
  };

  assert.throws(
    () => renderToStaticMarkup(React.createElement(Probe)),
    /inside an AuthProvider/,
  );
});

test("provider exposes the initial authentication snapshot", () => {
  const snapshot = {
    status: "authenticated",
    user: {
      id: "user-1",
      email: "user@example.com",
      name: "Example",
      image: null,
      emailVerified: true,
    },
  };

  const Probe = () => {
    const auth = useAuth();

    return React.createElement(
      "span",
      null,
      `${auth.snapshot.status}:${auth.snapshot.user.email}`,
    );
  };

  const html = renderWithAuth(React.createElement(Probe), snapshot);

  assert.match(html, /authenticated:user@example\.com/);
});

test("useSession exposes the current status", () => {
  const Probe = () => {
    const session = useSession();

    return React.createElement("span", null, session.status);
  };

  const html = renderWithAuth(React.createElement(Probe), {
    status: "unauthenticated",
    user: null,
  });

  assert.match(html, /unauthenticated/);
});

test("useUser returns null when unauthenticated", () => {
  const Probe = () => {
    const user = useUser();

    return React.createElement("span", null, String(user));
  };

  const html = renderWithAuth(React.createElement(Probe), {
    status: "unauthenticated",
    user: null,
  });

  assert.match(html, /null/);
});

test("SignInForm renders accessible email and password controls", () => {
  const html = renderWithAuth(React.createElement(SignInForm), {
    status: "unauthenticated",
    user: null,
  });

  assert.match(html, /Sign in/);
  assert.match(html, /type="email"/);
  assert.match(html, /type="password"/);
  assert.match(html, /autocomplete="email"/i);
  assert.match(html, /current-password/);
});

test("SignUpForm renders the registration fields", () => {
  const html = renderWithAuth(React.createElement(SignUpForm), {
    status: "unauthenticated",
    user: null,
  });

  assert.match(html, /Create account/);
  assert.match(html, /Confirm password/);
  assert.match(html, /new-password/);
});

test("AuthScreen renders the loading state", () => {
  const html = renderWithAuth(React.createElement(AuthScreen), {
    status: "loading",
    user: null,
  });

  assert.match(html, /Loading/);
  assert.match(html, /role="status"/);
});

test("AuthScreen renders the sign-in screen when unauthenticated", () => {
  const html = renderWithAuth(React.createElement(AuthScreen), {
    status: "unauthenticated",
    user: null,
  });

  assert.match(html, /Sign in/);
});

test("AuthScreen renders custom content for authenticated users", () => {
  const html = renderWithAuth(
    React.createElement(
      AuthScreen,
      null,
      React.createElement("p", null, "Private dashboard"),
    ),
    {
      status: "authenticated",
      user: {
        id: "user-1",
        email: "user@example.com",
        name: null,
        image: null,
        emailVerified: true,
      },
    },
  );

  assert.match(html, /Private dashboard/);
});

test("MfaChallengeForm is hidden when MFA is not pending", () => {
  const html = renderWithAuth(React.createElement(MfaChallengeForm), {
    status: "unauthenticated",
    user: null,
  });

  assert.equal(html, "");
});

test("MfaChallengeForm renders when an MFA challenge is pending", () => {
  const html = renderWithAuth(React.createElement(MfaChallengeForm), {
    status: "mfa-pending",
    user: null,
    mfa: {
      purpose: "sign-in",
      challengeId: "challenge-1",
      expiresAt: new Date().toISOString(),
      availableFactors: ["totp", "recovery-code"],
    },
  });

  assert.match(html, /Verify your identity/);
  assert.match(html, /one-time-code/);
});

test("MfaSettings renders its security management heading", () => {
  const html = renderWithAuth(React.createElement(MfaSettings), {
    status: "authenticated",
    user: {
      id: "user-1",
      email: "user@example.com",
      name: null,
      image: null,
      emailVerified: true,
    },
  });

  assert.match(html, /Security settings/);
});

test("locale resolution falls back to English without configured messages", () => {
  assert.equal(getAuthLocale(), "en");
  assert.equal(getAuthLocale(null), "en");
  assert.equal(getAuthLocale("en-US"), "en");
  assert.equal(getAuthLocale("de-DE"), "en");
  assert.equal(getAuthLocale("es-ES"), "en");
  assert.equal(getAuthLocale("nl-NL"), "en");
});

test("locale resolution selects only exact configured locale identifiers", () => {
  const localeMessages = {
    nl: { ...resolveAuthMessages(), signIn: "Inloggen" },
  };

  assert.equal(getAuthLocale("nl", localeMessages), "nl");
  assert.equal(getAuthLocale("nl-NL", localeMessages), "en");
  assert.equal(getAuthLocale("toString", localeMessages), "en");
  assert.equal(resolveAuthMessages("nl", localeMessages).signIn, "Inloggen");
});

test("message overrides replace individual translations", () => {
  const result = resolveAuthMessages("en", undefined, {
    signIn: "Welcome back",
  });

  assert.equal(result.signIn, "Welcome back");
  assert.equal(result.signUp, "Create account");
});

test("message resolution applies English, custom locale and per-message overrides in order", () => {
  const result = resolveAuthMessages(
    "nl",
    {
      en: { ...resolveAuthMessages(), signIn: "English override" },
      nl: { ...resolveAuthMessages(), signIn: "Inloggen" },
    },
    { signUp: "Registreren" },
  );

  assert.equal(result.signIn, "Inloggen");
  assert.equal(result.signUp, "Registreren");
  assert.equal(
    resolveAuthMessages("en", {
      en: { ...resolveAuthMessages(), signIn: "English override" },
    }).signIn,
    "English override",
  );
});

test("AuthProvider applies per-message overrides to its forms", () => {
  const html = renderToStaticMarkup(
    React.createElement(
      AuthProvider,
      {
        client: createClient(),
        initialSnapshot: { status: "unauthenticated", user: null },
        messages: { signIn: "Welcome back" },
      },
      React.createElement(SignInForm),
    ),
  );

  assert.match(html, /Welcome back/);
});
