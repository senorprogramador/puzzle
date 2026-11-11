# @puzzle-ui/fullstack

First-party full-stack integrations for Puzzle.

The package provides browser-safe authentication functionality, server-side authentication handlers, reusable authentication screens and framework adapters.

Authentication policies, persistence and security-sensitive operations remain in the framework-independent `@puzzle-ui/auth` and `@puzzle-ui/session` packages.

## Installation

```bash
bun add @puzzle-ui/fullstack @puzzle-ui/auth @puzzle-ui/session @puzzle-ui/ui
```

Install React 19 and the appropriate framework peer dependencies in your application.

## Package architecture

```text
@puzzle-ui/fullstack
└── auth/
    ├── client/
    │   ├── index.ts
    │   ├── react.tsx
    │   ├── messages.ts
    │   ├── auth.css
    │   └── passkeys.ts
    ├── server/
    │   ├── index.ts
    │   ├── mfa.ts
    │   ├── lifecycle.ts
    │   └── session.ts
    ├── shared/
    │   └── index.ts
    ├── next/
    │   └── index.ts
    └── tanstack/
        └── index.ts
```

## Public exports

| Import                               | Responsibility                                              |
| ------------------------------------ | ----------------------------------------------------------- |
| `@puzzle-ui/fullstack/auth/client`   | React provider, hooks, authentication UI and browser client |
| `@puzzle-ui/fullstack/auth/server`   | Server handlers, sessions and authentication lifecycle      |
| `@puzzle-ui/fullstack/auth/shared`   | Serializable public contracts                               |
| `@puzzle-ui/fullstack/auth/next`     | Next.js App Router adapter                                  |
| `@puzzle-ui/fullstack/auth/tanstack` | TanStack Start adapter                                      |

## Client

### AuthProvider

Wrap the application in `AuthProvider`.

```tsx
import { AuthProvider } from "@puzzle-ui/fullstack/auth/client";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider
    options={{
      basePath: "/api/auth",
    }}
    locale="en"
  >
    {children}
  </AuthProvider>
);
```

The provider creates and shares one authentication client.

Authentication state is retrieved from the server. Session credentials are not stored in browser storage.

### Hooks

```tsx
import { useAuth, useSession, useUser } from "@puzzle-ui/fullstack/auth/client";

const Profile = () => {
  const user = useUser();
  const session = useSession();
  const auth = useAuth();

  if (session.isLoading) return null;

  if (!user) return null;

  return (
    <div>
      <span>{user.email}</span>
      <button onClick={() => void auth.signOut()}>Sign out</button>
    </div>
  );
};
```

### Authentication components

Available components:

- `SignInForm`
- `SignUpForm`
- `MfaChallengeForm`
- `RequiredMfaEnrollment`
- `PasswordResetRequestForm`
- `PasswordResetForm`
- `EmailVerificationForm`
- `EmailVerificationNotice`
- `ChangePasswordForm`
- `MfaSettings`
- `AuthScreen`

All components support className customization.

Redirects are opt-in through `redirectTo` and restricted to same-origin paths.

## Configurable authentication experience

`@puzzle-ui/fullstack` provides an optional `AuthExperience` component for building branded sign-in and sign-up pages without having to implement the standard authentication flow yourself.

The experience supports:

- Custom branding, including a logo, title, description and footer.
- Layout configuration, including content width and alignment.
- Configurable redirects after successful authentication.
- Custom registration fields with validation.
- Custom submit callbacks for integrating application-specific registration logic.
- Existing Puzzle authentication messages and form behavior.

### Basic usage

```tsx
import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

export const SignUpPage = () => (
  <AuthExperience
    mode="sign-up"
    config={{
      branding: {
        title: "Create your account",
        description: "Get started with your new account.",
      },
      layout: {
        maxWidth: "32rem",
        align: "center",
      },
      redirects: {
        afterSignUp: "/dashboard",
      },
      fields: [
        {
          name: "company",
          label: "Company",
          type: "text",
          required: true,
        },
        {
          name: "role",
          label: "Your role",
          type: "select",
          options: [
            { label: "Developer", value: "developer" },
            { label: "Designer", value: "designer" },
            { label: "Other", value: "other" },
          ],
        },
      ],
    }}
  />
);
```

### Custom registration handling

Custom fields are UI-only extensions. They are not automatically added to the authentication user model or persisted by the auth engine.

The experience uses Puzzle UI form fields, text inputs, text areas, checkboxes,
selects, buttons and typography. URL and number fields retain native inputs to
preserve their input types and string values, which `TextInput` does not support.

Use `onSubmit` to receive the standard registration input and custom field values. The callback can call `signUp` to execute the normal registration flow.

```tsx
import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

export const SignUpPage = () => (
  <AuthExperience
    mode="sign-up"
    config={{
      fields: [
        {
          name: "company",
          label: "Company",
          type: "text",
          required: true,
        },
      ],
    }}
    onSubmit={async ({ registration, fields, signUp }) => {
      await signUp(registration);

      // Handle application-specific values separately.
      await saveCompanyInformation({
        email: registration.email,
        company: fields.company,
      });
    }}
  />
);
```

### Browser tests

Run the Fullstack authentication experience browser tests with:

```bash
bun run --filter @puzzle-ui/fullstack test:browser
```

### AuthScreen

```tsx
import { AuthScreen } from "@puzzle-ui/fullstack/auth/client";

export default function LoginPage() {
  return <AuthScreen mode="sign-in" redirectTo="/dashboard" />;
}
```

### Registration

```tsx
import { AuthScreen } from "@puzzle-ui/fullstack/auth/client";

export default function RegisterPage() {
  return <AuthScreen mode="sign-up" />;
}
```

### MFA management

```tsx
import { MfaSettings } from "@puzzle-ui/fullstack/auth/client";

export default function SecurityPage() {
  return <MfaSettings />;
}
```

### Localization

Puzzle Fullstack includes English messages as its default locale and fallback.

Applications can define their own locale identifiers by extending the `AuthLocale` type. Every custom locale must provide a complete `AuthMessages` object. English messages are optional because the built-in English messages are used whenever no application-provided English messages are available.

For example, an application can add Dutch and German:

```tsx
import { AuthProvider } from "@puzzle-ui/fullstack/auth/client";

import {
  getAuthLocale,
  resolveAuthMessages,
  type AuthLocale,
  type AuthLocaleMessages,
} from "@puzzle-ui/fullstack/auth/client";

type AppLocale = AuthLocale<"nl" | "de">;

const appMessages: AuthLocaleMessages<"nl" | "de"> = {
  nl: {
    // Supply every AuthMessages field in Dutch.
    // For example:
    signIn: "Inloggen",
    signUp: "Account aanmaken",
    email: "E-mailadres",
    password: "Wachtwoord",
    name: "Naam",
    confirmPassword: "Bevestig wachtwoord",
    submit: "Doorgaan",
    signingIn: "Inloggen...",
    signingUp: "Account aanmaken...",
    forgotPassword: "Wachtwoord vergeten?",
    createAccount: "Account aanmaken",
    existingAccount: "Heb je al een account?",
    noAccount: "Nog geen account?",
    mfaTitle: "Verifieer je identiteit",
    mfaDescription: "Voer je authenticatiecode in om door te gaan.",
    verificationCode: "Authenticatiecode",
    recoveryCode: "Herstelcode",
    verify: "Verifiëren",
    verifying: "Verifiëren...",
    useRecoveryCode: "Gebruik een herstelcode",
    useAuthenticator: "Gebruik authenticator-app",
    usePasskey: "Doorgaan met passkey",
    passkeyUnavailable: "Passkeys zijn niet beschikbaar in deze browser.",
    loading: "Laden...",
    signOut: "Uitloggen",
    unexpectedError: "Er is iets misgegaan. Probeer het opnieuw.",
    invalidCredentials: "Het e-mailadres of wachtwoord is onjuist.",
    passwordMismatch: "De wachtwoorden komen niet overeen.",
    passwordRequired: "Een wachtwoord is verplicht.",
    requestPasswordReset: "Wachtwoord herstellen aanvragen",
    resetPassword: "Wachtwoord herstellen",
    newPassword: "Nieuw wachtwoord",
    sendResetLink: "Verstuur herstellink",
    passwordResetSent: "De herstellink is verstuurd",
    verificationSent: "Verificatiemail is verstuurd",
    verifyEmail: "E-mailadres verifiëren",
    changePassword: "Wachtwoord wijzigen",
    passwordChanged: "Wachtwoord gewijzigd",
    emailRequired: "Een e-mailadres is verplicht.",
    nameRequired: "Een naam is verplicht.",
    authenticated: "Je bent ingelogd.",
    mfaSettings: "Beveiligingsinstellingen",
    addTotp: "Authenticator toevoegen",
    addPasskey: "Passkey toevoegen",
    removeFactor: "Verwijderen",
    recoveryCodes: "Herstelcodes",
    saveRecoveryCodes: "Bewaar deze codes op een veilige plek.",
    currentPassword: "Huidig wachtwoord",
    totpSecret: "Authenticator-geheim",
    verifyTotp: "Authenticator verifiëren",
    cancel: "Annuleren",
  },
  // Optionally (partially)override messages for English:
  en: {
    signUp: "Create your account",
  }
  de: {
    // Supply every AuthMessages field in German.
    // The same complete set of fields as the Dutch example is required.
  },
};

// The locale type can be used throughout the application.
const requestedLocale: string = "nl";

const locale: AppLocale = getAuthLocale(requestedLocale, appMessages);

// Resolve the complete message set before passing it to the provider.
// Built-in English messages are used for any missing English fallback.
const messages = resolveAuthMessages(locale, appMessages);

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider
    locale={locale}
    messages={messages}
    options={{
      basePath: "/api/auth",
    }}
  >
    {children}
  </AuthProvider>
);
```

The `AuthLocale` type accepts custom locale identifiers:

```ts
type AppLocale = AuthLocale<"nl" | "de" | "es">;
```

The corresponding message map requires a complete message set for every declared custom locale:

```ts
const messages: AuthLocaleMessages<"nl" | "de"> = {
  nl: dutchMessages,
  de: germanMessages,

  // Optional: English overrides.
  // Without this property, Puzzle's built-in English messages are used.
  // en: englishMessages,
};
```

The locale resolver only selects a custom locale when its messages are available:

```ts
const locale = getAuthLocale("nl-NL", messages);
// "en", because "nl-NL" is not a configured locale.

const dutchLocale = getAuthLocale("nl", messages);
// "nl"

const fallbackLocale = getAuthLocale("fr", messages);
// "en"
```

Locale identifiers are exact matches. If an application wants to support regional identifiers such as `nl-NL` or `en-GB`, it should declare and provide those locales explicitly.

Messages are resolved in this order:

1. Built-in English messages.
2. Optional application-provided English messages.
3. Messages for the selected custom locale.
4. Optional per-message overrides.

This means a custom locale always has a complete message set, while English can remain entirely implicit.

## Server

### Creating the server

```ts
import { createAuthServer } from "@puzzle-ui/fullstack/auth/server";

import {
  authManager,
  mfaManager,
  stepUpManager,
  sessions,
  cookie,
  csrf,
} from "./auth-managers";

export const authServer = createAuthServer({
  auth: authManager,
  mfa: mfaManager,
  stepUp: stepUpManager,
  sessions,
  cookie,
  csrf,
  resolveClientIp,
});
```

The supplied managers and providers must be initialized using their respective package contracts.

### Route handlers

`createAuthRouteHandlers` returns a map of paths and HTTP methods to Web Request handlers.

The default base path is `/api/auth`.

A custom base path can be configured.

### Lifecycle integration

The optional lifecycle integration provides:

- Email verification requests.
- Email verification.
- Password reset requests.
- Password reset completion.
- Authenticated password changes.

Password reset requests use a generic public response to prevent account enumeration.

### Session security

- Session tokens remain in HttpOnly cookies.
- State-changing requests require CSRF protection.
- Authentication responses use no-store caching.
- Password changes invalidate existing sessions.
- MFA challenge tokens remain server-managed.
- Client-facing responses contain only public user data.

## Next.js App Router

```ts
// app/api/auth/[...auth]/route.ts

import { auth } from "@/lib/auth";

import { createNextAuthHandler } from "@puzzle-ui/fullstack/auth/next";

const handlers = createNextAuthHandler({
  auth,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
```

## TanStack Start

```ts
import { createTanStackAuthHandler } from "@puzzle-ui/fullstack/auth/tanstack";

import { auth } from "./auth";

export const authHandler = createTanStackAuthHandler({
  auth,
});
```

Register the handler using the application's TanStack server route configuration.

## Runtime support

The package uses Web APIs for HTTP request and response handling.

Supported targets:

- Node.js
- Cloudflare Workers
- Bun development environments
- Browser authentication interfaces

Persistent sessions, tokens and authentication records must use durable storage.

## Build

```bash
bun run --filter @puzzle-ui/fullstack build
```

## Typecheck

```bash
bun run --filter @puzzle-ui/fullstack typecheck
```

## Tests

Tests run against the built package with Node's test runner. The test setup
ignores CSS imports so client components can be rendered without a browser.

```bash
bun run --filter @puzzle-ui/fullstack build
bun run --filter @puzzle-ui/fullstack test
```

## Security boundaries

The package maintains separate public entry points for:

- Client functionality.
- Server functionality.
- Shared contracts.
- Framework integrations.

Client code must never import server implementations, database adapters, secrets or password hashing implementations.

Server functionality must never be re-exported from browser-facing entry points.

Framework adapters must delegate security policies and authentication operations to the underlying authentication packages.

## Scope

This package is designed to support additional full-stack Puzzle modules in the future.

Authentication is the first module. Other modules should follow the same principles:

- Explicit client/server boundaries.
- Framework-independent domain logic.
- Serializable shared contracts.
- Thin framework adapters.
- Explicit public exports.
