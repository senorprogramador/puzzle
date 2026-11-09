export type AuthUser = {
  readonly id: string;
  readonly email: string;
  readonly emailVerifiedAt: Date | null;
  readonly name: string | null;
  readonly image: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
