import { Theme } from "@puzzle-ui/theme";
import { Button, DataTable, FileUpload } from "@puzzle-ui/ui";
import { useCurrentFrame } from "remotion";
import type { TutorialPreview } from "../types";

type Member = {
  name: string;
  role: string;
  team: string;
};

const members: Member[] = [
  { name: "Alex Morgan", role: "Designer", team: "Product" },
  { name: "Jordan Lee", role: "Engineer", team: "Platform" },
  { name: "Sam Rivera", role: "Researcher", team: "Product" },
  { name: "Taylor Kim", role: "Engineer", team: "Platform" },
  { name: "Morgan Chen", role: "Writer", team: "Design" },
  { name: "Casey Patel", role: "Engineer", team: "Platform" },
];

type PuzzlePreviewProps = {
  component: TutorialPreview;
  sceneId: string;
};

const DataTablePreview = ({ sceneId }: { sceneId: string }) => {
  const hasSort = sceneId === "sorting" || sceneId === "search";

  return (
    <DataTable<Member>
      numberOfItems={members.length}
      header={["Name", "Role", "Team"]}
      itemsPerPage={3}
      initialItems={members.slice(0, 3)}
      requestItems={async (start, end) => members.slice(start, end)}
      renderCell={(member) => [member.name, member.role, member.team]}
      defaultSort={hasSort ? { columnIndex: 1, direction: "asc" } : undefined}
      getSortValue={
        hasSort
          ? (member, columnIndex) =>
              [member.name, member.role, member.team][columnIndex] ?? null
          : undefined
      }
      searchable={sceneId === "search"}
      searchPlaceholder="Search members"
      getSearchValue={(member) => `${member.name} ${member.role} ${member.team}`}
      maxHeight={290}
    />
  );
};

const FileUploadPreview = () => (
  <FileUpload
    title="Upload a document"
    description="Choose a document or drop it here."
    browseLabel="Choose file"
  />
);

const ThemeSetupPreview = ({ sceneId }: { sceneId: string }) => (
  <Theme
    scope="local"
    theme={sceneId === "dark-mode" ? "dark" : "light"}
    colorTheme="cobalt-sky"
    tokens={
      sceneId === "token-override"
        ? { radius: { md: "0.5rem" } }
        : undefined
    }
  >
    <div
      style={{
        alignItems: "start",
        display: "grid",
        gap: 18,
        justifyItems: "start",
        minHeight: 290,
        padding: 28,
      }}
    >
      <div>
        <div style={{ color: "#64748b", fontSize: 14 }}>YOUR APP</div>
        <h2 style={{ color: "#0f172a", fontSize: 26, margin: "8px 0" }}>
          One provider, one theme
        </h2>
        <p style={{ color: "#475569", margin: 0 }}>
          Puzzle UI components read the same theme tokens.
        </p>
      </div>
      <Button>Continue</Button>
    </div>
  </Theme>
);

export const PuzzlePreview = ({ component, sceneId }: PuzzlePreviewProps) => {
  const frame = useCurrentFrame();
  const entrance = Math.min(frame / 14, 1);

  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 18,
        boxShadow: "0 24px 64px rgba(0,0,0,.2)",
        opacity: entrance,
        overflow: "hidden",
        transform: `translateY(${(1 - entrance) * 12}px)`,
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          color: "#334155",
          display: "flex",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          fontSize: 15,
          height: 42,
          gap: 8,
          padding: "0 14px",
        }}
      >
        <span style={{ color: "#ef4444" }}>●</span>
        <span style={{ color: "#f59e0b" }}>●</span>
        <span style={{ color: "#22c55e" }}>●</span>
        <span style={{ color: "#64748b", marginLeft: 8 }}>Live Puzzle component</span>
      </div>
      <div style={{ minHeight: 350, padding: 18 }}>
        {component === "theme-setup" ? (
          <ThemeSetupPreview sceneId={sceneId} />
        ) : (
          <Theme colorTheme="cobalt-sky">
            {component === "data-table" ? (
              <DataTablePreview sceneId={sceneId} />
            ) : (
              <FileUploadPreview />
            )}
          </Theme>
        )}
      </div>
    </div>
  );
};
