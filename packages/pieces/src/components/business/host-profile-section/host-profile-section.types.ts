import type { ElementType, ReactNode } from "react";
import type { TeamSectionProps } from "../team-section";
import type { BusinessProfile } from "../shared.types";

export type HospitalityHostProfile = Omit<BusinessProfile, "role"> & {
  role?: ReactNode;
  languages?: readonly string[];
  story?: ReactNode;
  contactAction?: ReactNode;
};

export type HostProfileSectionProps<C extends ElementType = "section"> =
  Omit<
    TeamSectionProps<C>,
    "departments" | "featuredMember" | "items" | "variant"
  > & {
    host: HospitalityHostProfile;
    variant?: "compact" | "profile";
    languagesLabel?: string;
    storyLabel?: ReactNode;
  };
