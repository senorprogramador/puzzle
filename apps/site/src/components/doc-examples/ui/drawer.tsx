import { useState } from "react";
import { Button, Drawer, Section, Stack } from "@puzzle-ui/ui";

export const DrawerExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        position="right"
        aria-label="Filters"
      >
        <Section>
          <Stack>
            <p>Filter your results.</p>
            <Button onClick={() => setOpen(false)}>Close filters</Button>
          </Stack>
        </Section>
      </Drawer>
    </>
  );
};
