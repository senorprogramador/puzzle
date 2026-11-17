import { Button, NotificationProvider, Stack, useNotification } from "@puzzle-ui/ui";

const NotificationExampleControls = () => {
  const notification = useNotification();

  return (
    <Stack direction="row" wrap="wrap">
      <Button onClick={() => notification.success("Changes saved")}>
        Show success
      </Button>
      <Button
        variant="outline"
        onClick={() => notification.error("Could not save", { duration: 0 })}
      >
        Show error
      </Button>
      <Button variant="ghost" onClick={notification.dismissAll}>
        Dismiss all
      </Button>
    </Stack>
  );
};

export const NotificationExample = () => (
  <NotificationProvider label="Example notifications">
    <NotificationExampleControls />
  </NotificationProvider>
);
