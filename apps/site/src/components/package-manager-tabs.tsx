"use client";

import type { PropsWithChildren } from "react";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

const PackageManagerTabs = ({ children }: PropsWithChildren) => (
  <Tabs
    items={["npm", "bun", "pnpm", "yarn"]}
    groupId="puzzle-package-manager"
    persist
  >
    {children}
  </Tabs>
);

export { PackageManagerTabs, Tab as PackageManagerTab };
