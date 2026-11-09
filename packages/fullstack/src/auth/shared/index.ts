export type AuthClientStatus = "loading" | "unauthenticated" | "mfa-pending" | "authenticated";

export type AuthClientUser = {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly image: string | null;
  readonly emailVerified: boolean;
};

export type AuthClientOptions = {
  readonly basePath?: string;
  readonly credentials?: "same-origin" | "include";
};

export type AuthClientSnapshot = {
  readonly status: AuthClientStatus;
  readonly user: AuthClientUser | null;
};
