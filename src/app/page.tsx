"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image, { type StaticImageData } from "next/image";
import bolognaPhoto from "../../public/images/campus/bologna.jpg";
import milanPhoto from "../../public/images/campus/milan.jpg";
import paduaPhoto from "../../public/images/campus/padua.jpg";
import pisaPhoto from "../../public/images/campus/pisa.jpg";
import turinPhoto from "../../public/images/campus/turin.jpg";
import venicePhoto from "../../public/images/campus/venice.jpg";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ProfileReview } from "@/components/ProfileReview";
import { ProgrammeEditor } from "@/components/ProgrammeEditor";
import { ShortlistReport } from "@/components/ShortlistReport";
import {
  createApplicationFromMatch,
  messageOf,
  createStudent,
  draftProgrammeRules,
  extractDocument,
  loadWorkspaceData,
  runStudentMatch,
  saveConfirmedProfile,
  saveProgramme,
  saveUniversityConversion,
  updateApplicationStage,
  updateWorkspaceProfile,
  type Application,
  type DeadlineItem,
  type MatchResult,
  type NewStudentInput,
  type Programme,
  type Student,
  type TeamMember,
  type University,
  type Workspace,
  type WorkspaceData,
} from "@/lib/supabase/workspace-data";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  Clock3,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  Filter,
  Flag,
  GraduationCap,
  LayoutDashboard,
  ListFilter,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";

type View =
  | "Overview"
  | "Students"
  | "Matches"
  | "Programmes"
  | "Applications"
  | "Calendar"
  | "Reports"
  | "Team"
  | "Settings";

const TODAY = new Date();

const isoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });
  link.click();
  URL.revokeObjectURL(url);
}

function useEscape(onEscape: () => void) {
  const handler = useRef(onEscape);
  useEffect(() => {
    handler.current = onEscape;
  });
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handler.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
}

const navGroups: {
  label: string;
  items: { label: View; icon: typeof LayoutDashboard }[];
}[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Students", icon: Users },
      { label: "Matches", icon: Sparkles },
      { label: "Programmes", icon: BookOpen },
      { label: "Applications", icon: FileCheck2 },
      { label: "Calendar", icon: CalendarDays },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Reports", icon: BarChart3 },
      { label: "Team", icon: Building2 },
      { label: "Settings", icon: Settings },
    ],
  },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand ${light ? "brand-light" : ""}`}>
      <div className="brand-symbol">
        <span />
        <span />
        <span />
      </div>
      <div>
        <strong>SHAFFMINNA</strong>
        <small>ADMISSIONS OS</small>
      </div>
    </div>
  );
}

const campusPhotos: { match: RegExp; photo: StaticImageData; place: string }[] =
  [
    { match: /padua|padova/i, photo: paduaPhoto, place: "Palazzo Bo, Padua" },
    { match: /bologna/i, photo: bolognaPhoto, place: "Archiginnasio, Bologna" },
    {
      match: /torino|turin/i,
      photo: turinPhoto,
      place: "Castello del Valentino, Turin",
    },
    { match: /milan|milano/i, photo: milanPhoto, place: "Ca’ Granda, Milan" },
    { match: /pisa/i, photo: pisaPhoto, place: "Palazzo della Sapienza, Pisa" },
    {
      match: /venice|venezia|foscari/i,
      photo: venicePhoto,
      place: "Ca’ Foscari, Venice",
    },
  ];

const campusPhotoFor = (university: string) =>
  campusPhotos.find((campus) => campus.match.test(university));

// University badge: a campus photo when we have one, otherwise the coloured initials chip.
function CampusMark({
  university,
  code,
  tone,
  size = "mini",
}: {
  university: string;
  code: string;
  tone: string;
  size?: "mini" | "large" | "small";
}) {
  const campus = campusPhotoFor(university);
  const className =
    size === "mini"
      ? "mini-school"
      : `school-logo ${size === "small" ? "small" : ""}`;
  if (!campus) return <span className={`${className} ${tone}`}>{code}</span>;
  return (
    <span className={`${className} campus-mark`}>
      <Image src={campus.photo} alt={campus.place} fill sizes="64px" />
    </span>
  );
}

// Turns Supabase auth errors into guidance a counsellor can act on.
function authErrorMessage(error: { code?: string; message: string }) {
  switch (error.code) {
    case "over_email_send_rate_limit":
      return "Too many emails were sent in the last hour. Wait a while and try again, or check your inbox for an earlier confirmation email.";
    case "over_request_rate_limit":
      return "Too many attempts. Please wait a minute and try again.";
    case "invalid_credentials":
      return "That email and password don’t match. Check them or reset your password.";
    case "email_not_confirmed":
      return "Confirm your email first. Use the link we sent you, then sign in.";
    case "user_already_exists":
    case "email_exists":
      return "An account with this email already exists. Sign in instead.";
    case "weak_password":
      return "Choose a stronger password (at least 8 characters).";
    default:
      return error.message;
  }
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const configured = isSupabaseConfigured();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    tone: "error" | "success";
  } | null>(null);
  const signingUp = mode === "signup";

  const switchMode = (next: "signin" | "signup") => {
    setMode(next);
    setMessage(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);
    if (!configured) {
      window.setTimeout(() => {
        setLoading(false);
        onLogin();
      }, 550);
      return;
    }
    if (signingUp) return createAccount();

    const { error } = await createSupabaseClient().auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setMessage({ text: authErrorMessage(error), tone: "error" });
    else onLogin();
  };

  const sendPasswordReset = async () => {
    if (!configured)
      return setMessage({
        text: "Password resets aren’t available in demo mode.",
        tone: "error",
      });
    if (!email)
      return setMessage({
        text: "Enter your work email first, then choose “Forgot password?”.",
        tone: "error",
      });
    const { error } = await createSupabaseClient().auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/`,
      },
    );
    setMessage(
      error
        ? { text: authErrorMessage(error), tone: "error" }
        : {
            text: `Password reset instructions sent to ${email}.`,
            tone: "success",
          },
    );
  };

  const createAccount = async () => {
    const fallbackName = email.split("@")[0];
    const { data, error } = await createSupabaseClient().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName.trim() || fallbackName,
          workspace_name: workspaceName.trim() || `${fallbackName}'s workspace`,
        },
      },
    });
    setLoading(false);
    if (error) setMessage({ text: authErrorMessage(error), tone: "error" });
    else if (data.session) onLogin();
    else
      setMessage({
        text: `Check ${email} to confirm your account, then sign in.`,
        tone: "success",
      });
  };

  return (
    <main className={`auth-page ${signingUp ? "signing-up" : ""}`}>
      <section className="auth-story">
        <Image
          src={venicePhoto}
          alt="Ca’ Foscari University on the Grand Canal, Venice"
          className="auth-story-photo"
          fill
          preload
          sizes="(max-width: 820px) 100vw, 55vw"
        />
        <div className="auth-story-veil" />
        <Brand light />
        <div className="story-copy">
          <h1>
            Every student deserves a <em>clear path</em> abroad.
          </h1>
          <p>
            Turn transcripts into verified, explainable programme matches at
            Europe’s universities, without the spreadsheets and scattered
            university pages.
          </p>
          <div className="stamp-row" aria-label="Destinations">
            <span className="stamp mint">Italia</span>
            <span className="stamp peach">Deutschland</span>
            <span className="stamp lavender">France</span>
            <span className="stamp sky">Magyarország</span>
          </div>
        </div>
        <div className="postcards" aria-hidden="true">
          <figure className="postcard tilt-left">
            <Image src={bolognaPhoto} alt="" fill sizes="220px" />
            <figcaption>Bologna · est. 1088</figcaption>
          </figure>
          <figure className="postcard tilt-right">
            <Image src={paduaPhoto} alt="" fill sizes="220px" />
            <figcaption>Padova · est. 1222</figcaption>
          </figure>
          <div className="story-card">
            <div className="story-match">
              <CampusMark
                university="University of Bologna"
                code="UB"
                tone="red"
              />
              <div>
                <strong>MSc Computer Science</strong>
                <span>University of Bologna</span>
              </div>
              <b>91%</b>
            </div>
            <div className="story-rule">
              <CheckCircle2 size={15} />
              <span>All 6 eligibility checks passed</span>
            </div>
          </div>
        </div>
        <p className="story-foot">
          Photos: Ca’ Foscari by Freddo213, Archiginnasio by Wwikiwalter,
          Palazzo Bo by Didier Descouens · CC BY-SA 4.0 via Wikimedia Commons
        </p>
      </section>
      <section className="auth-panel">
        <div className="mobile-brand">
          <Brand />
        </div>
        <div className="auth-box">
          <p className="eyebrow">
            {signingUp ? "GET STARTED" : "WELCOME BACK"}
          </p>
          <h2>
            {signingUp ? "Create your workspace" : "Sign in to your workspace"}
          </h2>
          <p className="muted">
            {signingUp
              ? "Set up your consultancy’s account. You can invite counsellors once you’re in."
              : "Continue managing students, applications, and deadlines."}
          </p>
          <form onSubmit={submit}>
            {signingUp && (
              <>
                <label>
                  Your name
                  <div className="input-wrap">
                    <UserPlus size={17} />
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </label>
                <label>
                  Consultancy name
                  <div className="input-wrap">
                    <Building2 size={17} />
                    <input
                      value={workspaceName}
                      onChange={(event) => setWorkspaceName(event.target.value)}
                      autoComplete="organization"
                      placeholder="Your consultancy"
                      required
                    />
                  </div>
                </label>
              </>
            )}
            <label>
              Work email
              <div className="input-wrap">
                <Mail size={17} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="you@consultancy.com"
                  required
                />
              </div>
            </label>
            <label>
              Password
              <div className="input-wrap">
                <LockKeyhole size={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={signingUp ? "new-password" : "current-password"}
                  minLength={signingUp ? 8 : undefined}
                  placeholder={signingUp ? "At least 8 characters" : ""}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            {!signingUp && (
              <div className="form-meta">
                <label className="check-line">
                  <input type="checkbox" defaultChecked /> Keep me signed in
                </label>
                <button
                  type="button"
                  className="link-button"
                  onClick={sendPasswordReset}
                >
                  Forgot password?
                </button>
              </div>
            )}
            {message && (
              <p
                className={`auth-message ${message.tone}`}
                role={message.tone === "error" ? "alert" : "status"}
              >
                {message.text}
              </p>
            )}
            <button className="login-button" type="submit" disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  {signingUp ? "Create workspace" : "Sign in"}{" "}
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
          <p className="auth-switch">
            {signingUp ? (
              <>
                Already have an account?{" "}
                <button onClick={() => switchMode("signin")}>Sign in</button>
              </>
            ) : (
              <>
                New to SHAFFMINNA?{" "}
                <button onClick={() => switchMode("signup")}>
                  Create a workspace
                </button>
              </>
            )}
          </p>
          {configured ? (
            <p className="demo-notice connected">
              <ShieldCheck size={13} /> Secure sign-in · connected to your SHAFFMINNA
              workspace
            </p>
          ) : (
            <p className="demo-notice">
              <Zap size={13} /> Demo mode · accounts aren’t connected yet
            </p>
          )}
        </div>
        <div className="legal-row">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Help centre</span>
        </div>
      </section>
    </main>
  );
}

function AppShell({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<View>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newStudent, setNewStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
  const [settingsSection, setSettingsSection] =
    useState<SettingsSection>("Workspace profile");
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [dataError, setDataError] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [reviewStudentId, setReviewStudentId] = useState("");
  const [reportStudentId, setReportStudentId] = useState("");
  const [editingProgramme, setEditingProgramme] = useState<
    Programme | "new" | null
  >(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const searchInput = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setDataError("");
    try {
      setData(await loadWorkspaceData());
    } catch (error) {
      setDataError(messageOf(error) ?? "Could not load your workspace.");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void loadWorkspaceData()
      .then((workspaceData) => {
        if (!cancelled) setData(workspaceData);
      })
      .catch((error) => {
        if (!cancelled)
          setDataError(messageOf(error) ?? "Could not load your workspace.");
      })
      .finally(() => {
        if (!cancelled) setLoadingData(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const notify = (message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  };
  const navigate = (next: View) => {
    setView(next);
    setSidebarOpen(false);
  };
  const openSettings = (section: SettingsSection) => {
    setSettingsSection(section);
    navigate("Settings");
  };
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setStudentQuery(search.trim());
    setSearch("");
    navigate("Students");
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (loadingData)
    return (
      <main className="loading-screen">
        <Brand />
        <span className="spinner dark" />
        <p>Loading your workspace…</p>
      </main>
    );
  if (!data)
    return (
      <main className="loading-screen">
        <Brand />
        <CircleAlert size={28} />
        <p>{dataError || "Could not load your workspace."}</p>
        <button
          className="primary-button"
          onClick={() => {
            setLoadingData(true);
            void refresh();
          }}
        >
          Try again
        </button>
        <button className="secondary-button" onClick={onLogout}>
          Sign out
        </button>
      </main>
    );

  const {
    workspace,
    currentUser,
    team,
    students,
    programmes,
    matches,
    applications,
    deadlines,
    isVerifier,
    universities,
  } = data;
  // Always show the latest saved copy of a student, not the one captured when it was opened.
  const drawerStudent = selectedStudent
    ? (students.find((student) => student.id === selectedStudent.id) ??
      selectedStudent)
    : null;
  const reviewStudent = students.find(
    (student) => student.id === reviewStudentId,
  );
  const reportStudent = students.find(
    (student) => student.id === reportStudentId,
  );
  const dueThisWeek = deadlines.filter(
    (deadline) =>
      !deadline.completedAt &&
      new Date(deadline.dueAt).getTime() <= TODAY.getTime() + 7 * 86400000,
  ).length;
  const workspaceInitial = workspace.name.charAt(0).toUpperCase() || "W";

  return (
    <main className="product-shell">
      {sidebarOpen && (
        <button
          className="mobile-scrim"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <Brand />
          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>
        <button className="workspace-card">
          <span className="workspace-avatar">{workspaceInitial}</span>
          <span>
            <small>WORKSPACE</small>
            <strong>{workspace.name}</strong>
          </span>
          <ChevronDown size={15} />
        </button>
        <nav aria-label="Main">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map(({ label, icon: Icon }) => (
                <button
                  className={view === label ? "active" : ""}
                  aria-current={view === label ? "page" : undefined}
                  key={label}
                  onClick={() =>
                    label === "Settings"
                      ? openSettings("Workspace profile")
                      : navigate(label)
                  }
                >
                  <Icon size={17} />
                  <span>{label}</span>
                  {label === "Students" && <b>{students.length}</b>}
                  {label === "Calendar" && dueThisWeek > 0 && (
                    <i aria-label={`${dueThisWeek} deadlines this week`} />
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="usage-card">
            <div>
              <span>MONTHLY PROFILES</span>
              <strong>
                {students.length} <small>/ 30 used</small>
              </strong>
            </div>
            <div className="usage-track">
              <span
                style={{
                  width: `${Math.min((students.length / 30) * 100, 100)}%`,
                }}
              />
            </div>
            <button onClick={() => openSettings("Subscription")}>
              View plan <ArrowRight size={13} />
            </button>
          </div>
          <button
            className="user-card"
            onClick={() => openSettings("Workspace profile")}
          >
            <span className={`avatar ${currentUser.tone}`}>
              {currentUser.initials}
            </span>
            <span>
              <strong>{currentUser.name}</strong>
              <small>{currentUser.role} counsellor</small>
            </span>
            <MoreHorizontal size={16} />
          </button>
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={13} />
            <strong>{view}</strong>
          </div>
          <div className="topbar-actions">
            <form
              className="global-search"
              role="search"
              onSubmit={submitSearch}
            >
              <Search size={16} />
              <input
                ref={searchInput}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students..."
                aria-label="Search students"
              />
              <kbd>⌘ K</kbd>
            </form>
            <button className="icon-button" aria-label="Help">
              <CircleHelp size={18} />
            </button>
            <button
              className="icon-button notification"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {dueThisWeek > 0 && <i />}
            </button>
            <div
              className={`top-avatar avatar ${currentUser.tone}`}
              aria-hidden="true"
            >
              {currentUser.initials}
            </div>
          </div>
        </header>
        <div className="page-wrap">
          {view === "Overview" && (
            <Overview
              students={students}
              matches={matches}
              applications={applications}
              deadlines={deadlines}
              user={currentUser}
              onNew={() => setNewStudent(true)}
              onNavigate={navigate}
              onStudent={setSelectedStudent}
              onNotify={notify}
            />
          )}
          {view === "Students" && (
            <StudentsView
              key={studentQuery}
              students={students}
              initialQuery={studentQuery}
              onNew={() => setNewStudent(true)}
              onSelect={setSelectedStudent}
              onNotify={notify}
            />
          )}
          {view === "Matches" && (
            <MatchesView
              students={students}
              matches={matches}
              onOpen={(student) => setSelectedStudent(student)}
              onReview={(student) => setReviewStudentId(student.id)}
              onReport={(student) => setReportStudentId(student.id)}
              onRun={async (student) => {
                const count = await runStudentMatch(workspace.id, student.id);
                await refresh();
                notify(`${count} programmes checked and saved`);
              }}
              onStartApplication={async (match) => {
                await createApplicationFromMatch(
                  workspace.id,
                  match.studentId,
                  match.programmeId,
                );
                await refresh();
                notify(`${match.programme} added to Applications`);
              }}
              onNotify={notify}
            />
          )}
          {view === "Programmes" && (
            <ProgrammesView
              programmes={programmes}
              universities={universities}
              isVerifier={isVerifier}
              onEdit={setEditingProgramme}
              onNotify={notify}
            />
          )}
          {view === "Applications" && (
            <ApplicationsView
              applications={applications}
              onStageChange={async (id, stage) => {
                try {
                  await updateApplicationStage(id, stage);
                  await refresh();
                  notify("Application stage updated");
                } catch (error) {
                  notify(messageOf(error) ?? "Could not update application");
                }
              }}
            />
          )}
          {view === "Calendar" && <CalendarView deadlines={deadlines} />}
          {view === "Reports" && (
            <ReportsView
              students={students}
              matches={matches}
              applications={applications}
              deadlines={deadlines}
              onNotify={notify}
            />
          )}
          {view === "Team" && (
            <TeamView team={team} workspace={workspace} onNotify={notify} />
          )}
          {view === "Settings" && (
            <SettingsView
              key={settingsSection}
              initialSection={settingsSection}
              workspace={workspace}
              user={currentUser}
              studentCount={students.length}
              onSave={async (nextWorkspace, fullName) => {
                await updateWorkspaceProfile(nextWorkspace, fullName);
                await refresh();
              }}
              onNotify={notify}
            />
          )}
        </div>
      </section>
      {newStudent && (
        <NewStudentWizard
          onClose={() => setNewStudent(false)}
          onComplete={async (input) => {
            const studentId = await createStudent(workspace.id, input);
            await refresh();
            setNewStudent(false);
            notify(`${input.firstName} ${input.lastName}’s profile was saved`);
            // Straight into review, where AI reads the uploads and the counsellor confirms.
            if (input.files.length) setReviewStudentId(studentId);
          }}
        />
      )}
      {drawerStudent && (
        <StudentDrawer
          key={drawerStudent.id}
          student={drawerStudent}
          matches={matches.filter(
            (match) => match.studentId === drawerStudent.id,
          )}
          applications={applications.filter(
            (application) => application.studentId === drawerStudent.id,
          )}
          onClose={() => setSelectedStudent(null)}
          onReview={() => setReviewStudentId(drawerStudent.id)}
          onReport={() => setReportStudentId(drawerStudent.id)}
          onNotify={notify}
        />
      )}
      {reviewStudent && (
        <ProfileReview
          key={`review-${reviewStudent.id}`}
          student={reviewStudent}
          onClose={() => setReviewStudentId("")}
          onRead={async (documentId) => {
            const extraction = await extractDocument(documentId);
            void refresh();
            return extraction;
          }}
          onSave={async (input) => {
            await saveConfirmedProfile(workspace.id, reviewStudent.id, input);
            await refresh();
            setReviewStudentId("");
            notify(
              `${reviewStudent.name.split(" ")[0]}’s profile confirmed. Run a match next.`,
            );
          }}
        />
      )}
      {editingProgramme && (
        <ProgrammeEditor
          programme={editingProgramme === "new" ? null : editingProgramme}
          universities={universities}
          onClose={() => setEditingProgramme(null)}
          onDraft={draftProgrammeRules}
          onSave={async (input, conversion) => {
            await saveProgramme(input);
            if (conversion)
              await saveUniversityConversion(
                conversion.universityId,
                conversion.conversion,
              );
            await refresh();
            setEditingProgramme(null);
            notify(
              input.status === "verified"
                ? `${input.programme} verified`
                : `${input.programme} saved for review`,
            );
          }}
        />
      )}
      {reportStudent && (
        <ShortlistReport
          workspace={workspace}
          counsellor={currentUser}
          student={reportStudent}
          matches={matches.filter(
            (match) => match.studentId === reportStudent.id,
          )}
          onClose={() => setReportStudentId("")}
          onCsv={() => {
            const rows = matches.filter(
              (match) => match.studentId === reportStudent.id,
            );
            downloadCsv(
              `${reportStudent.name.toLowerCase().replaceAll(" ", "-")}-shortlist.csv`,
              [
                [
                  "Programme",
                  "University",
                  "City",
                  "Result",
                  "Score",
                  "Tuition",
                  "Deadline",
                  "Rules verified",
                  "Checks",
                  "Source",
                ],
                ...rows.map((m) => [
                  m.programme,
                  m.university,
                  m.city,
                  m.status,
                  m.score,
                  m.fee,
                  m.deadline,
                  m.programmeVerified ? m.verified : "Not verified",
                  m.reasons.join("; "),
                  m.source,
                ]),
              ],
            );
            notify("Shortlist CSV downloaded");
          }}
        />
      )}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast">
            <CheckCircle2 size={18} />
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}

function PageTitle({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <div className="page-actions">{children}</div>
    </header>
  );
}

function exportStudents(
  students: Student[],
  onNotify: (message: string) => void,
) {
  downloadCsv("students.csv", [
    [
      "Name",
      "Degree",
      "CGPA",
      "City",
      "Destination",
      "Stage",
      "Profile %",
      "Updated",
    ],
    ...students.map((s) => [
      s.name,
      s.degree,
      s.cgpa,
      s.city,
      s.target,
      s.stage,
      s.progress,
      s.updated,
    ]),
  ]);
  onNotify("Student list exported");
}

function daysUntil(value: string) {
  return Math.ceil((new Date(value).getTime() - TODAY.getTime()) / 86400000);
}

function Overview({
  students,
  matches,
  applications,
  deadlines,
  user,
  onNew,
  onNavigate,
  onStudent,
  onNotify,
}: {
  students: Student[];
  matches: MatchResult[];
  applications: Application[];
  deadlines: DeadlineItem[];
  user: TeamMember;
  onNew: () => void;
  onNavigate: (view: View) => void;
  onStudent: (student: Student) => void;
  onNotify: (message: string) => void;
}) {
  const openDeadlines = deadlines.filter(
    (deadline) => !deadline.completedAt && daysUntil(deadline.dueAt) >= 0,
  );
  const dueThisWeek = openDeadlines.filter(
    (deadline) => daysUntil(deadline.dueAt) <= 7,
  ).length;
  const liveApplications = applications.filter(
    (application) => !["enrolled", "rejected"].includes(application.stage),
  );
  const attentionStudents = students
    .filter((student) =>
      ["needs_review", "profile_processing"].includes(student.status),
    )
    .slice(0, 3);
  const latestMatch = matches[0];
  const latestStudent = latestMatch
    ? students.find((student) => student.id === latestMatch.studentId)
    : undefined;
  const latestMatches = latestStudent
    ? matches
        .filter((match) => match.studentId === latestStudent.id)
        .slice(0, 3)
    : [];
  const dateLabel = new Date()
    .toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .toUpperCase();
  const firstName = user.name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  // A different campus greets the team each day.
  const heroCampus = campusPhotos[new Date().getDate() % campusPhotos.length];
  return (
    <>
      <header className="welcome-hero">
        <Image
          src={heroCampus.photo}
          alt={heroCampus.place}
          className="welcome-hero-photo"
          fill
          preload
          sizes="(max-width: 820px) 100vw, 1200px"
        />
        <div className="welcome-hero-copy">
          <p className="eyebrow">{dateLabel}</p>
          <h1>
            {greeting}
            {firstName ? `, ${firstName}` : ""}.
          </h1>
          <p>Here’s what needs your attention across your workspace.</p>
          <div className="page-actions">
            <button
              className="secondary-button"
              onClick={() => exportStudents(students, onNotify)}
            >
              <Download size={16} /> Export
            </button>
            <button className="primary-button" onClick={onNew}>
              <Plus size={17} /> New student
            </button>
          </div>
        </div>
        <span className="welcome-hero-place">
          <MapPin size={13} /> {heroCampus.place}
        </span>
      </header>
      <section className="metric-grid">
        <Metric
          icon={<Users size={18} />}
          tone="blue"
          label="Active students"
          value={String(
            students.filter((student) => student.status !== "archived").length,
          )}
          meta={`${attentionStudents.length} need review`}
        />
        <Metric
          icon={<Sparkles size={18} />}
          tone="violet"
          label="Matches generated"
          value={String(matches.length)}
          meta={`${matches.filter((match) => match.status === "Eligible").length} eligible`}
        />
        <Metric
          icon={<CalendarDays size={18} />}
          tone="orange"
          label="Due this week"
          value={String(dueThisWeek).padStart(2, "0")}
          meta={`${openDeadlines.length} upcoming`}
        />
        <Metric
          icon={<FileCheck2 size={18} />}
          tone="green"
          label="Applications live"
          value={String(liveApplications.length)}
          meta={`Across ${new Set(liveApplications.map((application) => application.studentId)).size} students`}
        />
      </section>
      <section className="dashboard-grid">
        <div className="panel focus-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">FOCUS FOR TODAY</p>
              <h2>
                {attentionStudents.length
                  ? `${attentionStudents.length} profiles need your review`
                  : "You’re caught up"}
              </h2>
            </div>
            <button
              className="text-button"
              onClick={() => onNavigate("Students")}
            >
              View queue <ArrowRight size={14} />
            </button>
          </div>
          <div className="focus-list">
            {attentionStudents.map((student) => (
              <button key={student.id} onClick={() => onStudent(student)}>
                <span className="focus-icon violet">
                  <Sparkles size={17} />
                </span>
                <span>
                  <strong>Review {student.name}’s profile</strong>
                  <small>
                    {student.progress}% complete · updated {student.updated}
                  </small>
                </span>
                <span className="priority orange">REVIEW</span>
                <ChevronRight size={16} />
              </button>
            ))}
            {!attentionStudents.length && (
              <div className="empty-state">
                <CheckCircle2 size={24} />
                <strong>No pending profile reviews</strong>
                <span>New students requiring attention will appear here.</span>
              </div>
            )}
          </div>
        </div>
        <div className="panel deadline-card">
          <div className="panel-head">
            <div>
              <p className="eyebrow">UPCOMING</p>
              <h2>Deadlines</h2>
            </div>
            <button
              className="icon-button"
              aria-label="Open calendar"
              onClick={() => onNavigate("Calendar")}
            >
              <CalendarDays size={16} />
            </button>
          </div>
          <div className="compact-deadlines">
            {openDeadlines.slice(0, 3).map((deadline) => {
              const due = new Date(deadline.dueAt);
              const days = daysUntil(deadline.dueAt);
              return (
                <Deadline
                  key={deadline.id}
                  date={String(due.getDate()).padStart(2, "0")}
                  month={due
                    .toLocaleDateString("en-GB", { month: "short" })
                    .toUpperCase()}
                  title={deadline.title}
                  detail={[
                    deadline.type.replaceAll("_", " "),
                    deadline.studentName,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  days={days === 0 ? "Today" : `${days} days`}
                  urgent={days <= 7}
                />
              );
            })}
            {!openDeadlines.length && (
              <div className="empty-state">
                <CalendarDays size={24} />
                <strong>No upcoming deadlines</strong>
                <span>Add deadlines from applications to see them here.</span>
              </div>
            )}
          </div>
          <button className="full-link" onClick={() => onNavigate("Calendar")}>
            Open deadline calendar <ArrowRight size={14} />
          </button>
        </div>
      </section>
      <section className="dashboard-grid lower-grid">
        <div className="panel recommended-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">LATEST MATCH RUN</p>
              <h2>
                {latestStudent
                  ? `${latestStudent.name.split(" ")[0]}’s top matches`
                  : "No match runs yet"}
              </h2>
            </div>
            <button
              className="text-button"
              onClick={() => onNavigate("Matches")}
            >
              See all {latestMatches.length} <ArrowRight size={14} />
            </button>
          </div>
          {latestStudent && (
            <button
              className="student-strip"
              onClick={() => onStudent(latestStudent)}
            >
              <span className={`avatar ${latestStudent.tone}`}>
                {latestStudent.initials}
              </span>
              <span>
                <strong>{latestStudent.name}</strong>
                <small>
                  {latestStudent.degree} · profile {latestStudent.progress}%
                  complete
                </small>
              </span>
              <span className="verified">
                <ShieldCheck size={14} /> SAVED
              </span>
              <ChevronRight size={16} />
            </button>
          )}
          {latestMatches.map((match) => (
            <div className="mini-match" key={match.id}>
              <CampusMark
                university={match.university}
                code={match.logo}
                tone={match.tone}
              />
              <div>
                <strong>{match.programme}</strong>
                <span>
                  {match.university} · {match.city}
                </span>
              </div>
              <div className="match-score">
                <b className={scoreTone(match.status)}>{match.score}%</b>
                <span>{match.status}</span>
              </div>
            </div>
          ))}
          {!latestStudent && (
            <div className="empty-state">
              <Sparkles size={24} />
              <strong>No saved matches</strong>
              <span>Match results will appear here once generated.</span>
            </div>
          )}
        </div>
        <div className="impact-card">
          <div className="impact-orbit">
            <Zap size={21} />
          </div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h2>
            {students.length} student{" "}
            {students.length === 1 ? "profile" : "profiles"} in one secure
            place.
          </h2>
          <p>
            {applications.length} applications and {deadlines.length} deadlines
            are currently tracked.
          </p>
          <button onClick={() => onNavigate("Reports")}>
            See workspace report <ArrowRight size={14} />
          </button>
          <div className="impact-lines">
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>
    </>
  );
}

function Metric({
  icon,
  tone,
  label,
  value,
  meta,
  trend,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
  meta: string;
  trend?: boolean;
}) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}>{icon}</div>
      <span>{label}</span>
      <div>
        <strong>{value}</strong>
        <small className={trend ? "up" : ""}>
          {trend && "↗ "}
          {meta}
        </small>
      </div>
    </div>
  );
}

function Deadline({
  date,
  month,
  title,
  detail,
  days,
  urgent = false,
}: {
  date: string;
  month: string;
  title: string;
  detail: string;
  days: string;
  urgent?: boolean;
}) {
  return (
    <div className="deadline-row">
      <div className={`date-tile ${urgent ? "urgent" : ""}`}>
        <strong>{date}</strong>
        <span>{month}</span>
      </div>
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <small className={urgent ? "urgent-text" : ""}>{days}</small>
    </div>
  );
}

const studentTabs: { label: string; test: (student: Student) => boolean }[] = [
  { label: "All students", test: () => true },
  {
    label: "Needs review",
    test: (student) => /review|missing|processing/i.test(student.stage),
  },
  { label: "Applications", test: (student) => student.stage === "Applied" },
  { label: "Completed", test: (student) => student.stage === "Completed" },
];

const studentSorts: Record<string, (a: Student, b: Student) => number> = {
  "Newest first": () => 0,
  "Name A–Z": (a, b) => a.name.localeCompare(b.name),
  "Most complete": (a, b) => b.progress - a.progress,
  "Least complete": (a, b) => a.progress - b.progress,
};

function StudentsView({
  students,
  initialQuery,
  onNew,
  onSelect,
  onNotify,
}: {
  students: Student[];
  initialQuery: string;
  onNew: () => void;
  onSelect: (student: Student) => void;
  onNotify: (message: string) => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState(studentTabs[0].label);
  const [sort, setSort] = useState("Newest first");
  const filtered = useMemo(() => {
    const inTab = studentTabs.find((item) => item.label === tab)!.test;
    return students
      .filter(
        (student) =>
          inTab(student) &&
          `${student.name} ${student.degree} ${student.stage}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      )
      .sort(studentSorts[sort]);
  }, [students, query, tab, sort]);
  return (
    <>
      <PageTitle
        eyebrow="STUDENT WORKSPACE"
        title="Students"
        text="Every profile, document, match, and application in one place."
      >
        <button
          className="secondary-button"
          onClick={() => exportStudents(students, onNotify)}
        >
          <Download size={16} /> Export list
        </button>
        <button className="primary-button" onClick={onNew}>
          <UserPlus size={17} /> Add student
        </button>
      </PageTitle>
      <div className="tab-bar" role="tablist">
        {studentTabs.map((item) => (
          <button
            key={item.label}
            role="tab"
            aria-selected={tab === item.label}
            className={tab === item.label ? "active" : ""}
            onClick={() => setTab(item.label)}
          >
            {item.label} <span>{students.filter(item.test).length}</span>
          </button>
        ))}
      </div>
      <div className="table-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by student, degree, or stage"
            aria-label="Search students"
          />
          {query && (
            <button
              className="clear-search"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <label className="outline-button sort-select">
          <ListFilter size={15} />
          <span className="sr-only">Sort students</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            {Object.keys(studentSorts).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <ChevronDown size={15} />
        </label>
      </div>
      <div className="panel data-table student-table">
        <div className="table-head">
          <span>STUDENT</span>
          <span>DESTINATION</span>
          <span>STAGE</span>
          <span>PROFILE</span>
          <span>UPDATED</span>
          <span />
        </div>
        {filtered.map((student) => (
          <button
            className="table-row"
            key={student.name}
            onClick={() => onSelect(student)}
          >
            <span className="person-cell">
              <span className={`avatar ${student.tone}`}>
                {student.initials}
              </span>
              <span>
                <strong>{student.name}</strong>
                <small>
                  {student.degree} · {student.cgpa}
                </small>
              </span>
            </span>
            <span className="destination-cell">
              <Flag size={14} />
              {student.target}
            </span>
            <Status text={student.stage} />
            <span className="completion-cell">
              <span>
                <i style={{ width: `${student.progress}%` }} />
              </span>
              <small>{student.progress}%</small>
            </span>
            <span className="updated">{student.updated}</span>
            <ChevronRight size={16} />
          </button>
        ))}
        {!filtered.length && (
          <div className="empty-state">
            <Search size={24} />
            <strong>No students found</strong>
            <span>
              {query
                ? "Try a different search term."
                : `No students in “${tab}” yet.`}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

function Status({ text }: { text: string }) {
  const tone = /missing|not eligible/i.test(text)
    ? "red"
    : /review|processing|borderline/i.test(text)
      ? "orange"
      : text.includes("Applied")
        ? "blue"
        : "green";
  return (
    <span className={`status ${tone}`}>
      <i />
      {text}
    </span>
  );
}

const scoreTone = (status: string) =>
  status === "Not eligible"
    ? "score-bad"
    : status === "Borderline"
      ? "score-warn"
      : "";

function MatchesView({
  students,
  matches,
  onOpen,
  onReview,
  onReport,
  onRun,
  onStartApplication,
  onNotify,
}: {
  students: Student[];
  matches: MatchResult[];
  onOpen: (student: Student) => void;
  onReview: (student: Student) => void;
  onReport: (student: Student) => void;
  onRun: (student: Student) => Promise<void>;
  onStartApplication: (match: MatchResult) => Promise<void>;
  onNotify: (message: string) => void;
}) {
  const [filter, setFilter] = useState("All results");
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [running, setRunning] = useState(false);
  const [startingApplication, setStartingApplication] = useState("");
  const student = students.find((item) => item.id === studentId) ?? students[0];
  const studentMatches = matches.filter(
    (match) => match.studentId === student?.id,
  );
  const visible = studentMatches.filter(
    (match) => filter === "All results" || match.status === filter,
  );
  const run = async () => {
    if (!student) return;
    setRunning(true);
    try {
      await onRun(student);
    } catch (error) {
      onNotify(messageOf(error) ?? "Could not run matching");
    } finally {
      setRunning(false);
    }
  };
  if (!student)
    return (
      <>
        <PageTitle
          eyebrow="ELIGIBILITY ENGINE"
          title="Match centre"
          text="Add a student before running verified programme matching."
        />
        <div className="panel empty-state">
          <Users size={28} />
          <strong>No students available</strong>
          <span>
            Create a student profile, then return here to generate matches.
          </span>
        </div>
      </>
    );
  return (
    <>
      <PageTitle
        eyebrow="ELIGIBILITY ENGINE"
        title="Match centre"
        text="Every result comes from fixed rules, never AI guesses, with the exact reason for each check."
      >
        <button
          className="secondary-button"
          disabled={!studentMatches.length}
          onClick={() => onReport(student)}
        >
          <FileText size={16} /> Shortlist report
        </button>
        {student.academic.confirmedAt ? (
          <button
            className="primary-button"
            disabled={running}
            onClick={() => void run()}
          >
            {running ? <span className="spinner" /> : <Sparkles size={16} />}{" "}
            {running ? "Matching…" : "Run new match"}
          </button>
        ) : (
          <button className="primary-button" onClick={() => onReview(student)}>
            <ShieldCheck size={16} /> Review profile first
          </button>
        )}
      </PageTitle>
      <div className="match-profile-bar">
        <label className="profile-select">
          <span className={`avatar ${student.tone}`}>{student.initials}</span>
          <span>
            <small>MATCHING FOR</small>
            <select
              value={student.id}
              onChange={(event) => {
                setStudentId(event.target.value);
                setFilter("All results");
              }}
            >
              {students.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </span>
          <ChevronDown size={16} />
        </label>
        <div className="profile-facts">
          <span>
            <GraduationCap size={15} />
            <b>{student.degree}</b>
            <small>{student.cgpa}</small>
          </span>
          <span>
            <BookOpen size={15} />
            <b>
              {Math.round(
                student.credits.reduce(
                  (total, credit) => total + credit.ects,
                  0,
                ),
              )}{" "}
              mapped ECTS
            </b>
            <small>
              {student.academic.confirmedAt
                ? `Confirmed ${new Date(student.academic.confirmedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
                : "Profile not confirmed"}
            </small>
          </span>
          <span>
            <Flag size={15} />
            <b>{student.target}</b>
            <small>
              {student.budget
                ? `Budget €${student.budget.toLocaleString()} / year`
                : "No budget added"}
            </small>
          </span>
        </div>
        <button className="verified-banner" onClick={() => onOpen(student)}>
          <ShieldCheck size={17} /> Open profile
        </button>
      </div>
      <div className="match-summary">
        <div>
          <strong>{studentMatches.length}</strong>
          <span>programmes checked</span>
        </div>
        <div className="good">
          <strong>
            {
              studentMatches.filter((match) => match.status === "Eligible")
                .length
            }
          </strong>
          <span>eligible</span>
        </div>
        <div className="warn">
          <strong>
            {
              studentMatches.filter((match) => match.status === "Borderline")
                .length
            }
          </strong>
          <span>borderline</span>
        </div>
        <div className="bad">
          <strong>
            {
              studentMatches.filter((match) => match.status === "Not eligible")
                .length
            }
          </strong>
          <span>not eligible</span>
        </div>
        <p>
          <Clock3 size={14} />{" "}
          {studentMatches[0]
            ? `Updated ${new Date(studentMatches[0].generatedAt).toLocaleString("en-GB")}`
            : "Not run yet"}
        </p>
      </div>
      <div className="match-controls">
        <div className="segmented" role="group" aria-label="Filter results">
          {["All results", "Eligible", "Borderline", "Not eligible"].map(
            (item) => (
              <button
                key={item}
                aria-pressed={filter === item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <button className="outline-button">
          <ListFilter size={15} /> Sort: Best match
        </button>
      </div>
      <div className="match-card-list">
        {visible.map((match) => (
          <article className="match-card" key={match.id}>
            <div className="match-main">
              <CampusMark
                university={match.university}
                code={match.logo}
                tone={match.tone}
                size="large"
              />
              <div className="match-title">
                <div>
                  <Status text={match.status} />
                  {match.programmeVerified ? (
                    <span className="fresh-label">
                      <ShieldCheck size={12} /> Rules verified {match.verified}
                    </span>
                  ) : (
                    <span className="unverified-label">
                      <CircleAlert size={12} /> Unverified rules: check the
                      source before advising
                    </span>
                  )}
                </div>
                <h2>{match.programme}</h2>
                <p>
                  {match.university} <span>·</span> <MapPin size={13} />{" "}
                  {match.city}
                </p>
                <div className="programme-meta">
                  <span>
                    Annual tuition <b>{match.fee}</b>
                  </span>
                  <span>
                    Application deadline <b>{match.deadline}</b>
                  </span>
                  <span>
                    Teaching language <b>English</b>
                  </span>
                </div>
              </div>
              <div className="large-score">
                <strong className={scoreTone(match.status)}>
                  {match.score}
                  <small>%</small>
                </strong>
                <span>match score</span>
              </div>
            </div>
            <div className="rule-bar">
              <div>
                {match.checks.length
                  ? match.checks.map((check, index) => (
                      <span
                        key={`${check.key}-${index}`}
                        className={
                          check.outcome === "fail"
                            ? "fail"
                            : check.outcome === "borderline"
                              ? "warn"
                              : ""
                        }
                        title={check.label}
                      >
                        {check.outcome === "fail" ? (
                          <X size={13} />
                        ) : check.outcome === "borderline" ? (
                          <CircleAlert size={13} />
                        ) : (
                          <Check size={13} />
                        )}
                        {check.detail}
                      </span>
                    ))
                  : match.reasons.map((reason, index) => (
                      <span key={`${reason}-${index}`}>
                        <Check size={13} />
                        {reason}
                      </span>
                    ))}
              </div>
              <button
                disabled={startingApplication === match.id}
                onClick={async () => {
                  setStartingApplication(match.id);
                  try {
                    await onStartApplication(match);
                  } catch (error) {
                    onNotify(
                      messageOf(error) ?? "Could not create application",
                    );
                  } finally {
                    setStartingApplication("");
                  }
                }}
              >
                {startingApplication === match.id
                  ? "Saving…"
                  : "Start application"}{" "}
                <ArrowRight size={14} />
              </button>
            </div>
          </article>
        ))}
        {!visible.length && (
          <div className="panel empty-state">
            <Sparkles size={28} />
            <strong>
              {studentMatches.length
                ? "No matches in this filter"
                : "No matches saved yet"}
            </strong>
            <span>
              {studentMatches.length
                ? "Choose another result filter."
                : student.academic.confirmedAt
                  ? "Run a new match to check every published programme."
                  : "Review and confirm the student’s profile, then run a match."}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

function ProgrammeStatus({ programme }: { programme: Programme }) {
  if (programme.status === "verified")
    return (
      <span className="fresh-cell">
        <ShieldCheck size={13} />
        {programme.freshness}
      </span>
    );
  return (
    <span className="fresh-cell unverified">
      <CircleAlert size={13} />
      {programme.status === "in_review" ? "In review" : "Not verified"}
    </span>
  );
}

function ProgrammesView({
  programmes,
  universities,
  isVerifier,
  onEdit,
  onNotify,
}: {
  programmes: Programme[];
  universities: University[];
  isVerifier: boolean;
  onEdit: (programme: Programme | "new") => void;
  onNotify: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [catalogue, setCatalogue] = useState<"programmes" | "universities">(
    "programmes",
  );
  const visible = programmes.filter((programme) =>
    `${programme.programme} ${programme.university} ${programme.city}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const visibleUniversities = universities.filter((university) =>
    `${university.name} ${university.region} ${university.institutionType}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const verified = programmes.filter(
    (programme) => programme.status === "verified",
  ).length;
  const inReview = programmes.filter(
    (programme) => programme.status === "in_review",
  ).length;
  const stale = programmes.filter((programme) =>
    ["stale", "unverified"].includes(programme.status),
  ).length;
  const catalogueTabs = (
    <div className="tab-bar" role="tablist" aria-label="Catalogue view">
      <button
        role="tab"
        aria-selected={catalogue === "programmes"}
        className={catalogue === "programmes" ? "active" : ""}
        onClick={() => {
          setCatalogue("programmes");
          setQuery("");
        }}
      >
        Programmes <span>{programmes.length}</span>
      </button>
      <button
        role="tab"
        aria-selected={catalogue === "universities"}
        className={catalogue === "universities" ? "active" : ""}
        onClick={() => {
          setCatalogue("universities");
          setQuery("");
        }}
      >
        Italian universities <span>{universities.length}</span>
      </button>
    </div>
  );
  if (catalogue === "universities") {
    const stateCount = universities.filter(
      (university) => university.institutionType === "Statale",
    ).length;
    const privateCount = universities.length - stateCount;
    const onlineCount = universities.filter(
      (university) => university.isTelematic,
    ).length;
    return (
      <>
        <PageTitle
          eyebrow="OFFICIAL MUR DIRECTORY"
          title="Italian universities"
          text="Every institution currently listed in the Ministry’s USTAT university directory."
        >
          <button
            className="secondary-button"
            onClick={() => {
              downloadCsv("italian-universities.csv", [
                ["University", "Region", "Type", "Delivery", "Official source"],
                ...visibleUniversities.map((university) => [
                  university.name,
                  university.region,
                  university.institutionType,
                  university.isTelematic ? "Online" : "Campus",
                  university.source,
                ]),
              ]);
              onNotify("University directory exported");
            }}
          >
            <Download size={16} /> Export directory
          </button>
        </PageTitle>
        {catalogueTabs}
        <div className="database-banner">
          <div className="database-icon">
            <Building2 size={22} />
          </div>
          <div>
            <strong>Complete official institution coverage</strong>
            <span>
              {universities.length} institutions · 20 regions · sourced from MUR
              USTAT on 23 September 2026
            </span>
          </div>
          <div className="database-stats">
            <span>
              <b>{stateCount}</b> state
            </span>
            <span className="warn">
              <b>{privateCount}</b> non-state
            </span>
            <span>
              <b>{onlineCount}</b> online
            </span>
          </div>
        </div>
        <div className="programme-filters">
          <div className="search-box">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search university, region, or type"
              aria-label="Search Italian universities"
            />
            {query && (
              <button
                className="clear-search"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="panel data-table programme-table university-directory">
          <div className="table-head">
            <span>UNIVERSITY</span>
            <span>REGION</span>
            <span>OWNERSHIP</span>
            <span>DELIVERY</span>
            <span>DIRECTORY STATUS</span>
            <span />
          </div>
          {visibleUniversities.map((university) => {
            const code = university.name
              .split(/\s+/)
              .filter((word) => word.length > 3)
              .slice(0, 2)
              .map((word) => word[0])
              .join("")
              .toUpperCase();
            return (
              <a
                className="table-row"
                key={university.id}
                href={university.source}
                target="_blank"
                rel="noreferrer"
                aria-label={`${university.name}, official MUR listing`}
              >
                <span className="person-cell">
                  <CampusMark
                    university={university.name}
                    code={code}
                    tone="blue"
                    size="small"
                  />
                  <span>
                    <strong>{university.name}</strong>
                    <small>Italy · {university.slug}</small>
                  </span>
                </span>
                <span>{university.region}</span>
                <span>
                  <b>{university.institutionType}</b>
                </span>
                <span>{university.isTelematic ? "Online" : "Campus"}</span>
                <span className="fresh-cell">
                  <ShieldCheck size={13} />
                  Official MUR listing
                </span>
                <ExternalLink size={15} />
              </a>
            );
          })}
          {!visibleUniversities.length && (
            <div className="empty-state">
              <Search size={24} />
              <strong>No universities found</strong>
              <span>Try another name, region, or institution type.</span>
            </div>
          )}
        </div>
      </>
    );
  }
  return (
    <>
      <PageTitle
        eyebrow="VERIFIED DATABASE"
        title="Programmes"
        text="Current entry rules, tuition, and deadlines, linked to primary sources."
      >
        <button
          className="secondary-button"
          onClick={() => {
            downloadCsv("programmes.csv", [
              [
                "Programme",
                "University",
                "City",
                "Intake",
                "Tuition / year",
                "Deadline",
                "Data status",
                "Source",
              ],
              ...visible.map((p) => [
                p.programme,
                p.university,
                p.city,
                p.intake,
                p.fee,
                p.deadline,
                p.freshness,
                p.source,
              ]),
            ]);
            onNotify("Programme database exported");
          }}
        >
          <Download size={16} /> Export database
        </button>
        {isVerifier && (
          <button className="primary-button" onClick={() => onEdit("new")}>
            <Plus size={17} /> Add programme
          </button>
        )}
      </PageTitle>
      {catalogueTabs}
      <div className="database-banner">
        <div className="database-icon">
          <ShieldCheck size={22} />
        </div>
        <div>
          <strong>Programme catalogue</strong>
          <span>
            {verified} of {programmes.length} programmes checked against their
            official admissions call
          </span>
        </div>
        <div className="database-stats">
          <span>
            <b>{verified}</b> verified
          </span>
          <span className="warn">
            <b>{inReview}</b> in review
          </span>
          <span className="bad">
            <b>{stale}</b> need attention
          </span>
        </div>
      </div>
      <div className="programme-filters">
        <div className="search-box">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search programme, university, or city"
            aria-label="Search programmes"
          />
          {query && (
            <button
              className="clear-search"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button className="outline-button">
          <Flag size={15} /> Italy <ChevronDown size={14} />
        </button>
        <button className="outline-button">
          <GraduationCap size={15} /> Master’s <ChevronDown size={14} />
        </button>
        <button className="outline-button">
          <Filter size={15} /> More filters
        </button>
      </div>
      <div
        className={`panel data-table programme-table ${isVerifier ? "verifier" : ""}`}
      >
        <div className="table-head">
          <span>PROGRAMME</span>
          <span>INTAKE</span>
          <span>TUITION / YEAR</span>
          <span>DEADLINE</span>
          <span>DATA STATUS</span>
          <span />
        </div>
        {visible.map((programme) => {
          const cells = (
            <>
              <span className="person-cell">
                <CampusMark
                  university={programme.university}
                  code={programme.code}
                  tone={programme.tone}
                  size="small"
                />
                <span>
                  <strong>{programme.programme}</strong>
                  <small>
                    {programme.university} · {programme.city}
                  </small>
                </span>
              </span>
              <span>{programme.intake}</span>
              <span>
                <b>{programme.fee}</b>
              </span>
              <span>{programme.deadline}</span>
              <ProgrammeStatus programme={programme} />
            </>
          );
          return isVerifier ? (
            <div className="table-row verifier-row" key={programme.id}>
              {cells}
              <span className="row-actions">
                <a
                  href={programme.source}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open the source for ${programme.programme}`}
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  className="outline-button"
                  onClick={() => onEdit(programme)}
                >
                  {programme.status === "verified" ? "Edit" : "Verify"}
                </button>
              </span>
            </div>
          ) : (
            <a
              className="table-row"
              key={programme.id}
              href={programme.source}
              target="_blank"
              rel="noreferrer"
              aria-label={`${programme.programme}, ${programme.university}, opens the university website`}
            >
              {cells}
              <ExternalLink size={15} />
            </a>
          );
        })}
        {!visible.length && (
          <div className="empty-state">
            <Search size={24} />
            <strong>No programmes found</strong>
            <span>
              {programmes.length
                ? "Try a different programme, university, or city."
                : "The programme catalogue is empty."}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

const applicationColumnDefinitions = [
  { title: "SHORTLISTED", tone: "neutral", stages: ["shortlisted"] },
  { title: "APPLICATION READY", tone: "orange", stages: ["application_ready"] },
  {
    title: "SUBMITTED",
    tone: "blue",
    stages: ["submitted", "pre_admitted", "universitaly", "visa"],
  },
  { title: "DECISION", tone: "green", stages: ["enrolled", "rejected"] },
];

const applicationStageLabels: Record<string, string> = {
  shortlisted: "Shortlisted",
  application_ready: "Application ready",
  submitted: "Submitted",
  pre_admitted: "Pre-admitted",
  universitaly: "Universitaly",
  visa: "Visa",
  enrolled: "Enrolled",
  rejected: "Rejected",
};

function ApplicationsView({
  applications,
  onStageChange,
}: {
  applications: Application[];
  onStageChange: (id: string, stage: string) => Promise<void>;
}) {
  const active = applications.filter(
    (application) => !["enrolled", "rejected"].includes(application.stage),
  );
  const submittedThisMonth = applications.filter(
    (application) =>
      application.submittedAt &&
      new Date(application.submittedAt).getMonth() === new Date().getMonth(),
  ).length;
  return (
    <>
      <PageTitle
        eyebrow="APPLICATION TRACKER"
        title="Applications"
        text="Every stage below is loaded from and saved back to your workspace."
      >
        <button
          className="secondary-button"
          onClick={() =>
            downloadCsv("applications.csv", [
              ["Student", "Programme", "University", "Stage", "Deadline"],
              ...applications.map((application) => [
                application.studentName,
                application.programme,
                application.university,
                applicationStageLabels[application.stage] ?? application.stage,
                application.deadline,
              ]),
            ])
          }
        >
          <Download size={16} /> Export
        </button>
      </PageTitle>
      <div className="pipeline-summary">
        <span>
          <b>{active.length}</b> active applications
        </span>
        <i />
        <span>
          <b>
            {
              applications.filter((application) =>
                ["shortlisted", "application_ready"].includes(
                  application.stage,
                ),
              ).length
            }
          </b>{" "}
          preparing
        </span>
        <i />
        <span>
          <b>{submittedThisMonth}</b> submitted this month
        </span>
        <i />
        <span className="success">
          <b>
            {
              applications.filter(
                (application) => application.stage === "enrolled",
              ).length
            }
          </b>{" "}
          enrolled
        </span>
      </div>
      <div className="kanban">
        {applicationColumnDefinitions.map((column) => {
          const cards = applications.filter((application) =>
            column.stages.includes(application.stage),
          );
          return (
            <section className="kanban-column" key={column.title}>
              <header>
                <span className={`column-dot ${column.tone}`} />
                {column.title}
                <b>{cards.length}</b>
              </header>
              <div>
                {cards.map((card) => (
                  <article className="application-card" key={card.id}>
                    <div className="application-person">
                      <span className={`avatar ${card.tone}`}>
                        {card.initials}
                      </span>
                      <div>
                        <strong>{card.studentName}</strong>
                        <small>
                          {applicationStageLabels[card.stage] ?? card.stage}
                        </small>
                      </div>
                    </div>
                    <h3>{card.programme}</h3>
                    <p>{card.university}</p>
                    <div className="doc-progress">
                      <span>
                        <i
                          style={{
                            width: [
                              "submitted",
                              "pre_admitted",
                              "universitaly",
                              "visa",
                              "enrolled",
                            ].includes(card.stage)
                              ? "100%"
                              : card.stage === "application_ready"
                                ? "75%"
                                : "35%",
                          }}
                        />
                      </span>
                      <small>Application progress</small>
                    </div>
                    <footer>
                      <span>
                        <Clock3 size={13} /> {card.deadline}
                      </span>
                      <label>
                        <span className="sr-only">Update stage</span>
                        <select
                          value={card.stage}
                          onChange={(event) =>
                            void onStageChange(card.id, event.target.value)
                          }
                        >
                          {Object.entries(applicationStageLabels).map(
                            ([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ),
                          )}
                        </select>
                      </label>
                    </footer>
                  </article>
                ))}
                {!cards.length && (
                  <div className="empty-state">
                    <FileCheck2 size={22} />
                    <strong>No applications</strong>
                    <span>Applications in this stage will appear here.</span>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function CalendarView({ deadlines }: { deadlines: DeadlineItem[] }) {
  const [month, setMonth] = useState(
    new Date(TODAY.getFullYear(), TODAY.getMonth(), 1),
  );
  const calendarEvents = useMemo(
    () =>
      deadlines.reduce<
        Record<string, { label: string; tone: "urgent" | "blue" | "green" }[]>
      >((events, deadline) => {
        const key = isoDate(new Date(deadline.dueAt));
        const days = daysUntil(deadline.dueAt);
        (events[key] ??= []).push({
          label: deadline.title,
          tone: deadline.completedAt ? "green" : days <= 7 ? "urgent" : "blue",
        });
        return events;
      }, {}),
    [deadlines],
  );
  const agenda = deadlines.filter(
    (deadline) =>
      !deadline.completedAt &&
      daysUntil(deadline.dueAt) >= 0 &&
      daysUntil(deadline.dueAt) <= 30,
  );
  const lead = (month.getDay() + 6) % 7; // Monday-first grid
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const cells = Array.from(
    { length: Math.ceil((lead + daysInMonth) / 7) * 7 },
    (_, index) =>
      new Date(month.getFullYear(), month.getMonth(), index - lead + 1),
  );
  const shiftMonth = (by: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + by, 1));
  const monthLabel = month.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
  return (
    <>
      <PageTitle
        eyebrow="DEADLINE CONTROL"
        title="Calendar"
        text="Application, pre-enrolment, scholarship, and visa milestones in one place."
      >
        <button
          className="secondary-button"
          onClick={() =>
            setMonth(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
          }
        >
          Today
        </button>
      </PageTitle>
      <div className="calendar-layout">
        <div className="panel month-panel">
          <header>
            <button onClick={() => shiftMonth(-1)} aria-label="Previous month">
              <ArrowLeft size={17} />
            </button>
            <h2 aria-live="polite">{monthLabel}</h2>
            <button onClick={() => shiftMonth(1)} aria-label="Next month">
              <ArrowRight size={17} />
            </button>
          </header>
          <div className="weekday-row">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="month-grid">
            {cells.map((date) => {
              const key = isoDate(date);
              return (
                <div
                  key={key}
                  className={`${date.getMonth() !== month.getMonth() ? "muted-day" : ""} ${key === isoDate(TODAY) ? "today" : ""}`}
                >
                  <span>{date.getDate()}</span>
                  {calendarEvents[key]?.slice(0, 2).map((event, index) => (
                    <small
                      key={`${event.label}-${index}`}
                      className={`event ${event.tone}`}
                      title={event.label}
                    >
                      {event.label}
                    </small>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <aside className="panel agenda-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">NEXT 30 DAYS</p>
              <h2>Agenda</h2>
            </div>
          </div>
          {agenda.map((deadline) => {
            const due = new Date(deadline.dueAt);
            const days = daysUntil(deadline.dueAt);
            return (
              <div key={deadline.id}>
                <p className="agenda-date">
                  {due
                    .toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })
                    .toUpperCase()}
                </p>
                <Deadline
                  date={String(due.getDate()).padStart(2, "0")}
                  month={due
                    .toLocaleDateString("en-GB", { month: "short" })
                    .toUpperCase()}
                  title={deadline.title}
                  detail={[
                    deadline.type.replaceAll("_", " "),
                    deadline.studentName,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  days={days === 0 ? "Today" : `${days} days`}
                  urgent={days <= 7}
                />
              </div>
            );
          })}
          {!agenda.length && (
            <div className="empty-state">
              <CalendarDays size={24} />
              <strong>No deadlines in the next 30 days</strong>
              <span>Upcoming milestones will appear here.</span>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

function ReportsView({
  students,
  matches,
  applications,
  deadlines,
  onNotify,
}: {
  students: Student[];
  matches: MatchResult[];
  applications: Application[];
  deadlines: DeadlineItem[];
  onNotify: (message: string) => void;
}) {
  const monthDates = Array.from(
    { length: 6 },
    (_, index) =>
      new Date(TODAY.getFullYear(), TODAY.getMonth() - 5 + index, 1),
  );
  const months = monthDates.map((date) =>
    date.toLocaleDateString("en-GB", { month: "short" }),
  );
  const shortlists = monthDates.map(
    (date) =>
      new Set(
        matches
          .filter((match) => {
            const generated = new Date(match.generatedAt);
            return (
              generated.getFullYear() === date.getFullYear() &&
              generated.getMonth() === date.getMonth()
            );
          })
          .map((match) => match.studentId),
      ).size,
  );
  const chartMax = Math.max(5, ...shortlists);
  const eligibleRate = matches.length
    ? Math.round(
        (matches.filter((match) => match.status === "Eligible").length /
          matches.length) *
          100,
      )
    : 0;
  const completedDeadlines = deadlines.filter(
    (deadline) => deadline.completedAt,
  ).length;
  const deadlinesMet = deadlines.length
    ? Math.round((completedDeadlines / deadlines.length) * 100)
    : 0;
  const onTrack = students.filter((student) =>
    ["shortlist_ready", "applying", "enrolled"].includes(student.status),
  ).length;
  const needsReview = students.filter((student) =>
    ["needs_review", "profile_processing"].includes(student.status),
  ).length;
  const atRisk = deadlines.filter(
    (deadline) => !deadline.completedAt && daysUntil(deadline.dueAt) < 0,
  ).length;
  const health = students.length
    ? Math.max(
        0,
        Math.min(
          100,
          Math.round(
            (onTrack / students.length) * 70 + (deadlinesMet || 30) * 0.3,
          ),
        ),
      )
    : 0;
  return (
    <>
      <PageTitle
        eyebrow="WORKSPACE INTELLIGENCE"
        title="Reports"
        text="Live metrics calculated from your workspace records."
      >
        <button
          className="secondary-button"
          onClick={() => {
            downloadCsv("workspace-report.csv", [
              ["Metric", "Value"],
              ["Students", students.length],
              ["Matches", matches.length],
              ["Eligible match rate", `${eligibleRate}%`],
              ["Applications", applications.length],
              ["Deadlines met", `${deadlinesMet}%`],
            ]);
            onNotify("Report downloaded");
          }}
        >
          <Download size={16} /> Download report
        </button>
      </PageTitle>
      <section className="metric-grid">
        <Metric
          icon={<Sparkles size={18} />}
          tone="blue"
          label="Matches generated"
          value={String(matches.length)}
          meta={`${new Set(matches.map((match) => match.studentId)).size} students matched`}
        />
        <Metric
          icon={<CheckCircle2 size={18} />}
          tone="green"
          label="Eligible match rate"
          value={`${eligibleRate}%`}
          meta={`${matches.filter((match) => match.status === "Eligible").length} eligible results`}
        />
        <Metric
          icon={<Users size={18} />}
          tone="violet"
          label="Students progressed"
          value={String(onTrack).padStart(2, "0")}
          meta={`of ${students.length} students`}
        />
        <Metric
          icon={<CalendarDays size={18} />}
          tone="orange"
          label="Deadlines met"
          value={`${deadlinesMet}%`}
          meta={`${completedDeadlines} completed`}
        />
      </section>
      <div className="report-grid">
        <div className="panel chart-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">TEAM OUTPUT</p>
              <h2>Students matched</h2>
            </div>
            <span className="outline-button">Last 6 months</span>
          </div>
          <div className="bar-chart">
            <div className="y-labels">
              <span>{chartMax}</span>
              <span>{Math.round(chartMax * 0.66)}</span>
              <span>{Math.round(chartMax * 0.33)}</span>
              <span>0</span>
            </div>
            <div
              className="bars"
              role="img"
              aria-label={`Students matched: ${months.map((month, index) => `${month} ${shortlists[index]}`).join(", ")}`}
            >
              {shortlists.map((value, index) => (
                <div key={`${months[index]}-${index}`}>
                  <i
                    style={{
                      height: `${Math.max((value / chartMax) * 100, value ? 8 : 0)}%`,
                    }}
                  >
                    <span>{value}</span>
                  </i>
                  <small>{months[index]}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="panel health-panel">
          <p className="eyebrow">STUDENT PIPELINE</p>
          <h2>Workspace health</h2>
          <div className="health-ring">
            <div>
              <strong>{health}</strong>
              <span>/ 100</span>
            </div>
          </div>
          <strong className="health-label">
            {health >= 75
              ? "Healthy"
              : health >= 45
                ? "Needs attention"
                : "Getting started"}
          </strong>
          <p>Based on progress and completed deadlines</p>
          <div className="health-list">
            <span>
              <i className="green" />
              On track <b>{onTrack}</b>
            </span>
            <span>
              <i className="orange" />
              Needs review <b>{needsReview}</b>
            </span>
            <span>
              <i className="red" />
              Overdue <b>{atRisk}</b>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function TeamView({
  team,
  workspace,
  onNotify,
}: {
  team: TeamMember[];
  workspace: Workspace;
  onNotify: (message: string) => void;
}) {
  return (
    <>
      <PageTitle
        eyebrow="WORKSPACE ACCESS"
        title="Team"
        text={`Members with access to ${workspace.name}.`}
      >
        <button
          className="secondary-button"
          onClick={() => {
            downloadCsv("team-members.csv", [
              ["Name", "Email", "Role"],
              ...team.map((member) => [member.name, member.email, member.role]),
            ]);
            onNotify("Team list exported");
          }}
        >
          <Download size={16} /> Export
        </button>
      </PageTitle>
      <div className="team-grid">
        <div className="panel member-panel">
          <div className="panel-head">
            <div>
              <h2>Team members</h2>
              <p>
                {team.length} active {team.length === 1 ? "member" : "members"}
              </p>
            </div>
          </div>
          {team.map((member) => (
            <div className="member-row" key={member.id}>
              <span className={`avatar ${member.tone}`}>{member.initials}</span>
              <div>
                <strong>{member.name}</strong>
                <small>{member.email}</small>
              </div>
              <span className="role-pill">{member.role}</span>
              <span className="last-active">
                <i />
                Active
              </span>
            </div>
          ))}
          {!team.length && (
            <div className="empty-state">
              <Users size={24} />
              <strong>No team members found</strong>
              <span>Workspace membership records will appear here.</span>
            </div>
          )}
        </div>
        <div className="panel access-panel">
          <div className="access-icon">
            <ShieldCheck size={21} />
          </div>
          <h2>Student data stays isolated</h2>
          <p>
            Role-based permissions and workspace isolation keep each
            consultancy’s records private.
          </p>
          <ul>
            <li>
              <Check size={14} /> Manager and counsellor roles
            </li>
            <li>
              <Check size={14} /> Workspace-scoped row-level security
            </li>
            <li>
              <Check size={14} /> Full activity log
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

const settingsSections = [
  "Workspace profile",
  "Destinations",
  "Notifications",
  "Privacy & data",
  "Subscription",
] as const;
type SettingsSection = (typeof settingsSections)[number];

const settingsToggles: Record<
  Exclude<SettingsSection, "Workspace profile" | "Subscription">,
  {
    group: string;
    intro: string;
    toggles: {
      key: string;
      title: string;
      detail: string;
      fallback: boolean;
    }[];
  }
> = {
  Destinations: {
    group: "destinations",
    intro: "Choose which countries appear in matching and programme search.",
    toggles: [
      {
        key: "Italy",
        title: "Italy",
        detail: "Verified programmes · 2027/28 intake",
        fallback: true,
      },
      {
        key: "Germany",
        title: "Germany",
        detail: "Programme data in verification",
        fallback: true,
      },
      {
        key: "France",
        title: "France",
        detail: "Available on request",
        fallback: false,
      },
    ],
  },
  Notifications: {
    group: "notifications",
    intro: "Decide when counsellors hear about deadlines and profile changes.",
    toggles: [
      {
        key: "deadline_reminders",
        title: "Deadline reminders",
        detail:
          "Email assigned counsellors 14, 7, and 2 days before a deadline",
        fallback: true,
      },
      {
        key: "profile_ready",
        title: "Profile ready for review",
        detail: "Notify when document extraction finishes",
        fallback: true,
      },
      {
        key: "weekly_summary",
        title: "Weekly activity summary",
        detail: "Send a Monday digest to workspace admins",
        fallback: false,
      },
    ],
  },
  "Privacy & data": {
    group: "privacy",
    intro: "Control how long student records and documents are kept.",
    toggles: [
      {
        key: "require_consent",
        title: "Require consent before processing",
        detail: "Block document upload until consent is recorded",
        fallback: true,
      },
      {
        key: "auto_delete_inactive",
        title: "Auto-delete inactive students",
        detail: "Remove records with no activity for 24 months",
        fallback: false,
      },
      {
        key: "activity_log",
        title: "Activity log",
        detail: "Record who viewed or edited each student profile",
        fallback: true,
      },
    ],
  },
};

function SettingsView({
  initialSection,
  workspace,
  user,
  studentCount,
  onSave,
  onNotify,
}: {
  initialSection: SettingsSection;
  workspace: Workspace;
  user: TeamMember;
  studentCount: number;
  onSave: (workspace: Workspace, fullName: string) => Promise<void>;
  onNotify: (message: string) => void;
}) {
  const [section, setSection] = useState<SettingsSection>(initialSection);
  const [draft, setDraft] = useState(workspace);
  const [fullName, setFullName] = useState(user.name);
  const [saving, setSaving] = useState(false);
  const discard = () => {
    setDraft(workspace);
    setFullName(user.name);
    onNotify("Changes discarded");
  };
  const toggles =
    section in settingsToggles
      ? settingsToggles[section as keyof typeof settingsToggles]
      : null;
  const toggleValue = (group: string, key: string, fallback: boolean) => {
    const values = draft.settings[group];
    return values && typeof values === "object" && key in values
      ? Boolean((values as Record<string, unknown>)[key])
      : fallback;
  };
  const setToggle = (group: string, key: string, value: boolean) =>
    setDraft((current) => ({
      ...current,
      settings: {
        ...current.settings,
        [group]: {
          ...(current.settings[group] &&
          typeof current.settings[group] === "object"
            ? (current.settings[group] as Record<string, unknown>)
            : {}),
          [key]: value,
        },
      },
    }));
  const save = async () => {
    setSaving(true);
    try {
      await onSave(draft, fullName);
      onNotify("Workspace settings saved");
    } catch (error) {
      onNotify(messageOf(error) ?? "Could not save settings");
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <PageTitle
        eyebrow="WORKSPACE SETTINGS"
        title="Settings"
        text="Manage your workspace details."
      />
      <div className="settings-layout">
        <nav aria-label="Settings sections">
          {settingsSections.map((item) => (
            <button
              key={item}
              className={section === item ? "active" : ""}
              aria-current={section === item ? "page" : undefined}
              onClick={() => setSection(item)}
            >
              {item}
              <ChevronRight size={15} />
            </button>
          ))}
        </nav>
        <div className="panel settings-card">
          <div className="settings-head">
            <p className="eyebrow">{section.toUpperCase()}</p>
            <h2>
              {section === "Workspace profile"
                ? "Consultancy details"
                : section}
            </h2>
            <p>
              These settings apply to everyone in the {draft.name} workspace.
            </p>
          </div>
          {section === "Workspace profile" && (
            <>
              <div className="brand-preview">
                <span className="workspace-avatar large">
                  {draft.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <strong>{draft.name}</strong>
                  <span>
                    {draft.tagline}
                    {draft.city ? ` · ${draft.city}` : ""}
                  </span>
                </div>
              </div>
              <div className="field-grid">
                <label>
                  Workspace name
                  <input
                    value={draft.name}
                    onChange={(event) =>
                      setDraft({ ...draft, name: event.target.value })
                    }
                  />
                </label>
                <label>
                  Primary contact
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </label>
                <label>
                  Business email
                  <input
                    type="email"
                    value={draft.businessEmail}
                    onChange={(event) =>
                      setDraft({ ...draft, businessEmail: event.target.value })
                    }
                  />
                </label>
                <label>
                  Phone number
                  <input
                    type="tel"
                    value={draft.phone}
                    onChange={(event) =>
                      setDraft({ ...draft, phone: event.target.value })
                    }
                  />
                </label>
                <label>
                  City
                  <input
                    value={draft.city}
                    onChange={(event) =>
                      setDraft({ ...draft, city: event.target.value })
                    }
                  />
                </label>
                <label className="wide">
                  Student report tagline
                  <input
                    value={draft.tagline}
                    onChange={(event) =>
                      setDraft({ ...draft, tagline: event.target.value })
                    }
                  />
                </label>
              </div>
            </>
          )}
          {toggles && (
            <div className="settings-placeholder">
              <p>{toggles.intro}</p>
              {toggles.toggles.map((toggle) => (
                <label className="toggle-row" key={toggle.key}>
                  <span>
                    <strong>{toggle.title}</strong>
                    <small>{toggle.detail}</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={toggleValue(
                      toggles.group,
                      toggle.key,
                      toggle.fallback,
                    )}
                    onChange={(event) =>
                      setToggle(toggles.group, toggle.key, event.target.checked)
                    }
                  />
                </label>
              ))}
            </div>
          )}
          {section === "Subscription" && (
            <div className="plan-card">
              <div>
                <p className="eyebrow">CURRENT PLAN</p>
                <h3>
                  {draft.plan.charAt(0).toUpperCase() + draft.plan.slice(1)} ·
                  30 profiles / month
                </h3>
                <p>Workspace billing plan</p>
              </div>
              <div className="plan-usage">
                <span>
                  <b>{studentCount}</b> of 30 profiles used
                </span>
                <div className="usage-track">
                  <span
                    style={{
                      width: `${Math.min((studentCount / 30) * 100, 100)}%`,
                    }}
                  />
                </div>
                <small>
                  {Math.max(30 - studentCount, 0)} profiles remaining
                </small>
              </div>
            </div>
          )}
          {section !== "Subscription" && (
            <footer>
              <button className="secondary-button" onClick={discard}>
                Discard
              </button>
              <button
                className="primary-button"
                disabled={saving || !draft.name.trim() || !fullName.trim()}
                onClick={() => void save()}
              >
                {saving ? <span className="spinner" /> : null} Save changes
              </button>
            </footer>
          )}
        </div>
      </div>
    </>
  );
}

function StudentDrawer({
  student,
  matches,
  applications,
  onClose,
  onReview,
  onReport,
}: {
  student: Student;
  matches: MatchResult[];
  applications: Application[];
  onClose: () => void;
  onReview: () => void;
  onReport: () => void;
  onNotify: (message: string) => void;
}) {
  const [tab, setTab] = useState("Profile");
  const closeButton = useRef<HTMLButtonElement>(null);
  const academic = student.academic;
  const documentStatus: Record<string, string> = {
    pending: "Not read yet",
    processing: "Reading…",
    review: "Read by AI, awaiting review",
    verified: "Reviewed",
    failed: "Reading failed",
  };
  useEscape(onClose);
  useEffect(() => closeButton.current?.focus(), []);
  const eligible = matches.filter(
    (match) => match.status === "Eligible",
  ).length;
  const borderline = matches.filter(
    (match) => match.status === "Borderline",
  ).length;
  const notEligible = matches.filter(
    (match) => match.status === "Not eligible",
  ).length;
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside
        className="student-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-drawer-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <button
            className="drawer-close"
            ref={closeButton}
            onClick={onClose}
            aria-label="Close student profile"
          >
            <X size={19} />
          </button>
          <div className={`avatar large ${student.tone}`}>
            {student.initials}
          </div>
          <div>
            <Status text={student.stage} />
            <h2 id="student-drawer-title">{student.name}</h2>
            <p>
              {student.degree} · {student.city}
            </p>
          </div>
        </header>
        <nav role="tablist">
          {["Profile", "Matches", "Applications"].map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={tab === item}
              className={tab === item ? "active" : ""}
              onClick={() => setTab(item)}
            >
              {item}
              {item === "Matches" && <span>{matches.length}</span>}
              {item === "Applications" && <span>{applications.length}</span>}
            </button>
          ))}
        </nav>
        {tab === "Profile" && (
          <div className="drawer-content">
            <section>
              <div className="section-title">
                <div>
                  <p className="eyebrow">ACADEMIC PROFILE</p>
                  <h3>
                    {academic.confirmedAt
                      ? "Confirmed by counsellor"
                      : "Not confirmed yet"}
                  </h3>
                </div>
                <button className="text-button" onClick={onReview}>
                  <ShieldCheck size={14} />
                  {academic.confirmedAt ? "Edit profile" : "Review profile"}
                </button>
              </div>
              {!academic.confirmedAt && (
                <p className="drawer-hint">
                  Read the documents with AI, check the details, and confirm
                  before matching.
                </p>
              )}
              <div className="detail-grid">
                <span>
                  <small>Degree</small>
                  <strong>{student.degree}</strong>
                </span>
                <span>
                  <small>CGPA</small>
                  <strong>{student.cgpa}</strong>
                </span>
                <span>
                  <small>Years of education</small>
                  <strong>{academic.yearsOfEducation ?? "Not added"}</strong>
                </span>
                <span>
                  <small>English</small>
                  <strong>
                    {academic.englishOverall != null
                      ? `${academic.englishTestType ?? "Test"} ${academic.englishOverall}`
                      : academic.mediumOfInstruction
                        ? "Medium of instruction"
                        : "Not added"}
                  </strong>
                </span>
                <span>
                  <small>Graduation year</small>
                  <strong>{student.graduationYear ?? "Not added"}</strong>
                </span>
                <span>
                  <small>Institution</small>
                  <strong>{student.institution}</strong>
                </span>
              </div>
            </section>
            <section>
              <div className="section-title">
                <div>
                  <p className="eyebrow">CREDIT MAPPING</p>
                  <h3>Subject areas</h3>
                </div>
                {student.confidence != null && (
                  <span className="confidence">
                    {student.confidence}% confidence
                  </span>
                )}
              </div>
              <div className="credit-list">
                {student.credits.map((credit) => (
                  <span key={credit.id}>
                    <b>{credit.area}</b>
                    <i>
                      <em
                        style={{
                          width: `${Math.min((credit.ects / 60) * 100, 100)}%`,
                        }}
                      />
                    </i>
                    <strong
                      title={
                        credit.creditHours != null
                          ? `${credit.creditHours} credit hours`
                          : undefined
                      }
                    >
                      {Math.round(credit.ects)} ECTS
                    </strong>
                  </span>
                ))}
                {!student.credits.length && (
                  <div className="empty-state">
                    <BookOpen size={22} />
                    <strong>No credit mapping yet</strong>
                    <span>Confirmed subject credits will appear here.</span>
                  </div>
                )}
              </div>
            </section>
            <section>
              <div className="section-title">
                <div>
                  <p className="eyebrow">DOCUMENTS</p>
                  <h3>Uploaded files</h3>
                </div>
              </div>
              <div className="document-list">
                {student.documents.map((document) => (
                  <span key={document.id}>
                    <FileText size={17} />
                    <b>{document.name}</b>
                    <small>
                      {formatBytes(document.size)} ·{" "}
                      {documentStatus[document.status] ?? document.status}
                    </small>
                    {document.status === "verified" ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <CircleAlert size={16} className="doc-pending" />
                    )}
                  </span>
                ))}
                {!student.documents.length && (
                  <div className="empty-state">
                    <FileText size={22} />
                    <strong>No documents uploaded</strong>
                    <span>Documents added during intake will appear here.</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
        {tab === "Matches" && (
          <div className="drawer-content">
            <div className="drawer-summary">
              <span>
                <strong>{eligible}</strong> eligible
              </span>
              <span>
                <strong>{borderline}</strong> borderline
              </span>
              <span>
                <strong>{notEligible}</strong> not eligible
              </span>
            </div>
            {matches.slice(0, 8).map((match) => (
              <div className="drawer-match" key={match.id}>
                <CampusMark
                  university={match.university}
                  code={match.logo}
                  tone={match.tone}
                />
                <div>
                  <strong>{match.programme}</strong>
                  <small>{match.university}</small>
                </div>
                <b className={scoreTone(match.status)}>{match.score}%</b>
              </div>
            ))}
            {!matches.length && (
              <div className="empty-state">
                <Sparkles size={22} />
                <strong>No matches saved</strong>
                <span>Run matching from the Match centre.</span>
              </div>
            )}
          </div>
        )}
        {tab === "Applications" && (
          <div className="drawer-content">
            {applications.map((application) => (
              <div className="drawer-match" key={application.id}>
                <CampusMark
                  university={application.university}
                  code={application.initials}
                  tone={application.tone}
                />
                <div>
                  <strong>{application.programme}</strong>
                  <small>
                    {application.university} ·{" "}
                    {applicationStageLabels[application.stage] ??
                      application.stage}
                  </small>
                </div>
              </div>
            ))}
            {!applications.length && (
              <div className="empty-state">
                <FileCheck2 size={22} />
                <strong>No applications</strong>
                <span>
                  Applications created for this student will appear here.
                </span>
              </div>
            )}
          </div>
        )}
        <footer>
          <button
            className="secondary-button"
            disabled={!matches.length}
            onClick={onReport}
          >
            <FileText size={16} /> Shortlist report
          </button>
          {tab !== "Matches" && (
            <button
              className="primary-button"
              onClick={() => setTab("Matches")}
            >
              <Sparkles size={16} /> View matches
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}

const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const supportedDocumentTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
const documentMimeType = (file: File) => {
  if (supportedDocumentTypes.has(file.type)) return file.type;
  const extension = file.name.toLowerCase().split(".").pop();
  return extension === "pdf" ? "application/pdf" : extension === "jpg" || extension === "jpeg" ? "image/jpeg" : extension === "png" ? "image/png" : "";
};

function NewStudentWizard({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: (input: NewStudentInput) => Promise<void>;
}) {
  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [degree, setDegree] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [budget, setBudget] = useState("");
  const [english, setEnglish] = useState("");
  const [country, setCountry] = useState("Italy");
  const [intake, setIntake] = useState("Fall 2027");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const labels = ["Student", "Documents", "Academics", "Review"];
  const fullName = `${firstName} ${lastName}`.trim();
  const canContinue =
    step === 1
      ? Boolean(firstName.trim() && lastName.trim())
      : step === 2
        ? consent && files.length > 0
        : step === 3
          ? Boolean(degree.trim())
          : true;
  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const selected = Array.from(list);
    const rejected = selected.filter((file) => !documentMimeType(file) || file.size > 20 * 1024 * 1024);
    if (rejected.length) {
      setError(`${rejected.map((file) => file.name).join(", ")} ${rejected.length === 1 ? "is" : "are"} not supported. Choose PDF, JPG or PNG files up to 20MB.`);
    } else {
      setError("");
    }
    setFiles((current) => [
      ...current,
      ...selected.filter(
        (file) =>
          documentMimeType(file) &&
          file.size <= 20 * 1024 * 1024 &&
          !current.some(
            (existing) =>
              existing.name === file.name && existing.size === file.size,
          ),
      ),
    ]);
  };
  const submitStudent = async () => {
    setSubmitting(true);
    setError("");
    try {
      await onComplete({
        firstName,
        lastName,
        email,
        phone,
        city,
        degree,
        cgpa: cgpa ? Number(cgpa) : null,
        cgpaScale: 4,
        country,
        intake,
        budget: budget ? Number(budget) : null,
        englishOverall: english ? Number(english) : null,
        consent,
        files,
      });
    } catch (submitError) {
      setError(messageOf(submitError) ?? "Could not save the student.");
      setSubmitting(false);
    }
  };
  useEscape(onClose);
  return (
    <div className="modal-backdrop">
      <div
        className="wizard"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
      >
        <header>
          <div>
            <p className="eyebrow">NEW STUDENT INTAKE</p>
            <h2 id="wizard-title">
              {step === 1
                ? "Start with the basics"
                : step === 2
                  ? "Upload student documents"
                  : step === 3
                    ? "Confirm academic goals"
                    : "Ready to create the profile"}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close new student intake">
            <X size={20} />
          </button>
        </header>
        <div className="wizard-progress">
          {labels.map((label, index) => (
            <div
              key={label}
              className={step >= index + 1 ? "active" : ""}
              aria-current={step === index + 1 ? "step" : undefined}
            >
              <span>{step > index + 1 ? <Check size={13} /> : index + 1}</span>
              <small>{label}</small>
              {index < labels.length - 1 && <i />}
            </div>
          ))}
        </div>
        <div className="wizard-body">
          {step === 1 && (
            <>
              <p className="step-help">
                Create the student record. You can invite the student to
                complete missing details later.
              </p>
              <div className="field-grid">
                <label>
                  First name
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                    autoFocus
                  />
                </label>
                <label>
                  Last name
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                  />
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="student@example.com"
                  />
                </label>
                <label>
                  Phone number
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+92 300 000 0000"
                  />
                </label>
                <label>
                  Home city
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Lahore"
                  />
                </label>
                <label>
                  Assigned counsellor
                  <input value="Current account" disabled />
                </label>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <p className="step-help">
                AI will extract structured information. You’ll review every
                field before matching.
              </p>
              <input
                ref={fileInput}
                id="student-document-upload"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                hidden
                onChange={(event) => {
                  addFiles(event.target.files);
                  event.target.value = "";
                }}
              />
              <label
                htmlFor="student-document-upload"
                className={`drop-zone ${dragging ? "dragging" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  addFiles(event.dataTransfer.files);
                }}
              >
                <span>
                  <UploadCloud size={23} />
                </span>
                <strong>Drop documents here or browse</strong>
                <small>
                  Transcript, degree, IELTS · PDF, JPG, or PNG · 20MB max
                </small>
              </label>
              {files.map((file) => (
                <div className="uploaded-file" key={file.name}>
                  <FileText size={18} />
                  <span>
                    <strong>{file.name}</strong>
                    <small>{formatBytes(file.size)} · Ready to upload</small>
                  </span>
                  <CheckCircle2 size={17} />
                  <button
                    onClick={() =>
                      setFiles(files.filter((item) => item.name !== file.name))
                    }
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
              <label className="consent-box">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                />
                <span>
                  <strong>
                    I confirm the student has consented to document processing.
                  </strong>
                  <small>
                    Required for GDPR-style data handling and your consultancy’s
                    records.
                  </small>
                </span>
              </label>
              {!files.length && (
                <p className="step-hint">
                  Add at least one document to continue.
                </p>
              )}
            </>
          )}
          {step === 3 && (
            <>
              <p className="step-help">
                Set matching preferences. These can be changed at any time.
              </p>
              <div className="field-grid">
                <label>
                  Current degree
                  <input
                    value={degree}
                    onChange={(event) => setDegree(event.target.value)}
                    placeholder="BS Computer Science"
                    required
                  />
                </label>
                <label>
                  CGPA
                  <input
                    type="number"
                    min="0"
                    max="4"
                    step="0.01"
                    value={cgpa}
                    onChange={(event) => setCgpa(event.target.value)}
                    placeholder="3.42"
                  />
                </label>
                <label>
                  Target country
                  <select
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                  >
                    <option>Italy</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Hungary</option>
                  </select>
                </label>
                <label>
                  Target intake
                  <select
                    value={intake}
                    onChange={(event) => setIntake(event.target.value)}
                  >
                    <option>Fall 2027</option>
                    <option>Spring 2027</option>
                  </select>
                </label>
                <label>
                  Max. annual tuition
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    placeholder="4000"
                  />
                </label>
                <label>
                  IELTS overall
                  <input
                    type="number"
                    min="0"
                    max="9"
                    step="0.5"
                    value={english}
                    onChange={(event) => setEnglish(event.target.value)}
                    placeholder="7.0"
                  />
                </label>
              </div>
            </>
          )}
          {step === 4 && (
            <div className="review-step">
              <div className="review-icon">
                <Sparkles size={24} />
              </div>
              <h3>Everything looks ready.</h3>
              <p>
                SHAFFMINNA will create {firstName}’s profile and prepare{" "}
                {files.length} uploaded{" "}
                {files.length === 1 ? "document" : "documents"} for your review.
              </p>
              <div className="review-summary">
                <span>
                  <CheckCircle2 size={15} />
                  <b>Student details</b>
                  <small>{fullName}</small>
                </span>
                <span>
                  <CheckCircle2 size={15} />
                  <b>Consent confirmed</b>
                  <small>Recorded</small>
                </span>
                <span>
                  <CheckCircle2 size={15} />
                  <b>Matching preferences</b>
                  <small>
                    {country} · {intake}
                  </small>
                </span>
              </div>
              <div className="human-note">
                <ShieldCheck size={18} />
                <span>
                  <strong>You stay in control.</strong>
                  <small>
                    No eligibility match will run until a counsellor confirms
                    the extracted profile.
                  </small>
                </span>
              </div>
            </div>
          )}
          {error && (
            <p className="auth-message error" role="alert">
              {error}
            </p>
          )}
        </div>
        <footer>
          <button
            className="secondary-button"
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
          >
            <ArrowLeft size={16} /> {step === 1 ? "Cancel" : "Back"}
          </button>
          <button
            className="primary-button"
            disabled={!canContinue || submitting}
            onClick={
              step === 4 ? () => void submitStudent() : () => setStep(step + 1)
            }
          >
            {step === 4 ? (
              <>
                {submitting ? (
                  <span className="spinner" />
                ) : (
                  <Check size={16} />
                )}{" "}
                {submitting ? "Saving…" : "Create student profile"}
              </>
            ) : (
              <>
                Continue <ArrowRight size={16} />
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  const configured = isSupabaseConfigured();
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(configured);

  useEffect(() => {
    if (!configured) return;
    const supabase = createSupabaseClient();
    void supabase.auth.getUser().then(({ data }) => {
      setAuthenticated(Boolean(data.user));
      setCheckingSession(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(Boolean(session?.user));
    });
    return () => data.subscription.unsubscribe();
  }, [configured]);

  const logout = () => {
    if (configured) void createSupabaseClient().auth.signOut();
    setAuthenticated(false);
  };

  if (checkingSession)
    return (
      <main className="loading-screen">
        <Brand />
        <span className="spinner dark" />
      </main>
    );
  return authenticated ? (
    <AppShell onLogout={logout} />
  ) : (
    <LoginScreen onLogin={() => setAuthenticated(true)} />
  );
}
