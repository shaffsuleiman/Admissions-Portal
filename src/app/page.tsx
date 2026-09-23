"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
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
  Paperclip,
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

type Student = {
  initials: string;
  name: string;
  degree: string;
  city: string;
  cgpa: string;
  target: string;
  stage: string;
  progress: number;
  tone: string;
  updated: string;
};

const students: Student[] = [
  { initials: "AH", name: "Ahmed Hassan", degree: "BS Computer Science", city: "Lahore", cgpa: "3.42 / 4.00", target: "Italy · Fall 2027", stage: "Shortlist ready", progress: 92, tone: "blue", updated: "12 min ago" },
  { initials: "FN", name: "Fatima Noor", degree: "BS Software Engineering", city: "Islamabad", cgpa: "3.18 / 4.00", target: "Italy · Fall 2027", stage: "Needs review", progress: 68, tone: "violet", updated: "1 hr ago" },
  { initials: "AR", name: "Ali Raza", degree: "BSc Mathematics", city: "Gujranwala", cgpa: "3.51 / 4.00", target: "Germany · Spring 2027", stage: "Applied", progress: 84, tone: "orange", updated: "3 hrs ago" },
  { initials: "SA", name: "Sara Ahmed", degree: "BS Electrical Engineering", city: "Karachi", cgpa: "3.29 / 4.00", target: "Italy · Fall 2027", stage: "Documents missing", progress: 42, tone: "pink", updated: "Yesterday" },
  { initials: "UA", name: "Usman Ali", degree: "BS Information Technology", city: "Faisalabad", cgpa: "3.67 / 4.00", target: "Italy · Fall 2027", stage: "Profile processing", progress: 31, tone: "green", updated: "Yesterday" },
];

const matchResults = [
  { id: 1, university: "University of Padua", programme: "MSc Data Science", city: "Padua", status: "Eligible", score: 96, fee: "€2,700", deadline: "18 Dec 2026", verified: "12 Sep 2026", logo: "UP", tone: "blue", reasons: ["CS credits: 48 / 30 ECTS", "Math credits: 24 / 18 ECTS", "English: IELTS 7.0 meets 6.5"] },
  { id: 2, university: "University of Bologna", programme: "MSc Computer Science", city: "Bologna", status: "Eligible", score: 91, fee: "€3,200", deadline: "11 Jan 2027", verified: "18 Sep 2026", logo: "UB", tone: "red", reasons: ["Relevant degree confirmed", "Converted grade: 97 / 110", "English requirement met"] },
  { id: 3, university: "Politecnico di Torino", programme: "MSc ICT Engineering", city: "Turin", status: "Borderline", score: 84, fee: "€2,600", deadline: "02 Feb 2027", verified: "08 Sep 2026", logo: "PT", tone: "orange", reasons: ["CS credits: 48 / 45 ECTS", "Math credits: 24 / 26 ECTS", "Short by 2 ECTS in mathematics"] },
  { id: 4, university: "University of Milan", programme: "MSc Artificial Intelligence", city: "Milan", status: "Not eligible", score: 62, fee: "€3,900", deadline: "28 Sep 2026", verified: "20 Sep 2026", logo: "UM", tone: "violet", reasons: ["Relevant degree confirmed", "Converted grade: 97 / 100", "Requires 36 ECTS in mathematics"] },
];

const programmes = [
  { code: "UP", university: "University of Padua", programme: "MSc Data Science", city: "Padua", fee: "€2,700", intake: "Fall 2027", deadline: "18 Dec", freshness: "Verified 11d ago", tone: "blue", source: "https://www.unipd.it/en/" },
  { code: "UB", university: "University of Bologna", programme: "MSc Computer Science", city: "Bologna", fee: "€3,200", intake: "Fall 2027", deadline: "11 Jan", freshness: "Verified 5d ago", tone: "red", source: "https://www.unibo.it/en" },
  { code: "PT", university: "Politecnico di Torino", programme: "MSc ICT Engineering", city: "Turin", fee: "€2,600", intake: "Fall 2027", deadline: "02 Feb", freshness: "Verified 15d ago", tone: "orange", source: "https://www.polito.it/en" },
  { code: "UM", university: "University of Milan", programme: "MSc Artificial Intelligence", city: "Milan", fee: "€3,900", intake: "Fall 2027", deadline: "28 Sep", freshness: "Verified 3d ago", tone: "violet", source: "https://www.unimi.it/en" },
  { code: "UPI", university: "University of Pisa", programme: "MSc Computer Engineering", city: "Pisa", fee: "€2,400", intake: "Fall 2027", deadline: "16 Jan", freshness: "Verified 8d ago", tone: "green", source: "https://www.unipi.it/en/" },
  { code: "CF", university: "Ca’ Foscari University", programme: "MSc Data Analytics", city: "Venice", fee: "€2,100", intake: "Fall 2027", deadline: "07 Feb", freshness: "Verified 2d ago", tone: "cyan", source: "https://www.unive.it/web/en" },
];

// Demo "today" — matches the dated sample data throughout the workspace.
const TODAY = new Date(2026, 8, 23);

const calendarEvents: Record<string, { label: string; tone: "urgent" | "blue" | "green" }[]> = {
  "2026-09-19": [{ label: "Submitted", tone: "green" }],
  "2026-09-23": [{ label: "Profile review", tone: "blue" }],
  "2026-09-28": [{ label: "Milan deadline", tone: "urgent" }],
  "2026-10-02": [{ label: "Ca’ Foscari pre-enrolment", tone: "blue" }],
  "2026-10-08": [{ label: "Pisa deadline", tone: "blue" }],
};

const isoDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
}

function useEscape(onEscape: () => void) {
  const handler = useRef(onEscape);
  useEffect(() => { handler.current = onEscape; });
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") handler.current(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
}

const navGroups: { label: string; items: { label: View; icon: typeof LayoutDashboard }[] }[] = [
  { label: "Workspace", items: [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Students", icon: Users },
    { label: "Matches", icon: Sparkles },
    { label: "Programmes", icon: BookOpen },
    { label: "Applications", icon: FileCheck2 },
    { label: "Calendar", icon: CalendarDays },
  ] },
  { label: "Manage", items: [
    { label: "Reports", icon: BarChart3 },
    { label: "Team", icon: Building2 },
    { label: "Settings", icon: Settings },
  ] },
];

function Brand({ light = false }: { light?: boolean }) {
  return <div className={`brand ${light ? "brand-light" : ""}`}><div className="brand-symbol"><span /><span /><span /></div><div><strong>Merit</strong><small>ADMISSIONS OS</small></div></div>;
}

// Turns Supabase auth errors into guidance a counsellor can act on.
function authErrorMessage(error: { code?: string; message: string }) {
  switch (error.code) {
    case "over_email_send_rate_limit": return "Too many emails were sent in the last hour. Wait a while and try again, or check your inbox for an earlier confirmation email.";
    case "over_request_rate_limit": return "Too many attempts. Please wait a minute and try again.";
    case "invalid_credentials": return "That email and password don’t match. Check them or reset your password.";
    case "email_not_confirmed": return "Confirm your email first — use the link we sent you, then sign in.";
    case "user_already_exists":
    case "email_exists": return "An account with this email already exists. Sign in instead.";
    case "weak_password": return "Choose a stronger password (at least 8 characters).";
    default: return error.message;
  }
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const configured = isSupabaseConfigured();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  // Demo credentials are only prefilled when there is no real backend to sign in to.
  const [email, setEmail] = useState(configured ? "" : "minna@nexuseducation.pk");
  const [password, setPassword] = useState(configured ? "" : "admissions2027");
  const [fullName, setFullName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: "error" | "success" } | null>(null);
  const signingUp = mode === "signup";

  const switchMode = (next: "signin" | "signup") => { setMode(next); setMessage(null); };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);
    if (!configured) {
      window.setTimeout(() => { setLoading(false); onLogin(); }, 550);
      return;
    }
    if (signingUp) return createAccount();

    const { error } = await createSupabaseClient().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMessage({ text: authErrorMessage(error), tone: "error" });
    else onLogin();
  };

  const signInWithGoogle = async () => {
    if (!configured) return onLogin();
    setMessage(null);
    const { error } = await createSupabaseClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setMessage({ text: authErrorMessage(error), tone: "error" });
  };

  const sendPasswordReset = async () => {
    if (!configured) return setMessage({ text: "Connect Supabase to enable password resets.", tone: "error" });
    if (!email) return setMessage({ text: "Enter your work email first, then choose “Forgot password?”.", tone: "error" });
    const { error } = await createSupabaseClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    setMessage(error ? { text: authErrorMessage(error), tone: "error" } : { text: `Password reset instructions sent to ${email}.`, tone: "success" });
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
    else setMessage({ text: `Check ${email} to confirm your account, then sign in.`, tone: "success" });
  };

  return <main className="auth-page">
    <section className="auth-story">
      <Brand light />
      <div className="story-copy">
        <span className="story-kicker"><Sparkles size={15} /> Built for education counsellors</span>
        <h1>Every student deserves a <em>clear path</em> forward.</h1>
        <p>Turn transcripts into verified, explainable programme matches—without losing hours to spreadsheets and scattered university pages.</p>
        <div className="proof-row">
          <div><strong>624</strong><span>verified programmes</span></div>
          <div><strong>&lt; 15m</strong><span>to a shortlist</span></div>
          <div><strong>98.4%</strong><span>data accuracy</span></div>
        </div>
      </div>
      <div className="story-card">
        <div className="story-card-head"><div className="avatar blue">AH</div><div><strong>Ahmed Hassan</strong><span>BS Computer Science · 3.42 CGPA</span></div><span className="live-dot">PROFILE REVIEWED</span></div>
        <div className="story-match"><div className="mini-school red">UB</div><div><strong>MSc Computer Science</strong><span>University of Bologna</span></div><b>91%</b></div>
        <div className="story-rule"><CheckCircle2 size={15} /><span>All 6 eligibility checks passed</span><small>Verified 5 days ago</small></div>
      </div>
      <p className="story-foot">Trusted data. Human-reviewed decisions.</p>
    </section>
    <section className="auth-panel">
      <div className="mobile-brand"><Brand /></div>
      <div className="auth-box">
        <p className="eyebrow">{signingUp ? "GET STARTED" : "WELCOME BACK"}</p>
        <h2>{signingUp ? "Create your workspace" : "Sign in to your workspace"}</h2>
        <p className="muted">{signingUp ? "Set up your consultancy’s account. You can invite counsellors once you’re in." : "Continue managing students, applications, and deadlines."}</p>
        <form onSubmit={submit}>
          {signingUp && <>
            <label>Your name<div className="input-wrap"><UserPlus size={17} /><input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" placeholder="Minna Shah" required /></div></label>
            <label>Consultancy name<div className="input-wrap"><Building2 size={17} /><input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} autoComplete="organization" placeholder="Nexus Education" required /></div></label>
          </>}
          <label>Work email<div className="input-wrap"><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@consultancy.com" required /></div></label>
          <label>Password<div className="input-wrap"><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={signingUp ? "new-password" : "current-password"} minLength={signingUp ? 8 : undefined} placeholder={signingUp ? "At least 8 characters" : ""} required /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          {!signingUp && <div className="form-meta"><label className="check-line"><input type="checkbox" defaultChecked /> Keep me signed in</label><button type="button" className="link-button" onClick={sendPasswordReset}>Forgot password?</button></div>}
          {message && <p className={`auth-message ${message.tone}`} role={message.tone === "error" ? "alert" : "status"}>{message.text}</p>}
          <button className="login-button" type="submit" disabled={loading}>{loading ? <span className="spinner" /> : <>{signingUp ? "Create workspace" : "Sign in"} <ArrowRight size={17} /></>}</button>
        </form>
        <div className="auth-divider"><span>or</span></div>
        <button className="sso-button" onClick={signInWithGoogle}><span className="google-mark">G</span> Continue with Google</button>
        <p className="auth-switch">{signingUp ? <>Already have an account? <button onClick={() => switchMode("signin")}>Sign in</button></> : <>New to Merit? <button onClick={() => switchMode("signup")}>Create a workspace</button></>}</p>
        {configured
          ? <p className="demo-notice connected"><ShieldCheck size={13} /> Secure sign-in · connected to your Merit workspace</p>
          : <p className="demo-notice"><Zap size={13} /> Demo mode · add Supabase credentials to enable real accounts</p>}
      </div>
      <div className="legal-row"><span>Privacy</span><span>Terms</span><span>Help centre</span></div>
    </section>
  </main>;
}

function AppShell({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<View>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newStudent, setNewStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("Workspace profile");
  const toastTimer = useRef<number | undefined>(undefined);
  const searchInput = useRef<HTMLInputElement>(null);

  const notify = (message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  };
  const navigate = (next: View) => { setView(next); setSidebarOpen(false); };
  const openSettings = (section: SettingsSection) => { setSettingsSection(section); navigate("Settings"); };
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

  return <main className="product-shell">
    {sidebarOpen && <button className="mobile-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-top"><Brand /><button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={19} /></button></div>
      <button className="workspace-card"><span className="workspace-avatar">N</span><span><small>WORKSPACE</small><strong>Nexus Education</strong></span><ChevronDown size={15} /></button>
      <nav aria-label="Main">{navGroups.map((group) => <div className="nav-group" key={group.label}><p>{group.label}</p>{group.items.map(({ label, icon: Icon }) => <button className={view === label ? "active" : ""} aria-current={view === label ? "page" : undefined} key={label} onClick={() => label === "Settings" ? openSettings("Workspace profile") : navigate(label)}><Icon size={17} /><span>{label}</span>{label === "Students" && <b>{students.length}</b>}{label === "Calendar" && <i aria-label="Deadline this week" />}</button>)}</div>)}</nav>
      <div className="sidebar-bottom"><div className="usage-card"><div><span>MONTHLY PROFILES</span><strong>18 <small>/ 30 used</small></strong></div><div className="usage-track"><span /></div><button onClick={() => openSettings("Subscription")}>View plan <ArrowRight size={13} /></button></div><button className="user-card" onClick={() => openSettings("Workspace profile")}><span className="avatar pink">MS</span><span><strong>Minna Shah</strong><small>Admin counsellor</small></span><MoreHorizontal size={16} /></button><button className="logout-button" onClick={onLogout}><LogOut size={15} /> Sign out</button></div>
    </aside>

    <section className="main-area">
      <header className="topbar"><button className="menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={13} /><strong>{view}</strong></div><div className="topbar-actions"><form className="global-search" role="search" onSubmit={submitSearch}><Search size={16} /><input ref={searchInput} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students..." aria-label="Search students" /><kbd>⌘ K</kbd></form><button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-avatar avatar pink" aria-hidden="true">MS</div></div></header>
      <div className="page-wrap">
        {view === "Overview" && <Overview onNew={() => setNewStudent(true)} onNavigate={navigate} onStudent={setSelectedStudent} onNotify={notify} />}
        {view === "Students" && <StudentsView key={studentQuery} initialQuery={studentQuery} onNew={() => setNewStudent(true)} onSelect={setSelectedStudent} onNotify={notify} />}
        {view === "Matches" && <MatchesView onOpen={() => setSelectedStudent(students[0])} onNotify={notify} />}
        {view === "Programmes" && <ProgrammesView onNotify={notify} />}
        {view === "Applications" && <ApplicationsView />}
        {view === "Calendar" && <CalendarView />}
        {view === "Reports" && <ReportsView onNotify={notify} />}
        {view === "Team" && <TeamView onNotify={notify} />}
        {view === "Settings" && <SettingsView key={settingsSection} initialSection={settingsSection} onNotify={notify} />}
      </div>
    </section>
    {newStudent && <NewStudentWizard onClose={() => setNewStudent(false)} onComplete={(name) => { setNewStudent(false); notify(`${name}’s profile created and ready for review`); }} />}
    {selectedStudent && <StudentDrawer key={selectedStudent.name} student={selectedStudent} onClose={() => setSelectedStudent(null)} onNotify={notify} />}
    <div className="toast-region" role="status" aria-live="polite">{toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}</div>
  </main>;
}

function PageTitle({ eyebrow, title, text, children }: { eyebrow: string; title: string; text: string; children?: React.ReactNode }) {
  return <header className="page-title"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p></div><div className="page-actions">{children}</div></header>;
}

function exportStudents(onNotify: (message: string) => void) {
  downloadCsv("students.csv", [["Name", "Degree", "CGPA", "City", "Destination", "Stage", "Profile %", "Updated"], ...students.map((s) => [s.name, s.degree, s.cgpa, s.city, s.target, s.stage, s.progress, s.updated])]);
  onNotify("Student list exported");
}

function Overview({ onNew, onNavigate, onStudent, onNotify }: { onNew: () => void; onNavigate: (view: View) => void; onStudent: (student: Student) => void; onNotify: (message: string) => void }) {
  return <>
    <PageTitle eyebrow="WEDNESDAY, 23 SEPTEMBER" title="Good morning, Minna." text="Here’s what needs your attention across your workspace."><button className="secondary-button" onClick={() => exportStudents(onNotify)}><Download size={16} /> Export</button><button className="primary-button" onClick={onNew}><Plus size={17} /> New student</button></PageTitle>
    <section className="metric-grid">
      <Metric icon={<Users size={18} />} tone="blue" label="Active students" value="12" meta="+3 this month" trend />
      <Metric icon={<Sparkles size={18} />} tone="violet" label="Matches generated" value="46" meta="18% faster" trend />
      <Metric icon={<CalendarDays size={18} />} tone="orange" label="Due this week" value="08" meta="3 need attention" />
      <Metric icon={<FileCheck2 size={18} />} tone="green" label="Applications live" value="17" meta="Across 9 students" />
    </section>
    <section className="dashboard-grid">
      <div className="panel focus-panel">
        <div className="panel-head"><div><p className="eyebrow">FOCUS FOR TODAY</p><h2>3 actions need your review</h2></div><button className="text-button" onClick={() => onNavigate("Students")}>View queue <ArrowRight size={14} /></button></div>
        <div className="focus-list">
          <button onClick={() => onStudent(students[1])}><span className="focus-icon violet"><Sparkles size={17} /></span><span><strong>Review Fatima’s extracted profile</strong><small>2 fields have low extraction confidence</small></span><span className="priority orange">HIGH</span><ChevronRight size={16} /></button>
          <button onClick={() => onNavigate("Applications")}><span className="focus-icon blue"><FileText size={17} /></span><span><strong>Upload Ahmed’s statement of purpose</strong><small>University of Bologna · due in 5 days</small></span><span className="priority blue">TODAY</span><ChevronRight size={16} /></button>
          <button onClick={() => onNavigate("Calendar")}><span className="focus-icon green"><CalendarDays size={17} /></span><span><strong>Confirm Ali’s Universitaly submission</strong><small>Pre-enrolment milestone is ready to complete</small></span><span className="priority green">READY</span><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="panel deadline-card"><div className="panel-head"><div><p className="eyebrow">UPCOMING</p><h2>Deadlines</h2></div><button className="icon-button" aria-label="Open calendar" onClick={() => onNavigate("Calendar")}><CalendarDays size={16} /></button></div><div className="compact-deadlines"><Deadline date="28" month="SEP" title="University of Milan" detail="Application · Ahmed Hassan" days="5 days" urgent /><Deadline date="02" month="OCT" title="Ca’ Foscari" detail="Pre-enrolment · Fatima Noor" days="9 days" /><Deadline date="08" month="OCT" title="University of Pisa" detail="Application · Sara Ahmed" days="15 days" /></div><button className="full-link" onClick={() => onNavigate("Calendar")}>Open deadline calendar <ArrowRight size={14} /></button></div>
    </section>
    <section className="dashboard-grid lower-grid">
      <div className="panel recommended-panel"><div className="panel-head"><div><p className="eyebrow">LATEST MATCH RUN</p><h2>Ahmed’s top matches</h2></div><button className="text-button" onClick={() => onNavigate("Matches")}>See all 14 <ArrowRight size={14} /></button></div><button className="student-strip" onClick={() => onStudent(students[0])}><span className="avatar blue">AH</span><span><strong>Ahmed Hassan</strong><small>BS Computer Science · profile reviewed</small></span><span className="verified"><ShieldCheck size={14} /> VERIFIED</span><ChevronRight size={16} /></button>{matchResults.slice(0,3).map((match) => <div className="mini-match" key={match.id}><div className={`mini-school ${match.tone}`}>{match.logo}</div><div><strong>{match.programme}</strong><span>{match.university} · {match.city}</span></div><div className="match-score"><b className={scoreTone(match.status)}>{match.score}%</b><span>{match.status}</span></div></div>)}</div>
      <div className="impact-card"><div className="impact-orbit"><Zap size={21} /></div><p className="eyebrow">YOUR IMPACT</p><h2>6.4 hours returned to your team this month.</h2><p>Shortlists are being completed 18% faster than last month.</p><button onClick={() => onNavigate("Reports")}>See productivity report <ArrowRight size={14} /></button><div className="impact-lines"><i /><i /><i /></div></div>
    </section>
  </>;
}

function Metric({ icon, tone, label, value, meta, trend }: { icon: React.ReactNode; tone: string; label: string; value: string; meta: string; trend?: boolean }) {
  return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><span>{label}</span><div><strong>{value}</strong><small className={trend ? "up" : ""}>{trend && "↗ "}{meta}</small></div></div>;
}

function Deadline({ date, month, title, detail, days, urgent = false }: { date: string; month: string; title: string; detail: string; days: string; urgent?: boolean }) {
  return <div className="deadline-row"><div className={`date-tile ${urgent ? "urgent" : ""}`}><strong>{date}</strong><span>{month}</span></div><div><strong>{title}</strong><span>{detail}</span></div><small className={urgent ? "urgent-text" : ""}>{days}</small></div>;
}

const studentTabs: { label: string; test: (student: Student) => boolean }[] = [
  { label: "All students", test: () => true },
  { label: "Needs review", test: (student) => /review|missing|processing/i.test(student.stage) },
  { label: "Applications", test: (student) => student.stage === "Applied" },
  { label: "Completed", test: (student) => student.stage === "Completed" },
];

const studentSorts: Record<string, (a: Student, b: Student) => number> = {
  "Newest first": () => 0,
  "Name A–Z": (a, b) => a.name.localeCompare(b.name),
  "Most complete": (a, b) => b.progress - a.progress,
  "Least complete": (a, b) => a.progress - b.progress,
};

function StudentsView({ initialQuery, onNew, onSelect, onNotify }: { initialQuery: string; onNew: () => void; onSelect: (student: Student) => void; onNotify: (message: string) => void }) {
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState(studentTabs[0].label);
  const [sort, setSort] = useState("Newest first");
  const filtered = useMemo(() => {
    const inTab = studentTabs.find((item) => item.label === tab)!.test;
    return students
      .filter((student) => inTab(student) && `${student.name} ${student.degree} ${student.stage}`.toLowerCase().includes(query.toLowerCase()))
      .sort(studentSorts[sort]);
  }, [query, tab, sort]);
  return <>
    <PageTitle eyebrow="STUDENT WORKSPACE" title="Students" text="Every profile, document, match, and application in one place."><button className="secondary-button" onClick={() => exportStudents(onNotify)}><Download size={16} /> Export list</button><button className="primary-button" onClick={onNew}><UserPlus size={17} /> Add student</button></PageTitle>
    <div className="tab-bar" role="tablist">{studentTabs.map((item) => <button key={item.label} role="tab" aria-selected={tab === item.label} className={tab === item.label ? "active" : ""} onClick={() => setTab(item.label)}>{item.label} <span>{students.filter(item.test).length}</span></button>)}</div>
    <div className="table-toolbar"><div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by student, degree, or stage" aria-label="Search students" />{query && <button className="clear-search" onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}</div><label className="outline-button sort-select"><ListFilter size={15} /><span className="sr-only">Sort students</span><select value={sort} onChange={(event) => setSort(event.target.value)}>{Object.keys(studentSorts).map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={15} /></label></div>
    <div className="panel data-table student-table"><div className="table-head"><span>STUDENT</span><span>DESTINATION</span><span>STAGE</span><span>PROFILE</span><span>UPDATED</span><span /></div>{filtered.map((student) => <button className="table-row" key={student.name} onClick={() => onSelect(student)}><span className="person-cell"><span className={`avatar ${student.tone}`}>{student.initials}</span><span><strong>{student.name}</strong><small>{student.degree} · {student.cgpa}</small></span></span><span className="destination-cell"><Flag size={14} />{student.target}</span><Status text={student.stage} /><span className="completion-cell"><span><i style={{ width: `${student.progress}%` }} /></span><small>{student.progress}%</small></span><span className="updated">{student.updated}</span><ChevronRight size={16} /></button>)}{!filtered.length && <div className="empty-state"><Search size={24} /><strong>No students found</strong><span>{query ? "Try a different search term." : `No students in “${tab}” yet.`}</span></div>}</div>
  </>;
}

function Status({ text }: { text: string }) {
  const tone = /missing|not eligible/i.test(text) ? "red" : /review|processing|borderline/i.test(text) ? "orange" : text.includes("Applied") ? "blue" : "green";
  return <span className={`status ${tone}`}><i />{text}</span>;
}

const scoreTone = (status: string) => status === "Not eligible" ? "score-bad" : status === "Borderline" ? "score-warn" : "";

function MatchesView({ onOpen, onNotify }: { onOpen: () => void; onNotify: (message: string) => void }) {
  const [filter, setFilter] = useState("All results");
  const visible = matchResults.filter((match) => filter === "All results" || match.status === filter);
  return <>
    <PageTitle eyebrow="ELIGIBILITY ENGINE" title="Match centre" text="Auditable results from verified rules—not AI guesses."><button className="secondary-button" onClick={() => { downloadCsv("ahmed-hassan-shortlist.csv", [["Programme", "University", "City", "Status", "Score %", "Tuition", "Deadline", "Verified"], ...matchResults.map((m) => [m.programme, m.university, m.city, m.status, m.score, m.fee, m.deadline, m.verified])]); onNotify("Shortlist downloaded"); }}><Download size={16} /> Download shortlist</button><button className="primary-button" onClick={() => onNotify("Match engine is checking 624 programmes")}><Sparkles size={16} /> Run new match</button></PageTitle>
    <div className="match-profile-bar"><button className="profile-select" onClick={onOpen}><span className="avatar blue">AH</span><span><small>MATCHING FOR</small><strong>Ahmed Hassan</strong></span><ChevronDown size={16} /></button><div className="profile-facts"><span><GraduationCap size={15} /><b>BS Computer Science</b><small>3.42 / 4.00</small></span><span><BookOpen size={15} /><b>72 mapped ECTS</b><small>Profile reviewed</small></span><span><Flag size={15} /><b>Italy · Fall 2027</b><small>Budget €4,000 / year</small></span></div><span className="verified-banner"><ShieldCheck size={17} /> Human verified</span></div>
    <div className="match-summary"><div><strong>14</strong><span>programmes checked</span></div><div className="good"><strong>8</strong><span>eligible</span></div><div className="warn"><strong>4</strong><span>borderline</span></div><div className="bad"><strong>2</strong><span>not eligible</span></div><p><Clock3 size={14} /> Completed in 42 seconds</p></div>
    <div className="match-controls"><div className="segmented" role="group" aria-label="Filter results">{["All results", "Eligible", "Borderline", "Not eligible"].map((item) => <button key={item} aria-pressed={filter === item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="outline-button"><ListFilter size={15} /> Sort: Best match</button></div>
    <div className="match-card-list">{visible.map((match) => <article className="match-card" key={match.id}><div className="match-main"><div className={`school-logo ${match.tone}`}>{match.logo}</div><div className="match-title"><div><Status text={match.status} /><span className="fresh-label"><ShieldCheck size={12} /> Verified {match.verified}</span></div><h2>{match.programme}</h2><p>{match.university} <span>·</span> <MapPin size={13} /> {match.city}</p><div className="programme-meta"><span>Annual tuition <b>{match.fee}</b></span><span>Application deadline <b>{match.deadline}</b></span><span>Teaching language <b>English</b></span></div></div><div className="large-score"><strong className={scoreTone(match.status)}>{match.score}<small>%</small></strong><span>match score</span></div></div><div className="rule-bar"><div>{match.reasons.map((reason, index) => <span key={reason} className={match.status === "Not eligible" && index === 2 ? "fail" : match.status === "Borderline" && index === 2 ? "warn" : ""}>{match.status === "Not eligible" && index === 2 ? <X size={13} /> : match.status === "Borderline" && index === 2 ? <CircleAlert size={13} /> : <Check size={13} />}{reason}</span>)}</div><button>View full eligibility <ArrowRight size={14} /></button></div></article>)}</div>
  </>;
}

function ProgrammesView({ onNotify }: { onNotify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const visible = programmes.filter((programme) => `${programme.programme} ${programme.university} ${programme.city}`.toLowerCase().includes(query.toLowerCase()));
  return <>
    <PageTitle eyebrow="VERIFIED DATABASE" title="Programmes" text="Current entry rules, tuition, and deadlines—linked to primary sources."><button className="secondary-button" onClick={() => { downloadCsv("programmes.csv", [["Programme", "University", "City", "Intake", "Tuition / year", "Deadline", "Data status", "Source"], ...visible.map((p) => [p.programme, p.university, p.city, p.intake, p.fee, p.deadline, p.freshness, p.source])]); onNotify("Programme database exported"); }}><Download size={16} /> Export database</button></PageTitle>
    <div className="database-banner"><div className="database-icon"><ShieldCheck size={22} /></div><div><strong>Italy database is ready for the 2027/28 intake</strong><span>624 programmes · 98.4% accuracy · last full refresh 20 September 2026</span></div><div className="database-stats"><span><b>614</b> verified</span><span className="warn"><b>8</b> in review</span><span className="bad"><b>2</b> need attention</span></div></div>
    <div className="programme-filters"><div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search programme, university, or city" aria-label="Search programmes" />{query && <button className="clear-search" onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}</div><button className="outline-button"><Flag size={15} /> Italy <ChevronDown size={14} /></button><button className="outline-button"><GraduationCap size={15} /> Master’s <ChevronDown size={14} /></button><button className="outline-button"><Filter size={15} /> More filters</button></div>
    <div className="panel data-table programme-table"><div className="table-head"><span>PROGRAMME</span><span>INTAKE</span><span>TUITION / YEAR</span><span>DEADLINE</span><span>DATA STATUS</span><span /></div>{visible.map((programme) => <a className="table-row" key={programme.programme} href={programme.source} target="_blank" rel="noreferrer" aria-label={`${programme.programme}, ${programme.university} — open source website`}><span className="person-cell"><span className={`school-logo small ${programme.tone}`}>{programme.code}</span><span><strong>{programme.programme}</strong><small>{programme.university} · {programme.city}</small></span></span><span>{programme.intake}</span><span><b>{programme.fee}</b></span><span>{programme.deadline}</span><span className="fresh-cell"><ShieldCheck size={13} />{programme.freshness}</span><ExternalLink size={15} /></a>)}{!visible.length && <div className="empty-state"><Search size={24} /><strong>No programmes found</strong><span>Try a different programme, university, or city.</span></div>}</div>
  </>;
}

const applicationColumns = [
  { title: "SHORTLISTED", tone: "neutral", cards: [{ name: "Ahmed Hassan", programme: "MSc Data Science", uni: "University of Padua", date: "Dec 18", avatar: "AH", color: "blue" }, { name: "Fatima Noor", programme: "MSc Computer Science", uni: "Ca’ Foscari University", date: "Feb 07", avatar: "FN", color: "violet" }] },
  { title: "APPLICATION READY", tone: "orange", cards: [{ name: "Ahmed Hassan", programme: "MSc Computer Science", uni: "University of Bologna", date: "Jan 11", avatar: "AH", color: "blue" }, { name: "Sara Ahmed", programme: "MSc ICT Engineering", uni: "Politecnico di Torino", date: "Feb 02", avatar: "SA", color: "pink" }] },
  { title: "SUBMITTED", tone: "blue", cards: [{ name: "Ali Raza", programme: "MSc Applied Mathematics", uni: "TU Munich", date: "Submitted Sep 19", avatar: "AR", color: "orange" }, { name: "Usman Ali", programme: "MSc Information Systems", uni: "University of Pisa", date: "Submitted Sep 16", avatar: "UA", color: "green" }] },
  { title: "DECISION", tone: "green", cards: [{ name: "Hira Khan", programme: "MSc Economics", uni: "University of Bologna", date: "Conditional offer", avatar: "HK", color: "cyan" }] },
];

function ApplicationsView() {
  return <><PageTitle eyebrow="APPLICATION TRACKER" title="Applications" text="Move every application from shortlist to enrolment without missing a step."><button className="secondary-button"><Filter size={16} /> Filter</button><button className="primary-button"><Plus size={17} /> Add application</button></PageTitle><div className="pipeline-summary"><span><b>17</b> active applications</span><i /><span><b>6</b> awaiting documents</span><i /><span><b>4</b> submitted this month</span><i /><span className="success"><b>2</b> offers received</span></div><div className="kanban">{applicationColumns.map((column) => <section className="kanban-column" key={column.title}><header><span className={`column-dot ${column.tone}`} />{column.title}<b>{column.cards.length}</b><button aria-label={`Add to ${column.title.toLowerCase()}`}><Plus size={15} /></button></header><div>{column.cards.map((card) => <article className="application-card" key={`${card.name}-${card.programme}`}><div className="application-person"><span className={`avatar ${card.color}`}>{card.avatar}</span><div><strong>{card.name}</strong><small>{card.date}</small></div><button aria-label={`More actions for ${card.name}, ${card.programme}`}><MoreHorizontal size={16} /></button></div><h3>{card.programme}</h3><p>{card.uni}</p><div className="doc-progress"><span><i style={{ width: card.date.includes("Submitted") || card.date.includes("offer") ? "100%" : "67%" }} /></span><small>{card.date.includes("Submitted") || card.date.includes("offer") ? "Documents complete" : "4 of 6 documents"}</small></div><footer><span><Paperclip size={13} /> {card.date.includes("Submitted") ? "6" : "4"}</span><span><Clock3 size={13} /> {card.date}</span></footer></article>)}</div></section>)}</div></>;
}

function CalendarView() {
  const [month, setMonth] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const lead = (month.getDay() + 6) % 7; // Monday-first grid
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((lead + daysInMonth) / 7) * 7 }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index - lead + 1));
  const shiftMonth = (by: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + by, 1));
  const monthLabel = month.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  return <><PageTitle eyebrow="DEADLINE CONTROL" title="Calendar" text="Application, pre-enrolment, scholarship, and visa milestones together."><button className="secondary-button" onClick={() => setMonth(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))}>Today</button><button className="primary-button"><Plus size={17} /> Add deadline</button></PageTitle><div className="calendar-layout"><div className="panel month-panel"><header><button onClick={() => shiftMonth(-1)} aria-label="Previous month"><ArrowLeft size={17} /></button><h2 aria-live="polite">{monthLabel}</h2><button onClick={() => shiftMonth(1)} aria-label="Next month"><ArrowRight size={17} /></button></header><div className="weekday-row">{["MON","TUE","WED","THU","FRI","SAT","SUN"].map((day) => <span key={day}>{day}</span>)}</div><div className="month-grid">{cells.map((date) => { const key = isoDate(date); return <div key={key} className={`${date.getMonth() !== month.getMonth() ? "muted-day" : ""} ${key === isoDate(TODAY) ? "today" : ""}`}><span>{date.getDate()}</span>{calendarEvents[key]?.map((event) => <small key={event.label} className={`event ${event.tone}`} title={event.label}>{event.label}</small>)}</div>; })}</div></div><aside className="panel agenda-panel"><div className="panel-head"><div><p className="eyebrow">NEXT 30 DAYS</p><h2>Agenda</h2></div></div><p className="agenda-date">MONDAY · 28 SEPTEMBER</p><Deadline date="28" month="SEP" title="University of Milan" detail="Application · Ahmed Hassan" days="5 days" urgent /><p className="agenda-date">FRIDAY · 2 OCTOBER</p><Deadline date="02" month="OCT" title="Ca’ Foscari" detail="Pre-enrolment · Fatima Noor" days="9 days" /><p className="agenda-date">THURSDAY · 8 OCTOBER</p><Deadline date="08" month="OCT" title="University of Pisa" detail="Application · Sara Ahmed" days="15 days" /></aside></div></>;
}

function ReportsView({ onNotify }: { onNotify: (message: string) => void }) {
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const shortlists = [19, 27, 24, 34, 36, 44];
  const chartMax = 60;
  return <><PageTitle eyebrow="WORKSPACE INTELLIGENCE" title="Reports" text="Track the time saved, student momentum, and team outcomes."><button className="secondary-button" onClick={() => { downloadCsv("shortlists-report.csv", [["Month", "Shortlists generated"], ...months.map((m, i) => [m, shortlists[i]])]); onNotify("Report downloaded"); }}><Download size={16} /> Download report</button></PageTitle><section className="metric-grid"><Metric icon={<Clock3 size={18} />} tone="blue" label="Avg. time to shortlist" value="14m" meta="42% faster" trend /><Metric icon={<CheckCircle2 size={18} />} tone="green" label="Eligible match rate" value="78%" meta="12% increase" trend /><Metric icon={<Users size={18} />} tone="violet" label="Students progressed" value="09" meta="of 12 active" /><Metric icon={<CalendarDays size={18} />} tone="orange" label="Deadlines met" value="94%" meta="6% increase" trend /></section><div className="report-grid"><div className="panel chart-panel"><div className="panel-head"><div><p className="eyebrow">TEAM OUTPUT</p><h2>Shortlists generated</h2></div><button className="outline-button">Last 6 months <ChevronDown size={14} /></button></div><div className="bar-chart"><div className="y-labels"><span>60</span><span>40</span><span>20</span><span>0</span></div><div className="bars" role="img" aria-label={`Shortlists generated: ${months.map((m, i) => `${m} ${shortlists[i]}`).join(", ")}`}>{shortlists.map((value, index) => <div key={months[index]}><i style={{ height: `${(value / chartMax) * 100}%` }}><span>{value}</span></i><small>{months[index]}</small></div>)}</div></div></div><div className="panel health-panel"><p className="eyebrow">STUDENT PIPELINE</p><h2>Workspace health</h2><div className="health-ring"><div><strong>82</strong><span>/ 100</span></div></div><strong className="health-label">Healthy and improving</strong><p>Up 8 points from last month</p><div className="health-list"><span><i className="green" />On track <b>7</b></span><span><i className="orange" />Needs review <b>3</b></span><span><i className="red" />At risk <b>2</b></span></div></div></div></>;
}

function TeamView({ onNotify }: { onNotify: (message: string) => void }) {
  const team = [{ name: "Minna Shah", role: "Workspace admin", email: "minna@nexuseducation.pk", initials: "MS", tone: "pink", active: "Now" }, { name: "Adeel Khan", role: "Senior counsellor", email: "adeel@nexuseducation.pk", initials: "AK", tone: "blue", active: "12 min ago" }, { name: "Zara Ali", role: "Counsellor", email: "zara@nexuseducation.pk", initials: "ZA", tone: "violet", active: "2 hrs ago" }];
  return <><PageTitle eyebrow="WORKSPACE ACCESS" title="Team" text="Manage counsellors, roles, and student access across your consultancy."><button className="primary-button" onClick={() => { const link = `${window.location.origin}/?invite=nexus-education`; navigator.clipboard?.writeText(link).then(() => onNotify("Invitation link copied"), () => onNotify(`Share this invite link: ${link}`)); }}><Plus size={17} /> Invite member</button></PageTitle><div className="team-grid"><div className="panel member-panel"><div className="panel-head"><div><h2>Team members</h2><p>3 active members · 2 seats available</p></div></div>{team.map((member) => <div className="member-row" key={member.email}><span className={`avatar ${member.tone}`}>{member.initials}</span><div><strong>{member.name}</strong><small>{member.email}</small></div><span className="role-pill">{member.role}</span><span className="last-active"><i />{member.active}</span><button aria-label={`More actions for ${member.name}`}><MoreHorizontal size={17} /></button></div>)}</div><div className="panel access-panel"><div className="access-icon"><ShieldCheck size={21} /></div><h2>Student data stays isolated</h2><p>Role-based permissions and workspace isolation keep each consultancy’s records private.</p><ul><li><Check size={14} /> Manager and counsellor roles</li><li><Check size={14} /> Student-level access controls</li><li><Check size={14} /> Full activity log</li></ul><button className="outline-button">Review permissions</button></div></div></>;
}

const settingsSections = ["Workspace profile", "Destinations", "Notifications", "Privacy & data", "Subscription"] as const;
type SettingsSection = typeof settingsSections[number];

const settingsToggles: Record<Exclude<SettingsSection, "Workspace profile" | "Subscription">, { intro: string; toggles: { title: string; detail: string; on: boolean }[] }> = {
  Destinations: { intro: "Choose which countries appear in matching and programme search.", toggles: [
    { title: "Italy", detail: "624 verified programmes · 2027/28 intake", on: true },
    { title: "Germany", detail: "Programme data in verification", on: true },
    { title: "France", detail: "Available on request", on: false },
  ] },
  Notifications: { intro: "Decide when counsellors hear about deadlines and profile changes.", toggles: [
    { title: "Deadline reminders", detail: "Email assigned counsellors 14, 7, and 2 days before a deadline", on: true },
    { title: "Profile ready for review", detail: "Notify when document extraction finishes", on: true },
    { title: "Weekly activity summary", detail: "Send a Monday digest to workspace admins", on: false },
  ] },
  "Privacy & data": { intro: "Control how long student records and documents are kept.", toggles: [
    { title: "Require consent before processing", detail: "Block document upload until consent is recorded", on: true },
    { title: "Auto-delete inactive students", detail: "Remove records with no activity for 24 months", on: false },
    { title: "Activity log", detail: "Record who viewed or edited each student profile", on: true },
  ] },
};

function SettingsView({ initialSection, onNotify }: { initialSection: SettingsSection; onNotify: (message: string) => void }) {
  const [section, setSection] = useState<SettingsSection>(initialSection);
  const [formVersion, setFormVersion] = useState(0);
  const discard = () => { setFormVersion(formVersion + 1); onNotify("Changes discarded"); };
  const toggles = section in settingsToggles ? settingsToggles[section as keyof typeof settingsToggles] : null;
  return <><PageTitle eyebrow="WORKSPACE SETTINGS" title="Settings" text="Manage your brand, notifications, destinations, and subscription." /><div className="settings-layout"><nav aria-label="Settings sections">{settingsSections.map((item) => <button key={item} className={section === item ? "active" : ""} aria-current={section === item ? "page" : undefined} onClick={() => setSection(item)}>{item}<ChevronRight size={15} /></button>)}</nav><div className="panel settings-card" key={`${section}-${formVersion}`}><div className="settings-head"><p className="eyebrow">{section.toUpperCase()}</p><h2>{section === "Workspace profile" ? "Consultancy details" : section}</h2><p>These settings apply to everyone in the Nexus Education workspace.</p></div>
    {section === "Workspace profile" && <><div className="brand-preview"><span className="workspace-avatar large">N</span><div><strong>Nexus Education</strong><span>European admissions consultancy · Lahore</span></div><button className="outline-button">Change logo</button></div><div className="field-grid"><label>Workspace name<input defaultValue="Nexus Education" /></label><label>Primary contact<input defaultValue="Minna Shah" /></label><label>Business email<input type="email" defaultValue="hello@nexuseducation.pk" /></label><label>Phone number<input type="tel" defaultValue="+92 300 123 4567" /></label><label className="wide">Student report tagline<input defaultValue="Your trusted partner for European admissions" /></label></div></>}
    {toggles && <div className="settings-placeholder"><p>{toggles.intro}</p>{toggles.toggles.map((toggle) => <label className="toggle-row" key={toggle.title}><span><strong>{toggle.title}</strong><small>{toggle.detail}</small></span><input type="checkbox" defaultChecked={toggle.on} /></label>)}</div>}
    {section === "Subscription" && <div className="plan-card"><div><p className="eyebrow">CURRENT PLAN</p><h3>Growth · 30 profiles / month</h3><p>Renews on 1 October 2026</p></div><div className="plan-usage"><span><b>18</b> of 30 profiles used this month</span><div className="usage-track"><span style={{ width: "60%" }} /></div><small>12 profiles remaining · resets 1 October</small></div></div>}
    {section !== "Subscription" && <footer><button className="secondary-button" onClick={discard}>Discard</button><button className="primary-button" onClick={() => onNotify("Workspace settings saved")}>Save changes</button></footer>}</div></div></>;
}

function StudentDrawer({ student, onClose, onNotify }: { student: Student; onClose: () => void; onNotify: (message: string) => void }) {
  const [tab, setTab] = useState("Profile");
  const closeButton = useRef<HTMLButtonElement>(null);
  const firstName = student.name.split(" ")[0];
  useEscape(onClose);
  useEffect(() => closeButton.current?.focus(), []);
  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="student-drawer" role="dialog" aria-modal="true" aria-labelledby="student-drawer-title" onMouseDown={(event) => event.stopPropagation()}><header><button className="drawer-close" ref={closeButton} onClick={onClose} aria-label="Close student profile"><X size={19} /></button><div className={`avatar large ${student.tone}`}>{student.initials}</div><div><Status text={student.stage} /><h2 id="student-drawer-title">{student.name}</h2><p>{student.degree} · {student.city}</p></div><button className="outline-button" aria-label="More actions"><MoreHorizontal size={16} /></button></header><nav role="tablist">{["Profile","Matches","Applications"].map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}{item === "Matches" && <span>14</span>}{item === "Applications" && <span>2</span>}</button>)}</nav>{tab === "Profile" && <div className="drawer-content"><section><div className="section-title"><div><p className="eyebrow">ACADEMIC PROFILE</p><h3>Reviewed information</h3></div><button className="text-button">Edit</button></div><div className="detail-grid"><span><small>Degree</small><strong>{student.degree}</strong></span><span><small>CGPA</small><strong>{student.cgpa}</strong></span><span><small>Graduation year</small><strong>2026</strong></span><span><small>Institution</small><strong>COMSATS University</strong></span></div></section><section><div className="section-title"><div><p className="eyebrow">CREDIT MAPPING</p><h3>Confirmed subject areas</h3></div><span className="confidence">96% confidence</span></div><div className="credit-list"><span><b>Computer science</b><i><em style={{ width: "86%" }} /></i><strong>48 ECTS</strong></span><span><b>Mathematics</b><i><em style={{ width: "52%" }} /></i><strong>24 ECTS</strong></span><span><b>Statistics</b><i><em style={{ width: "34%" }} /></i><strong>12 ECTS</strong></span></div></section><section><div className="section-title"><div><p className="eyebrow">DOCUMENTS</p><h3>Uploaded files</h3></div><button className="text-button">Add file</button></div><div className="document-list"><span><FileText size={17} /><b>BS transcript.pdf</b><small>18 courses extracted</small><CheckCircle2 size={16} /></span><span><FileText size={17} /><b>IELTS result.pdf</b><small>Overall 7.0 · verified</small><CheckCircle2 size={16} /></span><span><FileText size={17} /><b>Degree certificate.pdf</b><small>Verified</small><CheckCircle2 size={16} /></span></div></section></div>}{tab === "Matches" && <div className="drawer-content"><div className="drawer-summary"><span><strong>8</strong> eligible</span><span><strong>4</strong> borderline</span><span><strong>2</strong> not eligible</span></div>{matchResults.slice(0,3).map((match) => <div className="drawer-match" key={match.id}><span className={`mini-school ${match.tone}`}>{match.logo}</span><div><strong>{match.programme}</strong><small>{match.university}</small></div><b className={scoreTone(match.status)}>{match.score}%</b></div>)}</div>}{tab === "Applications" && <div className="drawer-content"><div className="application-timeline"><span className="done"><i><Check size={13} /></i><b>Profile reviewed</b><small>18 Sep 2026</small></span><span className="done"><i><Check size={13} /></i><b>Shortlist shared</b><small>21 Sep 2026</small></span><span className="current"><i>3</i><b>Applications in progress</b><small>2 programmes selected</small></span><span><i>4</i><b>Universitaly</b><small>Not started</small></span><span><i>5</i><b>Visa</b><small>Not started</small></span></div></div>}<footer><button className="secondary-button" onClick={() => { downloadCsv(`${student.name.toLowerCase().replaceAll(" ", "-")}-report.csv`, [["Field", "Value"], ["Name", student.name], ["Degree", student.degree], ["CGPA", student.cgpa], ["City", student.city], ["Destination", student.target], ["Stage", student.stage], ["Profile %", student.progress]]); onNotify(`${firstName}’s report downloaded`); }}><Download size={16} /> Report</button>{tab !== "Matches" && <button className="primary-button" onClick={() => setTab("Matches")}><Sparkles size={16} /> View matches</button>}</footer></aside></div>;
}

const formatBytes = (bytes: number) => bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

function NewStudentWizard({ onClose, onComplete }: { onClose: () => void; onComplete: (name: string) => void }) {
  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState(false);
  const [firstName, setFirstName] = useState("Ahmed");
  const [lastName, setLastName] = useState("Hassan");
  const [country, setCountry] = useState("Italy");
  const [intake, setIntake] = useState("Fall 2027");
  const [files, setFiles] = useState<{ name: string; size: string }[]>([{ name: "BS transcript.pdf", size: "2.4 MB" }]);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const labels = ["Student", "Documents", "Academics", "Review"];
  const fullName = `${firstName} ${lastName}`.trim();
  const canContinue = step === 1 ? Boolean(firstName.trim() && lastName.trim()) : step === 2 ? consent && files.length > 0 : true;
  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((current) => [...current, ...Array.from(list).filter((file) => !current.some((existing) => existing.name === file.name)).map((file) => ({ name: file.name, size: formatBytes(file.size) }))]);
  };
  useEscape(onClose);
  return <div className="modal-backdrop"><div className="wizard" role="dialog" aria-modal="true" aria-labelledby="wizard-title"><header><div><p className="eyebrow">NEW STUDENT INTAKE</p><h2 id="wizard-title">{step === 1 ? "Start with the basics" : step === 2 ? "Upload student documents" : step === 3 ? "Confirm academic goals" : "Ready to create the profile"}</h2></div><button onClick={onClose} aria-label="Close new student intake"><X size={20} /></button></header><div className="wizard-progress">{labels.map((label,index) => <div key={label} className={step >= index + 1 ? "active" : ""} aria-current={step === index + 1 ? "step" : undefined}><span>{step > index + 1 ? <Check size={13} /> : index + 1}</span><small>{label}</small>{index < labels.length - 1 && <i />}</div>)}</div><div className="wizard-body">{step === 1 && <><p className="step-help">Create the student record. You can invite the student to complete missing details later.</p><div className="field-grid"><label>First name<input value={firstName} onChange={(event) => setFirstName(event.target.value)} required autoFocus /></label><label>Last name<input value={lastName} onChange={(event) => setLastName(event.target.value)} required /></label><label>Email address<input type="email" defaultValue="ahmed.hassan@email.com" /></label><label>Phone number<input type="tel" defaultValue="+92 300 555 0142" /></label><label>Home city<input defaultValue="Lahore" /></label><label>Assigned counsellor<select defaultValue="Minna Shah"><option>Minna Shah</option><option>Adeel Khan</option><option>Zara Ali</option></select></label></div></>}{step === 2 && <><p className="step-help">AI will extract structured information. You’ll review every field before matching.</p><input ref={fileInput} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" hidden onChange={(event) => { addFiles(event.target.files); event.target.value = ""; }} /><button className={`drop-zone ${dragging ? "dragging" : ""}`} onClick={() => fileInput.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}><span><UploadCloud size={23} /></span><strong>Drop documents here or browse</strong><small>Transcript, degree, IELTS · PDF, JPG, or PNG · 20MB max</small></button>{files.map((file) => <div className="uploaded-file" key={file.name}><FileText size={18} /><span><strong>{file.name}</strong><small>{file.size} · Ready to process</small></span><CheckCircle2 size={17} /><button onClick={() => setFiles(files.filter((item) => item.name !== file.name))} aria-label={`Remove ${file.name}`}><X size={15} /></button></div>)}<label className="consent-box"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span><strong>I confirm the student has consented to document processing.</strong><small>Required for GDPR-style data handling and your consultancy’s records.</small></span></label>{!files.length && <p className="step-hint">Add at least one document to continue.</p>}</>}{step === 3 && <><p className="step-help">Set matching preferences. These can be changed at any time.</p><div className="field-grid"><label>Current degree<input defaultValue="BS Computer Science" /></label><label>CGPA<input defaultValue="3.42 / 4.00" /></label><label>Target country<select value={country} onChange={(event) => setCountry(event.target.value)}><option>Italy</option><option>Germany</option><option>France</option><option>Hungary</option></select></label><label>Target intake<select value={intake} onChange={(event) => setIntake(event.target.value)}><option>Fall 2027</option><option>Spring 2027</option></select></label><label>Max. annual tuition<input defaultValue="€4,000" /></label><label>English result<input defaultValue="IELTS 7.0" /></label></div></>}{step === 4 && <div className="review-step"><div className="review-icon"><Sparkles size={24} /></div><h3>Everything looks ready.</h3><p>Merit will create {firstName}’s profile and prepare {files.length} uploaded {files.length === 1 ? "document" : "documents"} for your review.</p><div className="review-summary"><span><CheckCircle2 size={15} /><b>Student details</b><small>{fullName}</small></span><span><CheckCircle2 size={15} /><b>Consent confirmed</b><small>Recorded</small></span><span><CheckCircle2 size={15} /><b>Matching preferences</b><small>{country} · {intake}</small></span></div><div className="human-note"><ShieldCheck size={18} /><span><strong>You stay in control.</strong><small>No eligibility match will run until a counsellor confirms the extracted profile.</small></span></div></div>}</div><footer><button className="secondary-button" onClick={step === 1 ? onClose : () => setStep(step - 1)}><ArrowLeft size={16} /> {step === 1 ? "Cancel" : "Back"}</button><button className="primary-button" disabled={!canContinue} onClick={step === 4 ? () => onComplete(fullName) : () => setStep(step + 1)}>{step === 4 ? <><Check size={16} /> Create student profile</> : <>Continue <ArrowRight size={16} /></>}</button></footer></div></div>;
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

  if (checkingSession) return <main className="loading-screen"><Brand /><span className="spinner dark" /></main>;
  return authenticated ? <AppShell onLogout={logout} /> : <LoginScreen onLogin={() => setAuthenticated(true)} />;
}
