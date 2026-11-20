import "server-only";

type RenderingServerContentProps = Readonly<{
  label: string;
}>;

export const RenderingServerContent = ({
  label,
}: RenderingServerContentProps) => (
  <section data-testid={`rendering-${label}-content`}>
    <h2>{label}</h2>
    <p>This content is rendered by a Server Component.</p>
  </section>
);
