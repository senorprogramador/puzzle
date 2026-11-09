export type {
  AuthClientStatus,
  AuthClientUser,
  AuthClientOptions,
  AuthClientSnapshot,
} from "../shared";

export interface AuthClient {
  getSnapshot(): Promise<import("../shared").AuthClientSnapshot>;
  signOut(): Promise<void>;
}
