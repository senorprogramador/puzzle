import { useState } from "react";
import { Button, Popover, Stack } from "@puzzle-ui/ui";

export const ControlledPopoverExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      title="Ready to continue?"
      trigger={<Button>Review changes</Button>}
    >
      <Stack>
        <p>Your changes are ready to save.</p>
        <Button onClick={() => setOpen(false)}>Done</Button>
      </Stack>
    </Popover>
  );
};
