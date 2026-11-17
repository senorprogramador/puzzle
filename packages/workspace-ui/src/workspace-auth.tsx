"use client";

import { useMemo, type ReactNode } from "react";

import {
  AuthClientError,
  AuthProvider,
  createAuthClient,
  type AuthClient,
  type AuthClientOptions,
  type AuthClientRegisterInput,
  type AuthClientSignInInput,
  type AuthClientSnapshot,
  type AuthClientUser,
} from "@puzzle-ui/fullstack/auth/client";
import { WORKSPACE_DEMO_MFA_CODE } from "@puzzle-ui/workspace";

type LocalAccount = {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly salt: string;
  readonly verifier: string;
};

type LocalAccountStore = {
  readonly version: 1;
  readonly accounts: Readonly<Record<string, LocalAccount>>;
};

type DeviceAuthResponse = AuthClientSnapshot;

const ACCOUNT_STORAGE_KEY = "puzzle.workspace.local-accounts.v1";
const ACTIVE_ACCOUNT_KEY = "puzzle.workspace.active-local-account.v1";
const PASSWORD_ITERATIONS = 310_000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getLocalStorage = (): Storage => {
  if (typeof localStorage === "undefined") {
    throw new AuthClientError({
      status: 500,
      code: "LOCAL_STORAGE_UNAVAILABLE",
      message: "Device-local accounts require browser storage.",
    });
  }

  return localStorage;
};

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const isLocalAccount = (value: unknown): value is LocalAccount =>
  isRecord(value) &&
  typeof value.id === "string" &&
  /^device_[0-9a-f-]{36}$/i.test(value.id) &&
  typeof value.email === "string" &&
  (value.name === null || typeof value.name === "string") &&
  typeof value.salt === "string" &&
  typeof value.verifier === "string";

const readAccounts = (): LocalAccountStore => {
  const raw = getLocalStorage().getItem(ACCOUNT_STORAGE_KEY);
  if (raw === null) return { version: 1, accounts: {} };

  let value: unknown;

  try {
    value = JSON.parse(raw);
  } catch {
    throw new AuthClientError({
      status: 500,
      code: "LOCAL_ACCOUNT_STORE_INVALID",
      message: "Device account storage is invalid. Clear it and sign up again.",
    });
  }

  if (
    !isRecord(value) ||
    value.version !== 1 ||
    !isRecord(value.accounts) ||
    !Object.values(value.accounts).every(isLocalAccount)
  ) {
    throw new AuthClientError({
      status: 500,
      code: "LOCAL_ACCOUNT_STORE_INVALID",
      message: "Device account storage is invalid. Clear it and sign up again.",
    });
  }

  return value as LocalAccountStore;
};

const writeAccounts = (store: LocalAccountStore): void => {
  getLocalStorage().setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(store));
};

const getActiveAccount = (): LocalAccount | null => {
  const storage = getLocalStorage();
  const activeEmail = storage.getItem(ACTIVE_ACCOUNT_KEY);
  if (activeEmail === null) return null;

  const account = readAccounts().accounts[activeEmail];

  if (!account) {
    throw new AuthClientError({
      status: 500,
      code: "LOCAL_ACCOUNT_STORE_INVALID",
      message: "The active device account is missing from local storage.",
    });
  }

  return account;
};

const encodeBase64 = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes));

const decodeBase64 = (value: string): Uint8Array =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

const deriveVerifier = async (
  password: string,
  salt: Uint8Array,
): Promise<Uint8Array> => {
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  const saltView = new Uint8Array(saltBuffer);
  saltView.set(salt);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  return new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: saltView,
        iterations: PASSWORD_ITERATIONS,
      },
      key,
      256,
    ),
  );
};

const createVerifier = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const verifier = await deriveVerifier(password, salt);

  return {
    salt: encodeBase64(salt),
    verifier: encodeBase64(verifier),
  };
};

const verifyPassword = async (
  password: string,
  account: LocalAccount,
): Promise<boolean> => {
  const expected = decodeBase64(account.verifier);
  const actual = await deriveVerifier(password, decodeBase64(account.salt));

  if (actual.length !== expected.length) return false;

  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) {
    difference |= actual[index]! ^ expected[index]!;
  }

  return difference === 0;
};

const validateCredentials = (input: AuthClientRegisterInput): string => {
  const email = normalizeEmail(input.email);
  const passwordLength = Array.from(input.password).length;

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 320 ||
    passwordLength < 12 ||
    passwordLength > 1024 ||
    new TextEncoder().encode(input.password).byteLength > 4096 ||
    (input.name != null && input.name.trim().length > 100)
  ) {
    throw new AuthClientError({
      status: 400,
      code: "INVALID_REQUEST",
      message: "Enter a valid email, name, and password of at least 12 characters.",
    });
  }

  return email;
};

const parseSnapshot = (value: unknown): AuthClientSnapshot => {
  if (
    !isRecord(value) ||
    (value.status !== "authenticated" &&
      value.status !== "unauthenticated") ||
    (value.user !== null &&
      (!isRecord(value.user) ||
        typeof value.user.id !== "string" ||
        typeof value.user.email !== "string" ||
        (value.user.name !== null && typeof value.user.name !== "string") ||
        (value.user.image !== null && typeof value.user.image !== "string") ||
        typeof value.user.emailVerified !== "boolean"))
  ) {
    throw new AuthClientError({
      status: 502,
      code: "INVALID_AUTH_RESPONSE",
      message: "The device authentication service returned an invalid response.",
    });
  }

  return {
    status: value.status,
    user: value.user as AuthClientUser | null,
  };
};

export const createWorkspaceAuthClient = (
  options: AuthClientOptions = {},
): AuthClient => {
  const client = createAuthClient(options);
  const basePath = (options.basePath ?? "/api/auth").replace(/\/+$/, "");
  const fetcher = options.fetcher ?? fetch;
  const credentials = options.credentials ?? "same-origin";

  const deviceRequest = async (
    path: string,
    method: "GET" | "POST",
    body?: unknown,
  ): Promise<unknown> => {
    const headers = new Headers();

    if (body !== undefined) headers.set("Content-Type", "application/json");

    const response = await fetcher(`${basePath}/device/${path}`, {
      method,
      credentials,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      throw new AuthClientError({
        status: response.status,
        code: "INVALID_AUTH_RESPONSE",
        message: "The device authentication service returned an invalid response.",
      });
    }

    if (!response.ok) {
      const error = isRecord(payload) && isRecord(payload.error)
        ? payload.error
        : {};

      throw new AuthClientError({
        status: response.status,
        code: typeof error.code === "string" ? error.code : "AUTH_REQUEST_FAILED",
        message:
          typeof error.message === "string"
            ? error.message
            : "The device authentication request failed.",
      });
    }

    return payload;
  };

  const createDeviceSession = async (
    input: Pick<LocalAccount, "email" | "name"> & { readonly id?: string },
  ): Promise<AuthClientSnapshot> => {
    const value = await deviceRequest("session", "POST", {
      ...(input.id ? { userId: input.id } : {}),
      email: input.email,
      name: input.name,
    });

    return parseSnapshot(value);
  };

  const getSnapshot = async (): Promise<AuthClientSnapshot> => {
    const account = getActiveAccount();

    if (!account) return client.getSnapshot();

    const current = parseSnapshot(await deviceRequest("state", "GET"));
    if (current.status === "authenticated" && current.user?.id === account.id) {
      return current;
    }

    return createDeviceSession({
      id: account.id,
      email: account.email,
      name: account.name,
    });
  };

  const register = async (
    input: AuthClientRegisterInput,
  ): Promise<AuthClientSnapshot> => {
    const email = validateCredentials(input);
    const store = readAccounts();

    if (store.accounts[email]) {
      throw new AuthClientError({
        status: 409,
        code: "LOCAL_ACCOUNT_EXISTS",
        message: "An account with this email already exists on this device.",
      });
    }

    const verifier = await createVerifier(input.password);
    const snapshot = await createDeviceSession({
      email,
      name: input.name?.trim() || null,
    });

    if (!snapshot.user) {
      throw new AuthClientError({
        status: 502,
        code: "INVALID_AUTH_RESPONSE",
        message: "The device authentication service did not create an account.",
      });
    }

    const nextStore: LocalAccountStore = {
      version: 1,
      accounts: {
        ...store.accounts,
        [email]: {
          id: snapshot.user.id,
          email,
          name: snapshot.user.name,
          ...verifier,
        },
      },
    };

    try {
      writeAccounts(nextStore);
      getLocalStorage().setItem(ACTIVE_ACCOUNT_KEY, email);
    } catch (error) {
      try {
        await deviceRequest("sign-out", "POST");
      } catch (cleanupError) {
        throw new AggregateError(
          [error, cleanupError],
          "Could not save the local account or revoke its session.",
        );
      }

      throw error;
    }

    return snapshot;
  };

  const signIn = async (
    input: AuthClientSignInInput,
  ): Promise<AuthClientSnapshot> => {
    const email = normalizeEmail(input.email);
    const account = readAccounts().accounts[email];

    if (!account) {
      const snapshot = await client.signIn(input);
      getLocalStorage().removeItem(ACTIVE_ACCOUNT_KEY);
      return snapshot;
    }

    if (!(await verifyPassword(input.password, account))) {
      throw new AuthClientError({
        status: 401,
        code: "INVALID_CREDENTIALS",
        message: "The email or password is incorrect.",
      });
    }

    const snapshot = await createDeviceSession({
      id: account.id,
      email: account.email,
      name: account.name,
    });
    getLocalStorage().setItem(ACTIVE_ACCOUNT_KEY, email);

    return snapshot;
  };

  const signOut = async (): Promise<void> => {
    if (getActiveAccount()) {
      await deviceRequest("sign-out", "POST");
      getLocalStorage().removeItem(ACTIVE_ACCOUNT_KEY);
      return;
    }

    await client.signOut();
  };

  const changePassword: AuthClient["changePassword"] = async (
    currentPassword,
    newPassword,
  ) => {
    if (getActiveAccount()) {
      throw new AuthClientError({
        status: 403,
        code: "PASSWORD_CHANGE_DISABLED",
        message: "Password changes are disabled for device-local accounts.",
      });
    }

    return client.changePassword(currentPassword, newPassword);
  };

  return {
    ...client,
    getSnapshot,
    register,
    signIn,
    signOut,
    changePassword,
  };
};

type WorkspaceAuthProviderProps = {
  readonly children: ReactNode;
};

export const WorkspaceAuthProvider = ({
  children,
}: WorkspaceAuthProviderProps) => {
  const client = useMemo(() => createWorkspaceAuthClient(), []);

  return (
    <AuthProvider client={client} demoTotpCode={WORKSPACE_DEMO_MFA_CODE}>
      {children}
    </AuthProvider>
  );
};
