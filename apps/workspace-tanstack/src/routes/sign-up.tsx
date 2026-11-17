import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

const authConfig = {
  redirects: { afterSignIn: "/dashboard", afterSignUp: "/dashboard" },
  offerPasskeyAfterSignIn: true,
};

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <main>
      <AuthExperience
        mode="sign-up"
        config={authConfig}
        onSignIn={() => void navigate({ to: "/sign-in" })}
      />
    </main>
  );
};

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});
