import { useState } from "react";
import { Button, Card, Stack, Transition } from "@puzzle-ui/ui";

export const TransitionExample = () => {
  const [visible, setVisible] = useState(true);

  return (
    <Stack>
      <Button onClick={() => setVisible((current) => !current)}>
        Toggle content
      </Button>
      <Transition visible={visible} template="slide-in-up">
        <Card>Animated content</Card>
      </Transition>
    </Stack>
  );
};
