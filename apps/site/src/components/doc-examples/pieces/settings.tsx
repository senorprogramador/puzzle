import { useState } from "react";
import {
  FormActions,
  SettingsGroup,
  SettingsRow,
  SettingsSection,
  type SettingsSectionVariant,
} from "@puzzle-ui/pieces";
import {
  Accordion,
  Button,
  Checkbox,
  Switch,
  Tabs,
  TextInput,
} from "@puzzle-ui/ui";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const settingsVariants: SectionVariantPreview<SettingsSectionVariant>[] = [
  { variant: "list", useCase: "Arrange settings as straightforward rows." },
  { variant: "grouped", useCase: "Separate preferences under headings." },
  { variant: "cards", useCase: "Give independent groups clear surfaces." },
  { variant: "split", useCase: "Use two columns for related controls." },
  { variant: "sidebar", useCase: "Pair navigation with the active panel." },
  { variant: "tabs", useCase: "Switch between caller-defined settings panels." },
  { variant: "accordion", useCase: "Collapse groups with the UI Accordion." },
  { variant: "profile", useCase: "Focus account identity and details." },
  { variant: "preferences", useCase: "Group personal preferences." },
  { variant: "security", useCase: "Present sign-in and security settings." },
  { variant: "notifications", useCase: "Group notification controls." },
  { variant: "compact", useCase: "Use a denser settings layout." },
];

export const SettingsSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="SettingsSection"
    variants={settingsVariants}
    buildCode={(variant) =>
      `<SettingsSection variant="${variant}" title="Workspace settings">...</SettingsSection>`
    }
    renderVariant={(variant) => (
      <SettingsSection
        title="Workspace settings"
        description="Set defaults for your Northstar team."
        variant={variant}
        navigation={
          variant === "sidebar" ? (
            <nav aria-label="Settings">
              <a href="#variant-profile">Profile</a>
              <a href="#variant-notifications">Notifications</a>
            </nav>
          ) : undefined
        }
      >
        {variant === "tabs" ? (
          <Tabs>
            <Tabs.Tab id="profile" tab="Profile">
              <SettingsGroup title="Profile">
                <SettingsRow
                  label="Display name"
                  htmlFor="variant-display-name"
                  control={
                    <TextInput
                      id="variant-display-name"
                      defaultValue="Jordan Lee"
                    />
                  }
                />
              </SettingsGroup>
            </Tabs.Tab>
            <Tabs.Tab id="security" tab="Security">
              <SettingsGroup title="Security">
                <SettingsRow
                  label="Two-step verification"
                  htmlFor="variant-two-step"
                  control={<Switch id="variant-two-step" defaultChecked />}
                />
              </SettingsGroup>
            </Tabs.Tab>
          </Tabs>
        ) : variant === "accordion" ? (
          <Accordion
            items={[
              {
                id: "profile",
                title: "Profile",
                content: <p>Update your team's profile preferences.</p>,
              },
              {
                id: "security",
                title: "Security",
                content: <p>Review sign-in and device settings.</p>,
              },
            ]}
            type="multiple"
          />
        ) : variant === "sidebar" ? (
          <>
            <div id="variant-profile">
              <SettingsGroup title="Profile">
                <p>Jordan Lee · jordan@northstar.studio</p>
              </SettingsGroup>
            </div>
            <div id="variant-notifications">
              <SettingsGroup title="Notifications">
                <p>Weekly digest enabled</p>
              </SettingsGroup>
            </div>
          </>
        ) : (
          <SettingsGroup title="Notifications">
            <SettingsRow
              label="Weekly digest"
              description="A weekly summary of your team's work."
              htmlFor={`variant-weekly-${variant}`}
              control={
                <Checkbox
                  id={`variant-weekly-${variant}`}
                  defaultChecked
                />
              }
            />
          </SettingsGroup>
        )}
      </SettingsSection>
    )}
  />
);

export const SettingsTabsExample = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState("Jordan Lee");
  const [email, setEmail] = useState("jordan@northstar.studio");
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [saved, setSaved] = useState(false);

  const resetSettings = () => {
    setDisplayName("Jordan Lee");
    setEmail("jordan@northstar.studio");
    setWeeklyDigest(true);
    setProductUpdates(false);
    setSaved(false);
    setActiveTab("profile");
  };

  return (
    <SettingsSection
      title="Workspace settings"
      description="Manage the preferences for your Northstar Studio account."
      variant="tabs"
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
                  value={displayName}
                  onChange={(event) => {
                    setDisplayName(event.currentTarget.value);
                    setSaved(false);
                  }}
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
                  value={email}
                  onChange={(event) => {
                    setEmail(event.currentTarget.value);
                    setSaved(false);
                  }}
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
                  onChange={(event) => {
                    setWeeklyDigest(event.currentTarget.checked);
                    setSaved(false);
                  }}
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
                  onChange={(event) => {
                    setProductUpdates(event.currentTarget.checked);
                    setSaved(false);
                  }}
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
        <Button variant="outline" onClick={resetSettings}>Cancel</Button>
        <Button onClick={() => setSaved(true)}>Save preferences</Button>
      </FormActions>
      {saved ? <p role="status">Preferences saved in this local example.</p> : null}
    </SettingsSection>
  );
};
