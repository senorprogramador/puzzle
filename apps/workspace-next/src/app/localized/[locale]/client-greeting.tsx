"use client";

import { useEffect, useState } from "react";

import { useLocaleAttributes, useTranslation } from "@/lib/i18n/client";

export const ClientGreeting = () => {
  const translator = useTranslation();
  const localeAttributes = useLocaleAttributes();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <p
      {...localeAttributes}
      data-testid="localized-client-message"
      data-hydrated={hydrated}
    >
      {translator.t("page.client")}
    </p>
  );
};
