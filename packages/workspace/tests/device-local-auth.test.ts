import { describe, expect, it } from "bun:test";

import {
  createSessionCookieOptions,
  readSessionCookie,
} from "@puzzle-ui/session";

import {
  handleWorkspaceDeviceAuthRequest,
  WorkspaceDeviceAuthManager,
} from "../src/services/device-local-auth.service";

const origin = "http://localhost:3000";
const cookie = createSessionCookieOptions({ production: false });
const createHandler = (manager: WorkspaceDeviceAuthManager) =>
  (request: Request) =>
    handleWorkspaceDeviceAuthRequest(request, {
      manager,
      cookie,
      allowedOrigins: [origin],
    });

const sessionRequest = (body: unknown, cookieHeader?: string) =>
  new Request(`${origin}/api/auth/device/session`, {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(body),
  });

describe("workspace device-local auth", () => {
  it("creates an authenticated session without persisting an account", async () => {
    const manager = new WorkspaceDeviceAuthManager();
    const handle = createHandler(manager);
    const response = await handle(
      sessionRequest({
        email: " person@example.com ",
        name: "Person",
      }),
    );
    const body = await response.json();
    const token = readSessionCookie(
      response.headers.get("set-cookie"),
      cookie.name,
    );

    expect(response.status).toBe(200);
    expect(body.status).toBe("authenticated");
    expect(body.user.email).toBe("person@example.com");
    expect(body.user.id).toMatch(/^device_[0-9a-f-]{36}$/i);
    expect(token).toBeTruthy();
    expect(manager.getUser(token!)).toMatchObject({
      id: body.user.id,
      email: "person@example.com",
    });
  });

  it("restores and revokes an in-memory session through the device endpoints", async () => {
    const manager = new WorkspaceDeviceAuthManager();
    const handle = createHandler(manager);
    const created = await handle(
      sessionRequest({ email: "person@example.com", name: null }),
    );
    const token = readSessionCookie(
      created.headers.get("set-cookie"),
      cookie.name,
    )!;
    const cookieHeader = `${cookie.name}=${token}`;

    const state = await handle(
      new Request(`${origin}/api/auth/device/state`, {
        headers: { cookie: cookieHeader },
      }),
    );
    expect((await state.json()).status).toBe("authenticated");

    const signedOut = await handle(
      new Request(`${origin}/api/auth/device/sign-out`, {
        method: "POST",
        headers: { origin, cookie: cookieHeader },
      }),
    );
    expect(signedOut.status).toBe(200);
    expect(manager.getUser(token)).toBeNull();
    expect(readSessionCookie(signedOut.headers.get("set-cookie"), cookie.name))
      .toBe("");
  });

  it("rejects cross-origin session creation and invalid account data", async () => {
    const handle = createHandler(new WorkspaceDeviceAuthManager());
    const crossOrigin = await handle(
      new Request(`${origin}/api/auth/device/session`, {
        method: "POST",
        headers: {
          origin: "https://attacker.example",
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: "person@example.com", name: null }),
      }),
    );
    const invalid = await handle(
      sessionRequest({ email: "not-an-email", name: null }),
    );

    expect(crossOrigin.status).toBe(403);
    expect(invalid.status).toBe(400);
  });
});
