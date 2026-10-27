"use client";

import { useState } from "react";
import { Heading, Section, Button, Dialog, Drawer, Stack } from "@puzzle/ui";

type DialogSectionProps = {};

const DialogSection = ({}: DialogSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <Section>
      <Heading variant="headline2">Press te button to open a dialog</Heading>
      <Stack direction="row">
        <Button onClick={() => setIsDialogOpen(true)}>Open Dialog</Button>
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title="Dialog Title"
          description="Dialog description"
          footer="Dialog footer"
        >
          <Button onClick={() => setIsSubDialogOpen(true)}>
            Open Sub Dialog
          </Button>
          <Dialog
            open={isSubDialogOpen}
            onOpenChange={setIsSubDialogOpen}
            title="Sub Dialog Title"
            description="Sub Dialog description"
            footer="Sub Dialog footer"
          ></Dialog>
        </Dialog>
        <Button onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>
        <Drawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          position="bottom"
        >
          Drawer Content Can be very long, so we have to limit it's width.
          Puzzle is a modern React UI framework designed to help developers
          build accessible, responsive, and visually appealing user interfaces
          with ease. It is open source and provides a set of reusable
          components, theming capabilities, and a focus on developer experience.
        </Drawer>
      </Stack>
    </Section>
  );
};

export { DialogSection, type DialogSectionProps };
