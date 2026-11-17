"use client";

import { useEffect, useState } from "react";

import { EmailVerificationForm } from "@puzzle-ui/fullstack/auth/client";
import { Button, Container, Stack } from "@puzzle-ui/ui";

const VerifyEmailPage = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") ?? "");
  }, []);

  return (
    <Container as="main" widthPreset="content">
      <Stack direction="col" gap="md">
        <EmailVerificationForm token={token} />
        <Button href="/dashboard" variant="outline">
          Return to dashboard
        </Button>
      </Stack>
    </Container>
  );
};

export { VerifyEmailPage };
