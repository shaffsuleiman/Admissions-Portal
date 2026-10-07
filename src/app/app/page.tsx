"use client";

import {
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import bolognaPhoto from "../../../public/images/campus/bologna.jpg";
import milanPhoto from "../../../public/images/campus/milan.jpg";
import paduaPhoto from "../../../public/images/campus/padua.jpg";
import pisaPhoto from "../../../public/images/campus/pisa.jpg";
import romePhoto from "../../../public/images/campus/rome.jpg";
import turinPhoto from "../../../public/images/campus/turin.jpg";
import venicePhoto from "../../../public/images/campus/venice.jpg";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ProfileReview } from "@/components/ProfileReview";
import { ProgrammeEditor } from "@/components/ProgrammeEditor";
import { ShortlistReport } from "@/components/ShortlistReport";
import { DEFAULT_CONVERSION, hasEligibilityRules, studentEctsRatio } from "@/lib/matching/engine";
import {
  createApplicationFromMatch,
  aiReviewProgramme,
  completeOnboarding,
  createDeadline,
  deleteStudent,
  messageOf,
  createStudent,
  draftProgrammeRules,
  extractDocument,
  loadWorkspaceData,
  createWorkspace,
  inviteMember,
  invitePreview,
  removeMember,
  revokeInvite,
  setMemberRole,
  researchStudentMatches,
  runStudentMatch,
  saveConfirmedProfile,
  saveProgramme,
  saveUniversityConversion,
  setDeadlineCompleted,
  updateApplicationStage,
  updateWorkspaceProfile,
  type ActivityItem,
  type Application,
  type PendingInvite,
  type WorkspaceSummary,
  type DeadlineItem,
  type LiveResearchMatch,
  type LiveResearchResult,
  type MatchResult,
  type NewDeadlineInput,
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
  ChevronsUpDown,
  CircleAlert,
  CircleHelp,
  Clock3,
  Download,
  Earth,
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
  ListChecks,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  PartyPopper,
  Plane,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
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

const viewSlugs: Record<View, string> = {
  Overview: "overview",
  Students: "students",
  Matches: "matches",
  Programmes: "programmes",
  Applications: "applications",
  Calendar: "calendar",
  Reports: "reports",
  Team: "team",
  Settings: "settings",
};

const viewFromSlug = (value: string | null): View =>
  ((Object.entries(viewSlugs).find(([, slug]) => slug === value)?.[0] as View) ??
    "Overview");

const TODAY = new Date();

const isoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  // The byte-order mark makes Excel read the file as UTF-8, so accented names survive.
  const url = URL.createObjectURL(
    new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });
  link.click();
  URL.revokeObjectURL(url);
}

/** Course-by-course credit sheet: subject area, credit hours, grade and ECTS at the student's own ratio. */
function exportCreditSheet(student: Student) {
  const ratio = studentEctsRatio(student.academic);
  const perHour = ratio?.ratio ?? DEFAULT_CONVERSION.ectsPerCreditHour;
  const round = (value: number) => Math.round(value * 10) / 10;
  const rows: (string | number)[][] = [
    ["Student", student.name],
    ["Degree", student.academic.degreeTitle || student.degree],
    ["Total credit hours", student.academic.totalCreditHours ?? ""],
    [
      "ECTS per credit hour",
      ratio
        ? `${perHour.toFixed(2)} (${ratio.degreeEcts} ECTS / ${ratio.totalCreditHours} credit hours)`
        : `${perHour} (standard rate; add years of education and total credit hours for the student's own ratio)`,
    ],
    [],
    ["Subject area", "Course", "Credit hours", "Grade", "ECTS"],
  ];
  for (const credit of student.credits) {
    for (const course of credit.courses) {
      rows.push([
        credit.area,
        course.title,
        course.creditHours ?? "",
        course.grade,
        course.creditHours != null ? round(course.creditHours * perHour) : "",
      ]);
    }
    const hours = credit.creditHours ?? credit.courses.reduce((sum, course) => sum + (course.creditHours ?? 0), 0);
    rows.push([`${credit.area} total`, "", round(hours), "", round(hours * perHour)]);
  }
  const fileName = student.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  downloadCsv(`credit-sheet-${fileName || "student"}.csv`, rows);
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
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <polyline points="12,46 21,22 31,38 52,14" />
        </svg>
      </div>
      <div>
        <strong>MatchED</strong>
        <small>ADMISSIONS OS</small>
      </div>
    </div>
  );
}

const campusPhotos: { match: RegExp; photo: StaticImageData; place: string; credit?: string }[] =
  [
    { match: /padua|padova/i, photo: paduaPhoto, place: "Palazzo Bo, Padua", credit: "Didier Descouens, CC BY-SA 4.0" },
    { match: /bologna/i, photo: bolognaPhoto, place: "Archiginnasio, Bologna", credit: "Wwikiwalter, CC BY-SA 4.0" },
    {
      match: /torino|turin/i,
      photo: turinPhoto,
      place: "Castello del Valentino, Turin",
    },
    { match: /milan|milano/i, photo: milanPhoto, place: "Ca’ Granda, Milan" },
    { match: /pisa/i, photo: pisaPhoto, place: "Palazzo della Sapienza, Pisa" },
    {
      match: /sapienza/i,
      photo: romePhoto,
      place: "Sapienza University main campus, Rome",
    },
    {
      match: /venice|venezia|foscari/i,
      photo: venicePhoto,
      place: "Ca’ Foscari, Venice",
      credit: "Freddo213, CC BY-SA 4.0",
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
      <Image src={campus.photo} alt={campus.place} fill sizes="64px" placeholder="blur" />
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
  const [invite, setInvite] = useState<Awaited<ReturnType<typeof invitePreview>>>(null);
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

  // An invitation link (/app?invite=…) prefills the invited email and opens that workspace after sign-in.
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("invite");
    if (!token || !configured) return;
    void invitePreview(token).then((preview) => {
      if (!preview) {
        setMessage({ text: "This invitation has expired or was revoked. Ask the person who invited you for a new link.", tone: "error" });
        return;
      }
      setInvite(preview);
      setEmail(preview.email);
      setMode("signup");
      try {
        sessionStorage.setItem(INVITED_WORKSPACE_KEY, preview.workspaceId);
      } catch {
        // Private browsing: the invited workspace is still in the switcher.
      }
    });
  }, [configured]);

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
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/app?recovery=1")}`,
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
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/app`,
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
        <Link href="/" className="auth-home-link" aria-label="MatchED website">
          <Brand light />
        </Link>
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
          <Link href="/" className="auth-home-link" aria-label="MatchED website">
            <Brand />
          </Link>
        </div>
        <div className="auth-box">
          {invite && (
            <p className="invite-banner">
              <Users size={16} aria-hidden="true" />
              <span>
                You’ve been invited to join <b>{invite.workspaceName}</b> as{" "}
                {(ROLE_LABELS[invite.role] ?? invite.role).toLowerCase()}.{" "}
                {signingUp ? "Create your account with this email, or sign in if you already have one." : "Sign in with the invited email to join."}
              </span>
            </p>
          )}
          <h2>
            {invite && signingUp
              ? `Join ${invite.workspaceName}`
              : signingUp
                ? "Create your workspace"
                : "Sign in to your workspace"}
          </h2>
          <p className="muted">
            {invite && signingUp
              ? "Set a password to accept the invitation."
              : signingUp
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
                {!invite && (
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
                )}
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
                New to MatchED?{" "}
                <button onClick={() => switchMode("signup")}>
                  Create a workspace
                </button>
              </>
            )}
          </p>
          {configured ? (
            <p className="demo-notice connected">
              <ShieldCheck size={13} /> Secure sign-in · connected to your
              MatchED workspace
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

function ResetPasswordScreen({ onComplete, onCancel }: { onComplete: () => void; onCancel: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The passwords do not match.");
    setLoading(true);
    const { error: updateError } = await createSupabaseClient().auth.updateUser({ password });
    setLoading(false);
    if (updateError) return setError(authErrorMessage(updateError));
    window.history.replaceState({}, "", "/app");
    onComplete();
  };

  return (
    <main className="auth-page">
      <section className="auth-story">
        <Image src={venicePhoto} alt="Ca’ Foscari University on the Grand Canal, Venice" className="auth-story-photo" fill preload sizes="(max-width: 820px) 100vw, 55vw" />
        <div className="auth-story-veil" />
        <Brand light />
        <div className="story-copy">
          <h1>Choose a new <em>secure password.</em></h1>
          <p>Your recovery link has been verified. Set the password you’ll use for your MatchED workspace.</p>
        </div>
      </section>
      <section className="auth-panel">
        <div className="mobile-brand"><Brand /></div>
        <div className="auth-box">
          <h2>Set a new password</h2>
          <p className="muted">Use at least eight characters and avoid reusing an old password.</p>
          <form onSubmit={submit}>
            <label>
              New password
              <div className="input-wrap">
                <LockKeyhole size={17} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            <label>
              Confirm password
              <div className="input-wrap">
                <LockKeyhole size={17} />
                <input type={showPassword ? "text" : "password"} value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" minLength={8} required />
              </div>
            </label>
            {error && <p className="auth-message error" role="alert">{error}</p>}
            <button className="login-button" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : <>Save new password <ArrowRight size={17} /></>}
            </button>
          </form>
          <p className="auth-switch"><button onClick={onCancel}>Cancel and sign out</button></p>
        </div>
      </section>
    </main>
  );
}

const quickStartSteps = [
  {
    icon: UserPlus,
    target: '[data-tour="students-nav"]',
    title: "Start with a student profile",
    text: "Keep academic history, target intake, budget and every supporting document together in one reviewable profile.",
    detail: "Open Students, then choose Add student",
  },
  {
    icon: BookOpen,
    target: '[data-tour="programmes-nav"]',
    title: "Work from trusted programme data",
    text: "Browse the Italian catalogue, inspect source freshness and review admission rules before they become eligible for matching.",
    detail: "Only evidence-backed rules enter the matcher",
  },
  {
    icon: Sparkles,
    target: '[data-tour="matches-nav"]',
    title: "See explainable matches",
    text: "Every result shows the academic checks, missing evidence and fit signals behind the recommendation.",
    detail: "Green, amber and red checks make decisions auditable",
  },
  {
    icon: FileCheck2,
    target: '[data-tour="applications-nav"]',
    title: "Move from shortlist to enrolment",
    text: "Turn a suitable match into an application and keep university, document, pre-enrolment and visa stages visible.",
    detail: "Applications and Calendar keep the whole team aligned",
  },
] as const;

type TourRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type TourPlacement = "above" | "below" | "left" | "right";

function QuickStartTutorial({
  onClose,
  onStart,
}: {
  onClose: () => Promise<void>;
  onStart: () => Promise<void>;
}) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<TourRect | null>(null);
  const [cardPosition, setCardPosition] = useState({ left: 24, top: 24 });
  const [placement, setPlacement] = useState<TourPlacement>("right");
  const [arrowOffset, setArrowOffset] = useState(38);
  const cardRef = useRef<HTMLElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const current = quickStartSteps[step];
  const Icon = current.icon;
  const last = step === quickStartSteps.length - 1;
  useEscape(() => void onClose());

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    nextButtonRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, []);

  useEffect(() => {
    const target = document.querySelector<HTMLElement>(current.target);
    if (!target) {
      return;
    }

    const updatePosition = () => {
      const bounds = target.getBoundingClientRect();
      const padding = 8;
      const rect = {
        height: bounds.height + padding * 2,
        left: Math.max(8, bounds.left - padding),
        top: Math.max(8, bounds.top - padding),
        width: bounds.width + padding * 2,
      };
      setTargetRect(rect);

      const viewportPadding = 16;
      const gap = 20;
      const cardWidth = Math.min(390, window.innerWidth - viewportPadding * 2);
      const cardHeight = cardRef.current?.offsetHeight ?? 340;
      const rightSpace = window.innerWidth - (rect.left + rect.width);
      const leftSpace = rect.left;
      const belowSpace = window.innerHeight - (rect.top + rect.height);

      let nextPlacement: TourPlacement;
      let left: number;
      let top: number;
      if (rightSpace >= cardWidth + gap) {
        nextPlacement = "right";
        left = rect.left + rect.width + gap;
        top = rect.top + rect.height / 2 - cardHeight / 2;
      } else if (leftSpace >= cardWidth + gap) {
        nextPlacement = "left";
        left = rect.left - cardWidth - gap;
        top = rect.top + rect.height / 2 - cardHeight / 2;
      } else if (belowSpace >= cardHeight + gap) {
        nextPlacement = "below";
        left = rect.left + rect.width / 2 - cardWidth / 2;
        top = rect.top + rect.height + gap;
      } else {
        nextPlacement = "above";
        left = rect.left + rect.width / 2 - cardWidth / 2;
        top = rect.top - cardHeight - gap;
      }

      const finalLeft = Math.min(
        Math.max(viewportPadding, left),
        Math.max(viewportPadding, window.innerWidth - cardWidth - viewportPadding),
      );
      const finalTop = Math.min(
        Math.max(viewportPadding, top),
        Math.max(viewportPadding, window.innerHeight - cardHeight - viewportPadding),
      );
      const verticalArrow = nextPlacement === "left" || nextPlacement === "right";
      const desiredArrowOffset = verticalArrow
        ? rect.top + rect.height / 2 - finalTop - 9
        : rect.left + rect.width / 2 - finalLeft - 9;
      const arrowLimit = Math.max(
        24,
        (verticalArrow ? cardHeight : cardWidth) - 42,
      );

      setPlacement(nextPlacement);
      setCardPosition({
        left: finalLeft,
        top: finalTop,
      });
      setArrowOffset(Math.min(Math.max(24, desiredArrowOffset), arrowLimit));
    };

    updatePosition();
    const settledTimer = window.setTimeout(updatePosition, 280);
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(target);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.clearTimeout(settledTimer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [current.target, step]);

  const onDialogKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight" && !last) setStep(step + 1);
    if (event.key === "ArrowLeft" && step > 0) setStep(step - 1);
    if (event.key !== "Tab" || !cardRef.current) return;
    const focusable = Array.from(
      cardRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const final = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      final.focus();
    } else if (!event.shiftKey && document.activeElement === final) {
      event.preventDefault();
      first.focus();
    }
  };

  const spotlightStyle = targetRect
    ? ({
        "--tour-height": `${targetRect.height}px`,
        "--tour-left": `${targetRect.left}px`,
        "--tour-top": `${targetRect.top}px`,
        "--tour-width": `${targetRect.width}px`,
      } as CSSProperties)
    : undefined;

  return (
    <div className="tour-layer">
      <div className="tour-click-shield" aria-hidden="true" />
      <div
        className={`tour-spotlight ${targetRect ? "ready" : ""}`}
        style={spotlightStyle}
        aria-hidden="true"
      />
      <section
        ref={cardRef}
        className="tour-card"
        data-placement={placement}
        style={
          {
            "--tour-arrow-offset": `${arrowOffset}px`,
            left: cardPosition.left,
            top: cardPosition.top,
          } as CSSProperties
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-start-title"
        aria-describedby="quick-start-description"
        onKeyDown={onDialogKeyDown}
      >
        <div className="tour-card-body">
          <div className="tour-card-heading">
            <span className="tour-icon" aria-hidden="true"><Icon size={18} /></span>
            <span>QUICK START</span>
            <button onClick={() => void onClose()} aria-label="Close quick-start tour">
              <X size={17} />
            </button>
          </div>
          <div className="tour-copy">
            <h2 id="quick-start-title">{current.title}</h2>
            <p id="quick-start-description">{current.text}</p>
            <div className="tour-tip">
              <Zap size={15} /> <span>{current.detail}</span>
            </div>
          </div>
          <div className="tour-progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${(step + 1) / quickStartSteps.length})` }} />
          </div>
          <footer className="tour-footer">
            <div className="tour-navigation">
              <button
                className="secondary-button"
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
              >
                Previous
              </button>
              <span role="status" aria-live="polite">
                {step + 1} of {quickStartSteps.length}
              </span>
              <button
                ref={nextButtonRef}
                className="primary-button"
                onClick={() => last ? void onStart() : setStep(step + 1)}
              >
                {last ? "Add student" : "Next"} <ArrowRight size={15} />
              </button>
            </div>
            <button className="tour-skip" onClick={() => void onClose()}>
              Skip tour
            </button>
          </footer>
        </div>
      </section>
    </div>
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
  const [autoReadStudentId, setAutoReadStudentId] = useState("");
  const [reportStudentId, setReportStudentId] = useState("");
  const [editingProgramme, setEditingProgramme] = useState<
    Programme | "new" | null
  >(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const tutorialPrompted = useRef(false);
  const toastTimer = useRef<number | undefined>(undefined);
  const searchInput = useRef<HTMLInputElement>(null);

  const openTutorial = useCallback(() => {
    setTutorialOpen(true);
    if (window.matchMedia("(max-width: 820px)").matches) {
      setSidebarOpen(true);
    }
  }, []);

  const refresh = useCallback(async () => {
    setDataError("");
    try {
      setData(await loadWorkspaceData());
      return true;
    } catch (error) {
      setDataError(messageOf(error) ?? "Could not load your workspace.");
      return false;
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let invited: string | undefined;
    try {
      invited = sessionStorage.getItem(INVITED_WORKSPACE_KEY) ?? undefined;
      sessionStorage.removeItem(INVITED_WORKSPACE_KEY);
    } catch {
      invited = undefined;
    }
    if (new URLSearchParams(window.location.search).has("invite"))
      window.history.replaceState({}, "", "/app");
    void loadWorkspaceData(invited)
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

  useEffect(() => {
    const syncViewFromUrl = () =>
      setView(viewFromSlug(new URLSearchParams(window.location.search).get("view")));
    syncViewFromUrl();
    window.addEventListener("popstate", syncViewFromUrl);
    return () => window.removeEventListener("popstate", syncViewFromUrl);
  }, []);

  useEffect(() => {
    if (data && !data.onboardingComplete && !tutorialPrompted.current) {
      tutorialPrompted.current = true;
      const frame = window.requestAnimationFrame(() => {
        setTutorialOpen(true);
        if (window.matchMedia("(max-width: 820px)").matches) {
          setSidebarOpen(true);
        }
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, [data]);

  const notify = (message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  };
  const navigate = (next: View) => {
    setView(next);
    setSidebarOpen(false);
    const url = new URL(window.location.href);
    if (next === "Overview") url.searchParams.delete("view");
    else url.searchParams.set("view", viewSlugs[next]);
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
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
      const target = event.target as HTMLElement | null;
      const enteringText =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (event.key === "?" && !enteringText && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        openTutorial();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openTutorial]);

  useEffect(() => {
    const workspaceId = data?.workspace.id;
    if (!workspaceId) return;
    const sync = async () => {
      if (document.visibilityState === "hidden" || !navigator.onLine) return;
      await refresh();
    };
    const onFocus = () => void sync();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void sync();
    };
    const onOnline = () => void sync();
    const interval = window.setInterval(() => void sync(), 15_000);
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [data?.workspace.id, refresh]);

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
    workspaces,
    invites,
    activity,
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
  const planLimit = PLAN_LIMITS[workspace.plan] ?? null;
  const monthStart = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1).getTime();
  const profilesThisMonth = students.filter((student) => Date.parse(student.createdAt) >= monthStart).length;
  const switchWorkspace = async (workspaceId: string) => {
    if (workspaceId === workspace.id) return;
    setLoadingData(true);
    try {
      const next = await loadWorkspaceData(workspaceId);
      setData(next);
      navigate("Overview");
      notify(`Switched to ${next.workspace.name}`);
    } catch (error) {
      notify(messageOf(error) ?? "Could not open that workspace");
    } finally {
      setLoadingData(false);
    }
  };
  const addWorkspace = async (name: string) => {
    const workspaceId = await createWorkspace(name);
    setData(await loadWorkspaceData(workspaceId));
    navigate("Overview");
    notify(`${name.trim()} is ready`);
  };

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
        <WorkspaceSwitcher
          current={workspace}
          workspaces={workspaces}
          onSwitch={switchWorkspace}
          onCreate={addWorkspace}
        />
        <nav aria-label="Main">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map(({ label, icon: Icon }) => (
                <button
                  className={view === label ? "active" : ""}
                  aria-current={view === label ? "page" : undefined}
                  data-tour={`${viewSlugs[label]}-nav`}
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
          {workspace.plan !== "enterprise" && (
            <div className="grow-card">
              <span className="grow-globe" aria-hidden="true">
                <Earth size={26} />
              </span>
              <strong>Expand global opportunities</strong>
              <small>Guide more students to incredible futures.</small>
              <button onClick={() => openSettings("Subscription")}>
                Upgrade plan <ArrowRight size={13} />
              </button>
            </div>
          )}
          <div className="usage-card">
            <div>
              <span>MONTHLY PROFILES</span>
              <strong>
                {profilesThisMonth}{" "}
                <small>{planLimit == null ? "added this month" : `/ ${planLimit} this month`}</small>
              </strong>
            </div>
            <div className="usage-track">
              <span
                style={{
                  width: planLimit == null ? "100%" : `${Math.min((profilesThisMonth / planLimit) * 100, 100)}%`,
                }}
              />
            </div>
            <button onClick={() => openSettings("Subscription")}>
              View plan <ArrowRight size={13} />
            </button>
          </div>
          <AccountMenu
            user={currentUser}
            onSettings={() => openSettings("Workspace profile")}
            onHelp={openTutorial}
            onLogout={onLogout}
          />
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
            <button
              className="help-button"
              aria-label="Open quick-start tutorial"
              aria-haspopup="dialog"
              aria-expanded={tutorialOpen}
              aria-keyshortcuts="?"
              data-tour="help-button"
              onClick={openTutorial}
            >
              <CircleHelp size={18} />
              <span>Help &amp; tour</span>
              <kbd>?</kbd>
            </button>
            <NotificationsMenu
              workspace={workspace}
              deadlines={deadlines}
              students={students}
              onOpenCalendar={() => navigate("Calendar")}
              onOpenStudent={(student) => setSelectedStudent(student)}
            />
            <div
              className={`top-avatar avatar ${currentUser.tone}`}
              aria-hidden="true"
            >
              {currentUser.initials}
            </div>
          </div>
        </header>
        <div className="page-wrap">
          {currentUser.role === "viewer" && (
            <p className="viewer-notice" role="status">
              <Eye size={15} aria-hidden="true" /> You have view-only access to {workspace.name}. Ask an admin if you need to make changes.
            </p>
          )}
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
              universities={universities}
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
              onAiReview={(programme) => aiReviewProgramme(programme.id)}
              onReviewBatchDone={async () => {
                await refresh();
              }}
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
          {view === "Calendar" && (
            <CalendarView
              deadlines={deadlines}
              students={students}
              onCreate={async (input) => {
                await createDeadline(workspace.id, input);
                await refresh();
              }}
              onToggle={async (deadline, completed) => {
                await setDeadlineCompleted(workspace.id, deadline.id, completed);
                await refresh();
              }}
              onNotify={notify}
            />
          )}
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
            <TeamView
              team={team}
              workspace={workspace}
              currentUser={currentUser}
              invites={invites}
              activity={activity}
              onChanged={refresh}
              onNotify={notify}
            />
          )}
          {view === "Settings" && (
            <SettingsView
              key={settingsSection}
              initialSection={settingsSection}
              workspace={workspace}
              user={currentUser}
              studentCount={profilesThisMonth}
              programmeCount={programmes.length}
              universityCount={new Set(programmes.map((programme) => programme.universityId ?? programme.university)).size}
              onExport={() => exportStudents(students, notify)}
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
            // Straight into review and automatically read every uploaded document.
            if (input.files.length) {
              setAutoReadStudentId(studentId);
              setReviewStudentId(studentId);
            }
          }}
        />
      )}
      {tutorialOpen && (
        <QuickStartTutorial
          onClose={async () => {
            setTutorialOpen(false);
            setSidebarOpen(false);
            if (!data.onboardingComplete) {
              try {
                await completeOnboarding();
                setData((current) =>
                  current ? { ...current, onboardingComplete: true } : current,
                );
              } catch (error) {
                notify(messageOf(error) ?? "Could not save tutorial progress");
              }
            }
          }}
          onStart={async () => {
            setTutorialOpen(false);
            navigate("Students");
            setNewStudent(true);
            if (!data.onboardingComplete) {
              try {
                await completeOnboarding();
                setData((current) =>
                  current ? { ...current, onboardingComplete: true } : current,
                );
              } catch (error) {
                notify(messageOf(error) ?? "Could not save tutorial progress");
              }
            }
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
          onDelete={async () => {
            await deleteStudent(workspace.id, drawerStudent.id);
            setSelectedStudent(null);
            setReviewStudentId("");
            setReportStudentId("");
            await refresh();
            notify(`${drawerStudent.name} was permanently deleted`);
          }}
          onNotify={notify}
        />
      )}
      {reviewStudent && (
        <ProfileReview
          key={`review-${reviewStudent.id}`}
          student={reviewStudent}
          autoRead={autoReadStudentId === reviewStudent.id}
          onClose={() => {
            setReviewStudentId("");
            setAutoReadStudentId("");
          }}
          onRead={async (documentId) => {
            const extraction = await extractDocument(documentId);
            void refresh();
            return extraction;
          }}
          onSave={async (input) => {
            await saveConfirmedProfile(workspace.id, reviewStudent.id, input);
            let resultMessage = `${reviewStudent.name.split(" ")[0]}’s profile confirmed.`;
            try {
              const count = await runStudentMatch(workspace.id, reviewStudent.id);
              resultMessage += ` ${count} programmes matched.`;
            } catch (caught) {
              resultMessage += ` Matching is waiting: ${messageOf(caught) ?? "no reviewed programmes are available yet"}`;
            }
            await refresh();
            setReviewStudentId("");
            setAutoReadStudentId("");
            notify(resultMessage);
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
              input.status === "ai_reviewed"
                ? `${input.programme} published as AI-reviewed`
                : input.status === "verified"
                  ? `${input.programme} verified`
                  : `${input.programme} saved as a draft`,
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
                  "Eligibility score",
                  "Preference fit",
                  "Tuition",
                  "Deadline",
                  "Rule review",
                  "Checks",
                  "Source",
                ],
                ...rows.map((m) => [
                  m.programme,
                  m.university,
                  m.city,
                  m.status,
                  m.score,
                  m.eligibilityScore,
                  m.fitScore ?? "Not scored",
                  m.fee,
                  m.deadline,
                  `${m.programmeVerified ? "Human verified" : "AI reviewed"} ${m.verified}`,
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
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-title">
      <div>
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
    });
  const firstName = user.name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const capitalisedName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : "";
  // A different campus greets the team each day; the circles use two other campuses.
  const heroCampus = campusPhotos[new Date().getDate() % campusPhotos.length];
  const orbitCampuses = campusPhotos.filter((campus) => campus !== heroCampus && !campus.credit).slice(0, 2);
  const [placeName, placeCity] = heroCampus.place.split(", ");
  const activeStudents = students.filter((student) => student.status !== "archived");
  const eligible = matches.filter((match) => match.status === "Eligible");
  const overdue = deadlines.filter(
    (deadline) => !deadline.completedAt && daysUntil(deadline.dueAt) < 0,
  ).length;
  const recentStudents = [...students]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 3);
  const reviewRows = attentionStudents.length ? attentionStudents : recentStudents;
  const newThisMonth = (timestamps: string[]) => countSince(timestamps, 30);
  return (
    <>
      <header className="lively-hero">
        <div className="lively-hero-copy">
          <p className="lively-dateline">
            <time>{dateLabel}</time>
          </p>
          <h1>
            {greeting}
            {capitalisedName ? (
              <>
                , <em>{capitalisedName}</em>
              </>
            ) : null}
            .
          </h1>
          <p>
            Here’s what needs your attention across your workspace today, and the next steps to
            keep your students moving forward.
          </p>
          <div className="lively-actions">
            <button
              className="secondary-button"
              onClick={() => exportStudents(students, onNotify)}
            >
              <Download size={16} /> Export
            </button>
            <button className="primary-button" onClick={onNew}>
              <Plus size={17} /> Add new student
            </button>
          </div>
        </div>
        <div className="lively-collage" aria-hidden="true">
          <div className="lively-collage-main">
            <Image
              src={heroCampus.photo}
              alt=""
              fill
              preload
              placeholder="blur"
              sizes="(max-width: 820px) 100vw, 640px"
            />
          </div>
          {orbitCampuses.map((campus, index) => (
            <span key={campus.place} className={`lively-orbit lively-orbit-${index + 1}`}>
              <Image src={campus.photo} alt="" fill placeholder="blur" sizes="150px" />
            </span>
          ))}
          <p className="lively-note">
            Students today,
            <br />
            global citizens tomorrow.
          </p>
          <svg className="lively-flight" viewBox="0 0 170 80" fill="none">
            <path d="M4 74 C 54 72, 98 52, 160 12" />
          </svg>
          <Plane className="lively-plane" size={20} />
        </div>
        <span className="lively-place">
          <MapPin size={15} />
          <span>
            <b>{placeName}</b>
            <small>{placeCity ? `${placeCity}, Italy` : "Italy"}</small>
          </span>
        </span>
        {heroCampus.credit ? <small className="lively-credit">Photo: {heroCampus.credit}</small> : null}
      </header>

      <section className="live-metrics" aria-label="Workspace at a glance">
        <LiveMetric
          icon={<Users size={20} />}
          tone="lavender"
          label="Active students"
          value={activeStudents.length}
          added={newThisMonth(activeStudents.map((student) => student.createdAt))}
          spark={dailyTotals(activeStudents.map((student) => student.createdAt), 30)}
          meta={`${attentionStudents.length} ${attentionStudents.length === 1 ? "needs" : "need"} review`}
        />
        <LiveMetric
          icon={<BookOpen size={20} />}
          tone="peach"
          label="Eligible matches"
          value={eligible.length}
          added={newThisMonth(eligible.map((match) => match.generatedAt))}
          spark={dailyTotals(eligible.map((match) => match.generatedAt), 30)}
          meta={`${plural(matches.length, "programme")} checked`}
        />
        <LiveMetric
          icon={<CalendarDays size={20} />}
          tone="rose"
          label="Due this week"
          value={dueThisWeek}
          chip={
            overdue
              ? { text: `${overdue} overdue`, tone: "down" }
              : { text: "On track", tone: "up" }
          }
          spark={upcomingPerDay(openDeadlines.map((deadline) => deadline.dueAt), 14).reduce<number[]>(
            (running, count) => [...running, (running.at(-1) ?? 0) + count],
            [],
          )}
          meta={`${openDeadlines.length} upcoming`}
        />
        <LiveMetric
          icon={<FileText size={20} />}
          tone="mint"
          label="Applications live"
          value={liveApplications.length}
          added={newThisMonth(applications.map((application) => application.createdAt))}
          spark={dailyTotals(applications.map((application) => application.createdAt), 30)}
          meta={`Across ${plural(new Set(liveApplications.map((application) => application.studentId)).size, "student")}`}
        />
      </section>

      <section className="lively-grid">
        <div className="panel lively-focus">
          <div className="panel-head">
            <div>
              <h2>
                {attentionStudents.length ? (
                  `${plural(attentionStudents.length, "profile")} ${attentionStudents.length === 1 ? "needs" : "need"} your review`
                ) : (
                  <>
                    You’re caught up <PartyPopper className="lively-cheer" size={22} aria-hidden="true" />
                  </>
                )}
              </h2>
              <p className="panel-sub">
                {attentionStudents.length
                  ? "Confirm these profiles so their matches can run."
                  : students.length
                    ? "No pending profile reviews. Your newest students are below."
                    : "Add your first student to see them here."}
              </p>
            </div>
            <button className="text-button" onClick={() => onNavigate("Students")}>
              View queue <ArrowRight size={14} />
            </button>
          </div>
          <div className="lively-focus-body">
            <div className="lively-people">
              {reviewRows.map((student) => {
                const isNew = TODAY.getTime() - Date.parse(student.createdAt) < 2 * DAY_MS;
                return (
                  <button
                    key={student.id}
                    className="lively-person"
                    onClick={() => onStudent(student)}
                  >
                    <span className={`avatar ${student.tone}`}>{student.initials}</span>
                    <span className="lively-person-text">
                      <strong>
                        {student.name}
                        {isNew ? <i className="lively-new">New</i> : null}
                      </strong>
                      <small>
                        {attentionStudents.length ? "Profile submitted" : student.degree} ·{" "}
                        {student.updated}
                      </small>
                    </span>
                    <span className="lively-review">
                      {attentionStudents.length ? "Review" : "Open"} <ArrowRight size={13} />
                    </span>
                  </button>
                );
              })}
              {!reviewRows.length && (
                <div className="empty-state">
                  <UserPlus size={24} />
                  <strong>No students yet</strong>
                  <span>Add a student to start matching.</span>
                </div>
              )}
            </div>
            <div className="lively-art" aria-hidden="true">
              <span className="lively-art-blob" />
              <span className="lively-art-card">
                <GraduationCap size={30} />
              </span>
              <span className="lively-art-check">
                <Check size={20} />
              </span>
              <p className="lively-note lively-art-note">
                Different students.
                <br />
                Brighter destinations.
              </p>
            </div>
          </div>
        </div>

        <ProgressChart students={students} matches={matches} applications={applications} />

        <div className="panel lively-deadlines">
          <div className="panel-head">
            <div>
              <h2>
                <CalendarDays size={20} aria-hidden="true" /> Upcoming deadlines
              </h2>
            </div>
            <button className="text-button" onClick={() => onNavigate("Calendar")}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="lively-deadline-list">
            {openDeadlines.slice(0, 4).map((deadline) => {
              const due = new Date(deadline.dueAt);
              const days = daysUntil(deadline.dueAt);
              return (
                <button
                  key={deadline.id}
                  className={`lively-deadline ${days <= 7 ? "is-soon" : ""}`}
                  onClick={() => onNavigate("Calendar")}
                >
                  <span className="lively-date">
                    <small>{due.toLocaleDateString("en-GB", { month: "short" })}</small>
                    <b>{due.getDate()}</b>
                  </span>
                  <span className="lively-deadline-text">
                    <strong>{deadline.university || deadline.title}</strong>
                    <small>
                      {deadline.university ? deadline.title : deadline.type.replaceAll("_", " ")}
                    </small>
                    <small>
                      {[deadline.studentName, days === 0 ? "Today" : `in ${plural(days, "day")}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </small>
                  </span>
                  <ChevronRight size={16} />
                </button>
              );
            })}
            {!openDeadlines.length && (
              <div className="empty-state">
                <CalendarDays size={24} />
                <strong>No upcoming deadlines</strong>
                <span>Deadlines you add from applications will appear here.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="dashboard-grid lower-grid">
        <div className="panel recommended-panel">
          <div className="panel-head">
            <div>
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
                <b className={scoreTone(match.status)}>{statusLabel(match.status)}</b>
                <span>
                  {requirementSummary(match.checks).met} of {requirementSummary(match.checks).total} rules
                </span>
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
          <h2>
            {students.length} student{" "}
            {students.length === 1 ? "profile" : "profiles"} in one secure
            place.
          </h2>
          <p>
            {plural(applications.length, "application")} and{" "}
            {plural(deadlines.length, "deadline")}{" "}
            {applications.length + deadlines.length === 1 ? "is" : "are"} currently tracked.
          </p>
          <button onClick={() => onNavigate("Reports")}>
            See workspace report <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </>
  );
}

const DAY_MS = 86_400_000;

/** Running total at the end of each of the last `days` days. */
function dailyTotals(timestamps: string[], days: number) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const times = timestamps
    .map((value) => Date.parse(value))
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => a - b);
  return Array.from({ length: days }, (_, index) => {
    const cutoff = end.getTime() - (days - 1 - index) * DAY_MS;
    let count = 0;
    for (const time of times) {
      if (time > cutoff) break;
      count += 1;
    }
    return count;
  });
}

/** How many items fall due on each of the next `days` days. */
function upcomingPerDay(timestamps: string[], days: number) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const counts = Array.from({ length: days }, () => 0);
  for (const value of timestamps) {
    const index = Math.floor((Date.parse(value) - start.getTime()) / DAY_MS);
    if (index >= 0 && index < days) counts[index] += 1;
  }
  return counts;
}

function countSince(timestamps: string[], days: number) {
  const since = Date.now() - days * DAY_MS;
  return timestamps.filter((value) => Date.parse(value) >= since).length;
}

function Sparkline({ values, tone }: { values: number[]; tone: string }) {
  const width = 64;
  const height = 28;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const points = values.map(
    (value, index) =>
      [
        (index / Math.max(values.length - 1, 1)) * width,
        height - 4 - ((value - min) / span) * (height - 8),
      ] as const,
  );
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg
      className={`sparkline ${tone}`}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
    >
      <polygon points={`0,${height} ${line} ${width},${height}`} />
      <polyline points={line} />
    </svg>
  );
}

function LiveMetric({
  icon,
  tone,
  label,
  value,
  added,
  chip,
  spark,
  meta,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: number;
  added?: number;
  chip?: { text: string; tone: "up" | "down" | "neutral" };
  spark: number[];
  meta: string;
}) {
  const badge =
    chip ??
    (added
      ? { text: `+${added} this month`, tone: "up" as const }
      : { text: "None new", tone: "neutral" as const });
  return (
    <div className={`live-metric ${tone}`}>
      <span className="live-metric-icon">{icon}</span>
      <div className="live-metric-body">
        <div className="live-metric-top">
          <span className="live-metric-label">{label}</span>
          <Sparkline values={spark} tone={tone} />
        </div>
        <div className="live-metric-value">
          <strong>{value}</strong>
          <small className={`live-chip ${badge.tone}`}>
            {badge.tone === "up" && added ? <TrendingUp size={12} /> : null}
            {badge.text}
          </small>
        </div>
        <span className="live-metric-meta">{meta}</span>
      </div>
    </div>
  );
}

/** Smooth line through points (Catmull-Rom converted to cubic Béziers). */
function smoothPath(points: (readonly [number, number])[]) {
  if (points.length < 2) return "";
  let path = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const [x0, y0] = points[index - 1] ?? points[index];
    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1];
    const [x3, y3] = points[index + 2] ?? points[index + 1];
    const c1x = x1 + (x2 - x0) / 6;
    const c1y = y1 + (y2 - y0) / 6;
    const c2x = x2 - (x3 - x1) / 6;
    const c2y = y2 - (y3 - y1) / 6;
    path += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return path;
}

/** Axis maximum made of four equal steps of 1, 2 or 5 × 10ⁿ, so every tick is a whole number. */
function niceCeiling(value: number) {
  const raw = Math.max(value, 4) / 4;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((candidate) => candidate * power).find((candidate) => candidate >= raw) ?? raw;
  return Math.ceil(step) * 4;
}

function ProgressChart({
  students,
  matches,
  applications,
}: {
  students: Student[];
  matches: MatchResult[];
  applications: Application[];
}) {
  const [range, setRange] = useState(30);
  const [hover, setHover] = useState<number | null>(null);
  const firstMatchByStudent = new Map<string, string>();
  for (const match of matches) {
    const current = firstMatchByStudent.get(match.studentId);
    if (!current || Date.parse(match.generatedAt) < Date.parse(current))
      firstMatchByStudent.set(match.studentId, match.generatedAt);
  }
  const series = [
    { key: "applications", label: "Applications", tone: "ink", values: dailyTotals(applications.map((item) => item.createdAt), range) },
    { key: "matched", label: "Students matched", tone: "rose", values: dailyTotals([...firstMatchByStudent.values()], range) },
    { key: "students", label: "Students", tone: "lavender", values: dailyTotals(students.map((item) => item.createdAt), range) },
  ];
  const width = 360;
  const height = 190;
  const left = 30;
  const bottom = 24;
  const top = 10;
  const max = niceCeiling(Math.max(...series.flatMap((item) => item.values), 1));
  const right = 20;
  const x = (index: number) => left + (index / (range - 1)) * (width - left - right);
  const y = (value: number) => top + (1 - value / max) * (height - top - bottom);
  const dates = Array.from({ length: range }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (range - 1 - index));
    return date;
  });
  const label = (date: Date) => date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const tickIndexes = [0, 1, 2, 3, 4].map((step) => Math.round((step / 4) * (range - 1)));
  const latest = series.map((item) => `${item.values[range - 1]} ${item.label.toLowerCase()}`).join(", ");
  const active = hover ?? null;
  return (
    <div className="panel lively-progress">
      <div className="panel-head">
        <div>
          <h2>Student progress</h2>
        </div>
        <label className="lively-range">
          <span className="sr-only">Chart range</span>
          <select value={range} onChange={(event) => setRange(Number(event.target.value))}>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <ChevronDown size={14} aria-hidden="true" />
        </label>
      </div>
      <ul className="lively-legend">
        {series.map((item) => (
          <li key={item.key} className={item.tone}>
            <i aria-hidden="true" /> {item.label}
          </li>
        ))}
      </ul>
      <div className="lively-chart">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Running totals over the last ${range} days. Today: ${latest}.`}
          onMouseLeave={() => setHover(null)}
          onMouseMove={(event) => {
            const box = event.currentTarget.getBoundingClientRect();
            const ratio = ((event.clientX - box.left) / box.width) * width;
            const index = Math.round(((ratio - left) / (width - left - right)) * (range - 1));
            setHover(Math.max(0, Math.min(range - 1, index)));
          }}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((step) => (
            <g key={step}>
              <line className="grid" x1={left} x2={width - right} y1={y(max * step)} y2={y(max * step)} />
              <text className="axis" x={left - 8} y={y(max * step) + 3} textAnchor="end">
                {Math.round(max * step)}
              </text>
            </g>
          ))}
          {tickIndexes.map((index) => (
            <text
              key={index}
              className="axis"
              x={x(index)}
              y={height - 6}
              textAnchor={index === 0 ? "start" : index === range - 1 ? "end" : "middle"}
            >
              {label(dates[index])}
            </text>
          ))}
          {series.map((item) => (
            <path
              key={item.key}
              className={`line ${item.tone}`}
              d={smoothPath(item.values.map((value, index) => [x(index), y(value)] as const))}
            />
          ))}
          {active !== null && (
            <g>
              <line className="guide" x1={x(active)} x2={x(active)} y1={top} y2={height - bottom} />
              {series.map((item) => (
                <circle key={item.key} className={`dot ${item.tone}`} cx={x(active)} cy={y(item.values[active])} r={4} />
              ))}
            </g>
          )}
        </svg>
        {active !== null && (
          <div
            className="lively-tooltip"
            style={{ left: `clamp(70px, ${(x(active) / width) * 100}%, calc(100% - 70px))` }}
          >
            <b>{label(dates[active])}</b>
            {series.map((item) => (
              <span key={item.key} className={item.tone}>
                <i aria-hidden="true" /> {item.values[active]} {item.label.toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Remembers which workspace an invitation link pointed at, so it opens after sign-in. */
const INVITED_WORKSPACE_KEY = "matched.invitedWorkspace";

const PLAN_LABELS: Record<string, string> = {
  trial: "Trial",
  starter: "Starter",
  growth: "Growth",
  enterprise: "Enterprise",
};

/** Lists every workspace this person belongs to, opens one, or creates a new one. */
function WorkspaceSwitcher({
  current,
  workspaces,
  onSwitch,
  onCreate,
}: {
  current: Workspace;
  workspaces: WorkspaceSummary[];
  onSwitch: (workspaceId: string) => Promise<void>;
  onCreate: (name: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const close = () => {
    setOpen(false);
    setCreating(false);
    setName("");
    setError("");
  };
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) close();
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) return setError("Use at least 2 characters.");
    setBusy(true);
    setError("");
    try {
      await onCreate(name);
      close();
    } catch (caught) {
      setError(messageOf(caught) ?? "Could not create the workspace.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="switcher" ref={root}>
      <button
        className="workspace-card"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="workspace-avatar">{current.name.charAt(0).toUpperCase() || "W"}</span>
        <span>
          <small>WORKSPACE</small>
          <strong>{current.name}</strong>
        </span>
        <ChevronsUpDown size={15} aria-hidden="true" />
      </button>
      {open && (
        <div className="switcher-menu" role="menu" aria-label="Workspaces">
          <p className="switcher-label">Your workspaces</p>
          {workspaces.map((item) => (
            <button
              key={item.id}
              role="menuitemradio"
              aria-checked={item.id === current.id}
              className="switcher-item"
              onClick={() => {
                close();
                void onSwitch(item.id);
              }}
            >
              <span className="workspace-avatar">{item.name.charAt(0).toUpperCase() || "W"}</span>
              <span>
                <strong>{item.name}</strong>
                <small>
                  {ROLE_LABELS[item.role] ?? item.role} · {PLAN_LABELS[item.plan] ?? item.plan} plan
                </small>
              </span>
              {item.id === current.id ? <Check size={15} aria-hidden="true" /> : null}
            </button>
          ))}
          {creating ? (
            <form className="switcher-create-form" onSubmit={create}>
              <label>
                <span className="sr-only">New workspace name</span>
                <input
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Consultancy or branch name"
                  maxLength={80}
                />
              </label>
              {error && <small className="switcher-error">{error}</small>}
              <div>
                <button type="button" className="secondary-button" onClick={() => setCreating(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={busy}>
                  {busy ? <span className="spinner" /> : null} Create
                </button>
              </div>
            </form>
          ) : (
            <button className="switcher-create" onClick={() => setCreating(true)}>
              <Plus size={15} /> Create workspace
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** The bell: overdue deadlines, deadlines this week and profiles waiting for review. */
function NotificationsMenu({
  workspace,
  deadlines,
  students,
  onOpenCalendar,
  onOpenStudent,
}: {
  workspace: Workspace;
  deadlines: DeadlineItem[];
  students: Student[];
  onOpenCalendar: () => void;
  onOpenStudent: (student: Student) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  const pending = deadlines.filter((deadline) => !deadline.completedAt);
  const overdue = notificationSetting(workspace, "overdue")
    ? pending.filter((deadline) => daysUntil(deadline.dueAt) < 0)
    : [];
  const upcoming = notificationSetting(workspace, "upcoming")
    ? pending.filter((deadline) => daysUntil(deadline.dueAt) >= 0 && daysUntil(deadline.dueAt) <= 7)
    : [];
  const reviews = notificationSetting(workspace, "reviews")
    ? students.filter((student) => ["needs_review", "profile_processing"].includes(student.status))
    : [];
  const count = overdue.length + upcoming.length + reviews.length;
  const deadlineLine = (deadline: DeadlineItem) =>
    [deadline.university, deadline.studentName].filter(Boolean).join(" · ");
  return (
    <div className="notifications" ref={root}>
      <button
        className="icon-button notification"
        aria-label={count ? `Notifications, ${count} new` : "Notifications"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={18} />
        {count > 0 && <i />}
      </button>
      {open && (
        <div className="notifications-panel" role="dialog" aria-label="Notifications">
          <header>
            <strong>Notifications</strong>
            <small>{count ? plural(count, "item") : "All clear"}</small>
          </header>
          {!count && (
            <p className="notifications-empty">
              <CheckCircle2 size={18} /> No overdue deadlines, nothing due this week and no profiles waiting.
            </p>
          )}
          {overdue.map((deadline) => (
            <button
              key={`overdue-${deadline.id}`}
              className="notification-item is-overdue"
              onClick={() => {
                setOpen(false);
                onOpenCalendar();
              }}
            >
              <CircleAlert size={16} />
              <span>
                <strong>{deadline.title} is overdue</strong>
                <small>
                  {deadlineLine(deadline)} · was due {plural(Math.abs(daysUntil(deadline.dueAt)), "day")} ago
                </small>
              </span>
            </button>
          ))}
          {upcoming.map((deadline) => (
            <button
              key={`upcoming-${deadline.id}`}
              className="notification-item"
              onClick={() => {
                setOpen(false);
                onOpenCalendar();
              }}
            >
              <CalendarDays size={16} />
              <span>
                <strong>{deadline.title}</strong>
                <small>
                  {deadlineLine(deadline)} ·{" "}
                  {daysUntil(deadline.dueAt) === 0 ? "due today" : `due in ${plural(daysUntil(deadline.dueAt), "day")}`}
                </small>
              </span>
            </button>
          ))}
          {reviews.map((student) => (
            <button
              key={`review-${student.id}`}
              className="notification-item"
              onClick={() => {
                setOpen(false);
                onOpenStudent(student);
              }}
            >
              <ShieldCheck size={16} />
              <span>
                <strong>Review {student.name}’s profile</strong>
                <small>Confirm the academic details so matching can run</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Workspace admin",
  manager: "Manager",
  counsellor: "Counsellor",
  viewer: "Viewer",
};

/** The signed-in person, with their role, and a menu for settings, help and signing out. */
function AccountMenu({
  user,
  onSettings,
  onHelp,
  onLogout,
}: {
  user: TeamMember;
  onSettings: () => void;
  onHelp: () => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  const choose = (action: () => void) => () => {
    setOpen(false);
    action();
  };
  return (
    <div className="account" ref={root}>
      {open && (
        <div className="account-menu" role="menu" aria-label="Account">
          <div className="account-menu-head">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <button role="menuitem" onClick={choose(onSettings)}>
            <Settings size={16} /> Profile and workspace settings
          </button>
          <button role="menuitem" onClick={choose(onHelp)}>
            <CircleHelp size={16} /> Help and product tour
          </button>
          <button role="menuitem" className="is-danger" onClick={choose(onLogout)}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}
      <button
        className="account-card"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={`avatar ${user.tone}`}>{user.initials}</span>
        <span className="account-text">
          <strong>{user.name}</strong>
          <small>{ROLE_LABELS[user.role] ?? user.role}</small>
        </span>
        <ChevronsUpDown size={16} aria-hidden="true" />
      </button>
    </div>
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

/** "1 student", "3 students". */
function plural(count: number, one: string, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`;
}

/** Percentages under 1% keep one decimal so a small share never reads as zero. */
function percent(part: number, whole: number) {
  if (!whole) return "0%";
  const value = (part / whole) * 100;
  if (value > 0 && value < 1) return `${value.toFixed(1)}%`;
  return `${Math.round(value)}%`;
}

/** Mapped subject credits when they exist, otherwise the degree total from the student's own credit-hour ratio. */
function ectsSummary(student: Student) {
  const mapped = Math.round(student.credits.reduce((total, credit) => total + credit.ects, 0));
  if (mapped > 0) return `${mapped} mapped ECTS`;
  const ratio = studentEctsRatio(student.academic);
  if (ratio) return `${ratio.degreeEcts} ECTS from ${ratio.totalCreditHours} credit hours`;
  return "Credits not mapped yet";
}

/**
 * The next four intakes that have not started yet. Italian programmes start in
 * September (Fall) or February (Spring), so an intake is offered only before its start month.
 */
function upcomingIntakes(from: Date, count = 4) {
  const intakes: { label: string; start: Date }[] = [];
  for (let year = from.getFullYear(); intakes.length < count + 2; year += 1) {
    intakes.push({ label: `Spring ${year}`, start: new Date(year, 1, 1) });
    intakes.push({ label: `Fall ${year}`, start: new Date(year, 8, 1) });
  }
  return intakes.filter((intake) => intake.start > from).slice(0, count).map((intake) => intake.label);
}

const UPCOMING_INTAKES = upcomingIntakes(TODAY);
const DEFAULT_INTAKE = UPCOMING_INTAKES.find((intake) => intake.startsWith("Fall")) ?? UPCOMING_INTAKES[0];

/** Counsellor-facing names for the engine's outcomes: an exact match meets every rule, a close match nearly does. */
function statusLabel(status: string) {
  return status === "Eligible" ? "Exact match" : status === "Borderline" ? "Close match" : status;
}

function levelLabel(level: string) {
  if (/single/i.test(level)) return "Single-cycle master’s";
  if (/bachelor/i.test(level)) return "Bachelor’s";
  if (/master/i.test(level)) return "Master’s";
  return level || "Level not set";
}

/** Requirements the student meets out of those the engine checked (preferences excluded). */
function requirementSummary(checks: MatchResult["checks"]) {
  const rules = checks.filter((check) => check.category !== "preference");
  return {
    met: rules.filter((check) => check.outcome === "pass").length,
    total: rules.length,
    toConfirm: rules.filter((check) => check.outcome === "borderline").length,
  };
}

/**
 * Regional right-to-study (DSU) scholarships are open at public and private universities alike;
 * what differs is where the student applies. Guidance only: the yearly call is the authority.
 */
const DSU_AGENCIES: Record<string, string> = {
  Abruzzo: "ADSU (the agency for the university’s city)",
  Basilicata: "ARDSU Basilicata",
  Calabria: "the university’s right-to-study office",
  Campania: "ADISURC",
  "Emilia-Romagna": "ER.GO",
  "Friuli-Venezia Giulia": "ARDiS",
  Lazio: "DiSCo Lazio",
  Liguria: "ALiSEO",
  Lombardia: "the university’s right-to-study office",
  Marche: "ERDIS Marche",
  Molise: "the regional right-to-study office",
  Piemonte: "EDISU Piemonte",
  Puglia: "ADISU Puglia",
  Sardegna: "ERSU (Cagliari or Sassari)",
  Sicilia: "ERSU (the agency for the university’s city)",
  Toscana: "DSU Toscana",
  "Trentino-Alto Adige": "Opera Universitaria or the Province of Bolzano",
  Umbria: "ADiSU Umbria",
  "Valle D'Aosta": "the Valle d’Aosta region",
  Veneto: "ESU (Padova, Venezia or Verona)",
};

function scholarshipNote(university: University | undefined) {
  if (!university) return "Regional scholarship: check the university’s right-to-study page";
  if (university.institutionType === "Non statale")
    return "Regional scholarship open · apply through the university’s own student-support office";
  return `Regional scholarship open · apply through ${DSU_AGENCIES[university.region] ?? "the regional right-to-study agency"}`;
}

const MATCH_PAGE_SIZE = 20;
const PROGRAMME_PAGE_SIZE = 50;

type MatchSort = "best" | "deadline" | "tuition";

/** Best match keeps the engine's ranking; the other sorts put missing values last. */
function sortMatches(list: MatchResult[], sort: MatchSort) {
  if (sort === "best") return list;
  const value = (match: MatchResult) =>
    sort === "deadline"
      ? match.deadlineIso
        ? Date.parse(match.deadlineIso)
        : Number.POSITIVE_INFINITY
      : (match.feeEur ?? Number.POSITIVE_INFINITY);
  return [...list].sort((a, b) => value(a) - value(b));
}

/** Eligibility checks first, preferences after, so the reason a result passed or failed reads first. */
function orderedChecks(checks: MatchResult["checks"]) {
  return [
    ...checks.filter((check) => check.category !== "preference"),
    ...checks.filter((check) => check.category === "preference"),
  ];
}

function MatchesView({
  students,
  matches,
  universities,
  onOpen,
  onReview,
  onReport,
  onRun,
  onStartApplication,
  onNotify,
}: {
  students: Student[];
  matches: MatchResult[];
  universities: University[];
  onOpen: (student: Student) => void;
  onReview: (student: Student) => void;
  onReport: (student: Student) => void;
  onRun: (student: Student) => Promise<void>;
  onStartApplication: (match: MatchResult) => Promise<void>;
  onNotify: (message: string) => void;
}) {
  const [filter, setFilter] = useState("All matches");
  const [showNotEligible, setShowNotEligible] = useState(false);
  const universityById = useMemo(
    () => new Map(universities.map((university) => [university.id, university])),
    [universities],
  );
  const [sort, setSort] = useState<MatchSort>("best");
  const [shown, setShown] = useState(MATCH_PAGE_SIZE);
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [running, setRunning] = useState(false);
  const [researching, setResearching] = useState(false);
  const [liveResearch, setLiveResearch] =
    useState<LiveResearchResult | null>(null);
  const [startingApplication, setStartingApplication] = useState("");
  const student = students.find((item) => item.id === studentId) ?? students[0];
  const studentMatches = matches.filter(
    (match) => match.studentId === student?.id,
  );
  // Not eligible results stay hidden unless asked for: they only explain why a programme is missing.
  const filtered = sortMatches(
    studentMatches.filter((match) => {
      if (match.status === "Not eligible" && !showNotEligible) return false;
      if (filter === "Exact match") return match.status === "Eligible";
      if (filter === "Close match") return match.status === "Borderline";
      if (filter === "Not eligible") return match.status === "Not eligible";
      return true;
    }),
    sort,
  );
  const notEligibleCount = studentMatches.filter((match) => match.status === "Not eligible").length;
  // Rendering hundreds of full cards at once makes the page very slow, so results load in pages.
  const visible = filtered.slice(0, shown);
  const chooseFilter = (next: string) => {
    setFilter(next);
    setShown(MATCH_PAGE_SIZE);
  };
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
  const runLiveResearch = async () => {
    if (!student) return;
    setResearching(true);
    setLiveResearch(null);
    try {
      const result = await researchStudentMatches(student.id);
      setLiveResearch(result);
      onNotify(
        result.matches.length
          ? `${result.matches.length} cited live candidates researched`
          : "No live candidates passed the evidence checks",
      );
    } catch (error) {
      onNotify(messageOf(error) ?? "Live AI research failed");
    } finally {
      setResearching(false);
    }
  };
  if (!student)
    return (
      <>
        <PageTitle
          title="Match centre"
          text="Add a student before running reviewed programme matching."
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
        title="Match centre"
        text="Evidence-backed AI-reviewed and human-verified rules are matched by the deterministic engine. AI-reviewed results remain provisional."
      >
        <button
          className="secondary-button"
          disabled={!studentMatches.length}
          onClick={() => onReport(student)}
        >
          <FileText size={16} /> Shortlist report
        </button>
        {student.academic.confirmedAt ? (
          <>
            <button
              className="secondary-button"
              disabled={researching || running}
              onClick={() => void runLiveResearch()}
              aria-describedby="live-research-description"
            >
              {researching ? (
                <span className="spinner dark" />
              ) : (
                <Search size={16} />
              )}{" "}
              {researching ? "Researching official sites…" : "Live AI research"}
            </button>
            <button
              className="primary-button"
              disabled={running || researching}
              onClick={() => void run()}
            >
              {running ? <span className="spinner" /> : <Sparkles size={16} />}{" "}
              {running ? "Matching…" : "Run saved catalogue"}
            </button>
          </>
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
                chooseFilter("All matches");
                setLiveResearch(null);
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
            <b>{ectsSummary(student)}</b>
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
      <div className="live-research-intro" id="live-research-description">
        <Sparkles size={16} />
        <span>
          <strong>Live AI research (Beta)</strong>
          Searches current official university pages using anonymized academic facts. Every
          extracted rule must cite a page the search tool opened; the deterministic engine still
          decides the result.
        </span>
      </div>
      {(researching || liveResearch) && (
        <section className="live-research-results" aria-live="polite">
          <header>
            <div>
              <span className="live-badge"><Search size={13} /> LIVE WEB</span>
              <h2>Provisional researched candidates</h2>
              <p>
                {researching
                  ? "Searching official sources and validating citations. This can take about a minute."
                  : liveResearch?.summary || "Research completed."}
              </p>
            </div>
            {liveResearch && (
              <small>
                Researched {new Date(liveResearch.researchedAt).toLocaleString("en-GB")}
              </small>
            )}
          </header>
          {researching ? (
            <div className="live-research-loading">
              <span className="spinner dark" />
              <strong>The agent is opening and checking current university pages…</strong>
            </div>
          ) : liveResearch?.matches.length ? (
            <div className="live-result-list">
              {liveResearch.matches.map((match) => (
                <LiveResearchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="live-research-empty">
              <CircleAlert size={20} />
              <div>
                <strong>No candidate passed the evidence gate</strong>
                <p>
                  {liveResearch?.discarded
                    ? `${liveResearch.discarded} candidate${liveResearch.discarded === 1 ? " was" : "s were"} excluded because rules or citations were incomplete.`
                    : "The search did not return enough current, citable admission data."}
                </p>
              </div>
            </div>
          )}
          <footer>
            These results are research leads, not admission guarantees. Verify the linked call for
            applications before advising or applying.
          </footer>
        </section>
      )}
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
          <span>exact matches</span>
        </div>
        <div className="warn">
          <strong>
            {
              studentMatches.filter((match) => match.status === "Borderline")
                .length
            }
          </strong>
          <span>close matches</span>
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
          {["All matches", "Exact match", "Close match", ...(showNotEligible ? ["Not eligible"] : [])].map(
            (item) => (
              <button
                key={item}
                aria-pressed={filter === item}
                className={filter === item ? "active" : ""}
                onClick={() => chooseFilter(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <label className="match-toggle">
          <input
            type="checkbox"
            checked={showNotEligible}
            onChange={(event) => {
              setShowNotEligible(event.target.checked);
              if (!event.target.checked && filter === "Not eligible") chooseFilter("All matches");
              setShown(MATCH_PAGE_SIZE);
            }}
          />
          Show not eligible ({notEligibleCount})
        </label>
        <label className="outline-button match-sort">
          <ListFilter size={15} />
          <span className="sr-only">Sort results</span>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as MatchSort);
              setShown(MATCH_PAGE_SIZE);
            }}
          >
            <option value="best">Sort: Best match</option>
            <option value="deadline">Sort: Earliest deadline</option>
            <option value="tuition">Sort: Lowest tuition</option>
          </select>
        </label>
      </div>
      <p className="match-disclaimer">
        <ShieldCheck size={15} aria-hidden="true" />
        Matches compare the student with each programme’s published entry rules. Meeting every rule
        does not guarantee admission: the university’s admissions committee makes the final decision.
      </p>
      <div className="match-card-list">
        {visible.map((match) => {
          const university = match.universityId ? universityById.get(match.universityId) : undefined;
          const summary = requirementSummary(match.checks);
          return (
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
                  <Status text={statusLabel(match.status)} />
                  {match.programmeVerified ? (
                    <span className="fresh-label">
                      <ShieldCheck size={12} /> Rules verified {match.verified}
                    </span>
                  ) : (
                    <span className="fresh-label">
                      <Sparkles size={12} /> AI reviewed {match.verified} · provisional
                    </span>
                  )}
                </div>
                <h2>{match.programme}</h2>
                <p>
                  {match.university} <span>·</span> <MapPin size={13} />{" "}
                  {match.city}
                </p>
                <ul className="match-facts" aria-label="Programme facts">
                  <li>
                    <GraduationCap size={13} aria-hidden="true" /> {levelLabel(match.degreeLevel)}
                  </li>
                  <li>
                    <Building2 size={13} aria-hidden="true" />{" "}
                    {university ? (university.institutionType === "Non statale" ? "Private" : "Public") : "Institution type not set"}
                  </li>
                  <li className={match.accessRestricted ? "is-restricted" : ""}>
                    <LockKeyhole size={13} aria-hidden="true" />{" "}
                    {match.accessRestricted === true
                      ? "Restricted access"
                      : match.accessRestricted === false
                        ? "Open access"
                        : "Access: check the call"}
                  </li>
                  <li>
                    <BarChart3 size={13} aria-hidden="true" />{" "}
                    {university?.qsRankLabel
                      ? `QS ${university.qsRankLabel}${university.qsRankYear ? ` (${university.qsRankYear})` : ""}`
                      : "QS rank not added"}
                  </li>
                </ul>
                {/^https?:\/\//.test(match.source) && (
                  <a
                    className="official-link"
                    href={match.source}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Confirm ${match.programme} on the official ${match.university} website`}
                  >
                    {match.sourceIsCourseList
                      ? "Confirm on the university’s course list"
                      : "Confirm on the official programme page"}{" "}
                    <ExternalLink size={12} />
                  </a>
                )}
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
                <p className="match-scholarship">{scholarshipNote(university)}</p>
              </div>
              <div className="large-score requirement-score">
                <strong className={scoreTone(match.status)}>
                  {summary.met}
                  <small>/{summary.total}</small>
                </strong>
                <span>requirements met</span>
                {summary.toConfirm ? <small>{summary.toConfirm} to confirm</small> : null}
              </div>
            </div>
            <div className="rule-bar">
              <div>
                {match.checks.length
                  ? orderedChecks(match.checks).map((check, index) => {
                      // Preferences only affect ranking, so a mismatch is a note, never a red failure.
                      const preference = check.category === "preference";
                      const tone =
                        check.outcome === "pass"
                          ? ""
                          : preference || check.outcome === "borderline"
                            ? "warn"
                            : "fail";
                      return (
                        <span
                          key={`${check.key}-${index}`}
                          className={`${tone} ${preference && check.outcome !== "pass" ? "preference" : ""}`.trim()}
                          title={check.label}
                        >
                          {tone === "fail" ? (
                            <X size={13} />
                          ) : tone === "warn" ? (
                            <CircleAlert size={13} />
                          ) : (
                            <Check size={13} />
                          )}
                          {preference && check.outcome !== "pass" ? `Preference: ${check.detail}` : check.detail}
                        </span>
                      );
                    })
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
          );
        })}
        {filtered.length > visible.length && (
          <button
            className="secondary-button show-more"
            onClick={() => setShown((count) => count + MATCH_PAGE_SIZE)}
          >
            Show {Math.min(MATCH_PAGE_SIZE, filtered.length - visible.length)} more
            <small>
              {visible.length} of {filtered.length} shown
            </small>
          </button>
        )}
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
                  ? "Run a new match against evidence-backed AI-reviewed or verified rules."
                  : "Review and confirm the student’s profile, then run a match."}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

function LiveResearchCard({ match }: { match: LiveResearchMatch }) {
  const code = match.university
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <article className="live-result-card">
      <div className="live-result-main">
        <CampusMark
          university={match.university}
          code={code || "IT"}
          tone="pink"
          size="large"
        />
        <div className="match-title">
          <div>
            <Status text={match.status} />
            <span className="fresh-label">
              <Sparkles size={12} /> {match.confidence}% source confidence · provisional
            </span>
          </div>
          <h2>{match.programme}</h2>
          <p>
            {match.university} <span>·</span> <MapPin size={13} /> {match.city}
          </p>
          <div className="programme-meta">
            <span>
              Annual tuition
              <b>
                {match.annualTuitionEur == null
                  ? "Not confirmed"
                  : `€${match.annualTuitionEur.toLocaleString()}`}
              </b>
            </span>
            <span>
              Application deadline
              <b>{match.applicationDeadline || "Not confirmed"}</b>
            </span>
            <span>
              Intake <b>{match.intake || match.academicYear}</b>
            </span>
          </div>
        </div>
        <div className="large-score">
          <strong className={scoreTone(match.status)}>
            {match.score}<small>%</small>
          </strong>
          <span>rank score</span>
        </div>
      </div>
      <div className="live-checks">
        {match.checks.map((check, index) => (
          <span
            key={`${check.key}-${index}`}
            className={
              check.outcome === "fail"
                ? "fail"
                : check.outcome === "borderline"
                  ? "warn"
                  : ""
            }
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
        ))}
      </div>
      <footer className="live-sources">
        <span>Sources opened by the research tool</span>
        <div>
          {match.sources.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              {source.title} <ExternalLink size={12} />
            </a>
          ))}
        </div>
      </footer>
    </article>
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
  if (programme.status === "ai_reviewed")
    return (
      <span className="fresh-cell">
        <Sparkles size={13} />
        AI reviewed · {programme.aiConfidence ?? 0}%
      </span>
    );
  return (
    <span className="fresh-cell unverified">
      <CircleAlert size={13} />
      {programme.status === "in_review" ? "In review" : "Not verified"}
    </span>
  );
}

function programmeReadiness(programme: Programme) {
  const fields = [
    Boolean(programme.source && programme.source !== "#"),
    hasEligibilityRules(programme.rules),
    Boolean(programme.academicYear),
    programme.feeValue != null,
    Boolean(programme.deadlineIso),
    Boolean(programme.applicationUrl),
    programme.evidence.length > 0,
  ];
  return {
    complete: fields.filter(Boolean).length,
    total: fields.length,
  };
}

function ProgrammesView({
  programmes,
  universities,
  isVerifier,
  onEdit,
  onAiReview,
  onReviewBatchDone,
  onNotify,
}: {
  programmes: Programme[];
  universities: University[];
  isVerifier: boolean;
  onEdit: (programme: Programme | "new") => void;
  onAiReview: (programme: Programme) => Promise<{ status: "ai_reviewed" | "in_review"; confidence: number }>;
  onReviewBatchDone: () => Promise<void>;
  onNotify: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [catalogue, setCatalogue] = useState<"programmes" | "universities">(
    "programmes",
  );
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [aiReviewing, setAiReviewing] = useState({ done: 0, total: 0, published: 0 });
  const stopAiReview = useRef(false);
  const queueMode = statusFilter === "queue";
  // The list renders in pages; changing the search or filters starts again from the first page.
  const filterKey = `${query}|${levelFilter}|${statusFilter}`;
  const [page, setPage] = useState({ key: filterKey, count: PROGRAMME_PAGE_SIZE });
  const shownCount = page.key === filterKey ? page.count : PROGRAMME_PAGE_SIZE;
  const visible = programmes
    .filter((programme) => {
      const matchesQuery =
        `${programme.programme} ${programme.university} ${programme.city} ${programme.degreeClass}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const level = programme.degreeLevel.toLowerCase();
      const matchesLevel =
        levelFilter === "all" ||
        (levelFilter === "bachelor" && level.includes("bachelor")) ||
        (levelFilter === "master" && level === "master") ||
        (levelFilter === "single-cycle" && level.includes("single"));
      const matchesStatus = queueMode
        ? !["ai_reviewed", "verified"].includes(programme.status)
        : statusFilter === "all" || programme.status === statusFilter;
      return matchesQuery && matchesLevel && matchesStatus;
    })
    .sort((a, b) => {
      if (!queueMode) return 0;
      const statusOrder: Record<string, number> = {
        in_review: 0,
        unverified: 1,
        stale: 2,
      };
      const byStatus =
        (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
      if (byStatus) return byStatus;
      return programmeReadiness(b).complete - programmeReadiness(a).complete;
    });
  const visibleUniversities = universities.filter((university) =>
    `${university.name} ${university.region} ${university.institutionType}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const verified = programmes.filter(
    (programme) => programme.status === "verified",
  ).length;
  const aiReviewed = programmes.filter(
    (programme) => programme.status === "ai_reviewed",
  ).length;
  const inReview = programmes.filter(
    (programme) => programme.status === "in_review",
  ).length;
  const stale = programmes.filter((programme) =>
    ["stale", "unverified"].includes(programme.status),
  ).length;
  const queueCount = programmes.length - verified - aiReviewed;
  // Reviews every programme in the current view that has no published rules yet.
  // Each successful review is saved immediately, so stopping or throttling never
  // loses completed work.
  const reviewWithAi = async () => {
    const candidates = visible.filter((programme) => !["ai_reviewed", "verified"].includes(programme.status));
    if (!candidates.length) return;
    stopAiReview.current = false;
    let published = 0;
    let processed = 0;
    let nextIndex = 0;
    let failed = 0;
    setAiReviewing({ done: 0, total: candidates.length, published: 0 });

    const reviewOne = async (programme: Programme) => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          return await onAiReview(programme);
        } catch (error) {
          const retryable = /busy|quota|rate|429|500|502|503|504|timeout/i.test(
            messageOf(error) ?? "",
          );
          if (!retryable || attempt === 2) throw error;
          await new Promise((resolve) =>
            setTimeout(resolve, 1_500 * 2 ** attempt + Math.random() * 500),
          );
        }
      }
      throw new Error("Review failed after retries.");
    };

    const worker = async () => {
      while (!stopAiReview.current) {
        const index = nextIndex;
        nextIndex += 1;
        if (index >= candidates.length) return;
        try {
          const result = await reviewOne(candidates[index]);
          if (result.status === "ai_reviewed") published += 1;
        } catch {
          failed += 1;
        } finally {
          processed += 1;
          setAiReviewing({ done: processed, total: candidates.length, published });
        }
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(6, candidates.length) }, worker),
    );
    setAiReviewing({ done: 0, total: 0, published: 0 });
    await onReviewBatchDone();
    if (stopAiReview.current) {
      onNotify(`Review stopped after ${processed}/${candidates.length}; completed records were saved.`);
    } else if (failed) {
      onNotify(`${published} rules published; ${failed} pages failed after retries and remain queued.`);
    } else {
      onNotify(`${published} programme rules published from ${processed} source reviews.`);
    }
  };
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
          <>
            <button
              className="secondary-button"
              onClick={() => {
                setCatalogue("programmes");
                setStatusFilter("queue");
                setQuery("");
              }}
            >
              <ListChecks size={16} /> Review queue ({queueCount})
            </button>
            {aiReviewing.total ? (
              <button className="primary-button" onClick={() => (stopAiReview.current = true)}>
                <span className="spinner" /> AI reviewing {aiReviewing.done}/{aiReviewing.total} · {aiReviewing.published} published · Stop
              </button>
            ) : (
              <button
                className="primary-button"
                disabled={!queueCount}
                onClick={() => void reviewWithAi()}
                title="Reviews every programme in the current view that has no published rules yet"
              >
                <Sparkles size={16} /> AI review all ({visible.filter((programme) => !["ai_reviewed", "verified"].includes(programme.status)).length})
              </button>
            )}
            <button className="primary-button" onClick={() => onEdit("new")}>
              <Plus size={17} /> Add programme
            </button>
          </>
        )}
      </PageTitle>
      {catalogueTabs}
      {isVerifier && queueMode && (
        <div className="review-queue-banner">
          <div>
            <ListChecks size={21} />
            <span>
              <strong>Automated programme review queue</strong>
              <small>
                In-review records appear first, followed by the most complete catalogue records.
              </small>
            </span>
          </div>
          <button
            className="primary-button"
            disabled={!visible.length}
            onClick={() => visible[0] && onEdit(visible[0])}
          >
            Open next programme <ArrowRight size={15} />
          </button>
        </div>
      )}
      <div className="database-banner">
        <div className="database-icon">
          <ShieldCheck size={22} />
        </div>
        <div>
          <strong>Programme catalogue</strong>
          <span>
            {verified + aiReviewed} of {programmes.length} programmes reviewed against linked sources
          </span>
        </div>
        <div className="database-stats">
          <span>
            <b>{verified}</b> verified
          </span>
          <span>
            <b>{aiReviewed}</b> AI reviewed
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
        <span className="outline-button static-filter">
          <Flag size={15} /> Italy
        </span>
        <label className="outline-button select-filter">
          <GraduationCap size={15} />
          <select
            value={levelFilter}
            onChange={(event) => setLevelFilter(event.target.value)}
            aria-label="Filter programmes by degree level"
          >
            <option value="all">All levels</option>
            <option value="bachelor">Bachelor’s</option>
            <option value="master">Master’s</option>
            <option value="single-cycle">Single-cycle</option>
          </select>
          <ChevronDown size={14} />
        </label>
        <label className="outline-button select-filter">
          <Filter size={15} />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter programmes by verification status"
          >
            <option value="all">All data statuses</option>
            {isVerifier && <option value="queue">Review queue</option>}
            <option value="verified">Verified</option>
            <option value="ai_reviewed">AI reviewed</option>
            <option value="in_review">In review</option>
            <option value="unverified">Needs verification</option>
            <option value="stale">Stale</option>
          </select>
          <ChevronDown size={14} />
        </label>
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
        {visible.slice(0, shownCount).map((programme) => {
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
                  <small>
                    {programme.degreeLevel} · {programme.language} · A.Y.{" "}
                    {programme.academicYear}
                  </small>
                  {isVerifier && (() => {
                    const readiness = programmeReadiness(programme);
                    return (
                      <small className="review-readiness">
                        <span>
                          <i style={{ width: `${(readiness.complete / readiness.total) * 100}%` }} />
                        </span>
                        {readiness.complete}/{readiness.total} fields ready
                      </small>
                    );
                  })()}
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
                  {["ai_reviewed", "verified"].includes(programme.status) ? "Edit" : "Review"}
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
        {visible.length > shownCount && (
          <button
            className="secondary-button show-more"
            onClick={() => setPage({ key: filterKey, count: shownCount + PROGRAMME_PAGE_SIZE })}
          >
            Show {Math.min(PROGRAMME_PAGE_SIZE, visible.length - shownCount)} more
            <small>
              {shownCount} of {visible.length} shown
            </small>
          </button>
        )}
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

function NewDeadlineModal({
  students,
  onClose,
  onSave,
}: {
  students: Student[];
  onClose: () => void;
  onSave: (input: NewDeadlineInput) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<NewDeadlineInput["type"]>("custom");
  const [dueAt, setDueAt] = useState("");
  const [studentId, setStudentId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEscape(onClose);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave({ title, type, dueAt, studentId: studentId || null });
      onClose();
    } catch (caught) {
      setError(messageOf(caught) ?? "Could not create the deadline.");
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="wizard deadline-modal" role="dialog" aria-modal="true" aria-labelledby="deadline-modal-title" onSubmit={save}>
        <header>
          <div>
            <h2 id="deadline-modal-title">Add a deadline</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close deadline form"><X size={20} /></button>
        </header>
        <div className="wizard-body">
          <div className="field-grid">
            <label className="wide">Title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Universitaly pre-enrolment" required autoFocus /></label>
            <label>
              Deadline type
              <select value={type} onChange={(event) => setType(event.target.value as NewDeadlineInput["type"])}>
                <option value="application">Application</option>
                <option value="scholarship">Scholarship</option>
                <option value="pre_enrolment">Pre-enrolment</option>
                <option value="document">Document</option>
                <option value="visa">Visa</option>
                <option value="custom">Custom</option>
              </select>
            </label>
            <label>Due date<input type="date" value={dueAt} onChange={(event) => setDueAt(event.target.value)} required /></label>
            <label className="wide">
              Student (optional)
              <select value={studentId} onChange={(event) => setStudentId(event.target.value)}>
                <option value="">Workspace-wide deadline</option>
                {students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
              </select>
            </label>
          </div>
          {error && <p className="auth-message error" role="alert">{error}</p>}
        </div>
        <footer>
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" type="submit" disabled={saving || !title.trim() || !dueAt}>
            {saving ? <span className="spinner" /> : <CalendarDays size={16} />} {saving ? "Saving…" : "Add deadline"}
          </button>
        </footer>
      </form>
    </div>
  );
}

function CalendarView({
  deadlines,
  students,
  onCreate,
  onToggle,
  onNotify,
}: {
  deadlines: DeadlineItem[];
  students: Student[];
  onCreate: (input: NewDeadlineInput) => Promise<void>;
  onToggle: (deadline: DeadlineItem, completed: boolean) => Promise<void>;
  onNotify: (message: string) => void;
}) {
  const [month, setMonth] = useState(
    new Date(TODAY.getFullYear(), TODAY.getMonth(), 1),
  );
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState("");
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
        title="Calendar"
        text="Application, pre-enrolment, scholarship, and visa milestones in one place."
      >
        <button className="primary-button" onClick={() => setAdding(true)}>
          <Plus size={16} /> Add deadline
        </button>
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
              <h2>Next 30 days</h2>
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
                <button
                  className={`deadline-toggle ${deadline.completedAt ? "complete" : ""}`}
                  disabled={updating === deadline.id}
                  onClick={async () => {
                    setUpdating(deadline.id);
                    try {
                      await onToggle(deadline, !deadline.completedAt);
                      onNotify(deadline.completedAt ? "Deadline reopened" : "Deadline completed");
                    } catch (caught) {
                      onNotify(messageOf(caught) ?? "Could not update deadline");
                    } finally {
                      setUpdating("");
                    }
                  }}
                >
                  {updating === deadline.id ? <span className="spinner dark" /> : <CheckCircle2 size={14} />}
                  {deadline.completedAt ? "Reopen" : "Mark complete"}
                </button>
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
      {adding && (
        <NewDeadlineModal
          students={students}
          onClose={() => setAdding(false)}
          onSave={async (input) => {
            await onCreate(input);
            onNotify("Deadline added");
          }}
        />
      )}
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
  const [monthCount, setMonthCount] = useState(6);
  const monthDates = Array.from(
    { length: monthCount },
    (_, index) =>
      new Date(TODAY.getFullYear(), TODAY.getMonth() - (monthCount - 1) + index, 1),
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
  // A multiple of 3 keeps the four axis ticks whole numbers at even spacing.
  const chartMax = Math.max(3, Math.ceil(Math.max(...shortlists) / 3) * 3);
  const eligibleCount = matches.filter((match) => match.status === "Eligible").length;
  const eligibleRate = percent(eligibleCount, matches.length);
  const completedDeadlines = deadlines.filter(
    (deadline) => deadline.completedAt,
  ).length;
  // Only deadlines whose date has passed can be met or missed; future ones are still open.
  const dueDeadlines = deadlines.filter(
    (deadline) => deadline.completedAt || daysUntil(deadline.dueAt) < 0,
  );
  const metDeadlines = dueDeadlines.filter((deadline) => deadline.completedAt).length;
  const deadlinesMet = dueDeadlines.length
    ? Math.round((metDeadlines / dueDeadlines.length) * 100)
    : null;
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
            deadlinesMet === null
              ? (onTrack / students.length) * 100
              : (onTrack / students.length) * 70 + deadlinesMet * 0.3,
          ),
        ),
      )
    : 0;
  return (
    <>
      <PageTitle
        title="Reports"
        text="Live metrics calculated from your workspace records."
      >
        <button
          className="secondary-button"
          onClick={() => {
            downloadCsv("workspace-report.csv", [
              ["Metric", "Value"],
              ["Students", students.length],
              ["Programmes checked", matches.length],
              ["Eligible match rate", eligibleRate],
              ["Applications", applications.length],
              ["Deadlines met", deadlinesMet === null ? "None due yet" : `${deadlinesMet}%`],
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
          label="Programmes checked"
          value={String(matches.length)}
          meta={`For ${plural(new Set(matches.map((match) => match.studentId)).size, "student")}`}
        />
        <Metric
          icon={<CheckCircle2 size={18} />}
          tone="green"
          label="Eligible match rate"
          value={eligibleRate}
          meta={`${plural(eligibleCount, "eligible result")}`}
        />
        <Metric
          icon={<Users size={18} />}
          tone="violet"
          label="Students progressed"
          value={String(onTrack)}
          meta={`of ${plural(students.length, "student")}`}
        />
        <Metric
          icon={<CalendarDays size={18} />}
          tone="orange"
          label="Deadlines met"
          value={deadlinesMet === null ? "None" : `${deadlinesMet}%`}
          meta={
            deadlinesMet !== null
              ? `${completedDeadlines} completed`
              : deadlines.length
                ? `${plural(deadlines.length, "deadline")} still open`
                : "No deadlines yet"
          }
        />
      </section>
      <div className="report-grid">
        <div className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h2>Students matched</h2>
            </div>
            <label className="lively-range">
              <span className="sr-only">Chart range</span>
              <select value={monthCount} onChange={(event) => setMonthCount(Number(event.target.value))}>
                <option value={3}>Last 3 months</option>
                <option value={6}>Last 6 months</option>
                <option value={12}>Last 12 months</option>
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </label>
          </div>
          <div className="bar-chart">
            <div className="y-labels">
              <span>{chartMax}</span>
              <span>{(chartMax / 3) * 2}</span>
              <span>{chartMax / 3}</span>
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
          <h2>Workspace health</h2>
          <div
            className={`health-ring ${health >= 75 ? "is-healthy" : health >= 45 ? "is-attention" : "is-starting"}`}
            style={{ "--health": `${health}%` } as CSSProperties}
          >
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
          <p>{deadlinesMet === null ? "Based on student progress" : "Based on progress and deadlines met"}</p>
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

/** "just now", "5 minutes ago", "3 days ago". */
function ago(iso: string | null | undefined) {
  if (!iso) return null;
  const minutes = Math.round((TODAY.getTime() - Date.parse(iso)) / 60000);
  if (Number.isNaN(minutes)) return null;
  if (minutes < 5) return "just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const ROLE_HELP: Record<string, string> = {
  admin: "Everything, including members, roles and billing",
  manager: "Manages counsellors and viewers, and all student work",
  counsellor: "Adds students, runs matches and manages applications",
  viewer: "Can see students and matches but not change them",
};

/** One readable line per activity record. */
function describeActivity(item: ActivityItem) {
  const meta = item.metadata;
  const role = (value: unknown) => (ROLE_LABELS[String(value)] ?? String(value ?? "")).toLowerCase();
  switch (item.action) {
    case "member.invited":
      return `invited ${meta.email} as ${role(meta.role)}`;
    case "member.joined":
      return `joined as ${role(meta.role)}`;
    case "member.role_changed":
      return `changed a member’s role from ${role(meta.from)} to ${role(meta.to)}`;
    case "member.removed":
      return "removed a member";
    case "member.left":
      return "left the workspace";
    case "matches.generated":
      return `ran matching against ${meta.programme_count ?? "the"} programmes`;
    default:
      return item.action.replaceAll("_", " ").replace(".", " ");
  }
}

function TeamView({
  team,
  workspace,
  currentUser,
  invites,
  activity,
  onChanged,
  onNotify,
}: {
  team: TeamMember[];
  workspace: Workspace;
  currentUser: TeamMember;
  invites: PendingInvite[];
  activity: ActivityItem[];
  onChanged: () => Promise<unknown>;
  onNotify: (message: string) => void;
}) {
  const isAdmin = currentUser.role === "admin";
  const canManage = isAdmin || currentUser.role === "manager";
  const adminCount = team.filter((member) => member.role === "admin").length;
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("counsellor");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [lastLink, setLastLink] = useState<{ email: string; link: string } | null>(null);
  const [busyMember, setBusyMember] = useState("");
  const linkFor = (token: string) => `${window.location.origin}/app?invite=${token}`;
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onNotify("Invitation link copied");
    } catch {
      onNotify("Copy failed. Select the link and copy it manually.");
    }
  };
  const invite = async (event: FormEvent) => {
    event.preventDefault();
    setInviteError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setInviteError("Enter a valid email address.");
    setInviting(true);
    try {
      const token = await inviteMember(workspace.id, email, role);
      setLastLink({ email: email.trim(), link: linkFor(token) });
      setEmail("");
      await onChanged();
      onNotify(`Invitation created for ${email.trim()}`);
    } catch (error) {
      setInviteError(messageOf(error) ?? "Could not create the invitation.");
    } finally {
      setInviting(false);
    }
  };
  const act = async (memberId: string, action: () => Promise<void>, done: string) => {
    setBusyMember(memberId);
    try {
      await action();
      await onChanged();
      onNotify(done);
    } catch (error) {
      onNotify(messageOf(error) ?? "That change was not allowed.");
    } finally {
      setBusyMember("");
    }
  };
  const roleOptions = (memberRole: string) =>
    Object.keys(ROLE_LABELS).filter((option) => isAdmin || (option !== "admin" && memberRole !== "admin"));
  return (
    <>
      <PageTitle title="Team" text={`People with access to ${workspace.name}, and what they can do.`}>
        <button
          className="secondary-button"
          onClick={() => {
            downloadCsv("team-members.csv", [
              ["Name", "Email", "Role", "Last active"],
              ...team.map((member) => [member.name, member.email, ROLE_LABELS[member.role] ?? member.role, ago(member.lastSeenAt) ?? "Never"]),
            ]);
            onNotify("Team list exported");
          }}
        >
          <Download size={16} /> Export
        </button>
      </PageTitle>
      <div className="team-grid">
        <div className="team-main">
          {canManage && (
            <div className="panel invite-panel">
              <div className="panel-head">
                <div>
                  <h2>Invite a colleague</h2>
                  <p className="panel-sub">
                    They join this workspace when they sign up or next sign in with this email.
                  </p>
                </div>
              </div>
              <form className="invite-form" onSubmit={invite}>
                <label>
                  <span>Work email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="colleague@consultancy.com"
                    autoComplete="off"
                  />
                </label>
                <label>
                  <span>Role</span>
                  <select value={role} onChange={(event) => setRole(event.target.value)}>
                    {Object.keys(ROLE_LABELS)
                      .filter((option) => isAdmin || option !== "admin")
                      .map((option) => (
                        <option key={option} value={option}>
                          {ROLE_LABELS[option]}
                        </option>
                      ))}
                  </select>
                </label>
                <button className="primary-button" type="submit" disabled={inviting}>
                  {inviting ? <span className="spinner" /> : <UserPlus size={16} />} Invite
                </button>
              </form>
              <p className="invite-role-help">{ROLE_HELP[role]}</p>
              {inviteError && <p className="auth-message error" role="alert">{inviteError}</p>}
              {lastLink && (
                <div className="invite-link" role="status">
                  <span>
                    Send {lastLink.email} this link. If they already have an account, they have been added straight away.
                  </span>
                  <div>
                    <input readOnly value={lastLink.link} aria-label="Invitation link" onFocus={(event) => event.target.select()} />
                    <button className="secondary-button" type="button" onClick={() => void copy(lastLink.link)}>
                      Copy link
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="panel member-panel">
            <div className="panel-head">
              <div>
                <h2>Members</h2>
                <p className="panel-sub">{plural(team.length, "person", "people")} in this workspace</p>
              </div>
            </div>
            {team.map((member) => {
              const isMe = member.id === currentUser.id;
              // A workspace always keeps one admin, so the last one can't step down or leave.
              const lastAdmin = member.role === "admin" && adminCount === 1;
              const canEditRole = !lastAdmin && canManage && (isAdmin || member.role !== "admin");
              const canRemove = !lastAdmin && (isMe || (canManage && (isAdmin || !["admin", "manager"].includes(member.role))));
              const lastSeen = ago(member.lastSeenAt);
              return (
                <div className="member-row" key={member.id}>
                  <span className={`avatar ${member.tone}`}>{member.initials}</span>
                  <div className="member-text">
                    <strong>
                      {member.name}
                      {isMe ? <i className="member-you">You</i> : null}
                    </strong>
                    <small>{member.email}</small>
                  </div>
                  {canEditRole ? (
                    <label className="member-role">
                      <span className="sr-only">Role for {member.name}</span>
                      <select
                        value={member.role}
                        disabled={busyMember === member.id}
                        onChange={(event) =>
                          void act(
                            member.id,
                            () => setMemberRole(workspace.id, member.id, event.target.value),
                            `${member.name} is now ${ROLE_LABELS[event.target.value] ?? event.target.value}`,
                          )
                        }
                      >
                        {roleOptions(member.role).map((option) => (
                          <option key={option} value={option}>
                            {ROLE_LABELS[option]}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <span
                      className="role-pill"
                      title={lastAdmin ? "Make someone else a workspace admin before changing this role" : undefined}
                    >
                      {ROLE_LABELS[member.role] ?? member.role}
                    </span>
                  )}
                  <span className={`last-active ${lastSeen === "just now" ? "is-now" : ""}`}>
                    {lastSeen ? (lastSeen === "just now" ? "Active now" : `Active ${lastSeen}`) : "Not signed in yet"}
                  </span>
                  {canRemove ? (
                    <button
                      className="member-remove"
                      disabled={busyMember === member.id}
                      onClick={() => {
                        const question = isMe
                          ? `Leave ${workspace.name}? You will lose access to its students.`
                          : `Remove ${member.name} from ${workspace.name}?`;
                        if (!window.confirm(question)) return;
                        void act(
                          member.id,
                          () => removeMember(workspace.id, member.id),
                          isMe ? `You left ${workspace.name}` : `${member.name} was removed`,
                        );
                      }}
                    >
                      {isMe ? "Leave" : "Remove"}
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              );
            })}
          </div>

          {canManage && invites.length > 0 && (
            <div className="panel member-panel">
              <div className="panel-head">
                <div>
                  <h2>Pending invitations</h2>
                  <p className="panel-sub">Links stay valid for 14 days.</p>
                </div>
              </div>
              {invites.map((pending) => {
                const daysLeft = Math.max(0, Math.round((Date.parse(pending.expiresAt) - TODAY.getTime()) / 86400000));
                return (
                  <div className="member-row invite-row" key={pending.id}>
                    <span className="avatar">
                      <Mail size={16} />
                    </span>
                    <div className="member-text">
                      <strong>{pending.email}</strong>
                      <small>
                        {ROLE_LABELS[pending.role] ?? pending.role} · expires in {plural(daysLeft, "day")}
                      </small>
                    </div>
                    <button className="secondary-button" onClick={() => void copy(linkFor(pending.token))}>
                      Copy link
                    </button>
                    <button
                      className="member-remove"
                      disabled={busyMember === pending.id}
                      onClick={() => void act(pending.id, () => revokeInvite(pending.id), `Invitation for ${pending.email} revoked`)}
                    >
                      Revoke
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <aside className="team-side">
          <div className="panel activity-panel">
            <div className="panel-head">
              <div>
                <h2>Recent activity</h2>
                <p className="panel-sub">The latest changes in this workspace.</p>
              </div>
            </div>
            {activity.length ? (
              <ol className="activity-list">
                {activity.map((item) => (
                  <li key={item.id}>
                    <span className="activity-dot" aria-hidden="true" />
                    <p>
                      <strong>{item.actorName}</strong> {describeActivity(item)}
                    </p>
                    <time dateTime={item.createdAt}>{ago(item.createdAt)}</time>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="empty-state">
                <Clock3 size={22} />
                <strong>No activity yet</strong>
                <span>Invites, matches and role changes will appear here.</span>
              </div>
            )}
          </div>
          <div className="panel access-panel">
            <h2>What each role can do</h2>
            <ul className="role-guide">
              {Object.keys(ROLE_LABELS).map((option) => (
                <li key={option}>
                  <strong>{ROLE_LABELS[option]}</strong>
                  <span>{ROLE_HELP[option]}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
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

const settingsToggles: Partial<
  Record<
    SettingsSection,
    {
      group: string;
      intro: string;
      toggles: { key: string; title: string; detail: string; fallback: boolean }[];
    }
  >
> = {
  Notifications: {
    group: "notifications",
    intro: "Choose what the bell in the top bar shows for this workspace.",
    toggles: [
      {
        key: "overdue",
        title: "Overdue deadlines",
        detail: "Deadlines whose date has passed and are not marked done",
        fallback: true,
      },
      {
        key: "upcoming",
        title: "Deadlines this week",
        detail: "Deadlines due in the next 7 days",
        fallback: true,
      },
      {
        key: "reviews",
        title: "Profiles waiting for review",
        detail: "Students whose documents are read but not yet confirmed",
        fallback: true,
      },
    ],
  },
};

/** Monthly student profiles included in each plan (null means unlimited). */
const PLAN_LIMITS: Record<string, number | null> = {
  trial: 10,
  starter: 30,
  growth: 150,
  enterprise: null,
};

/** The bell's switches live in workspace settings; missing values default to on. */
function notificationSetting(workspace: Workspace, key: string) {
  const group = workspace.settings.notifications;
  if (group && typeof group === "object" && key in group) return Boolean((group as Record<string, unknown>)[key]);
  return true;
}

function SettingsView({
  initialSection,
  workspace,
  user,
  studentCount,
  programmeCount,
  universityCount,
  onExport,
  onSave,
  onNotify,
}: {
  initialSection: SettingsSection;
  workspace: Workspace;
  user: TeamMember;
  /** Student profiles added this calendar month. */
  studentCount: number;
  programmeCount: number;
  universityCount: number;
  onExport: () => void;
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
  const toggles = settingsToggles[section] ?? null;
  const limit = PLAN_LIMITS[draft.plan] ?? null;
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
            <div className="settings-toggles">
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
                <h3>
                  {PLAN_LABELS[draft.plan] ?? draft.plan} plan ·{" "}
                  {limit == null ? "unlimited profiles" : `${limit} profiles a month`}
                </h3>
                <p>
                  To change plan, <a href="/book?plan=growth">book a call</a> and we will move your workspace over.
                </p>
              </div>
              <div className="plan-usage">
                <span>
                  <b>{studentCount}</b> {limit == null ? "profiles added this month" : `of ${limit} profiles used this month`}
                </span>
                {limit != null && (
                  <>
                    <div className="usage-track">
                      <span style={{ width: `${Math.min((studentCount / limit) * 100, 100)}%` }} />
                    </div>
                    <small>{plural(Math.max(limit - studentCount, 0), "profile")} remaining this month</small>
                  </>
                )}
              </div>
            </div>
          )}
          {section === "Destinations" && (
            <div className="settings-info">
              <p>MatchED matches students against English-taught programmes in Italy.</p>
              <div className="destination-row">
                <strong>Italy</strong>
                <span>
                  {programmeCount} programmes at {universityCount} universities, each linked to its official page
                </span>
                <span className="status green">
                  <i />
                  Active
                </span>
              </div>
              <p className="settings-note">Other countries are not in the catalogue yet, so they are not offered for matching.</p>
            </div>
          )}
          {section === "Privacy & data" && (
            <div className="settings-info">
              <ul className="privacy-facts">
                <li>
                  <strong>Consent first</strong>
                  <span>A student’s consent must be recorded before any document can be uploaded.</span>
                </li>
                <li>
                  <strong>Private to this workspace</strong>
                  <span>Student records, documents and matches are only visible to members of {draft.name}.</span>
                </li>
                <li>
                  <strong>Activity is recorded</strong>
                  <span>Invites, role changes and match runs appear in the Team page’s activity feed.</span>
                </li>
                <li>
                  <strong>Deleting a student</strong>
                  <span>Removes their profile, documents, matches and applications from the workspace.</span>
                </li>
              </ul>
              <button className="secondary-button" onClick={onExport}>
                <Download size={16} /> Export all student records
              </button>
            </div>
          )}
          {(section === "Workspace profile" || section === "Notifications") && (
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
  onDelete,
  onNotify,
}: {
  student: Student;
  matches: MatchResult[];
  applications: Application[];
  onClose: () => void;
  onReview: () => void;
  onReport: () => void;
  onDelete: () => Promise<void>;
  onNotify: (message: string) => void;
}) {
  const [tab, setTab] = useState("Profile");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
                  <h3>Academic profile</h3>
                  <p className="section-status">
                    {academic.confirmedAt
                      ? "Confirmed by counsellor"
                      : "Not confirmed yet"}
                  </p>
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
                  <h3>Subject areas</h3>
                </div>
                {student.confidence != null && (
                  <span className="confidence">
                    {student.confidence}% confidence
                  </span>
                )}
                <button
                  className="text-button"
                  disabled={!student.credits.length}
                  onClick={() => exportCreditSheet(student)}
                >
                  <Download size={14} /> Credit sheet
                </button>
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
                  <h3>Documents</h3>
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
                <b className={scoreTone(match.status)}>{statusLabel(match.status)}</b>
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
          {confirmingDelete ? (
            <div className="drawer-delete-confirmation">
              <strong>Delete {student.name} and all related data?</strong>
              <button
                className="secondary-button"
                disabled={deleting}
                onClick={() => setConfirmingDelete(false)}
              >
                Cancel
              </button>
              <button
                className="danger-button"
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true);
                  try {
                    await onDelete();
                  } catch (error) {
                    setDeleting(false);
                    setConfirmingDelete(false);
                    onNotify(messageOf(error) ?? "Could not delete the student");
                  }
                }}
              >
                {deleting ? <span className="spinner" /> : <Trash2 size={15} />}
                Delete permanently
              </button>
            </div>
          ) : (
            <>
              <button
                className="danger-button drawer-delete-button"
                onClick={() => setConfirmingDelete(true)}
              >
                <Trash2 size={15} /> Delete student
              </button>
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
            </>
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

const supportedDocumentTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
const documentMimeType = (file: File) => {
  if (supportedDocumentTypes.has(file.type)) return file.type;
  const extension = file.name.toLowerCase().split(".").pop();
  return extension === "pdf"
    ? "application/pdf"
    : extension === "jpg" || extension === "jpeg"
      ? "image/jpeg"
      : extension === "png"
        ? "image/png"
        : "";
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
  const [applyingFor, setApplyingFor] = useState<"master" | "bachelor">("master");
  const [degree, setDegree] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [schoolPercent, setSchoolPercent] = useState("");
  const [budget, setBudget] = useState("");
  const [english, setEnglish] = useState("");
  const country = "Italy";
  const [intake, setIntake] = useState(DEFAULT_INTAKE);
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
          ? Boolean(degree.trim()) &&
            (applyingFor === "master" ||
              !schoolPercent ||
              (Number(schoolPercent) >= 0 && Number(schoolPercent) <= 100))
          : true;
  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const selected = Array.from(list);
    const rejected = selected.filter(
      (file) => !documentMimeType(file) || file.size > 20 * 1024 * 1024,
    );
    if (rejected.length) {
      setError(
        `${rejected.map((file) => file.name).join(", ")} ${rejected.length === 1 ? "is" : "are"} not supported. Choose PDF, JPG or PNG files up to 20MB.`,
      );
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
        cgpa: applyingFor === "master" && cgpa ? Number(cgpa) : null,
        highestQualification: applyingFor === "bachelor" ? "higher_secondary" : "bachelor",
        higherSecondaryPercent: applyingFor === "bachelor" && schoolPercent ? Number(schoolPercent) : null,
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
              <div className="segmented qualification-switch" role="group" aria-label="Applying for">
                {([
                  ["master", "Master’s (has a degree)"],
                  ["bachelor", "Bachelor’s (FSc / A levels)"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={applyingFor === value}
                    className={applyingFor === value ? "active" : ""}
                    onClick={() => setApplyingFor(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="field-grid">
                <label>
                  {applyingFor === "master" ? "Current degree" : "School qualification"}
                  <input
                    value={degree}
                    onChange={(event) => setDegree(event.target.value)}
                    placeholder={applyingFor === "master" ? "BS Computer Science" : "FSc Pre-Engineering or A levels"}
                    required
                  />
                </label>
                {applyingFor === "master" ? (
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
                ) : (
                  <label>
                    FSc / A level result (%)
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={schoolPercent}
                      onChange={(event) => setSchoolPercent(event.target.value)}
                      placeholder="74"
                    />
                  </label>
                )}
                <label>
                  Target country
                  <input value="Italy" readOnly aria-describedby="country-note" />
                  <small id="country-note" className="field-hint">The programme catalogue covers Italy.</small>
                </label>
                <label>
                  Target intake
                  <select
                    value={intake}
                    onChange={(event) => setIntake(event.target.value)}
                  >
                    {UPCOMING_INTAKES.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
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
                MatchED will create {firstName}’s profile and prepare{" "}
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
  const [recoveringPassword, setRecoveringPassword] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("recovery") === "1",
  );

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
  if (authenticated && recoveringPassword)
    return (
      <ResetPasswordScreen
        onComplete={() => setRecoveringPassword(false)}
        onCancel={() => {
          window.history.replaceState({}, "", "/app");
          setRecoveringPassword(false);
          logout();
        }}
      />
    );
  return authenticated ? (
    <AppShell onLogout={logout} />
  ) : (
    <LoginScreen onLogin={() => setAuthenticated(true)} />
  );
}
