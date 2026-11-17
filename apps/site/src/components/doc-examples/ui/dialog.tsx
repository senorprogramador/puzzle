import { useState } from "react";
import { Button, Dialog } from "@puzzle-ui/ui";

export const DialogExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Review changes"
        description="Check your changes before continuing."
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        <p>Your changes are ready.</p>
      </Dialog>
    </>
  );
};
