import { useState } from "react";
import { Backdrop, Button } from "@puzzle-ui/ui";

export const BackdropExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Show backdrop</Button>
      <Backdrop open={open} onClose={() => setOpen(false)}>
        <Button onClick={() => setOpen(false)}>Close backdrop</Button>
      </Backdrop>
    </>
  );
};
