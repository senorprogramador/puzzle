"use client";

import { useRouter } from "next/navigation";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";
import { Button } from "@puzzle-ui/ui";

const authConfig = {
  redirects: { afterSignIn: "/dashboard", afterSignUp: "/dashboard" },
  offerPasskeyAfterSignIn: true,
};

const SignInPage = () => {
  const router = useRouter();

  return (
    <main>
      <AuthExperience
        mode="sign-in"
        config={authConfig}
        onSignUp={() => router.push("/sign-up")}
      />
      <Button href="/forgot-password" variant="ghost">
        Forgot password?
      </Button>
    </main>
  );
};

export default SignInPage;
