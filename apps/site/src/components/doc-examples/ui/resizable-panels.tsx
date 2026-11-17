import { useState } from "react";
import { Button, ResizablePanels, Stack } from "@puzzle-ui/ui";

export const ControlledResizablePanelsExample = () => {
  const [sizes, setSizes] = useState([30, 70]);

  return (
    <Stack>
      <div
        style={{
          width: "100%",
          height: "12rem",
          border: "1px solid var(--puzzle-color-border)",
        }}
      >
        <ResizablePanels sizes={sizes} onSizesChange={setSizes}>
          <ResizablePanels.Panel
            minSize={20}
            style={{ padding: "var(--puzzle-space-4)" }}
          >
            Navigation
          </ResizablePanels.Panel>
          <ResizablePanels.Handle withGrip aria-label="Resize navigation" />
          <ResizablePanels.Panel
            minSize={40}
            style={{ padding: "var(--puzzle-space-4)" }}
          >
            Content
          </ResizablePanels.Panel>
        </ResizablePanels>
      </div>
      <Stack direction="row">
        <span role="status">
          Sizes: {sizes.map((size) => Math.round(size) + "%").join(" / ")}
        </span>
        <Button variant="outline" onClick={() => setSizes([30, 70])}>
          Reset
        </Button>
      </Stack>
    </Stack>
  );
};
