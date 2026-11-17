import { useState } from "react";
import { FormActions, SettingsGroup, SettingsRow, SettingsSection } from "@puzzle-ui/pieces";
import { Button, Checkbox, Switch, Tabs, TextInput } from "@puzzle-ui/ui";

export const SettingsTabsExample = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);

  return (
    <SettingsSection
      title="Workspace settings"
      description="Manage the preferences for your Northstar Studio account."
      variant="tabs"
      actions={<Button>Save changes</Button>}
    >
      <Tabs activeId={activeTab} onActivate={setActiveTab}>
        <Tabs.Tab id="profile" tab="Profile">
          <SettingsGroup title="Your profile">
            <SettingsRow
              label="Display name"
              description="Shown to teammates across your workspace."
              htmlFor="settings-display-name"
              control={
                <TextInput
                  id="settings-display-name"
                  value="Jordan Lee"
                  onChange={() => {}}
                />
              }
            />
            <SettingsRow
              label="Work email"
              htmlFor="settings-email"
              control={
                <TextInput
                  id="settings-email"
                  type="email"
                  value="jordan@northstar.studio"
                  onChange={() => {}}
                />
              }
            />
          </SettingsGroup>
        </Tabs.Tab>
        <Tabs.Tab id="notifications" tab="Notifications">
          <SettingsGroup title="Email preferences">
            <SettingsRow
              label="Weekly digest"
              description="A weekly summary of your team's progress."
              htmlFor="settings-weekly-digest"
              control={
                <Switch
                  id="settings-weekly-digest"
                  checked={weeklyDigest}
                  onChange={(event) =>
                    setWeeklyDigest(event.currentTarget.checked)
                  }
                />
              }
            />
            <SettingsRow
              label="Product updates"
              description="Occasional notes about new workspace features."
              htmlFor="settings-product-updates"
              control={
                <Checkbox
                  id="settings-product-updates"
                  checked={productUpdates}
                  onChange={(event) =>
                    setProductUpdates(event.currentTarget.checked)
                  }
                />
              }
            />
          </SettingsGroup>
        </Tabs.Tab>
        <Tabs.Tab id="security" tab="Security">
          <SettingsGroup title="Sign-in">
            <SettingsRow
              label="Two-step verification"
              description="Require an additional check when signing in."
              htmlFor="settings-two-step"
              control={<Switch id="settings-two-step" defaultChecked />}
            />
          </SettingsGroup>
        </Tabs.Tab>
      </Tabs>
      <FormActions>
        <Button variant="outline">Cancel</Button>
        <Button>Save preferences</Button>
      </FormActions>
    </SettingsSection>
  );
};
