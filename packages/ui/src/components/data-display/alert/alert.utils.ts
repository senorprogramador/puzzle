import type { AlertSeverity } from "./alert.types";

type AlertSemantics = {
  role: "alert" | "status";
  ariaLive: "assertive" | "polite";
};

const getAlertSemantics = (severity: AlertSeverity): AlertSemantics => {
  const isUrgent = severity === "error" || severity === "warning";

  return {
    role: isUrgent ? "alert" : "status",
    ariaLive: isUrgent ? "assertive" : "polite",
  };
};

export { getAlertSemantics };
export type { AlertSemantics };
