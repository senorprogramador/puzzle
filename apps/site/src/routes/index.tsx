import * as fs from "node:fs";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  Accordion,
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationItem,
  BreadcrumbsProps,
  Button,
  Carousel,
  CarouselController,
  PageLayout,
  Section,
  SectionStack,
  Skeleton,
  Stack,
  TextDocument,
  TextEditor,
  TextEditorToolbar,
  TextRenderer,
} from "@puzzle/ui";
import { Heading, Text, Preview } from "@puzzle/ui";
import { DialogSection } from "@/components/dialog-section";
import { FlowbiteIcon } from "@puzzle/icons/sets/flowbite";
import { useState } from "react";
import { Icon } from "@puzzle/icons";

const breadcrumbs = [
  {
    label: "Home",
    href: "/",
    leadingIcon: <FlowbiteIcon name="home-solid" size={16} />,
  },
  {
    label: "Projects",
    href: "/projects",
    leadingIcon: <FlowbiteIcon name="folder-solid" size={16} />,
  },
  {
    label: "Puzzle",
  },
] satisfies BreadcrumbsProps["items"];

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

const accordionItems = [
  {
    id: "shipping",
    title: "Shipping information",
    content: <p>Orders are shipped within 1–2 business days.</p>,
  },
  {
    id: "returns",
    title: "Returns and refunds",
    content: <p>You can return eligible items within 30 days.</p>,
  },
  {
    id: "payment",
    title: "Payment methods",
    content: <p>We accept the major credit cards.</p>,
  },
];

function Home() {
  const [document, setDocument] = useState<TextDocument>({
    type: "doc",
    content: [
      {
        type: "heading",
        variant: "headline1",
        children: [{ text: "Hallo", marks: ["bold"] }],
      },
      {
        type: "paragraph",
        variant: "body1",
        children: [
          { text: "Dit is gewone tekst met " },
          {
            text: "opmaak",
            marks: ["italic", "underline"],
          },
        ],
      },
    ],
  });
  return (
    <PageLayout
      header={
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
            { label: "Components", href: "/components" },
            { label: "Docs", href: "/docs" },
          ]}
          trailingComponents={
            <>
              <Button variant="ghost">Settings</Button>
              <Avatar alt="Sjoerd van den Berg" />
            </>
          }
          sticky
        />
      }
    >
      <SectionStack divideY>
        <Section>
          <TextEditor
            value={document}
            onChange={setDocument}
            toolbar={<TextEditorToolbar />}
          />
          <TextRenderer document={document} />
        </Section>
        <DialogSection />
        <Section>
          <Preview defaultDevice="mobile">
            <Section>
              <Heading variant="headline2">Bottom Navigation</Heading>
              <BottomNavigation>
                <BottomNavigationItem
                  icon={<Icon name="bxs:home" size={24} />}
                  label="Home"
                />
                <BottomNavigationItem
                  icon={<Icon name="bxs:package" size={24} />}
                  label="Components"
                />
                <BottomNavigationItem
                  icon={<Icon name="bxs:file-blank" size={24} />}
                  label="Docs"
                />
              </BottomNavigation>
            </Section>
          </Preview>
        </Section>
        <Section>
          <Preview defaultDevice="mobile">
            <Section>
              <Heading variant="headline2">Accordion</Heading>
              <Accordion items={accordionItems} unMountOnClose={true} />
            </Section>
          </Preview>
        </Section>
        <Section>
          <Preview defaultDevice="mobile">
            <Section>
              <Heading variant="headline2">App Bar</Heading>
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
                  { label: "Components", href: "/components" },
                  { label: "Docs", href: "/docs" },
                ]}
                trailingComponents={
                  <>
                    <Button variant="ghost">Settings</Button>
                    <Avatar alt="Sjoerd van den Berg" />
                  </>
                }
                sticky
              />
            </Section>
            <div className="h-128" />
          </Preview>
        </Section>
        <Section>
          <Preview defaultDevice="mobile">
            <Section>
              <Heading variant="headline2">Skeleton</Heading>
              <Skeleton width="75%" height={16} />
              <Skeleton width="75%" height={16} radius="none" />
              <Skeleton width="100%" height={180} />
              <Skeleton width={48} height={48} radius="full" />
              <Skeleton width={64} height={64} radius="full" />
              <Skeleton width={120} height={40} radius="full" />
            </Section>
          </Preview>
        </Section>
        <Section>
          <Preview defaultDevice="mobile">
            <Section>
              <Heading variant="headline2">Carousel</Heading>
              <CarouselController
                items={Array.from({ length: 10 }, (_, i) => i + 1)}
              >
                <Carousel<number>
                  renderItem={(item) => (
                    <div className="flex items-center justify-center p-4 border border-orange-500 bg-orange-100">
                      {item}
                    </div>
                  )}
                  panelsPerView={{
                    mobile: 1,
                    tablet: 3,
                    desktop: 4,
                  }}
                  singlePageAlignment="center"
                  buttonAlignment="aside"
                  backButton={
                    <button className="disabled:opacity-50 select-none disabled:pointer-events-none w-8 h-8 flex items-center justify-center border border-gray-300 bg-white rounded-full">
                      &lt;
                    </button>
                  }
                  nextButton={
                    <button className="disabled:opacity-50 select-none disabled:pointer-events-none w-8 h-8 flex items-center justify-center border border-gray-300 bg-white rounded-full">
                      &gt;
                    </button>
                  }
                  pagerAlignment="under"
                  renderPager={(currentPage, numberOfPages) => (
                    <Stack
                      direction="row"
                      alignH="center"
                      alignV="center"
                      gap="sm"
                      className="mt-2"
                    >
                      {Array.from({ length: numberOfPages }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i === currentPage
                              ? "font-bold text-2xl my-auto"
                              : ""
                          }
                        >
                          {i === currentPage ? "•" : "○"}
                        </span>
                      ))}
                    </Stack>
                  )}
                />
              </CarouselController>
            </Section>
          </Preview>
        </Section>
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
            build accessible, responsive, and visually appealing user interfaces
            with ease. It is open source and provides a set of reusable
            components, theming capabilities, and a focus on developer
            experience.
          </Text>
        </Section>
        <Section>
          <Heading variant="headline2">Why another UI framework?</Heading>
          <Text>
            While there are many React UI frameworks available, Puzzle aims to
            provide a complete and developer-friendly solution. It focuses on
            ease of use, theming capabilities, and a set of reusable components
            that help developers build consistent and visually appealing
            interfaces efficiently.
          </Text>
        </Section>
        <Section>
          <Heading variant="headline2">CSS framework agnostic</Heading>
          <Text>
            Puzzle is designed to be CSS framework agnostic, allowing developers
            to integrate it seamlessly with their preferred CSS solutions. This
            flexibility ensures that Puzzle can be used in a wide range of
            projects without imposing specific styling constraints.
          </Text>
        </Section>
        <Section>
          <Heading variant="headline2">Fluid components</Heading>
          <Text>
            Puzzle components are designed to be fluid and adaptable, allowing
            developers to create responsive layouts that work across different
            screen sizes and devices. This ensures that applications built with
            Puzzle maintain a consistent and visually appealing design
            regardless of the user's environment.
          </Text>
        </Section>
      </SectionStack>
    </PageLayout>
  );
}
