"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { Theme } from "@puzzle-ui/theme";
import { WorkspaceAuthProvider } from "@puzzle-ui/workspace-ui";

import fonts from "../puzzle-fonts.json";

type ProvidersProps = {
  children: ReactNode;
};

// Puzzle Link and Image render the Next.js components.
const themeComponents = {
  link: Link,
  image: Image,
};

const Providers = ({ children }: ProvidersProps) => (
  <Theme
    theme="system"
    fonts={fonts}
    fontSource="local"
    components={themeComponents}
  >
    <WorkspaceAuthProvider>
      {children}
    </WorkspaceAuthProvider>
  </Theme>
);

export { Providers };
