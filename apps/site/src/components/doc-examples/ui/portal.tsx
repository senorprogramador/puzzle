import { Card, Portal, PortalTarget } from "@puzzle-ui/ui";

export const PortalExample = () => (
  <>
    <PortalTarget
      id="documentation-portal-target"
      aria-label="Portal destination"
    />
    <Portal targetId="documentation-portal-target">
      <Card>This content is rendered inside the target.</Card>
    </Portal>
  </>
);
