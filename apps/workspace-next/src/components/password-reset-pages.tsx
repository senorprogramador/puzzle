"use client";

import { useEffect, useState } from "react";

import {
  PasswordResetForm,
  PasswordResetRequestForm,
} from "@puzzle-ui/fullstack/auth/client";
import { Button, Container, Stack } from "@puzzle-ui/ui";

const PasswordResetRequestPage = () => (
  <Container as="main" widthPreset="content">
    <Stack direction="col" gap="md">
      <PasswordResetRequestForm />
      <Button href="/sign-in" variant="outline">
        Return to sign in
      </Button>
    </Stack>
  </Container>
);

const PasswordResetCompletionPage = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") ?? "");
  }, []);

  return (
    <Container as="main" widthPreset="content">
      <Stack direction="col" gap="md">
        <PasswordResetForm token={token} />
        <Button href="/sign-in" variant="outline">
          Return to sign in
        </Button>
      </Stack>
    </Container>
  );
};

export { PasswordResetCompletionPage, PasswordResetRequestPage };
