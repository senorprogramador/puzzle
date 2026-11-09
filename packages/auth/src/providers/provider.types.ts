export type PasswordHash = {
  readonly hash: string;
  readonly algorithm: "argon2id";
  readonly parameters: Readonly<Record<string, number | string>>;
};

export interface PasswordHasher {
  hash(password: string): Promise<PasswordHash>;
  verify(password: string, stored: PasswordHash): Promise<boolean>;
}

export type EmailMessage = {
  readonly to: string;
  readonly subject: string;
  readonly template: string;
  readonly variables: Readonly<Record<string, string>>;
};

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

export interface RateLimitProvider {
  consume(input: {
    readonly key: string;
    readonly limit: number;
    readonly windowSeconds: number;
  }): Promise<{
    readonly allowed: boolean;
    readonly remaining: number;
    readonly resetAt: Date;
  }>;
}

export interface PasswordHasher {
  hash(password: string): Promise<PasswordHash>;
  verify(password: string, stored: PasswordHash): Promise<boolean>;
  needsRehash?(stored: PasswordHash): boolean | Promise<boolean>;
}
