import { Theme } from "@puzzle/theme";
import { Icon } from "@puzzle/icons";
import { BottomNavigation, BottomNavigationItem, Section } from "@puzzle/ui";

const BottomNavigationPreview = () => (
  <Theme scope="local" components={{ link: null }}>
    <Section>
      <BottomNavigation ariaLabel="Primary destinations">
        <BottomNavigationItem
          icon={<Icon name="lucide:house" />}
          label="Home"
          href="#home"
          active
        />
        <BottomNavigationItem
          icon={<Icon name="lucide:search" />}
          label="Search"
          href="#search"
        />
        <BottomNavigationItem
          icon={<Icon name="lucide:settings" />}
          label="Settings"
          href="#settings"
        />
      </BottomNavigation>
    </Section>
  </Theme>
);

export { BottomNavigationPreview };
