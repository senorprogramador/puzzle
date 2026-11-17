import { useState } from "react";

import { useAuth } from "@puzzle-ui/fullstack/auth/client";
import { Button } from "@puzzle-ui/ui";

export const SignOutButton = () => {
  const { signOut } = useAuth();
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    setPending(true);

    try {
      await signOut();
      window.location.assign("/");
    } catch (error) {
      console.error(error);
      setPending(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleSignOut} disabled={pending}>
      Sign out
    </Button>
  );
};
