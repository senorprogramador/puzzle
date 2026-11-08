import { Button, Heading, Stack } from "@puzzle-ui/ui";

type HeaderProps = {};

const Header = ({}: HeaderProps) => {
  return (
    <Stack
      className="puzzle-container"
      direction="row"
      alignH="between"
      alignV="center"
    >
      <Stack direction="row" alignV="center" gap="0">
        <img
          src="/favicon.svg"
          width="48"
          height="48"
          alt="Logo"
          className="h-12 w-12"
        />
        <Heading level="headline4" as="h1" className="ml-4">
          Puzzle
        </Heading>
      </Stack>
      <Stack
        as="nav"
        direction="row"
        alignV="center"
        divider={<div role="separator">|</div>}
        className="desktop:hidden"
      >
        <Button variant="ghost" href="/">
          Home
        </Button>
        <Button variant="ghost" href="/about">
          About
        </Button>
      </Stack>
    </Stack>
  );
};

export { Header, type HeaderProps };
