import { useState } from "react";
import { Tabs } from "@puzzle-ui/ui";

export const ControlledTabsExample = () => {
  const [activeId, setActiveId] = useState("overview");

  return (
    <Tabs activeId={activeId} onActivate={setActiveId}>
      <Tabs.Tab id="overview" tab="Overview">
        Selected tab: {activeId}
      </Tabs.Tab>
      <Tabs.Tab id="details" tab="Details">
        Selected tab: {activeId}
      </Tabs.Tab>
    </Tabs>
  );
};
