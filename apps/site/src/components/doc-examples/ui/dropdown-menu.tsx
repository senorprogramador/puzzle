import { useState } from "react";
import { Button, DropdownMenu, Stack } from "@puzzle-ui/ui";

export const DropdownMenuExample = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [density, setDensity] = useState("comfortable");
  const [status, setStatus] = useState("Choose an action");

  return (
    <Stack>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">Project options</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Project</DropdownMenu.Label>
          <DropdownMenu.Group aria-label="Project actions">
            <DropdownMenu.Item onSelect={() => setStatus("Edit project")}>
              Edit project
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => setStatus("Duplicate project")}>
              Duplicate project
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.CheckboxItem
            checked={showArchived}
            onCheckedChange={setShowArchived}
          >
            Show archived
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.RadioGroup value={density} onValueChange={setDensity}>
            <DropdownMenu.Label>Density</DropdownMenu.Label>
            <DropdownMenu.RadioItem value="comfortable">
              Comfortable
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="compact">
              Compact
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            variant="danger"
            onSelect={() => setStatus("Delete project")}
          >
            Delete project
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <span role="status">
        {status}; archived {showArchived ? "shown" : "hidden"}; {density}{" "}
        density
      </span>
    </Stack>
  );
};
