import { AppBar } from "@puzzle-ui/ui";

type HeaderProps = {};

const Header = ({}: HeaderProps) => {
  return (
    <AppBar
      logo={
        <img
          src="/favicon.svg"
          width="48"
          height="48"
          alt="Logo"
          className="h-12 w-12"
        />
      }
      title="Puzzle"
      navigationItems={[
        { label: "Home", href: "/", current: true },
        { label: "Docs", href: "/docs/getting-started" },
        { label: "About", href: "/docs/about" },
        { label: "Architecture", href: "/docs/architecture" },
      ]}
      sticky
    />
  );
};

export { Header, type HeaderProps };
