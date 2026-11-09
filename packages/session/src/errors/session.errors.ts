export class SessionError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = "SessionError";
  }
}

export class SessionNotFoundError extends SessionError {
  constructor() {
    super("Session not found or no longer active.", "SESSION_NOT_FOUND");
    this.name = "SessionNotFoundError";
  }
}

export class SessionExpiredError extends SessionError {
  constructor() {
    super("Session has expired.", "SESSION_EXPIRED");
    this.name = "SessionExpiredError";
  }
}

export class SessionRevokedError extends SessionError {
  constructor() {
    super("Session has been revoked.", "SESSION_REVOKED");
    this.name = "SessionRevokedError";
  }
}

export class SessionSecurityError extends SessionError {
  constructor(message: string) {
    super(message, "SESSION_SECURITY_ERROR");
    this.name = "SessionSecurityError";
  }
}

export class SessionConfigurationError extends SessionError {
  constructor(message: string) {
    super(message, "SESSION_CONFIGURATION_ERROR");
    this.name = "SessionConfigurationError";
  }
}
