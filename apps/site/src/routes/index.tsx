import * as fs from "node:fs";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { PageLayout, Section, SectionStack, Stack } from "@puzzle/ui";
import { Theme } from "@puzzle/theme";
import { Heading, Text } from "@puzzle/ui";
import { Header } from "@/components/layout/header";
import { DialogSection } from "@/components/dialog-section";

const filePath = "count.txt";

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
  );
}

const getCount = createServerFn({
  method: "GET",
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  return (
    <Theme
      theme="light"
      fonts={{
        heading: {
          family: "Geist",
          weights: [600, 700],
        },
        body: {
          family: "Inter",
          weights: [400, 600],
        },
        accent: {
          family: "Geist",
          weights: [400, 500],
        },
      }}
    >
      <PageLayout
        header={<Header />}
        headerClassName="sticky top-0 p-2 bg-white/10 border-b border-gray-200/10 shadow-sm"
      >
        <SectionStack divideY>
          <DialogSection />
          <Section>
            <Stack
              as="ul"
              direction="row"
              alignH="center"
              alignV="center"
              divider={<li role="separator">-</li>}
            >
              <li>A</li>
              <li>B</li>
              <li>C</li>
              <li>D</li>
            </Stack>
            <Heading variant="headline2">What is Puzzle?</Heading>
            <Text>
              Puzzle is a modern React UI framework designed to help developers
              build accessible, responsive, and visually appealing user
              interfaces with ease. It is open source and provides a set of
              reusable components, theming capabilities, and a focus on
              developer experience.
            </Text>
          </Section>
          <Section>
            <Heading variant="headline2">Why another UI framework?</Heading>
            <Text>
              While there are many React UI frameworks available, Puzzle aims to
              provide a complete and developer-friendly solution. It focuses on
              ease of use, theming capabilities, and a set of reusable
              components that help developers build consistent and visually
              appealing interfaces efficiently.
            </Text>
          </Section>
          <Section>
            <Heading variant="headline2">CSS framework agnostic</Heading>
            <Text>
              Puzzle is designed to be CSS framework agnostic, allowing
              developers to integrate it seamlessly with their preferred CSS
              solutions. This flexibility ensures that Puzzle can be used in a
              wide range of projects without imposing specific styling
              constraints.
            </Text>
          </Section>
          <Section>
            <Heading variant="headline2">Fluid components</Heading>
            <Text>
              Puzzle components are designed to be fluid and adaptable, allowing
              developers to create responsive layouts that work across different
              screen sizes and devices. This ensures that applications built
              with Puzzle maintain a consistent and visually appealing design
              regardless of the user's environment.
            </Text>
          </Section>
        </SectionStack>
      </PageLayout>
    </Theme>
  );
}
