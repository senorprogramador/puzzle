import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Puzzle",
  description: "Built with Puzzle",
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body>
      <Providers>
        {children}
      </Providers>
    </body>
  </html>
);

export default RootLayout;
