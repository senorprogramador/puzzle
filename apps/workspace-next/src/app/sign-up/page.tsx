"use client";

import { useRouter } from "next/navigation";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

const authConfig = {
  redirects: { afterSignIn: "/dashboard", afterSignUp: "/dashboard" },
  offerPasskeyAfterSignIn: true,
};

const SignUpPage = () => {
  const router = useRouter();

  return (
    <main>
      <AuthExperience
        mode="sign-up"
        config={authConfig}
        onSignIn={() => router.push("/sign-in")}
      />
    </main>
  );
};

export default SignUpPage;
