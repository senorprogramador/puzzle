"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  DashboardActivityFeed,
  DashboardHeader,
  DashboardProgressCard,
  DashboardShell,
  DashboardSidebar,
  DashboardStatCard,
  DashboardStatGroup,
  DashboardTopbar,
  EmptyStatePanel,
  ProjectCard,
  ProjectGrid,
  SettingsRow,
  SettingsSection,
} from "@puzzle-ui/pieces";
import {
  EmailVerificationNotice,
  MfaSettings,
  useAuth,
} from "@puzzle-ui/fullstack/auth/client";
import {
  Button,
  Checkbox,
  DatePicker,
  FormField,
  Heading,
  Select,
  Text,
  TextInput,
} from "@puzzle-ui/ui";
import {
  deleteLocalEntity,
  mergeLocalEntities,
  upsertLocalEntity,
  type LocalEntityChanges,
} from "./workspace-device-store";
import type {
  Activity,
  NotificationPreferences,
  Project,
  ProjectMember,
  Workspace,
  WorkspaceInvitation,
  WorkspaceMember,
  WorkspaceTask,
} from "@puzzle-ui/workspace/client";

import "./workspace-app.css";

type View = "overview" | "projects" | "tasks" | "team" | "activity" | "settings";

export type WorkspaceSummary = Pick<
  Workspace,
  "id" | "name" | "slug" | "description"
>;

type WorkspaceDetails = WorkspaceSummary & Pick<Workspace, "revision">;
type ProjectView = Omit<
  Pick<
    Project,
    | "id"
    | "name"
    | "description"
    | "status"
    | "revision"
    | "color"
    | "ownerId"
  >,
  never
> & {
  startDate: string | null;
  endDate: string | null;
  updatedAt: string;
};
type TaskView = Omit<
  Pick<
    WorkspaceTask,
    | "id"
    | "title"
    | "description"
    | "status"
    | "priority"
    | "projectId"
    | "assigneeId"
  >,
  never
> & { dueAt: string | null; updatedAt: string };
type MemberView = Pick<
  WorkspaceMember,
  "id" | "userId" | "role" | "status"
>;
type ProjectMemberView = Pick<ProjectMember, "id" | "userId" | "role">;
type InvitationView = Omit<
  Pick<
    WorkspaceInvitation,
    "id" | "email" | "role" | "acceptedAt" | "revokedAt"
  >,
  "acceptedAt" | "revokedAt"
> & {
  acceptedAt: string | null;
  expiresAt: string;
  revokedAt: string | null;
};
type ActivityView = Pick<
  Activity,
  "id" | "action" | "entityType" | "entityId" | "details" | "actorUserId"
> & { createdAt: string };
type PreferencesView = Pick<
  NotificationPreferences,
  "emailNotifications" | "activityNotifications" | "productUpdates"
>;
type SessionView = {
  readonly sessionId: string;
  readonly kind: "anonymous" | "authenticated";
  readonly createdAt: string;
  readonly lastSeenAt: string;
  readonly expiresAt: string;
  readonly current: boolean;
};
type SettingsView = "general" | "profile" | "security" | "notifications";
type TaskDraft = {
  title: string;
  description: string;
  projectId: string;
  status: WorkspaceTask["status"];
  priority: WorkspaceTask["priority"];
  assigneeId: string;
  dueAt: string;
};
type ProjectDraft = {
  name: string;
  description: string;
  color: string;
  status: Project["status"];
  startDate: string;
  endDate: string;
};

type WorkspaceData = {
  workspace: WorkspaceDetails;
  projects: readonly ProjectView[];
  tasks: readonly TaskView[];
  activity: {
    readonly items: readonly ActivityView[];
    readonly nextCursor: { readonly value: string } | null;
    readonly hasNextPage: boolean;
  };
  preferences: PreferencesView | null;
};

type LocalWorkspaceSnapshot = {
  readonly localOnly?: boolean;
  readonly workspace?: WorkspaceDetails;
  readonly projects?: LocalEntityChanges<ProjectView>;
  readonly tasks?: LocalEntityChanges<TaskView>;
  readonly members?: LocalEntityChanges<MemberView>;
  readonly invitations?: LocalEntityChanges<InvitationView>;
  readonly projectMembers?: Readonly<
    Record<string, LocalEntityChanges<ProjectMemberView>>
  >;
  readonly preferences?: PreferencesView;
  readonly activity?: readonly ActivityView[];
};
type LocalDashboardSnapshot = {
  readonly version: 1;
  readonly localWorkspaces: readonly WorkspaceSummary[];
  readonly workspaceData: Readonly<Record<string, LocalWorkspaceSnapshot>>;
  readonly profile?: { readonly name: string; readonly image: string };
};
type ApiError = { error?: { message?: string } };

const views: readonly { id: View; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "projects", label: "Projects" },
  { id: "tasks", label: "Tasks" },
  { id: "team", label: "Team" },
  { id: "activity", label: "Activity" },
  { id: "settings", label: "Settings" },
];
const taskPriorities: readonly WorkspaceTask["priority"][] = [
  "low",
  "medium",
  "high",
  "urgent",
];
const PAGE_SIZE = 10;

const taskStatuses: readonly WorkspaceTask["status"][] = [
  "todo",
  "in_progress",
  "review",
  "done",
];
const projectStatuses: readonly Project["status"][] = [
  "active",
  "completed",
  "archived",
];
const memberRoles: readonly ("admin" | "member")[] = ["member", "admin"];

const api = async <T,>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");

  const response = await fetch(path, {
    ...init,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as ApiError).error?.message === "string"
        ? (payload as ApiError).error?.message
        : "The request could not be completed.";

    throw new Error(message);
  }

  return payload as T;
};

const jsonRequest = (method: "POST" | "PATCH" | "DELETE", body?: unknown) => ({
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

const describeError = (error: unknown) =>
  error instanceof Error ? error.message : "The request could not be completed.";

const loadWorkspaceData = async (
  workspaceId: string,
  local?: LocalWorkspaceSnapshot,
): Promise<WorkspaceData> => {
  if (local?.localOnly) {
    if (!local.workspace) {
      throw new Error("The locally saved workspace is missing its details.");
    }

    return mergeWorkspaceData(emptyWorkspaceData(local.workspace), local);
  }

  const base = `/api/workspaces/${encodeURIComponent(workspaceId)}`;
  const [workspace, projects, tasks, activity, preferences] = await Promise.all([
    api<{ workspace: WorkspaceDetails }>(base),
    api<{ projects: readonly ProjectView[] }>(`${base}/projects`),
    api<{ tasks: readonly TaskView[] }>(`${base}/tasks`),
    api<{ activity: WorkspaceData["activity"] }>(`${base}/activity?first=8`),
    api<{ preferences: PreferencesView | null }>(`${base}/preferences`),
  ]);

  return mergeWorkspaceData({
    workspace: workspace.workspace,
    projects: projects.projects,
    tasks: tasks.tasks,
    activity: activity.activity,
    preferences: preferences.preferences,
  }, local);
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const parseDateInput = (value: string): Date | null => {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
};

const normalizeText = (
  value: string,
  label: string,
  maximumLength: number,
  required = false,
) => {
  const normalized = value.trim();
  if (required && !normalized) throw new Error(`${label} is required.`);
  if (normalized.length > maximumLength) {
    throw new Error(`${label} must be ${maximumLength} characters or fewer.`);
  }
  return normalized;
};

const dateInputToIso = (value: string, label: string): string | null => {
  if (!value) return null;
  const date = parseDateInput(value);
  if (!date) throw new Error(`Enter a valid ${label}.`);
  return date.toISOString();
};

const formatDateInput = (value: Date | null): string => {
  if (!value) return "";

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const eventLabel = (action: string) =>
  action.replaceAll(".", " ").replaceAll("_", " ");

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);

const DEFAULT_PREFERENCES: PreferencesView = {
  emailNotifications: true,
  activityNotifications: true,
  productUpdates: false,
};
const EMPTY_LOCAL_SNAPSHOT: LocalDashboardSnapshot = {
  version: 1,
  localWorkspaces: [],
  workspaceData: {},
};
const DEVICE_STORAGE_VERSION = 1;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const deviceStorageKey = (userId: string) =>
  `puzzle-workspace:v${DEVICE_STORAGE_VERSION}:${encodeURIComponent(userId)}`;

const readDeviceSnapshot = (userId: string): LocalDashboardSnapshot => {
  const raw = window.localStorage.getItem(deviceStorageKey(userId));
  if (!raw) return EMPTY_LOCAL_SNAPSHOT;

  const value: unknown = JSON.parse(raw);
  if (
    !isRecord(value) ||
    value.version !== DEVICE_STORAGE_VERSION ||
    !Array.isArray(value.localWorkspaces) ||
    !isRecord(value.workspaceData)
  ) {
    throw new Error("The saved dashboard data has an unsupported format.");
  }

  return value as LocalDashboardSnapshot;
};

const mergeWorkspaceData = (
  base: WorkspaceData,
  local?: LocalWorkspaceSnapshot,
): WorkspaceData => {
  const activityItems = new Map(
    base.activity.items.map((item) => [item.id, item]),
  );
  for (const item of local?.activity ?? []) {
    activityItems.set(item.id, item);
  }

  return {
    workspace: local?.workspace ?? base.workspace,
    projects: mergeLocalEntities(base.projects, local?.projects),
    tasks: mergeLocalEntities(base.tasks, local?.tasks),
    activity: {
      ...base.activity,
      items: [...activityItems.values()].sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt),
      ),
    },
    preferences: local?.preferences ?? base.preferences,
  };
};

const emptyWorkspaceData = (workspace: WorkspaceSummary): WorkspaceData => ({
  workspace: { ...workspace, revision: 0 },
  projects: [],
  tasks: [],
  activity: { items: [], nextCursor: null, hasNextPage: false },
  preferences: DEFAULT_PREFERENCES,
});

const mergeWorkspaceSummaries = (
  initial: readonly WorkspaceSummary[],
  snapshot: LocalDashboardSnapshot,
): readonly WorkspaceSummary[] => {
  const workspaces = new Map(initial.map((workspace) => [workspace.id, workspace]));
  for (const workspace of snapshot.localWorkspaces) {
    workspaces.set(workspace.id, workspace);
  }
  for (const [id, local] of Object.entries(snapshot.workspaceData)) {
    if (local.workspace) {
      workspaces.set(id, {
        id,
        name: local.workspace.name,
        slug: local.workspace.slug,
        description: local.workspace.description,
      });
    }
  }
  return [...workspaces.values()];
};

const localActivity = (
  userId: string,
  action: Activity["action"],
  entityType: Activity["entityType"],
  entityId: string,
  details: Activity["details"],
): ActivityView => ({
  id: crypto.randomUUID(),
  action,
  entityType,
  entityId,
  details,
  actorUserId: userId,
  createdAt: new Date().toISOString(),
});

const SessionManagement = () => {
  const [sessions, setSessions] = useState<readonly SessionView[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  const refresh = async () => {
    const result = await api<{ sessions: readonly SessionView[] }>(
      "/api/auth/sessions",
    );
    setSessions(result.sessions);
  };

  useEffect(() => {
    let active = true;

    void api<{ sessions: readonly SessionView[] }>("/api/auth/sessions")
      .then((result) => {
        if (active) setSessions(result.sessions);
      })
      .catch((requestError: unknown) => {
        if (active) setError(describeError(requestError));
      });

    return () => {
      active = false;
    };
  }, []);

  const revoke = async (sessionId: string) => {
    setRevoking(sessionId);
    setError(null);

    try {
      await api(
        "/api/auth/sessions/revoke",
        jsonRequest("POST", { sessionId }),
      );
      await refresh();
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setRevoking(null);
    }
  };

  return (
    <SettingsSection
      title="Active sessions"
      description="Review devices signed in to your account and revoke access you no longer recognize."
    >
      {error && (
        <p className="puzzle-workspace-error" role="alert">
          {error}
        </p>
      )}
      {sessions === null ? (
        <Text as="p" role="status">Loading sessions…</Text>
      ) : sessions.length === 0 ? (
        <Text as="p">No active sessions were found.</Text>
      ) : (
        <ul className="puzzle-workspace-list">
          {sessions.map((session) => (
            <li className="puzzle-workspace-list-item" key={session.sessionId}>
              <div>
                <strong>{session.current ? "This device" : "Signed-in device"}</strong>
                <span>
                  {session.kind} · Last active {formatDate(session.lastSeenAt)}
                </span>
              </div>
              {session.current ? (
                <Text as="span">Current session</Text>
              ) : (
                <Button
                  variant="outline"
                  disabled={revoking === session.sessionId}
                  onClick={() => void revoke(session.sessionId)}
                >
                  {revoking === session.sessionId ? "Revoking…" : "Revoke"}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </SettingsSection>
  );
};

const PageControls = ({
  label,
  page,
  pageCount,
  onChange,
}: {
  readonly label: string;
  readonly page: number;
  readonly pageCount: number;
  readonly onChange: (page: number) => void;
}) => (
  <nav className="puzzle-workspace-pagination" aria-label={`${label} pages`}>
    <Button
      variant="outline"
      disabled={page <= 1}
      onClick={() => onChange(page - 1)}
    >
      Previous
    </Button>
    <Text as="span">
      Page {page} of {pageCount}
    </Text>
    <Button
      variant="outline"
      disabled={page >= pageCount}
      onClick={() => onChange(page + 1)}
    >
      Next
    </Button>
  </nav>
);

export type WorkspaceAppProps = {
  readonly initialWorkspaces: readonly WorkspaceSummary[];
  readonly userId: string;
  readonly userEmail: string;
  readonly userName?: string | null;
  readonly userImage?: string | null;
  readonly topbarActions?: ReactNode;
};

const WorkspaceApp = ({
  initialWorkspaces,
  userId,
  userEmail,
  userName,
  userImage,
  topbarActions,
}: WorkspaceAppProps) => {
  const { snapshot: authSnapshot } = useAuth();
  const isDeviceLocalUser = authSnapshot.user?.id.startsWith("device_") ?? false;
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [workspaceId, setWorkspaceId] = useState(
    initialWorkspaces[0]?.id ?? "",
  );
  const [deviceSnapshot, setDeviceSnapshot] =
    useState<LocalDashboardSnapshot>(EMPTY_LOCAL_SNAPSHOT);
  const deviceSnapshotRef = useRef(deviceSnapshot);
  const [hydratedUserId, setHydratedUserId] = useState<string | null>(null);
  const [devicePersistenceEnabled, setDevicePersistenceEnabled] =
    useState(true);
  const [view, setView] = useState<View>("overview");
  const [settingsView, setSettingsView] = useState<SettingsView>("general");
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(
    null,
  );
  const [members, setMembers] = useState<readonly MemberView[]>([]);
  const [invitations, setInvitations] = useState<readonly InvitationView[]>([]);
  const [preferences, setPreferences] =
    useState<PreferencesView>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(Boolean(initialWorkspaces[0]));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceStorageError, setDeviceStorageError] = useState<string | null>(
    null,
  );
  const [invitationError, setInvitationError] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectColor, setProjectColor] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState<
    Project["status"] | "all"
  >("all");
  const [projectSort, setProjectSort] = useState<"updated" | "name">("updated");
  const [projectPage, setProjectPage] = useState(1);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectDraft, setProjectDraft] = useState<ProjectDraft | null>(null);
  const [projectMembers, setProjectMembers] = useState<
    readonly ProjectMemberView[]
  >([]);
  const [projectMembersProjectId, setProjectMembersProjectId] = useState<
    string | null
  >(null);
  const [projectMemberUserId, setProjectMemberUserId] = useState("");
  const [projectMemberRole, setProjectMemberRole] =
    useState<ProjectMember["role"]>("member");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskProjectId, setTaskProjectId] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] =
    useState<WorkspaceTask["priority"]>("medium");
  const [taskAssigneeId, setTaskAssigneeId] = useState("");
  const [taskDueAt, setTaskDueAt] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] =
    useState<WorkspaceTask["status"] | "all">("all");
  const [taskPriorityFilter, setTaskPriorityFilter] =
    useState<WorkspaceTask["priority"] | "all">("all");
  const [taskProjectFilter, setTaskProjectFilter] = useState("all");
  const [taskSort, setTaskSort] = useState<"updated" | "due" | "title">(
    "updated",
  );
  const [taskPage, setTaskPage] = useState(1);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskDraft, setTaskDraft] = useState<TaskDraft | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");
  const [profileName, setProfileName] = useState(userName ?? "");
  const [profileImage, setProfileImage] = useState(userImage ?? "");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    deviceSnapshotRef.current = deviceSnapshot;
  }, [deviceSnapshot]);

  useEffect(() => {
    let snapshot = EMPTY_LOCAL_SNAPSHOT;
    let persistenceEnabled = true;
    setDeviceStorageError(null);

    try {
      snapshot = readDeviceSnapshot(userId);
    } catch (loadError) {
      persistenceEnabled = false;
      setDeviceStorageError(
        `Local dashboard data could not be loaded: ${describeError(loadError)}`,
      );
    }

    setDeviceSnapshot(snapshot);
    setWorkspaces(mergeWorkspaceSummaries(initialWorkspaces, snapshot));
    setProfileName(snapshot.profile?.name ?? userName ?? "");
    setProfileImage(snapshot.profile?.image ?? userImage ?? "");
    setDevicePersistenceEnabled(persistenceEnabled);
    setHydratedUserId(userId);
  }, [initialWorkspaces, userId, userImage, userName]);

  useEffect(() => {
    if (hydratedUserId !== userId || !devicePersistenceEnabled) return;

    try {
      window.localStorage.setItem(
        deviceStorageKey(userId),
        JSON.stringify(deviceSnapshot),
      );
    } catch (saveError) {
      setDevicePersistenceEnabled(false);
      setDeviceStorageError(
        `Local dashboard changes could not be saved: ${describeError(saveError)}`,
      );
    }
  }, [devicePersistenceEnabled, deviceSnapshot, hydratedUserId, userId]);

  useEffect(() => {
    if (hydratedUserId === userId) {
      setWorkspaces(mergeWorkspaceSummaries(initialWorkspaces, deviceSnapshot));
    } else {
      setWorkspaces(initialWorkspaces);
    }
  }, [deviceSnapshot, hydratedUserId, initialWorkspaces, userId]);

  useEffect(() => {
    if (hydratedUserId !== userId) return;

    if (!workspaceId) {
      setWorkspaceData(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    setWorkspaceData(null);

    void loadWorkspaceData(
      workspaceId,
      deviceSnapshotRef.current.workspaceData[workspaceId],
    )
      .then((data) => {
        if (!active) return;
        setWorkspaceData(data);
        setPreferences(data.preferences ?? DEFAULT_PREFERENCES);
      })
      .catch((loadError: unknown) => {
        if (active) setError(describeError(loadError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [hydratedUserId, userId, workspaceId]);

  useEffect(() => {
    if (
      (view !== "team" && view !== "tasks" && view !== "projects") ||
      !workspaceId ||
      hydratedUserId !== userId
    ) {
      return;
    }

    let active = true;
    const local = deviceSnapshotRef.current.workspaceData[workspaceId];
    const base = `/api/workspaces/${encodeURIComponent(workspaceId)}`;

    if (local?.localOnly) {
      setMembers(mergeLocalEntities([], local.members));
    } else {
      void api<{ members: readonly MemberView[] }>(`${base}/members`)
        .then((result) => {
          if (active) setMembers(mergeLocalEntities(result.members, local?.members));
        })
        .catch((loadError: unknown) => {
          if (active) setError(describeError(loadError));
        });
    }

    if (view === "team") {
      setInvitationError(null);
      if (local?.localOnly) {
        setInvitations(mergeLocalEntities([], local.invitations));
      } else {
        void api<{ invitations: readonly InvitationView[] }>(
          `${base}/invitations`,
        )
          .then((result) => {
            if (active) {
              setInvitations(
                mergeLocalEntities(result.invitations, local?.invitations),
              );
            }
          })
          .catch((loadError: unknown) => {
            if (active) setInvitationError(describeError(loadError));
          });
      }
    }

    return () => {
      active = false;
    };
  }, [hydratedUserId, userId, view, workspaceId]);

  const updateDeviceWorkspace = (
    id: string,
    update: (current: LocalWorkspaceSnapshot) => LocalWorkspaceSnapshot,
  ) => {
    setDeviceSnapshot((current) => ({
      ...current,
      workspaceData: {
        ...current.workspaceData,
        [id]: update(current.workspaceData[id] ?? {}),
      },
    }));
  };

  const addLocalActivity = (
    id: string,
    action: Activity["action"],
    entityType: Activity["entityType"],
    entityId: string,
    details: Activity["details"],
  ) => {
    const activity = localActivity(userId, action, entityType, entityId, details);
    updateDeviceWorkspace(id, (current) => ({
      ...current,
      activity: [activity, ...(current.activity ?? [])],
    }));
    setWorkspaceData((current) =>
      current
        ? {
            ...current,
            activity: {
              ...current.activity,
              items: [
                activity,
                ...current.activity.items.filter((item) => item.id !== activity.id),
              ],
            },
          }
        : current,
    );
  };

  const createWorkspace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const name = normalizeText(workspaceName, "Workspace name", 120, true);
      const slug = workspaceSlug.trim();
      if (
        slug.length > 63 ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
      ) {
        throw new Error("Enter a valid workspace slug.");
      }
      if (workspaces.some((workspace) => workspace.slug === slug)) {
        throw new Error("A workspace with this slug already exists.");
      }

      const workspace: WorkspaceSummary = {
        id: crypto.randomUUID(),
        name,
        slug,
        description: null,
      };
      const workspaceDetails: WorkspaceDetails = {
        ...workspace,
        revision: 0,
      };
      const owner: MemberView = {
        id: `${workspace.id}-member-${userId}`,
        userId,
        role: "owner",
        status: "active",
      };
      const activity = localActivity(
        userId,
        "workspace.created",
        "workspace",
        workspace.id,
        { slug, source: "device" },
      );
      const local: LocalWorkspaceSnapshot = {
        localOnly: true,
        workspace: workspaceDetails,
        members: upsertLocalEntity(undefined, owner),
        activity: [activity],
      };

      setDeviceSnapshot((current) => ({
        ...current,
        localWorkspaces: [...current.localWorkspaces, workspace],
        workspaceData: { ...current.workspaceData, [workspace.id]: local },
      }));
      setWorkspaceData(mergeWorkspaceData(emptyWorkspaceData(workspace), local));
      setMembers([owner]);
      setInvitations([]);
      setWorkspaceId(workspace.id);
      setWorkspaceName("");
      setWorkspaceSlug("");
      setShowCreateWorkspace(false);
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setBusy(false);
    }
  };

  const createProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!workspaceId) return;
    setBusy(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const name = normalizeText(projectName, "Project name", 160, true);
      const description = normalizeText(
        projectDescription,
        "Project description",
        4000,
      );
      const color = normalizeText(projectColor, "Project color", 32);
      const startDate = dateInputToIso(projectStartDate, "start date");
      const endDate = dateInputToIso(projectEndDate, "end date");
      if (startDate && endDate && endDate < startDate) {
        throw new Error("Project end date cannot be before its start date.");
      }
      const project: ProjectView = {
        id: crypto.randomUUID(),
        name,
        description: description || null,
        status: "active",
        revision: 0,
        color: color || null,
        ownerId: userId,
        startDate,
        endDate,
        updatedAt: now,
      };
      setWorkspaceData((current) =>
        current ? { ...current, projects: [...current.projects, project] } : current,
      );
      updateDeviceWorkspace(workspaceId, (current) => ({
        ...current,
        projects: upsertLocalEntity(current.projects, project),
      }));
      addLocalActivity(workspaceId, "project.created", "project", project.id, {
        name: project.name,
      });
      setProjectName("");
      setProjectDescription("");
      setProjectColor("");
      setProjectStartDate("");
      setProjectEndDate("");
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setBusy(false);
    }
  };

  const createTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!workspaceId) return;
    setBusy(true);
    setError(null);

    try {
      const title = normalizeText(taskTitle, "Task title", 200, true);
      const description = normalizeText(
        taskDescription,
        "Task description",
        4000,
      );
      const task: TaskView = {
        id: crypto.randomUUID(),
        title,
        description: description || null,
        projectId: taskProjectId || null,
        status: "todo",
        priority: taskPriority,
        assigneeId: taskAssigneeId || null,
        dueAt: dateInputToIso(taskDueAt, "due date"),
        updatedAt: new Date().toISOString(),
      };
      setWorkspaceData((current) =>
        current ? { ...current, tasks: [...current.tasks, task] } : current,
      );
      updateDeviceWorkspace(workspaceId, (current) => ({
        ...current,
        tasks: upsertLocalEntity(current.tasks, task),
      }));
      addLocalActivity(workspaceId, "task.created", "task", task.id, {
        title: task.title,
        status: task.status,
      });
      setTaskTitle("");
      setTaskDescription("");
      setTaskProjectId("");
      setTaskPriority("medium");
      setTaskAssigneeId("");
      setTaskDueAt("");
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setBusy(false);
    }
  };

  const updateTaskStatus = async (
    taskId: string,
    status: WorkspaceTask["status"],
  ) => {
    if (!workspaceId) return;
    setError(null);

    const task = workspaceData?.tasks.find((item) => item.id === taskId);
    if (!task) return;
    const updated = { ...task, status, updatedAt: new Date().toISOString() };
    setWorkspaceData((current) =>
      current
        ? {
            ...current,
            tasks: current.tasks.map((item) =>
              item.id === taskId ? updated : item,
            ),
          }
        : current,
    );
    updateDeviceWorkspace(workspaceId, (current) => ({
      ...current,
      tasks: upsertLocalEntity(current.tasks, updated),
    }));
    addLocalActivity(workspaceId, "task.status_changed", "task", taskId, {
      status,
    });
  };

  const saveTaskEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!workspaceId || !editingTaskId || !taskDraft) return;
    setBusy(true);
    setError(null);

    try {
      const task = workspaceData?.tasks.find(
        (item) => item.id === editingTaskId,
      );
      if (!task) throw new Error("The task could not be found.");
      const title = normalizeText(taskDraft.title, "Task title", 200, true);
      const description = normalizeText(
        taskDraft.description,
        "Task description",
        4000,
      );
      const updated: TaskView = {
        ...task,
        ...taskDraft,
        title,
        description: description || null,
        projectId: taskDraft.projectId || null,
        assigneeId: taskDraft.assigneeId || null,
        dueAt: dateInputToIso(taskDraft.dueAt, "due date"),
        updatedAt: new Date().toISOString(),
      };
      setWorkspaceData((current) =>
        current
          ? {
              ...current,
              tasks: current.tasks.map((item) =>
                item.id === editingTaskId ? updated : item,
              ),
            }
          : current,
      );
      updateDeviceWorkspace(workspaceId, (current) => ({
        ...current,
        tasks: upsertLocalEntity(current.tasks, updated),
      }));
      addLocalActivity(workspaceId, "task.updated", "task", updated.id, {
        title: updated.title,
        status: updated.status,
      });
      setEditingTaskId(null);
      setTaskDraft(null);
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setBusy(false);
    }
  };

  const deleteTask = async (task: TaskView) => {
    if (
      !workspaceId ||
      !window.confirm(`Delete "${task.title}"? This cannot be undone.`)
    ) {
      return;
    }

    setError(null);

    setWorkspaceData((current) =>
      current
        ? {
            ...current,
            tasks: current.tasks.filter((item) => item.id !== task.id),
          }
        : current,
    );
    updateDeviceWorkspace(workspaceId, (current) => ({
      ...current,
      tasks: deleteLocalEntity(current.tasks, task.id),
    }));
    addLocalActivity(workspaceId, "task.deleted", "task", task.id, {
      title: task.title,
    });
  };

  const updateProjectStatus = async (
    projectId: string,
    status: Project["status"],
  ) => {
    if (!workspaceId) return;
    setError(null);

    const project = workspaceData?.projects.find((item) => item.id === projectId);
    if (!project) return;
    const updated = {
      ...project,
      status,
      revision: project.revision + 1,
      updatedAt: new Date().toISOString(),
    };
    setWorkspaceData((current) =>
      current
        ? {
            ...current,
            projects: current.projects.map((item) =>
              item.id === projectId ? updated : item,
            ),
          }
        : current,
    );
    updateDeviceWorkspace(workspaceId, (current) => ({
      ...current,
      projects: upsertLocalEntity(current.projects, updated),
    }));
    addLocalActivity(workspaceId, "project.updated", "project", projectId, {
      status,
    });
  };

  const loadProjectMembers = async (projectId: string) => {
    if (!workspaceId) return;

    try {
      const local = deviceSnapshotRef.current.workspaceData[workspaceId];
      const changes = local?.projectMembers?.[projectId];
      const members = local?.localOnly
        ? mergeLocalEntities([], changes)
        : mergeLocalEntities(
            (
              await api<{ members: readonly ProjectMemberView[] }>(
                `/api/workspaces/${encodeURIComponent(workspaceId)}/projects/${encodeURIComponent(projectId)}/members`,
              )
            ).members,
            changes,
          );
      setProjectMembers(members);
      setProjectMembersProjectId(projectId);
      setProjectMemberUserId("");
    } catch (requestError) {
      setError(describeError(requestError));
    }
  };

  const addProjectMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!workspaceId || !projectMembersProjectId || !projectMemberUserId) return;
    setBusy(true);
    setError(null);

    try {
      if (projectMembers.some((member) => member.userId === projectMemberUserId)) {
        throw new Error("This user is already assigned to the project.");
      }
      const member: ProjectMemberView = {
        id: crypto.randomUUID(),
        userId: projectMemberUserId,
        role: projectMemberRole,
      };
      setProjectMembers((current) => [...current, member]);
      updateDeviceWorkspace(workspaceId, (current) => {
        const changes = current.projectMembers?.[projectMembersProjectId] ?? {
          upserts: [],
          deletedIds: [],
        };
        return {
          ...current,
          projectMembers: {
            ...current.projectMembers,
            [projectMembersProjectId]: upsertLocalEntity(changes, member),
          },
        };
      });
      addLocalActivity(
        workspaceId,
        "project.member_added",
        "project",
        projectMembersProjectId,
        { userId: projectMemberUserId, role: projectMemberRole },
      );
      setProjectMemberUserId("");
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setBusy(false);
    }
  };

  const removeProjectMember = async (projectMemberId: string) => {
    if (!workspaceId || !projectMembersProjectId) return;

    const member = projectMembers.find((item) => item.id === projectMemberId);
    if (!member) return;
    setProjectMembers((current) =>
      current.filter((item) => item.id !== projectMemberId),
    );
    updateDeviceWorkspace(workspaceId, (current) => {
      const changes = current.projectMembers?.[projectMembersProjectId] ?? {
        upserts: [],
        deletedIds: [],
      };
      return {
        ...current,
        projectMembers: {
          ...current.projectMembers,
          [projectMembersProjectId]: deleteLocalEntity(
            changes,
            projectMemberId,
          ),
        },
      };
    });
    addLocalActivity(
      workspaceId,
      "project.member_removed",
      "project",
      projectMembersProjectId,
      { userId: member.userId },
    );
  };

  const saveProjectEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!workspaceId || !editingProjectId || !projectDraft) return;
    setBusy(true);
    setError(null);

    try {
      const project = workspaceData?.projects.find(
        (item) => item.id === editingProjectId,
      );
      if (!project) throw new Error("The project could not be found.");
      const name = normalizeText(projectDraft.name, "Project name", 160, true);
      const description = normalizeText(
        projectDraft.description,
        "Project description",
        4000,
      );
      const color = normalizeText(projectDraft.color, "Project color", 32);
      const startDate = dateInputToIso(projectDraft.startDate, "start date");
      const endDate = dateInputToIso(projectDraft.endDate, "end date");
      if (startDate && endDate && endDate < startDate) {
        throw new Error("Project end date cannot be before its start date.");
      }
      const updated: ProjectView = {
        ...project,
        ...projectDraft,
        name,
        description: description || null,
        color: color || null,
        startDate,
        endDate,
        revision: project.revision + 1,
        updatedAt: new Date().toISOString(),
      };
      setWorkspaceData((current) =>
        current
          ? {
              ...current,
              projects: current.projects.map((item) =>
                item.id === editingProjectId ? updated : item,
              ),
            }
          : current,
      );
      updateDeviceWorkspace(workspaceId, (current) => ({
        ...current,
        projects: upsertLocalEntity(current.projects, updated),
      }));
      addLocalActivity(workspaceId, "project.updated", "project", updated.id, {
        name: updated.name,
      });
      setEditingProjectId(null);
      setProjectDraft(null);
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setBusy(false);
    }
  };

  const loadMoreActivity = async () => {
    const cursor = workspaceData?.activity.nextCursor?.value;
    if (!workspaceId || !cursor) return;
    setError(null);

    try {
      const page = await api<{ activity: WorkspaceData["activity"] }>(
        `/api/workspaces/${encodeURIComponent(workspaceId)}/activity?first=8&after=${encodeURIComponent(cursor)}`,
      );
      setWorkspaceData((current) =>
        current
          ? {
              ...current,
              activity: {
                ...page.activity,
                items: [...current.activity.items, ...page.activity.items],
              },
            }
          : current,
      );
    } catch (requestError) {
      setError(describeError(requestError));
    }
  };

  const createInvitation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!workspaceId) return;
    setBusy(true);
    setInvitationError(null);

    try {
      const email = inviteEmail.trim().toLowerCase();
      if (!email) throw new Error("Enter an email address.");
      const invitation: InvitationView = {
        id: crypto.randomUUID(),
        email,
        role: inviteRole,
        acceptedAt: null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        revokedAt: null,
      };
      setInvitations((current) => [...current, invitation]);
      updateDeviceWorkspace(workspaceId, (current) => ({
        ...current,
        invitations: upsertLocalEntity(current.invitations, invitation),
      }));
      addLocalActivity(workspaceId, "invitation.created", "member", invitation.id, {
        email,
        role: inviteRole,
      });
      setInviteEmail("");
    } catch (requestError) {
      setInvitationError(describeError(requestError));
    } finally {
      setBusy(false);
    }
  };

  const updateMemberRole = async (
    memberId: string,
    role: "admin" | "member",
  ) => {
    if (!workspaceId) return;
    setError(null);

    const member = members.find((item) => item.id === memberId);
    if (!member || member.role === "owner") return;
    const updated = { ...member, role };
    setMembers((current) =>
      current.map((item) => (item.id === memberId ? updated : item)),
    );
    updateDeviceWorkspace(workspaceId, (current) => ({
      ...current,
      members: upsertLocalEntity(current.members, updated),
    }));
    addLocalActivity(workspaceId, "member.role_changed", "member", memberId, {
      role,
    });
  };

  const removeMember = async (member: MemberView) => {
    if (
      !workspaceId ||
      !window.confirm(
        member.userId === userId
          ? "Leave this workspace?"
          : "Remove this member from the workspace?",
      )
    ) {
      return;
    }

    setError(null);

    setMembers((current) =>
      current.filter((item) => item.id !== member.id),
    );
    updateDeviceWorkspace(workspaceId, (current) => ({
      ...current,
      members: deleteLocalEntity(current.members, member.id),
    }));
    addLocalActivity(workspaceId, "member.removed", "member", member.id, {
      userId: member.userId,
    });
  };

  const revokeInvitation = async (invitationId: string) => {
    if (!workspaceId) return;
    setError(null);

    const invitation = invitations.find((item) => item.id === invitationId);
    if (!invitation) return;
    const updated = { ...invitation, revokedAt: new Date().toISOString() };
    setInvitations((current) =>
      current.map((item) => (item.id === invitationId ? updated : item)),
    );
    updateDeviceWorkspace(workspaceId, (current) => ({
      ...current,
      invitations: upsertLocalEntity(current.invitations, updated),
    }));
    addLocalActivity(workspaceId, "invitation.revoked", "member", invitationId, {
      email: invitation.email,
    });
  };

  const updateWorkspace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!workspaceId || !workspaceData) return;
    setBusy(true);
    setError(null);

    try {
      const name = normalizeText(
        workspaceData.workspace.name,
        "Workspace name",
        120,
        true,
      );
      const description = normalizeText(
        workspaceData.workspace.description ?? "",
        "Workspace description",
        2000,
      );
      const updated: WorkspaceDetails = {
        ...workspaceData.workspace,
        name,
        description: description || null,
        revision: workspaceData.workspace.revision + 1,
      };
      setWorkspaceData((current) =>
        current ? { ...current, workspace: updated } : current,
      );
      updateDeviceWorkspace(workspaceId, (current) => ({
        ...current,
        workspace: updated,
      }));
      addLocalActivity(workspaceId, "workspace.updated", "workspace", workspaceId, {
        name: updated.name,
      });
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setBusy(false);
    }
  };

  const updateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileError(null);
    setProfileSaved(false);

    try {
      const profile = {
        name: profileName.trim(),
        image: profileImage.trim(),
      };
      setProfileName(profile.name);
      setProfileImage(profile.image);
      setDeviceSnapshot((current) => ({ ...current, profile }));
      setProfileSaved(true);
    } catch (requestError) {
      setProfileError(describeError(requestError));
    }
  };

  const updatePreference = async (
    key: keyof PreferencesView,
    value: boolean,
  ) => {
    if (!workspaceId) return;
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    updateDeviceWorkspace(workspaceId, (current) => ({
      ...current,
      preferences: next,
    }));
    setError(null);
  };

  const navItems = views.map(({ id, label }) => ({
    id,
    label,
    href: `#${id}`,
  }));
  const activeWorkspace = workspaceData?.workspace;
  const projectMembersProject =
    workspaceData?.projects.find(
      (project) => project.id === projectMembersProjectId,
    ) ?? null;
  const openTasks =
    workspaceData?.tasks.filter((task) => task.status !== "done").length ?? 0;
  const projectQuery = projectSearch.trim().toLowerCase();
  const matchingProjects = (workspaceData?.projects ?? [])
    .filter(
      (project) =>
        (!projectQuery ||
          `${project.name} ${project.description ?? ""}`
            .toLowerCase()
            .includes(projectQuery)) &&
        (projectStatusFilter === "all" ||
          project.status === projectStatusFilter),
    )
    .sort((left, right) =>
      projectSort === "name"
        ? left.name.localeCompare(right.name)
        : right.updatedAt.localeCompare(left.updatedAt),
    );
  const projectPageCount = Math.max(
    1,
    Math.ceil(matchingProjects.length / PAGE_SIZE),
  );
  const currentProjectPage = Math.min(projectPage, projectPageCount);
  const visibleProjects = matchingProjects.slice(
    (currentProjectPage - 1) * PAGE_SIZE,
    currentProjectPage * PAGE_SIZE,
  );
  const taskQuery = taskSearch.trim().toLowerCase();
  const matchingTasks = (workspaceData?.tasks ?? [])
    .filter(
      (task) =>
        (!taskQuery ||
          `${task.title} ${task.description ?? ""}`
            .toLowerCase()
            .includes(taskQuery)) &&
        (taskStatusFilter === "all" || task.status === taskStatusFilter) &&
        (taskPriorityFilter === "all" ||
          task.priority === taskPriorityFilter) &&
        (taskProjectFilter === "all" ||
          (taskProjectFilter === "unassigned"
            ? task.projectId === null
            : task.projectId === taskProjectFilter)),
    )
    .sort((left, right) => {
      if (taskSort === "title") return left.title.localeCompare(right.title);
      if (taskSort === "due") {
        return (left.dueAt ?? "9999").localeCompare(right.dueAt ?? "9999");
      }

      return right.updatedAt.localeCompare(left.updatedAt);
    });
  const taskPageCount = Math.max(1, Math.ceil(matchingTasks.length / PAGE_SIZE));
  const currentTaskPage = Math.min(taskPage, taskPageCount);
  const visibleTasks = matchingTasks.slice(
    (currentTaskPage - 1) * PAGE_SIZE,
    currentTaskPage * PAGE_SIZE,
  );
  const createWorkspaceForm = (
    <form className="puzzle-workspace-form" onSubmit={createWorkspace}>
      <FormField label="Workspace name" required>
        <TextInput
          value={workspaceName}
          onChange={(event) => {
            setWorkspaceName(event.target.value);
            setWorkspaceSlug(slugify(event.target.value));
          }}
        />
      </FormField>
      <FormField label="Workspace slug" required>
        <TextInput
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          value={workspaceSlug}
          onChange={(event) => setWorkspaceSlug(event.target.value)}
        />
      </FormField>
      <Button type="submit" disabled={busy}>
        {busy ? "Creating..." : "Create workspace"}
      </Button>
    </form>
  );

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          items={navItems}
          pathname={`#${view}`}
          onNavigate={(href) => {
            const nextView = href.slice(1);
            const next = views.find((item) => item.id === nextView);
            if (next) setView(next.id);
          }}
          label="Workspace sections"
        />
      }
      topbar={
        <DashboardTopbar>
          <div className="puzzle-workspace-topbar">
            <strong>Puzzle Workspace</strong>
            <span>{userEmail}</span>
            {topbarActions}
          </div>
        </DashboardTopbar>
      }
    >
      <div className="puzzle-workspace-content">
        <DashboardHeader
          eyebrow="Workspace"
          title={activeWorkspace?.name ?? "Your workspaces"}
          description="Projects, tasks, people, and activity in one place."
          actions={
            <div className="puzzle-workspace-header-actions">
              <Select
                aria-label="Select workspace"
                rootClassName="puzzle-workspace-picker"
                options={
                  workspaces.length === 0
                    ? [{ value: "", label: "No workspaces" }]
                    : workspaces.map((workspace) => ({
                        value: workspace.id,
                        label: workspace.name,
                      }))
                }
                value={workspaceId}
                onChange={(value) => setWorkspaceId(value ?? "")}
                disabled={workspaces.length === 0}
                fullWidth
              />
              <Button
                variant="outline"
                onClick={() => setShowCreateWorkspace((current) => !current)}
              >
                {showCreateWorkspace ? "Cancel" : "New workspace"}
              </Button>
            </div>
          }
        />

        {error && (
          <p className="puzzle-workspace-error" role="alert">
            {error}
          </p>
        )}
        {deviceStorageError && (
          <p className="puzzle-workspace-error" role="alert">
            {deviceStorageError}
          </p>
        )}
        {showCreateWorkspace && workspaceId && createWorkspaceForm}

        {!workspaceId ? (
          <EmptyStatePanel
            title="Create your first workspace"
            description="A workspace keeps your projects, tasks, and team activity together."
            action={createWorkspaceForm}
          />
        ) : loading ? (
          <Text as="p" role="status">
            Loading workspace…
          </Text>
        ) : workspaceData ? (
          <>
            {view === "overview" && (
              <section className="puzzle-workspace-section">
                <DashboardStatGroup columns={4}>
                  <DashboardStatCard
                    label="Active projects"
                    value={
                      workspaceData.projects.filter(
                        (project) => project.status === "active",
                      ).length
                    }
                  />
                  <DashboardStatCard
                    label="Open tasks"
                    value={openTasks}
                  />
                  <DashboardStatCard
                    label="Completed tasks"
                    value={
                      workspaceData.tasks.filter(
                        (task) => task.status === "done",
                      ).length
                    }
                  />
                  <DashboardStatCard
                    label="Activity events"
                    value={workspaceData.activity.items.length}
                    description={
                      workspaceData.activity.hasNextPage
                        ? "Showing the latest events"
                        : "All recent events"
                    }
                  />
                </DashboardStatGroup>
                <div className="puzzle-workspace-inline-actions">
                  <Button onClick={() => setView("projects")}>
                    Create a project
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setView("tasks")}
                  >
                    Create a task
                  </Button>
                </div>
                <div className="puzzle-workspace-section">
                  <Heading as="h2" level="headline3">
                    Recent projects
                  </Heading>
                  {workspaceData.projects.length > 0 ? (
                    <ProjectGrid>
                      {workspaceData.projects
                        .slice(0, 3)
                        .map((project) => (
                        <ProjectCard
                          key={project.id}
                          title={project.name}
                          description={project.description ?? undefined}
                          status={
                            <span className="puzzle-workspace-status">
                              {project.status}
                            </span>
                          }
                          actions={
                            <Select
                              className="puzzle-workspace-control"
                              aria-label={`Status for ${project.name}`}
                              options={[
                                { value: "active", label: "Active" },
                                { value: "completed", label: "Completed" },
                                { value: "archived", label: "Archived" },
                              ]}
                              value={project.status}
                              onChange={(value) => {
                                const status = projectStatuses.find(
                                  (item) => item === value,
                                );
                                if (status) {
                                  void updateProjectStatus(project.id, status);
                                }
                              }}
                            />
                          }
                        />
                      ))}
                    </ProjectGrid>
                  ) : (
                    <EmptyStatePanel
                      title="No projects yet"
                      description="Create a project to give your tasks a shared home."
                      action={
                        <Button onClick={() => setView("projects")}>
                          Create a project
                        </Button>
                      }
                    />
                  )}
                  {workspaceData.projects.length > 0 && (
                    <ProjectGrid>
                      {workspaceData.projects.slice(0, 3).map((project) => {
                        const projectTasks = workspaceData.tasks.filter(
                          (task) => task.projectId === project.id,
                        );
                        const completed = projectTasks.filter(
                          (task) => task.status === "done",
                        ).length;

                        return (
                          <DashboardProgressCard
                            key={project.id}
                            title={project.name}
                            description={
                              projectTasks.length === 0
                                ? "No tasks assigned yet"
                                : `${completed} of ${projectTasks.length} tasks complete`
                            }
                            value={
                              projectTasks.length === 0
                                ? 0
                                : Math.round(
                                    (completed / projectTasks.length) * 100,
                                  )
                            }
                            status={project.status}
                          />
                        );
                      })}
                    </ProjectGrid>
                  )}
                </div>
                <DashboardActivityFeed
                  items={workspaceData.activity.items.map((item) => ({
                    id: item.id,
                    description: `${eventLabel(item.action)} · ${item.entityType}`,
                    timestamp: formatDate(item.createdAt),
                    dateTime: item.createdAt,
                  }))}
                />
              </section>
            )}

            {view === "projects" && (
              <section className="puzzle-workspace-section">
                <Heading as="h2" level="headline3">
                  Projects
                </Heading>
                <form className="puzzle-workspace-form" onSubmit={createProject}>
                  <FormField label="Project name" required>
                    <TextInput
                      value={projectName}
                      onChange={(event) => setProjectName(event.target.value)}
                    />
                  </FormField>
                  <FormField label="Description">
                    <TextInput
                      value={projectDescription}
                      onChange={(event) =>
                        setProjectDescription(event.target.value)
                      }
                    />
                  </FormField>
                  <FormField label="Color">
                    <TextInput
                      maxLength={32}
                      value={projectColor}
                      onChange={(event) => setProjectColor(event.target.value)}
                    />
                  </FormField>
                  <FormField label="Start date">
                    <DatePicker
                      value={parseDateInput(projectStartDate)}
                      onChange={(value) =>
                        setProjectStartDate(formatDateInput(value))
                      }
                      clearable
                      fullWidth
                    />
                  </FormField>
                  <FormField label="End date">
                    <DatePicker
                      value={parseDateInput(projectEndDate)}
                      onChange={(value) =>
                        setProjectEndDate(formatDateInput(value))
                      }
                      clearable
                      fullWidth
                    />
                  </FormField>
                  <Button type="submit" disabled={busy}>
                    {busy ? "Creating…" : "Create project"}
                  </Button>
                </form>
                <div className="puzzle-workspace-form">
                  <FormField label="Search projects">
                    <TextInput
                      inputMode="search"
                      role="searchbox"
                      value={projectSearch}
                      onChange={(event) => {
                        setProjectSearch(event.target.value);
                        setProjectPage(1);
                      }}
                    />
                  </FormField>
                  <FormField label="Status">
                    <Select
                      fullWidth
                      options={[
                        { value: "all", label: "All statuses" },
                        ...projectStatuses.map((status) => ({
                          value: status,
                          label: status,
                        })),
                      ]}
                      value={projectStatusFilter}
                      onChange={(value) => {
                        const status = projectStatuses.find((item) => item === value);
                        setProjectStatusFilter(status ?? "all");
                        setProjectPage(1);
                      }}
                    />
                  </FormField>
                  <FormField label="Sort by">
                    <Select
                      fullWidth
                      options={[
                        { value: "updated", label: "Recently updated" },
                        { value: "name", label: "Name" },
                      ]}
                      value={projectSort}
                      onChange={(value) => {
                        setProjectSort(value === "name" ? "name" : "updated");
                        setProjectPage(1);
                      }}
                    />
                  </FormField>
                </div>
                {matchingProjects.length > 0 ? (
                  <ProjectGrid>
                    {visibleProjects.map((project) => (
                      <div key={project.id}>
                        <ProjectCard
                          title={project.name}
                          description={project.description ?? undefined}
                          status={
                            <span className="puzzle-workspace-status">
                              {project.status}
                            </span>
                          }
                          actions={
                            <div className="puzzle-workspace-inline-actions">
                              <Select
                                aria-label={`Status for ${project.name}`}
                                options={[
                                  { value: "active", label: "Active" },
                                  { value: "completed", label: "Completed" },
                                  { value: "archived", label: "Archived" },
                                ]}
                                size="sm"
                                className="puzzle-workspace-control"
                                value={project.status}
                                onChange={(value) => {
                                  const status = projectStatuses.find(
                                    (item) => item === value,
                                  );
                                  if (status) {
                                    void updateProjectStatus(project.id, status);
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setEditingProjectId(project.id);
                                  setProjectDraft({
                                    name: project.name,
                                    description: project.description ?? "",
                                    color: project.color ?? "",
                                    status: project.status,
                                    startDate: project.startDate?.slice(0, 10) ?? "",
                                    endDate: project.endDate?.slice(0, 10) ?? "",
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  void loadProjectMembers(project.id)
                                }
                              >
                                Members
                              </Button>
                            </div>
                          }
                        />
                        {editingProjectId === project.id && projectDraft && (
                          <form
                            className="puzzle-workspace-form"
                            onSubmit={saveProjectEdit}
                          >
                            <FormField label="Name" required>
                              <TextInput
                                value={projectDraft.name}
                                onChange={(event) =>
                                  setProjectDraft({
                                    ...projectDraft,
                                    name: event.target.value,
                                  })
                                }
                              />
                            </FormField>
                            <FormField label="Description">
                              <TextInput
                                value={projectDraft.description}
                                onChange={(event) =>
                                  setProjectDraft({
                                    ...projectDraft,
                                    description: event.target.value,
                                  })
                                }
                              />
                            </FormField>
                            <FormField label="Color">
                              <TextInput
                                maxLength={32}
                                value={projectDraft.color}
                                onChange={(event) =>
                                  setProjectDraft({
                                    ...projectDraft,
                                    color: event.target.value,
                                  })
                                }
                              />
                            </FormField>
                            <FormField label="Start date">
                              <DatePicker
                                value={parseDateInput(projectDraft.startDate)}
                                onChange={(value) =>
                                  setProjectDraft({
                                    ...projectDraft,
                                    startDate: formatDateInput(value),
                                  })
                                }
                                clearable
                                fullWidth
                              />
                            </FormField>
                            <FormField label="End date">
                              <DatePicker
                                value={parseDateInput(projectDraft.endDate)}
                                onChange={(value) =>
                                  setProjectDraft({
                                    ...projectDraft,
                                    endDate: formatDateInput(value),
                                  })
                                }
                                clearable
                                fullWidth
                              />
                            </FormField>
                            <Button type="submit" disabled={busy}>
                              Save project
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setEditingProjectId(null);
                                setProjectDraft(null);
                              }}
                            >
                              Cancel
                            </Button>
                          </form>
                        )}
                      </div>
                    ))}
                  </ProjectGrid>
                ) : (
                  <EmptyStatePanel
                    title={
                      workspaceData.projects.length === 0
                        ? "No projects yet"
                        : "No matching projects"
                    }
                    description="Projects help your team organize related work."
                  />
                )}
                {projectMembersProject && (
                  <SettingsSection
                    title={`Members · ${projectMembersProject.name}`}
                    description="Only active workspace members can be assigned to a project."
                  >
                    <form
                      className="puzzle-workspace-form"
                      onSubmit={addProjectMember}
                    >
                      <FormField label="Workspace member" required>
                        <Select
                          fullWidth
                          options={[
                            { value: "", label: "Select a member" },
                            ...members
                              .filter(
                                (member) =>
                                  !projectMembers.some(
                                    (existing) =>
                                      existing.userId === member.userId,
                                  ),
                              )
                              .map((member) => ({
                                value: member.userId,
                                label: member.userId,
                              })),
                          ]}
                          value={projectMemberUserId}
                          onChange={(value) =>
                            setProjectMemberUserId(value ?? "")
                          }
                        />
                      </FormField>
                      <FormField label="Project role">
                        <Select
                          fullWidth
                          options={[
                            { value: "member", label: "Member" },
                            { value: "manager", label: "Manager" },
                          ]}
                          value={projectMemberRole}
                          onChange={(value) =>
                            setProjectMemberRole(
                              value === "manager"
                                ? "manager"
                                : "member",
                            )
                          }
                        />
                      </FormField>
                      <Button
                        type="submit"
                        disabled={busy || projectMemberUserId.length === 0}
                      >
                        Add member
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setProjectMembersProjectId(null)}
                      >
                        Close
                      </Button>
                    </form>
                    {projectMembers.length === 0 ? (
                      <Text as="p">No project members yet.</Text>
                    ) : (
                      <ul className="puzzle-workspace-list">
                        {projectMembers.map((member) => (
                          <li
                            className="puzzle-workspace-list-item"
                            key={member.id}
                          >
                            <div>
                              <strong>{member.userId}</strong>
                              <span>{member.role}</span>
                            </div>
                            {member.userId !== projectMembersProject.ownerId && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  void removeProjectMember(member.id)
                                }
                              >
                                Remove
                              </Button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </SettingsSection>
                )}
                {matchingProjects.length > PAGE_SIZE && (
                  <PageControls
                    label="Project"
                    page={currentProjectPage}
                    pageCount={projectPageCount}
                    onChange={setProjectPage}
                  />
                )}
              </section>
            )}

            {view === "tasks" && (
              <section className="puzzle-workspace-section">
                <Heading as="h2" level="headline3">
                  Tasks
                </Heading>
                <form className="puzzle-workspace-form" onSubmit={createTask}>
                  <FormField label="Task title" required>
                    <TextInput
                      value={taskTitle}
                      onChange={(event) => setTaskTitle(event.target.value)}
                    />
                  </FormField>
                  <FormField label="Description">
                    <TextInput
                      value={taskDescription}
                      onChange={(event) => setTaskDescription(event.target.value)}
                    />
                  </FormField>
                  <FormField label="Project">
                    <Select
                      fullWidth
                      options={[
                        { value: "", label: "No project" },
                        ...workspaceData.projects.map((project) => ({
                          value: project.id,
                          label: project.name,
                        })),
                      ]}
                      value={taskProjectId}
                      onChange={(value) => setTaskProjectId(value ?? "")}
                    />
                  </FormField>
                  <FormField label="Priority">
                    <Select
                      fullWidth
                      options={taskPriorities.map((priority) => ({
                        value: priority,
                        label: priority,
                      }))}
                      value={taskPriority}
                      onChange={(value) => {
                        const priority = taskPriorities.find((item) => item === value);
                        if (priority) setTaskPriority(priority);
                      }}
                    />
                  </FormField>
                  <FormField label="Assignee">
                    <Select
                      fullWidth
                      options={[
                        { value: "", label: "Unassigned" },
                        ...members.map((member) => ({
                          value: member.userId,
                          label: member.userId,
                        })),
                      ]}
                      value={taskAssigneeId}
                      onChange={(value) => setTaskAssigneeId(value ?? "")}
                    />
                  </FormField>
                  <FormField label="Due date">
                    <DatePicker
                      value={parseDateInput(taskDueAt)}
                      onChange={(value) => setTaskDueAt(formatDateInput(value))}
                      clearable
                      fullWidth
                    />
                  </FormField>
                  <Button type="submit" disabled={busy}>
                    {busy ? "Adding…" : "Add task"}
                  </Button>
                </form>
                <div className="puzzle-workspace-form">
                  <FormField label="Search tasks">
                    <TextInput
                      inputMode="search"
                      role="searchbox"
                      value={taskSearch}
                      onChange={(event) => {
                        setTaskSearch(event.target.value);
                        setTaskPage(1);
                      }}
                    />
                  </FormField>
                  <FormField label="Status">
                    <Select
                      fullWidth
                      options={[
                        { value: "all", label: "All statuses" },
                        ...taskStatuses.map((status) => ({
                          value: status,
                          label: status,
                        })),
                      ]}
                      value={taskStatusFilter}
                      onChange={(value) => {
                        const status = taskStatuses.find((item) => item === value);
                        setTaskStatusFilter(status ?? "all");
                        setTaskPage(1);
                      }}
                    />
                  </FormField>
                  <FormField label="Priority">
                    <Select
                      fullWidth
                      options={[
                        { value: "all", label: "All priorities" },
                        ...taskPriorities.map((priority) => ({
                          value: priority,
                          label: priority,
                        })),
                      ]}
                      value={taskPriorityFilter}
                      onChange={(value) => {
                        const priority = taskPriorities.find((item) => item === value);
                        setTaskPriorityFilter(priority ?? "all");
                        setTaskPage(1);
                      }}
                    />
                  </FormField>
                  <FormField label="Project">
                    <Select
                      fullWidth
                      options={[
                        { value: "all", label: "All projects" },
                        { value: "unassigned", label: "No project" },
                        ...workspaceData.projects.map((project) => ({
                          value: project.id,
                          label: project.name,
                        })),
                      ]}
                      value={taskProjectFilter}
                      onChange={(value) => {
                        setTaskProjectFilter(value ?? "all");
                        setTaskPage(1);
                      }}
                    />
                  </FormField>
                  <FormField label="Sort by">
                    <Select
                      fullWidth
                      options={[
                        { value: "updated", label: "Recently updated" },
                        { value: "due", label: "Due date" },
                        { value: "title", label: "Title" },
                      ]}
                      value={taskSort}
                      onChange={(value) => {
                        setTaskSort(
                          value === "title" || value === "due" ? value : "updated",
                        );
                        setTaskPage(1);
                      }}
                    />
                  </FormField>
                </div>
                {matchingTasks.length > 0 ? (
                  <ul className="puzzle-workspace-list">
                    {visibleTasks.map((task) => (
                      <li className="puzzle-workspace-list-item" key={task.id}>
                        {editingTaskId === task.id && taskDraft ? (
                          <form
                            className="puzzle-workspace-form"
                            onSubmit={saveTaskEdit}
                          >
                            <FormField label="Title" required>
                              <TextInput
                                value={taskDraft.title}
                                onChange={(event) =>
                                  setTaskDraft({
                                    ...taskDraft,
                                    title: event.target.value,
                                  })
                                }
                              />
                            </FormField>
                            <FormField label="Description">
                              <TextInput
                                value={taskDraft.description}
                                onChange={(event) =>
                                  setTaskDraft({
                                    ...taskDraft,
                                    description: event.target.value,
                                  })
                                }
                              />
                            </FormField>
                            <FormField label="Project">
                              <Select
                                fullWidth
                                options={[
                                  { value: "", label: "No project" },
                                  ...workspaceData.projects.map((project) => ({
                                    value: project.id,
                                    label: project.name,
                                  })),
                                ]}
                                value={taskDraft.projectId}
                                onChange={(value) =>
                                  setTaskDraft({
                                    ...taskDraft,
                                    projectId: value ?? "",
                                  })
                                }
                              />
                            </FormField>
                            <FormField label="Status">
                              <Select
                                fullWidth
                                options={taskStatuses.map((status) => ({
                                  value: status,
                                  label: status,
                                }))}
                                value={taskDraft.status}
                                onChange={(value) => {
                                  const status = taskStatuses.find((item) => item === value);
                                  if (status) {
                                    setTaskDraft({ ...taskDraft, status });
                                  }
                                }}
                              />
                            </FormField>
                            <FormField label="Priority">
                              <Select
                                fullWidth
                                options={taskPriorities.map((priority) => ({
                                  value: priority,
                                  label: priority,
                                }))}
                                value={taskDraft.priority}
                                onChange={(value) => {
                                  const priority = taskPriorities.find((item) => item === value);
                                  if (priority) {
                                    setTaskDraft({ ...taskDraft, priority });
                                  }
                                }}
                              />
                            </FormField>
                            <FormField label="Assignee">
                              <Select
                                fullWidth
                                options={[
                                  { value: "", label: "Unassigned" },
                                  ...members.map((member) => ({
                                    value: member.userId,
                                    label: member.userId,
                                  })),
                                ]}
                                value={taskDraft.assigneeId}
                                onChange={(value) =>
                                  setTaskDraft({
                                    ...taskDraft,
                                    assigneeId: value ?? "",
                                  })
                                }
                              />
                            </FormField>
                            <FormField label="Due date">
                              <DatePicker
                                value={parseDateInput(taskDraft.dueAt)}
                                onChange={(value) =>
                                  setTaskDraft({
                                    ...taskDraft,
                                    dueAt: formatDateInput(value),
                                  })
                                }
                                clearable
                                fullWidth
                              />
                            </FormField>
                            <Button type="submit" disabled={busy}>Save task</Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setEditingTaskId(null);
                                setTaskDraft(null);
                              }}
                            >
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <>
                            <div>
                              <strong>{task.title}</strong>
                              {task.description && <span>{task.description}</span>}
                              <span>
                                {task.priority} priority
                                {task.assigneeId
                                  ? ` · assigned to ${task.assigneeId}`
                                  : " · unassigned"}
                                {task.dueAt
                                  ? ` · due ${new Date(task.dueAt).toLocaleDateString()}`
                                  : ""}
                              </span>
                            </div>
                            <Select
                              aria-label={`Status for ${task.title}`}
                              className="puzzle-workspace-control"
                              options={taskStatuses.map((status) => ({
                                value: status,
                                label: status,
                              }))}
                              value={task.status}
                              onChange={(value) => {
                                const status = taskStatuses.find(
                                  (item) => item === value,
                                );
                                if (status) {
                                  void updateTaskStatus(task.id, status);
                                }
                              }}
                            />
                            <div className="puzzle-workspace-inline-actions">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setEditingTaskId(task.id);
                                  setTaskDraft({
                                    title: task.title,
                                    description: task.description ?? "",
                                    projectId: task.projectId ?? "",
                                    status: task.status,
                                    priority: task.priority,
                                    assigneeId: task.assigneeId ?? "",
                                    dueAt: task.dueAt?.slice(0, 10) ?? "",
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => void deleteTask(task)}
                              >
                                Delete
                              </Button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyStatePanel
                    title={
                      workspaceData.tasks.length === 0
                        ? "No tasks yet"
                        : "No matching tasks"
                    }
                    description="Add a task to start tracking work."
                  />
                )}
                {matchingTasks.length > PAGE_SIZE && (
                  <PageControls
                    label="Task"
                    page={currentTaskPage}
                    pageCount={taskPageCount}
                    onChange={setTaskPage}
                  />
                )}
              </section>
            )}

            {view === "team" && (
              <section className="puzzle-workspace-section">
                <Heading as="h2" level="headline3">
                  Team
                </Heading>
                <SettingsSection
                  title="Members"
                  description="Manage workspace access and roles."
                >
                  {members.length === 0 ? (
                    <Text as="p">No active members were found.</Text>
                  ) : (
                    <ul className="puzzle-workspace-list">
                      {members.map((member) => (
                        <li
                          className="puzzle-workspace-list-item"
                          key={member.id}
                        >
                          <div>
                            <strong>
                              {member.userId === userId
                                ? `${member.userId} (you)`
                                : member.userId}
                            </strong>
                            <span>{member.status}</span>
                          </div>
                          <div className="puzzle-workspace-inline-actions">
                            {member.role !== "owner" && (
                              <Select
                                className="puzzle-workspace-control"
                                aria-label={`Role for ${member.userId}`}
                                options={[
                                  { value: "member", label: "Member" },
                                  { value: "admin", label: "Admin" },
                                ]}
                                size="sm"
                                value={member.role}
                                onChange={(value) => {
                                  const role = memberRoles.find(
                                    (item) => item === value,
                                  );
                                  if (role) {
                                    void updateMemberRole(member.id, role);
                                  }
                                }}
                              />
                            )}
                            {member.role !== "owner" && (
                              <Button
                                variant="outline"
                                onClick={() => void removeMember(member)}
                              >
                                {member.userId === userId ? "Leave" : "Remove"}
                              </Button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </SettingsSection>
                <SettingsSection
                  title="Invitations"
                  description="Demo invitations are saved only on this device; no email is sent."
                >
                  <form
                    className="puzzle-workspace-form"
                    onSubmit={createInvitation}
                  >
                    <FormField label="Email address" required>
                      <TextInput
                        type="email"
                        value={inviteEmail}
                        onChange={(event) => setInviteEmail(event.target.value)}
                      />
                    </FormField>
                    <FormField label="Role">
                      <Select
                        fullWidth
                        options={[
                          { value: "member", label: "Member" },
                          { value: "admin", label: "Admin" },
                        ]}
                        value={inviteRole}
                        onChange={(value) =>
                          setInviteRole(value === "admin" ? "admin" : "member")
                        }
                      />
                    </FormField>
                    <Button type="submit" disabled={busy}>
                      {busy ? "Saving…" : "Save invitation"}
                    </Button>
                  </form>
                  {invitationError && (
                    <p className="puzzle-workspace-error" role="alert">
                      {invitationError}
                    </p>
                  )}
                  {invitations.length > 0 && (
                    <ul className="puzzle-workspace-list">
                      {invitations.map((invitation) => (
                        <li
                          className="puzzle-workspace-list-item"
                          key={invitation.id}
                        >
                          <div>
                            <strong>{invitation.email}</strong>
                            <span>
                              {invitation.acceptedAt
                                ? "Accepted"
                                : invitation.revokedAt
                                  ? "Revoked"
                                  : new Date(invitation.expiresAt) < new Date()
                                    ? "Expired"
                                    : `Pending · ${invitation.role}`}
                            </span>
                          </div>
                          {!invitation.acceptedAt && !invitation.revokedAt && (
                            <Button
                              variant="outline"
                              onClick={() =>
                                void revokeInvitation(invitation.id)
                              }
                            >
                              Revoke
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </SettingsSection>
              </section>
            )}

            {view === "activity" && (
              <section className="puzzle-workspace-section">
                <Heading as="h2" level="headline3">
                  Activity
                </Heading>
                <DashboardActivityFeed
                  items={workspaceData.activity.items.map((item) => ({
                    id: item.id,
                    description: `${eventLabel(item.action)} · ${item.entityType}`,
                    timestamp: formatDate(item.createdAt),
                    dateTime: item.createdAt,
                  }))}
                  emptyState="Workspace changes will appear here."
                />
                {workspaceData.activity.hasNextPage && (
                  <Button variant="outline" onClick={() => void loadMoreActivity()}>
                    Load more activity
                  </Button>
                )}
              </section>
            )}

            {view === "settings" && (
              <section className="puzzle-workspace-section">
                <Heading as="h2" level="headline3">
                  Settings
                </Heading>
                <nav
                  className="puzzle-workspace-settings-nav"
                  aria-label="Settings sections"
                >
                  {(
                    [
                      ["general", "General"],
                      ["profile", "Profile"],
                      ["security", "Security"],
                      ["notifications", "Notifications"],
                    ] as const
                  ).map(([id, label]) => (
                    <Button
                      key={id}
                      type="button"
                      variant="outline"
                      aria-pressed={settingsView === id}
                      onClick={() => setSettingsView(id)}
                    >
                      {label}
                    </Button>
                  ))}
                </nav>

                {settingsView === "general" && (
                  <SettingsSection
                    title="Workspace details"
                    description="Update the name and description for this workspace."
                  >
                    <form
                      className="puzzle-workspace-form"
                      onSubmit={updateWorkspace}
                    >
                      <FormField label="Name" required>
                        <TextInput
                          value={workspaceData.workspace.name}
                          onChange={(event) =>
                            setWorkspaceData((current) =>
                              current
                                ? {
                                    ...current,
                                    workspace: {
                                      ...current.workspace,
                                      name: event.target.value,
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                      </FormField>
                      <FormField label="Description">
                        <TextInput
                          value={workspaceData.workspace.description ?? ""}
                          onChange={(event) =>
                            setWorkspaceData((current) =>
                              current
                                ? {
                                    ...current,
                                    workspace: {
                                      ...current.workspace,
                                      description: event.target.value || null,
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                      </FormField>
                      <Button type="submit" disabled={busy}>
                        Save workspace
                      </Button>
                    </form>
                  </SettingsSection>
                )}

                {settingsView === "profile" && (
                  <SettingsSection
                    title="Profile"
                    description="Manage the account details shown to your team."
                  >
                    <form
                      className="puzzle-workspace-form"
                      onSubmit={updateProfile}
                    >
                      <FormField label="Name" required>
                        <TextInput
                          autoComplete="name"
                          maxLength={120}
                          value={profileName}
                          onChange={(event) => {
                            setProfileName(event.target.value);
                            setProfileSaved(false);
                          }}
                        />
                      </FormField>
                      <FormField label="Email">
                        <TextInput
                          type="email"
                          value={userEmail}
                          readOnly
                        />
                      </FormField>
                      <FormField label="Avatar image URL">
                        <input
                          className="puzzle-workspace-control"
                          type="url"
                          maxLength={2048}
                          value={profileImage}
                          onChange={(event) => {
                            setProfileImage(event.target.value);
                            setProfileSaved(false);
                          }}
                        />
                      </FormField>
                      {profileError && (
                        <p className="puzzle-workspace-error" role="alert">
                          {profileError}
                        </p>
                      )}
                      {profileSaved && (
                        <Text as="p" role="status">Profile updated.</Text>
                      )}
                      <Button type="submit">Save profile</Button>
                    </form>
                    <Text as="p">
                      Email changes are disabled for the local demo.
                    </Text>
                    {isDeviceLocalUser ? (
                      <Text as="p">
                        Email verification is unavailable for device-local
                        accounts.
                      </Text>
                    ) : (
                      <EmailVerificationNotice />
                    )}
                  </SettingsSection>
                )}

                {settingsView === "security" && (
                  <>
                    <SettingsSection
                      title="Security"
                      description="Protect your account with a password, authenticator, or passkey."
                    >
                      <SettingsRow
                        label="Change password"
                        description="Password changes are disabled for this workspace."
                        control={
                          <Text as="span">Disabled for workspace accounts</Text>
                        }
                      />
                      {authSnapshot.status === "authenticated" &&
                      isDeviceLocalUser ? (
                        <Text as="p">
                          MFA is unavailable for device-local accounts.
                        </Text>
                      ) : authSnapshot.status === "authenticated" ? (
                        <MfaSettings />
                      ) : authSnapshot.status === "loading" ? (
                        <Text as="p" role="status">
                          Checking your signed-in session…
                        </Text>
                      ) : (
                        <Text as="p" role="status">
                          Sign in again to manage account security.
                        </Text>
                      )}
                    </SettingsSection>
                    {authSnapshot.status === "authenticated" &&
                    isDeviceLocalUser ? (
                      <Text as="p">
                        This account has a device-only session.
                      </Text>
                    ) : authSnapshot.status === "authenticated" ? (
                      <SessionManagement />
                    ) : authSnapshot.status === "loading" ? null : (
                      <Button href="/sign-in" variant="outline">
                        Sign in
                      </Button>
                    )}
                  </>
                )}

                {settingsView === "notifications" && (
                  <SettingsSection
                    title="Notifications"
                    description="Choose which workspace updates you receive."
                  >
                    <SettingsRow
                      label="Email notifications"
                      description="Receive important workspace updates by email."
                      control={
                        <Checkbox
                          aria-label="Email notifications"
                          checked={preferences.emailNotifications}
                          onChange={(event) =>
                            void updatePreference(
                              "emailNotifications",
                              event.target.checked,
                            )
                          }
                        />
                      }
                    />
                    <SettingsRow
                      label="Activity notifications"
                      description="Receive notifications when workspace activity changes."
                      control={
                        <Checkbox
                          aria-label="Activity notifications"
                          checked={preferences.activityNotifications}
                          onChange={(event) =>
                            void updatePreference(
                              "activityNotifications",
                              event.target.checked,
                            )
                          }
                        />
                      }
                    />
                    <SettingsRow
                      label="Product updates"
                      description="Receive occasional Puzzle product news."
                      control={
                        <Checkbox
                          aria-label="Product updates"
                          checked={preferences.productUpdates}
                          onChange={(event) =>
                            void updatePreference(
                              "productUpdates",
                              event.target.checked,
                            )
                          }
                        />
                      }
                    />
                  </SettingsSection>
                )}
              </section>
            )}
          </>
        ) : (
          <EmptyStatePanel
            title="Workspace unavailable"
            description="The workspace could not be loaded. Check your access and try again."
            action={
              <Button onClick={() => window.location.reload()}>
                Reload workspace
              </Button>
            }
          />
        )}
      </div>
    </DashboardShell>
  );
};

const InvitationAcceptance = () => {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") ?? "");
  }, []);

  const acceptInvitation = async () => {
    setBusy(true);
    setMessage(null);

    try {
      await api(
        "/api/invitations/accept",
        jsonRequest("POST", { token }),
      );
      setAccepted(true);
    } catch (error) {
      setMessage(describeError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="puzzle-workspace-accept">
      <section className="puzzle-workspace-accept__panel">
        <Heading as="h1" level="headline2">
          Accept workspace invitation
        </Heading>
        <Text as="p">
          Sign in with the verified email address that received this invitation.
        </Text>
        {message && (
          <p className="puzzle-workspace-error" role="alert">
            {message}
          </p>
        )}
        {accepted ? (
          <Button href="/dashboard">Open workspace</Button>
        ) : (
          <div className="puzzle-workspace-inline-actions">
            <Button
              onClick={() => void acceptInvitation()}
              disabled={busy || token.length === 0}
            >
              {busy ? "Accepting…" : "Accept invitation"}
            </Button>
            <Button href="/sign-in" variant="outline">
              Sign in
            </Button>
          </div>
        )}
        {!token && (
          <p className="puzzle-workspace-error" role="alert">
            This invitation link is missing its token.
          </p>
        )}
      </section>
    </main>
  );
};

const EmailChangeVerification = () => {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") ?? "");
  }, []);

  const verifyEmailChange = async () => {
    setBusy(true);
    setMessage(null);

    try {
      await api(
        "/api/auth/email/change/verify",
        jsonRequest("POST", { token }),
      );
      setVerified(true);
    } catch (error) {
      setMessage(describeError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="puzzle-workspace-accept">
      <section className="puzzle-workspace-accept__panel">
        <Heading as="h1" level="headline2">
          Confirm your new email
        </Heading>
        <Text as="p">
          Confirm the new address to finish updating your Puzzle account.
        </Text>
        {message && (
          <p className="puzzle-workspace-error" role="alert">
            {message}
          </p>
        )}
        {verified ? (
          <>
            <Text as="p" role="status">Your email address has been updated.</Text>
            <Button href="/dashboard">Open workspace</Button>
          </>
        ) : (
          <Button
            onClick={() => void verifyEmailChange()}
            disabled={busy || token.length === 0}
          >
            {busy ? "Verifying…" : "Confirm email"}
          </Button>
        )}
        {!token && (
          <p className="puzzle-workspace-error" role="alert">
            This confirmation link is missing its token.
          </p>
        )}
      </section>
    </main>
  );
};

export { EmailChangeVerification, InvitationAcceptance, WorkspaceApp };
