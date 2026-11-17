import { createFileRoute } from "@tanstack/react-router";

import { SaaSHero } from "@puzzle-ui/pieces";
import {
  Button,
  Container,
  Heading,
  Stack,
  Text,
} from "@puzzle-ui/ui";

const HomePage = () => (
  <Container as="main" widthPreset="content">
    <Stack direction="col" gap="xl">
      <SaaSHero
        title="Make team work feel connected"
        description="Plan projects, track tasks, and keep every workspace update in view."
        actions={
          <Stack direction="row" gap="sm" wrap="wrap">
            <Button href="/sign-up">Create an account</Button>
            <Button href="/sign-in" variant="outline">
              Sign in
            </Button>
          </Stack>
        }
      />
      <Stack direction="col" gap="sm">
        <Heading as="h2" level="headline3">
          Your team, in sync
        </Heading>
        <Text as="p">
          Create a workspace to bring projects, tasks, team access, and activity
          together.
        </Text>
      </Stack>
    </Stack>
  </Container>
);

export const Route = createFileRoute("/")({
  component: HomePage,
});
