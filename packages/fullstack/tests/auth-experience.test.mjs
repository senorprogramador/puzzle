import test from "node:test";
import assert from "node:assert/strict";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { AuthProvider, AuthExperience } from "../dist/auth/client/index.js";

const createSnapshot = (status = "unauthenticated") => ({
  status,
  user: null,
});

const createClient = (snapshot = createSnapshot()) => ({
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

  async requestEmailVerification() {},
  async verifyEmail() {},
  async requestPasswordReset() {},
  async resetPassword() {},
  async changePassword() {},

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
    throw new Error("Not implemented in this test.");
  },

  async verifyTotpEnrollment() {
    throw new Error("Not implemented in this test.");
  },

  async registerPasskey() {
    throw new Error("Not implemented in this test.");
  },

  async beginRequiredTotpEnrollment() {
    throw new Error("Not implemented in this test.");
  },

  async verifyRequiredTotpEnrollment() {
    throw new Error("Not implemented in this test.");
  },

  async registerRequiredPasskey() {
    throw new Error("Not implemented in this test.");
  },

  async removeMfaFactor() {},
  async regenerateRecoveryCodes() {},
  async beginStepUp() {},
  async verifyStepUpTotp() {},
  async verifyStepUpRecoveryCode() {},
  async verifyStepUpWithPasskey() {},
});

const renderExperience = ({ snapshot = createSnapshot(), ...props } = {}) =>
  renderToStaticMarkup(
    React.createElement(
      AuthProvider,
      {
        client: createClient(snapshot),
        initialSnapshot: snapshot,
      },
      React.createElement(AuthExperience, props),
    ),
  );

test("renders sign-up markup from the supplied initial snapshot", () => {
  const html = renderExperience({
    mode: "sign-up",
    snapshot: createSnapshot("unauthenticated"),
  });

  assert.match(html, /Create an account/);
  assert.match(html, /type="email"/);
  assert.match(html, /type="password"/);
  assert.match(html, /Confirm password/);
});

test("renders configured branding in server markup", () => {
  const html = renderExperience({
    mode: "sign-up",
    config: {
      branding: {
        title: "Welcome to Example",
        description: "Create your account to continue.",
      },
    },
  });

  assert.match(html, /Welcome to Example/);
  assert.match(html, /Create your account to continue/);
});

test("renders custom text fields with stable accessible labels", () => {
  const html = renderExperience({
    mode: "sign-up",
    config: {
      fields: [
        {
          name: "company",
          label: "Company",
          type: "text",
          description: "Your organization name.",
        },
      ],
    },
  });

  assert.match(html, /Company/);
  assert.match(html, /name="company"/);
  assert.match(html, /Your organization name/);
  assert.match(html, /aria-describedby=/);
});

test("renders custom checkbox fields", () => {
  const html = renderExperience({
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
  });

  assert.match(html, /Accept terms/);
  assert.match(html, /type="checkbox"/);
  assert.match(html, /required/);
});

test("renders select options", () => {
  const html = renderExperience({
    mode: "sign-up",
    config: {
      fields: [
        {
          name: "country",
          label: "Country",
          type: "select",
          options: [
            {
              label: "Spain",
              value: "es",
            },
            {
              label: "Netherlands",
              value: "nl",
            },
          ],
        },
      ],
    },
  });

  assert.match(html, /Spain/);
  assert.match(html, /Netherlands/);
});

test("rejects invalid custom field names", () => {
  assert.throws(
    () =>
      renderExperience({
        mode: "sign-up",
        config: {
          fields: [
            {
              name: "company.name",
              label: "Company",
              type: "text",
            },
          ],
        },
      }),
    /Invalid custom auth field name/,
  );
});

test("rejects duplicate custom field names", () => {
  assert.throws(
    () =>
      renderExperience({
        mode: "sign-up",
        config: {
          fields: [
            {
              name: "company",
              label: "Company",
              type: "text",
            },
            {
              name: "company",
              label: "Organization",
              type: "text",
            },
          ],
        },
      }),
    /Duplicate custom auth field name/,
  );
});

test("rejects reserved custom field names", () => {
  assert.throws(
    () =>
      renderExperience({
        mode: "sign-up",
        config: {
          fields: [
            {
              name: "email",
              label: "Alternative email",
              type: "email",
            },
          ],
        },
      }),
    /is reserved/,
  );
});

test("requires options for select fields", () => {
  assert.throws(
    () =>
      renderExperience({
        mode: "sign-up",
        config: {
          fields: [
            {
              name: "country",
              label: "Country",
              type: "select",
            },
          ],
        },
      }),
    /requires at least one option/,
  );
});

test("does not render browser-dependent state during SSR", () => {
  const html = renderExperience({
    mode: "sign-up",
    config: {
      redirects: {
        afterSignUp: "/dashboard",
      },
    },
  });

  assert.match(html, /Create an account/);
  assert.doesNotMatch(html, /window\.location/);
});
