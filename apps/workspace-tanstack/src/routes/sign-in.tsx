import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";
import { Button } from "@puzzle-ui/ui";

const authConfig = {
  redirects: { afterSignIn: "/dashboard", afterSignUp: "/dashboard" },
  offerPasskeyAfterSignIn: true,
};

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <main>
      <AuthExperience
        mode="sign-in"
        config={authConfig}
        onSignUp={() => void navigate({ to: "/sign-up" })}
      />
      <Button href="/forgot-password" variant="ghost">
        Forgot password?
      </Button>
    </main>
  );
};

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});
