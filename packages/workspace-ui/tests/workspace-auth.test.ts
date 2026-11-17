import { afterAll, afterEach, describe, expect, it } from "bun:test";

import {
  AuthClientError,
  type AuthClientOptions,
} from "@puzzle-ui/fullstack/auth/client";

import { createWorkspaceAuthClient } from "../src/workspace-auth";

const storageValues = new Map<string, string>();
const storage = {
  getItem: (key: string) => storageValues.get(key) ?? null,
  setItem: (key: string, value: string) => {
    storageValues.set(key, value);
  },
  removeItem: (key: string) => {
    storageValues.delete(key);
  },
  clear: () => storageValues.clear(),
  key: (index: number) => [...storageValues.keys()][index] ?? null,
  get length() {
    return storageValues.size;
  },
};

const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: storage,
});

afterEach(() => {
  storage.clear();
});

const createDeviceFetcher = (requests: Array<{ url: string; body: unknown }>) =>
  (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const body = init?.body ? JSON.parse(String(init.body)) : null;
    requests.push({ url, body });

    if (url.endsWith("/device/state")) {
      return Response.json({ status: "unauthenticated", user: null });
    }

    if (url.endsWith("/device/sign-out")) {
      return Response.json({ status: "unauthenticated", user: null });
    }

    if (url.endsWith("/device/session")) {
      return Response.json({
        status: "authenticated",
        user: {
          id: body.userId ?? "device_123e4567-e89b-12d3-a456-426614174000",
          email: body.email,
          name: body.name,
          image: null,
          emailVerified: false,
        },
      });
    }

    return Response.json(
      { error: { code: "NOT_FOUND", message: "Not found." } },
      { status: 404 },
    );
  }) as typeof fetch;

const clientOptions = (
  fetcher: typeof fetch,
): AuthClientOptions => ({
  basePath: "/api/auth",
  fetcher,
});

describe("workspace device-local auth client", () => {
  it("keeps signup credentials on-device and sends only identity to the server", async () => {
    const requests: Array<{ url: string; body: unknown }> = [];
    const client = createWorkspaceAuthClient(
      clientOptions(createDeviceFetcher(requests)),
    );
    const result = await client.register({
      email: "person@example.com",
      name: "Person",
      password: "device-only-password",
    });
    const stored = [...storageValues.values()].join("\n");
    const accountStore = JSON.parse(
      storageValues.get("puzzle.workspace.local-accounts.v1")!,
    );

    expect(result.status).toBe("authenticated");
    expect(requests).toHaveLength(1);
    expect(requests[0]?.url).toBe("/api/auth/device/session");
    expect(requests[0]?.body).toEqual({
      email: "person@example.com",
      name: "Person",
    });
    expect(stored).not.toContain("device-only-password");
    expect(accountStore.accounts["person@example.com"].verifier)
      .not.toBe("device-only-password");
  });

  it("verifies local credentials before creating another server session", async () => {
    const requests: Array<{ url: string; body: unknown }> = [];
    const client = createWorkspaceAuthClient(
      clientOptions(createDeviceFetcher(requests)),
    );
    await client.register({
      email: "person@example.com",
      name: "Person",
      password: "device-only-password",
    });
    requests.length = 0;

    await expect(
      client.signIn({
        email: "person@example.com",
        password: "wrong-password",
      }),
    ).rejects.toBeInstanceOf(AuthClientError);
    expect(requests).toHaveLength(0);

    const signedIn = await client.signIn({
      email: "person@example.com",
      password: "device-only-password",
    });
    expect(signedIn.status).toBe("authenticated");
    expect(requests).toHaveLength(1);
    expect(requests[0]?.body).not.toHaveProperty("password");
  });

  it("reissues an ephemeral session from the active device account", async () => {
    const requests: Array<{ url: string; body: unknown }> = [];
    const client = createWorkspaceAuthClient(
      clientOptions(createDeviceFetcher(requests)),
    );
    await client.register({
      email: "person@example.com",
      password: "device-only-password",
    });
    requests.length = 0;

    const snapshot = await client.getSnapshot();

    expect(snapshot.status).toBe("authenticated");
    expect(requests.map(({ url }) => url)).toEqual([
      "/api/auth/device/state",
      "/api/auth/device/session",
    ]);
    expect(requests[1]?.body).not.toHaveProperty("password");
  });

  it("does not call password-change APIs for a device-local account", async () => {
    const requests: Array<{ url: string; body: unknown }> = [];
    const client = createWorkspaceAuthClient(
      clientOptions(createDeviceFetcher(requests)),
    );
    await client.register({
      email: "person@example.com",
      password: "device-only-password",
    });

    await expect(
      client.changePassword("device-only-password", "another-password"),
    ).rejects.toMatchObject({ code: "PASSWORD_CHANGE_DISABLED" });
    expect(requests.every(({ url }) => !url.endsWith("/password/change")))
      .toBe(true);
  });
});

afterAll(() => {
  if (originalStorage) {
    Object.defineProperty(globalThis, "localStorage", originalStorage);
  } else {
    Reflect.deleteProperty(globalThis, "localStorage");
  }
});
