import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

type StartRegistrationInput = Parameters<typeof startRegistration>[0];
type StartAuthenticationInput = Parameters<typeof startAuthentication>[0];

export type PasskeyBrowserAdapter = {
  readonly startRegistration: (
    input: StartRegistrationInput,
  ) => Promise<unknown>;

  readonly startAuthentication: (
    input: StartAuthenticationInput,
  ) => Promise<unknown>;
};

export type PasskeyBrowserHelpers = {
  readonly startRegistration: (
    optionsJSON: Readonly<Record<string, unknown>>,
  ) => Promise<unknown>;

  readonly startAuthentication: (
    optionsJSON: Readonly<Record<string, unknown>>,
  ) => Promise<unknown>;

  readonly isSupported: () => boolean;
};

const defaultAdapter: PasskeyBrowserAdapter = {
  startRegistration: (input) => startRegistration(input),
  startAuthentication: (input) => startAuthentication(input),
};

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null;

const assertOptions = (
  optionsJSON: Readonly<Record<string, unknown>>,
): void => {
  if (
    !isRecord(optionsJSON) ||
    typeof optionsJSON.challenge !== "string" ||
    optionsJSON.challenge.length < 32
  ) {
    throw new Error("The server returned invalid WebAuthn options.");
  }
};

const isSupported = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }

  return (
    typeof navigator.credentials !== "undefined" &&
    typeof navigator.credentials.create === "function" &&
    typeof navigator.credentials.get === "function"
  );
};

/**
 * Creates passkey browser helpers.
 *
 * The adapter argument makes the browser boundary independently testable.
 * The default adapter uses @simplewebauthn/browser.
 */
export const createPasskeyBrowserHelpers = (
  adapter: PasskeyBrowserAdapter = defaultAdapter,
): PasskeyBrowserHelpers => ({
  isSupported,

  startRegistration: async (optionsJSON) => {
    if (!isSupported()) {
      throw new Error("Passkeys are not supported in this browser.");
    }

    assertOptions(optionsJSON);

    return adapter.startRegistration({
      optionsJSON:
        optionsJSON as unknown as StartRegistrationInput["optionsJSON"],
    });
  },

  startAuthentication: async (optionsJSON) => {
    if (!isSupported()) {
      throw new Error("Passkeys are not supported in this browser.");
    }

    assertOptions(optionsJSON);

    return adapter.startAuthentication({
      optionsJSON:
        optionsJSON as unknown as StartAuthenticationInput["optionsJSON"],
    });
  },
});

const defaultHelpers = createPasskeyBrowserHelpers();

export const isPasskeySupported = (): boolean => defaultHelpers.isSupported();

export const startPasskeyRegistration = (
  optionsJSON: Readonly<Record<string, unknown>>,
): Promise<unknown> => defaultHelpers.startRegistration(optionsJSON);

export const startPasskeyAuthentication = (
  optionsJSON: Readonly<Record<string, unknown>>,
): Promise<unknown> => defaultHelpers.startAuthentication(optionsJSON);
