import type {
  BusinessContactItem,
  BusinessImage,
  BusinessLogoItem,
  BusinessMetricItem,
  BusinessSocialLink,
  CaseStudyCardProps,
  ProfileCardProps,
  ServiceCardProps,
} from "@puzzle-ui/ui";
import type { ReactNode } from "react";
import type { EditorialImage } from "../content/shared";

export type BusinessProfile = Omit<ProfileCardProps, "className"> & {
  id: string;
  department?: string;
};

export type BusinessDepartment = {
  id: string;
  name: string;
  members: readonly BusinessProfile[];
};

export type BusinessValue = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
};

export type BusinessTimelineItem = {
  id: string;
  year: ReactNode;
  title: ReactNode;
  description?: ReactNode;
};

export type BusinessService = Omit<
  ServiceCardProps,
  "className" | "image"
> & {
  id: string;
  image?: EditorialImage;
  category?: string;
};

export type BusinessCaseStudy = Omit<
  CaseStudyCardProps,
  "className" | "media"
> & {
  id: string;
  image?: EditorialImage;
  beforeAfter?: {
    before: EditorialImage;
    after: EditorialImage;
  };
};

export type BusinessContactDepartment = {
  id: string;
  name: string;
  contacts: readonly BusinessContactPerson[];
};

export type BusinessContactPerson = {
  id: string;
  name: string;
  role?: ReactNode;
  email?: string;
  phone?: string;
};

export type BusinessCareerPosition = {
  id: string;
  title: string;
  department?: string;
  location?: string;
  employmentType?: string;
  description?: ReactNode;
  href?: string;
  featured?: boolean;
};

export type BusinessBenefit = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
};

export type BusinessPartner = BusinessLogoItem & {
  category?: string;
  featured?: boolean;
};

export type BusinessAward = {
  id: string;
  title: string;
  organization: string;
  year: string | number;
  logo?: BusinessImage;
  description?: ReactNode;
  href?: string;
  external?: boolean;
  featured?: boolean;
};

export type { BusinessContactItem, BusinessMetricItem, BusinessSocialLink };
