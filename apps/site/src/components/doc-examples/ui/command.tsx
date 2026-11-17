import { useState } from "react";
import { Button, Command, CommandDialog, Stack } from "@puzzle-ui/ui";

const commandItems = [
  {
    id: "new-file",
    label: "New file",
    description: "Create a file in the current project",
    group: "File",
    keywords: ["create"],
    shortcut: "⌘N",
  },
  {
    id: "open-file",
    label: "Open file",
    description: "Browse files in the current project",
    group: "File",
    keywords: ["browse"],
    shortcut: "⌘O",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Configure your workspace",
    group: "Preferences",
    keywords: ["preferences"],
  },
  {
    id: "publish",
    label: "Publish project",
    group: "Project",
    disabled: true,
  },
];

export const CommandExample = () => {
  const [selected, setSelected] = useState("");

  return (
    <Stack>
      <Command
        commands={commandItems}
        autoFocus={false}
        onSelect={(command) => setSelected(command.label)}
      />
      <span role="status">
        {selected ? `Selected: ${selected}` : "Choose a command"}
      </span>
    </Stack>
  );
};

export const CommandDialogExample = () => {
  const [selected, setSelected] = useState("");

  return (
    <Stack>
      <Button variant="outline" onClick={() => setSelected("")}>
        Open the palette with ⌘K / Ctrl+K
      </Button>
      <CommandDialog
        title="Project commands"
        description="Search and choose an action."
        commands={commandItems}
        onSelect={(command) => setSelected(command.label)}
      />
      <span role="status">
        {selected ? `Selected: ${selected}` : "No command selected"}
      </span>
    </Stack>
  );
};
