import { useState } from "react";
import { Button, ScrollLock, Stack } from "@puzzle-ui/ui";

export const ScrollLockExample = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <Stack>
      <ScrollLock enabled={enabled} />
      <Button onClick={() => setEnabled((current) => !current)}>
        {enabled ? "Unlock preview scrolling" : "Lock preview scrolling"}
      </Button>
      <p>Scroll the preview, enable the lock, then try scrolling again.</p>
      {Array.from({ length: 10 }, (_, index) => (
        <p key={index}>Example paragraph {index + 1}</p>
      ))}
    </Stack>
  );
};
