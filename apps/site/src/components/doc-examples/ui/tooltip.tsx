import { useState } from "react";
import { Button, Stack, Tooltip } from "@puzzle-ui/ui";

export const ControlledTooltipExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Stack alignH="center">
      <Tooltip
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="outline">Focus or hover me</Button>}
      >
        Your changes are saved automatically.
      </Tooltip>
      <span role="status">{open ? "Tooltip open" : "Tooltip closed"}</span>
    </Stack>
  );
};
