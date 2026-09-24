import { createClient } from "@/lib/supabase/client";
import type { ProgrammeDraft, TranscriptExtraction } from "@/lib/ai/schemas";
import {
  DEFAULT_CONVERSION,
  evaluate,
  hasEligibilityRules,
  normalizeRules,
  serializeRules,
  type Check,
  type Conversion,
  type ProgrammeRules,
} from "@/lib/matching/engine";

export type Workspace = {
  id: string;
  name: string;
  plan: string;
  businessEmail: string;
  phone: string;
  city: string;
  tagline: string;
  settings: Record<string, unknown>;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  tone: string;
};

export type StudentDocument = {
  id: string;
  name: string;
  status: string;
  size: number;
  type: string;
  mimeType: string;
  extraction: TranscriptExtraction | null;
  confidence: number | null;
};

export type SubjectCredit = {
  id: string;
  area: string;
  ects: number;
  creditHours: number | null;
  courses: { title: string; creditHours: number | null; grade: string }[];
  confirmed: boolean;
};

/** The confirmed academic facts the eligibility engine reads. */
export type AcademicFacts = {
  degreeTitle: string;
  institution: string;
  graduationYear: number | null;
  yearsOfEducation: number | null;
  cgpa: number | null;
  cgpaScale: number | null;
  totalCreditHours: number | null;
  englishTestType: string | null;
  englishOverall: number | null;
  mediumOfInstruction: boolean;
  confirmedAt: string | null;
};

export type Student = {
  id: string;
  initials: string;
  name: string;
  degree: string;
  city: string;
  cgpa: string;
  target: string;
  stage: string;
  status: string;
  progress: number;
  tone: string;
  updated: string;
  updatedAt: string;
  targetCountries: string[];
  targetIntake: string;
  budget: number | null;
  graduationYear: number | null;
  institution: string;
  confidence: number | null;
  documents: StudentDocument[];
  credits: SubjectCredit[];
  academic: AcademicFacts;
};

export type Programme = {
  id: string;
  code: string;
  university: string;
  programme: string;
  city: string;
  countryCode: string;
  fee: string;
  feeValue: number | null;
  intake: string;
  deadline: string;
  deadlineIso: string | null;
  freshness: string;
  status: string;
  tone: string;
  source: string;
  language: string;
  universityId: string | null;
  degreeLevel: string;
  applicationUrl: string;
  academicYear: string;
  officialCode: string;
  degreeClass: string;
  cataloguedAt: string | null;
  verifiedAt: string | null;
  aiReviewedAt: string | null;
  aiConfidence: number | null;
  reviewStartedAt: string | null;
  sourceCheckedAt: string | null;
  evidence: { field: string; quote: string }[];
  notes: string;
  rules: ProgrammeRules;
};

export type University = {
  id: string;
  slug: string;
  name: string;
  region: string;
  institutionType: "Statale" | "Non statale";
  isTelematic: boolean;
  source: string;
  verifiedAt: string;
  conversion: Conversion;
};

export type MatchResult = {
  id: string;
  studentId: string;
  programmeId: string;
  university: string;
  programme: string;
  city: string;
  status: string;
  score: number;
  eligibilityScore: number;
  fitScore: number | null;
  fee: string;
  deadline: string;
  verified: string;
  logo: string;
  tone: string;
  reasons: string[];
  checks: Check[];
  programmeVerified: boolean;
  programmeReviewStatus: "ai_reviewed" | "verified";
  source: string;
  generatedAt: string;
};

export type Application = {
  id: string;
  studentId: string;
  programmeId: string;
  stage: string;
  studentName: string;
  initials: string;
  programme: string;
  university: string;
  deadline: string;
  submittedAt: string | null;
  tone: string;
};

export type DeadlineItem = {
  id: string;
  title: string;
  type: string;
  dueAt: string;
  completedAt: string | null;
  studentName: string;
  university: string;
};

export type NewDeadlineInput = {
  title: string;
  type: "application" | "scholarship" | "pre_enrolment" | "document" | "visa" | "custom";
  dueAt: string;
  studentId: string | null;
};

export type WorkspaceData = {
  workspace: Workspace;
  currentUser: TeamMember;
  team: TeamMember[];
  students: Student[];
  programmes: Programme[];
  matches: MatchResult[];
  applications: Application[];
  deadlines: DeadlineItem[];
  /** Platform verifiers can publish programme rules. */
  isVerifier: boolean;
  universities: University[];
  onboardingComplete: boolean;
};

export type NewStudentInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  degree: string;
  cgpa: number | null;
  cgpaScale: number;
  country: string;
  intake: string;
  budget: number | null;
  englishOverall: number | null;
  consent: boolean;
  files: File[];
};

/** Supabase errors are plain objects, not Error instances; read the message from either. */
export function messageOf(error: unknown): string | null {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  )
    return error.message;
  return null;
}

const tones = ["blue", "violet", "orange", "pink", "green", "cyan"];
const statusLabels: Record<string, string> = {
  profile_processing: "Profile processing",
  needs_review: "Needs review",
  shortlist_ready: "Shortlist ready",
  applying: "Applied",
  enrolled: "Completed",
  archived: "Archived",
};
const matchLabels: Record<string, string> = {
  eligible: "Eligible",
  borderline: "Borderline",
  not_eligible: "Not eligible",
};

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

function toneFor(value: string) {
  let hash = 0;
  for (const character of value)
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return tones[hash % tones.length];
}

function relativeDate(value: string | null | undefined) {
  if (!value) return "Not yet";
  const difference = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.floor(difference / 60_000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function displayDate(value: string | null | undefined, withYear = true) {
  if (!value) return "No date";
  return new Date(
    `${value.length === 10 ? `${value}T12:00:00` : value}`,
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

function programmeCode(university: string) {
  return university
    .replace(/[^A-Za-z\s]/g, "")
    .split(/\s+/)
    .filter((part) => !["of", "the"].includes(part.toLowerCase()))
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function euro(value: number | null | undefined) {
  return value == null ? "Not listed" : `€${value.toLocaleString("en-US")}`;
}

function studentProgress(
  row: Record<string, unknown>,
  academic: Record<string, unknown> | null,
  documents: unknown[],
) {
  let points = 20;
  if (row.email) points += 8;
  if (row.phone) points += 7;
  if (row.city) points += 5;
  if (row.target_intake) points += 10;
  if (academic?.degree_title) points += 15;
  if (academic?.cgpa) points += 10;
  if (academic?.english_overall || academic?.medium_of_instruction)
    points += 10;
  if (documents.length) points += 15;
  return Math.min(points, 100);
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (Array.isArray(value))
    return (value[0] as Record<string, unknown> | undefined) ?? null;
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object",
      )
    : [];
}

function mapProgramme(row: Record<string, unknown>): Programme {
  const university = String(row.university_name ?? "Unknown university");
  const verifiedAt =
    typeof row.verified_at === "string" ? row.verified_at : null;
  const aiReviewedAt =
    typeof row.ai_reviewed_at === "string" ? row.ai_reviewed_at : null;
  const deadline =
    typeof row.application_deadline === "string"
      ? row.application_deadline
      : null;
  const fee =
    typeof row.annual_tuition_eur === "number" ? row.annual_tuition_eur : null;
  return {
    id: String(row.id),
    code: programmeCode(university),
    university,
    programme: String(row.programme_name ?? "Untitled programme"),
    city: String(row.city ?? "Not set"),
    countryCode: String(row.country_code ?? ""),
    fee: euro(fee),
    feeValue: fee,
    intake: String(row.intake ?? "Not set"),
    deadline: displayDate(deadline, false),
    deadlineIso: deadline,
    freshness: verifiedAt
      ? `Verified ${relativeDate(verifiedAt)}`
      : aiReviewedAt
        ? `AI reviewed ${relativeDate(aiReviewedAt)}`
        : "Not reviewed",
    status: String(row.verification_status ?? "unverified"),
    tone: toneFor(String(row.id)),
    source: String(row.source_url ?? "#"),
    language: String(row.teaching_language ?? "English"),
    universityId:
      typeof row.university_id === "string" ? row.university_id : null,
    degreeLevel: String(row.degree_level ?? "master"),
    applicationUrl: String(row.application_url ?? ""),
    academicYear: String(row.academic_year ?? ""),
    officialCode: String(row.official_programme_code ?? ""),
    degreeClass: String(row.degree_class ?? ""),
    cataloguedAt:
      typeof row.catalogue_checked_at === "string"
        ? row.catalogue_checked_at
        : null,
    verifiedAt,
    aiReviewedAt,
    aiConfidence: numberOrNull(row.ai_confidence),
    reviewStartedAt:
      typeof row.review_started_at === "string"
        ? row.review_started_at
        : null,
    sourceCheckedAt:
      typeof row.source_checked_at === "string"
        ? row.source_checked_at
        : null,
    evidence: asArray(row.verification_evidence)
      .map((item) => ({
        field: String(item.field ?? ""),
        quote: String(item.quote ?? ""),
      }))
      .filter((item) => item.field && item.quote),
    notes: String(row.verification_notes ?? ""),
    rules: normalizeRules(row.requirements),
  };
}

const numberOrNull = (value: unknown) =>
  value == null || value === "" || Number.isNaN(Number(value))
    ? null
    : Number(value);

function mapAcademic(academic: Record<string, unknown> | null): AcademicFacts {
  return {
    degreeTitle: String(academic?.degree_title ?? ""),
    institution: String(academic?.institution ?? ""),
    graduationYear: numberOrNull(academic?.graduation_year),
    yearsOfEducation: numberOrNull(academic?.years_of_education),
    cgpa: numberOrNull(academic?.cgpa),
    cgpaScale: numberOrNull(academic?.cgpa_scale),
    totalCreditHours: numberOrNull(academic?.total_credit_hours),
    englishTestType:
      typeof academic?.english_test_type === "string"
        ? academic.english_test_type
        : null,
    englishOverall: numberOrNull(academic?.english_overall),
    mediumOfInstruction: Boolean(academic?.medium_of_instruction),
    confirmedAt:
      typeof academic?.confirmed_at === "string" ? academic.confirmed_at : null,
  };
}

export async function loadWorkspaceData(): Promise<WorkspaceData> {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user)
    throw new Error("Your session expired. Please sign in again.");

  const user = authData.user;
  const membershipResult = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  let membership = membershipResult.data;
  const membershipError = membershipResult.error;

  if (membershipError) throw membershipError;
  if (!membership) {
    const name = String(
      user.user_metadata?.workspace_name ??
        `${user.email?.split("@")[0] ?? "My"}'s workspace`,
    );
    const { data: workspace, error } = await supabase
      .from("workspaces")
      .insert({
        name,
        slug: `workspace-${user.id}`,
        created_by: user.id,
        business_email: user.email,
      })
      .select("id")
      .single();
    if (error) throw error;
    membership = { workspace_id: workspace.id, role: "admin" };
  }

  const workspaceId = membership.workspace_id;
  const [
    workspaceResult,
    studentsResult,
    programmesResult,
    matchesResult,
    applicationsResult,
    deadlinesResult,
    membersResult,
  ] = await Promise.all([
    supabase.from("workspaces").select("*").eq("id", workspaceId).single(),
    supabase
      .from("students")
      .select("*, academic_profiles(*), documents(*), subject_credits(*)")
      .eq("workspace_id", workspaceId)
      .order("updated_at", { ascending: false }),
    supabase.from("programmes").select("*").order("university_name"),
    supabase
      .from("matches")
      .select("*, programmes(*)")
      .eq("workspace_id", workspaceId)
      .order("score", { ascending: false }),
    supabase
      .from("applications")
      .select("*, students(first_name,last_name), programmes(*)")
      .eq("workspace_id", workspaceId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("deadlines")
      .select("*, students(first_name,last_name), programmes(university_name)")
      .eq("workspace_id", workspaceId)
      .order("due_at"),
    supabase
      .from("workspace_members")
      .select("user_id, role")
      .eq("workspace_id", workspaceId),
  ]);

  const firstError = [
    workspaceResult,
    studentsResult,
    programmesResult,
    matchesResult,
    applicationsResult,
    deadlinesResult,
    membersResult,
  ].find((result) => result.error)?.error;
  if (firstError) throw firstError;

  const memberRows = membersResult.data ?? [];
  const memberIds = memberRows.map((member) => member.user_id);
  const { data: profiles, error: profilesError } = memberIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name, phone, onboarding_completed_at")
        .in("id", memberIds)
    : { data: [], error: null };
  if (profilesError) throw profilesError;
  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );

  const team: TeamMember[] = memberRows.map((member) => {
    const profile = profileMap.get(member.user_id);
    const name =
      profile?.full_name ||
      (member.user_id === user.id
        ? String(
            user.user_metadata?.full_name ??
              user.email?.split("@")[0] ??
              "User",
          )
        : "Team member");
    return {
      id: member.user_id,
      name,
      email:
        member.user_id === user.id ? (user.email ?? "") : "Workspace member",
      role: member.role,
      initials: initials(name),
      tone: toneFor(member.user_id),
    };
  });

  const studentRows = (studentsResult.data ?? []) as Record<string, unknown>[];
  const students: Student[] = studentRows.map((row) => {
    const academic = asObject(row.academic_profiles);
    const documents = asArray(row.documents);
    const credits = asArray(row.subject_credits);
    const name = `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim();
    const cgpa =
      academic?.cgpa == null
        ? "Not added"
        : `${Number(academic.cgpa).toFixed(2)} / ${Number(academic.cgpa_scale ?? 4).toFixed(2)}`;
    const countries = Array.isArray(row.target_countries)
      ? row.target_countries.map(String)
      : [];
    return {
      id: String(row.id),
      initials: initials(name),
      name,
      degree: String(academic?.degree_title ?? "Academic profile pending"),
      city: String(row.city ?? "Not set"),
      cgpa,
      target: `${countries.join(", ") || "No destination"}${row.target_intake ? ` · ${row.target_intake}` : ""}`,
      stage: statusLabels[String(row.status)] ?? String(row.status),
      status: String(row.status),
      progress: studentProgress(row, academic, documents),
      tone: toneFor(String(row.id)),
      updated: relativeDate(String(row.updated_at ?? "")),
      updatedAt: String(row.updated_at ?? ""),
      targetCountries: countries,
      targetIntake: String(row.target_intake ?? ""),
      budget:
        typeof row.annual_budget_eur === "number"
          ? row.annual_budget_eur
          : null,
      graduationYear:
        typeof academic?.graduation_year === "number"
          ? academic.graduation_year
          : null,
      institution: String(academic?.institution ?? "Not added"),
      confidence:
        typeof academic?.extraction_confidence === "number"
          ? academic.extraction_confidence
          : null,
      documents: documents.map((document) => ({
        id: String(document.id),
        name: String(document.file_name),
        status: String(document.extraction_status),
        size: Number(document.size_bytes ?? 0),
        type: String(document.document_type ?? "other"),
        mimeType: String(document.mime_type ?? ""),
        extraction:
          document.extracted_data &&
          typeof document.extracted_data === "object" &&
          Object.keys(document.extracted_data).length
            ? (document.extracted_data as TranscriptExtraction)
            : null,
        confidence: numberOrNull(document.extraction_confidence),
      })),
      credits: credits.map((credit) => ({
        id: String(credit.id),
        area: String(credit.subject_area),
        ects: Number(credit.ects ?? 0),
        creditHours: numberOrNull(credit.local_credits),
        courses: asArray(credit.source_courses).map((course) => ({
          title: String(course.title ?? ""),
          creditHours: numberOrNull(course.credit_hours),
          grade: String(course.grade ?? ""),
        })),
        confirmed: Boolean(credit.confirmed),
      })),
      academic: mapAcademic(academic),
    };
  });

  const programmes = (
    (programmesResult.data ?? []) as Record<string, unknown>[]
  ).map(mapProgramme);
  const matches: MatchResult[] = (
    (matchesResult.data ?? []) as Record<string, unknown>[]
  )
    .filter((row) =>
      ["ai_reviewed", "verified"].includes(
        String(asObject(row.programmes)?.verification_status),
      ),
    )
    // Never label a legacy score as the new rank score. It will reappear after
    // the counsellor runs matching with the current engine.
    .filter(
      (row) => numberOrNull(asObject(row.rules_snapshot)?.eligibility_score) != null,
    )
    .map((row) => {
      const programme = asObject(row.programmes) ?? {};
      const snapshot = asObject(row.rules_snapshot) ?? {};
      const university = String(
        programme.university_name ?? "Unknown university",
      );
      return {
        id: String(row.id),
        studentId: String(row.student_id),
        programmeId: String(row.programme_id),
        university,
        programme: String(programme.programme_name ?? "Untitled programme"),
        city: String(programme.city ?? "Not set"),
        status: matchLabels[String(row.result)] ?? String(row.result),
        score: Number(row.score ?? 0),
        eligibilityScore:
          numberOrNull(snapshot.eligibility_score) ?? Number(row.score ?? 0),
        fitScore: numberOrNull(snapshot.fit_score),
        fee: euro(
          typeof programme.annual_tuition_eur === "number"
            ? programme.annual_tuition_eur
            : null,
        ),
        deadline: displayDate(
          typeof programme.application_deadline === "string"
            ? programme.application_deadline
            : null,
        ),
        verified: displayDate(
          typeof programme.verified_at === "string"
            ? programme.verified_at
            : typeof programme.ai_reviewed_at === "string"
              ? programme.ai_reviewed_at
              : null,
        ),
        logo: programmeCode(university),
        tone: toneFor(String(row.programme_id)),
        reasons: Array.isArray(row.reasons) ? row.reasons.map(String) : [],
        checks: Array.isArray(row.checks) ? (row.checks as Check[]) : [],
        programmeVerified: programme.verification_status === "verified",
        programmeReviewStatus:
          programme.verification_status === "verified"
            ? "verified"
            : "ai_reviewed",
        source: String(programme.source_url ?? ""),
        generatedAt: String(row.generated_at ?? ""),
      };
    });

  const applications: Application[] = (
    (applicationsResult.data ?? []) as Record<string, unknown>[]
  ).map((row) => {
    const student = asObject(row.students) ?? {};
    const programme = asObject(row.programmes) ?? {};
    const studentName =
      `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() ||
      "Unknown student";
    return {
      id: String(row.id),
      studentId: String(row.student_id),
      programmeId: String(row.programme_id),
      stage: String(row.stage),
      studentName,
      initials: initials(studentName),
      programme: String(programme.programme_name ?? "Untitled programme"),
      university: String(programme.university_name ?? "Unknown university"),
      deadline: displayDate(
        typeof programme.application_deadline === "string"
          ? programme.application_deadline
          : null,
        false,
      ),
      submittedAt:
        typeof row.submitted_at === "string" ? row.submitted_at : null,
      tone: toneFor(String(row.student_id)),
    };
  });

  const deadlines: DeadlineItem[] = (
    (deadlinesResult.data ?? []) as Record<string, unknown>[]
  ).map((row) => {
    const student = asObject(row.students) ?? {};
    const programme = asObject(row.programmes) ?? {};
    return {
      id: String(row.id),
      title: String(row.title),
      type: String(row.deadline_type),
      dueAt: String(row.due_at),
      completedAt:
        typeof row.completed_at === "string" ? row.completed_at : null,
      studentName:
        `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim(),
      university: String(programme.university_name ?? ""),
    };
  });

  const workspaceRow = workspaceResult.data;
  const currentProfile = profileMap.get(user.id);
  const currentName =
    currentProfile?.full_name ||
    String(
      user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User",
    );
  const currentUser = team.find((member) => member.id === user.id) ?? {
    id: user.id,
    name: currentName,
    email: user.email ?? "",
    role: membership.role,
    initials: initials(currentName),
    tone: toneFor(user.id),
  };

  // Verifier access and university conversions arrive with migration 0004;
  // until it is applied these reads fail quietly and the workspace still loads.
  const { data: verifierRow } = await supabase
    .from("platform_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  const isVerifier = Boolean(verifierRow);
  const universities = await loadUniversities();

  return {
    isVerifier,
    universities,
    onboardingComplete: Boolean(currentProfile?.onboarding_completed_at),
    workspace: {
      id: workspaceRow.id,
      name: workspaceRow.name,
      plan: workspaceRow.plan,
      businessEmail: workspaceRow.business_email ?? user.email ?? "",
      phone: workspaceRow.phone ?? currentProfile?.phone ?? "",
      city: workspaceRow.city ?? "",
      tagline:
        workspaceRow.tagline ?? "Your trusted partner for European admissions",
      settings: workspaceRow.settings ?? {},
    },
    currentUser,
    team,
    students,
    programmes,
    matches,
    applications,
    deadlines,
  };
}

export async function completeOnboarding() {
  const supabase = createClient();
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data.user)
    throw new Error("Your session expired. Please sign in again.");
  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq("id", data.user.id);
  if (error) throw error;
}

function documentType(file: File) {
  const name = file.name.toLowerCase();
  if (name.includes("transcript")) return "transcript";
  if (
    name.includes("ielts") ||
    name.includes("toefl") ||
    name.includes("english")
  )
    return "english_test";
  if (name.includes("passport")) return "passport";
  if (name.includes("degree") || name.includes("certificate")) return "degree";
  if (name.includes("statement") || name.includes("sop")) return "sop";
  if (name.includes("cv") || name.includes("resume")) return "cv";
  return "other";
}

function documentMimeType(file: File) {
  if (
    file.type === "application/pdf" ||
    file.type === "image/jpeg" ||
    file.type === "image/png"
  )
    return file.type;
  const extension = file.name.toLowerCase().split(".").pop();
  if (extension === "pdf") return "application/pdf";
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "png") return "image/png";
  return "application/octet-stream";
}

export async function createStudent(
  workspaceId: string,
  input: NewStudentInput,
) {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user)
    throw new Error("Your session expired. Please sign in again.");
  if (!input.consent)
    throw new Error(
      "Student consent is required before documents can be processed.",
    );

  const { data: student, error: studentError } = await supabase
    .from("students")
    .insert({
      workspace_id: workspaceId,
      assigned_to: authData.user.id,
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      email: input.email.trim() || null,
      phone: input.phone.trim() || null,
      city: input.city.trim() || null,
      status: "needs_review",
      target_countries: [input.country],
      target_intake: input.intake,
      annual_budget_eur: input.budget,
      consent_recorded_at: new Date().toISOString(),
      consent_recorded_by: authData.user.id,
    })
    .select("id")
    .single();
  if (studentError) throw studentError;

  const { error: academicError } = await supabase
    .from("academic_profiles")
    .insert({
      student_id: student.id,
      workspace_id: workspaceId,
      degree_level: "Bachelor's",
      degree_title: input.degree.trim() || null,
      cgpa: input.cgpa,
      cgpa_scale: input.cgpaScale,
      english_test_type: input.englishOverall == null ? null : "IELTS",
      english_overall: input.englishOverall,
    });
  if (academicError) throw academicError;

  for (const file of input.files) {
    const safeName =
      file.name
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "") || "document";
    const documentId = crypto.randomUUID();
    const storagePath = `${workspaceId}/${student.id}/${documentId}-${safeName}`;
    const mimeType = documentMimeType(file);
    const { error: uploadError } = await supabase.storage
      .from("student-documents")
      .upload(storagePath, file, {
        contentType: mimeType,
        upsert: false,
      });
    if (uploadError) throw uploadError;
    const { error: documentError } = await supabase.from("documents").insert({
      id: documentId,
      workspace_id: workspaceId,
      student_id: student.id,
      document_type: documentType(file),
      storage_path: storagePath,
      file_name: file.name,
      mime_type: mimeType,
      size_bytes: file.size,
      extraction_status: "pending",
    });
    if (documentError) throw documentError;
  }

  await supabase.from("activity_logs").insert({
    workspace_id: workspaceId,
    actor_id: authData.user.id,
    action: "student.created",
    entity_type: "student",
    entity_id: student.id,
    metadata: {
      name: `${input.firstName} ${input.lastName}`.trim(),
      documents: input.files.length,
    },
  });
  return student.id;
}

/** Permanently deletes a student, their private uploads, and all cascading records. */
export async function deleteStudent(workspaceId: string, studentId: string) {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user)
    throw new Error("Your session expired. Please sign in again.");

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id, first_name, last_name")
    .eq("id", studentId)
    .eq("workspace_id", workspaceId)
    .maybeSingle();
  if (studentError) throw studentError;
  if (!student) throw new Error("Student not found or you do not have access.");

  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("student_id", studentId);
  if (documentsError) throw documentsError;

  const storagePaths = (documents ?? []).map((document) =>
    String(document.storage_path),
  );
  if (storagePaths.length) {
    const { error: storageError } = await supabase.storage
      .from("student-documents")
      .remove(storagePaths);
    if (storageError) throw storageError;
  }

  const { data: deleted, error: deleteError } = await supabase
    .from("students")
    .delete()
    .eq("id", studentId)
    .eq("workspace_id", workspaceId)
    .select("id")
    .maybeSingle();
  if (deleteError) throw deleteError;
  if (!deleted) throw new Error("The student could not be deleted.");

  await supabase.from("activity_logs").insert({
    workspace_id: workspaceId,
    actor_id: authData.user.id,
    action: "student.deleted",
    entity_type: "student",
    entity_id: studentId,
    metadata: {
      name: `${student.first_name} ${student.last_name}`.trim(),
      documents: storagePaths.length,
    },
  });
}

export async function updateApplicationStage(
  applicationId: string,
  stage: string,
) {
  const supabase = createClient();
  const changes: Record<string, string | null> = { stage };
  if (stage === "submitted") changes.submitted_at = new Date().toISOString();
  if (["enrolled", "rejected", "pre_admitted"].includes(stage))
    changes.decision_at = new Date().toISOString();
  const { error } = await supabase
    .from("applications")
    .update(changes)
    .eq("id", applicationId);
  if (error) throw error;
}

export async function createDeadline(
  workspaceId: string,
  input: NewDeadlineInput,
) {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user)
    throw new Error("Your session expired. Please sign in again.");
  if (!input.title.trim() || !input.dueAt)
    throw new Error("Add a deadline title and date.");
  const { error } = await supabase.from("deadlines").insert({
    workspace_id: workspaceId,
    student_id: input.studentId,
    deadline_type: input.type,
    title: input.title.trim(),
    due_at: new Date(`${input.dueAt}T12:00:00Z`).toISOString(),
  });
  if (error) throw error;
  await supabase.from("activity_logs").insert({
    workspace_id: workspaceId,
    actor_id: authData.user.id,
    action: "deadline.created",
    entity_type: "deadline",
    metadata: { title: input.title.trim(), due_at: input.dueAt },
  });
}

export async function setDeadlineCompleted(
  workspaceId: string,
  deadlineId: string,
  completed: boolean,
) {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user)
    throw new Error("Your session expired. Please sign in again.");
  const { error } = await supabase
    .from("deadlines")
    .update({ completed_at: completed ? new Date().toISOString() : null })
    .eq("id", deadlineId)
    .eq("workspace_id", workspaceId);
  if (error) throw error;
  await supabase.from("activity_logs").insert({
    workspace_id: workspaceId,
    actor_id: authData.user.id,
    action: completed ? "deadline.completed" : "deadline.reopened",
    entity_type: "deadline",
    entity_id: deadlineId,
  });
}

export async function createApplicationFromMatch(
  workspaceId: string,
  studentId: string,
  programmeId: string,
) {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user)
    throw new Error("Your session expired. Please sign in again.");
  const { data: existingApplication, error: existingError } = await supabase
    .from("applications")
    .select("id")
    .eq("student_id", studentId)
    .eq("programme_id", programmeId)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existingApplication) return existingApplication.id;
  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .insert({
      workspace_id: workspaceId,
      student_id: studentId,
      programme_id: programmeId,
      stage: "shortlisted",
    })
    .select("id")
    .single();
  if (applicationError) throw applicationError;

  const { data: programme, error: programmeError } = await supabase
    .from("programmes")
    .select("university_name, application_deadline")
    .eq("id", programmeId)
    .single();
  if (programmeError) throw programmeError;
  if (programme.application_deadline) {
    const { data: existingDeadline } = await supabase
      .from("deadlines")
      .select("id")
      .eq("application_id", application.id)
      .eq("deadline_type", "application")
      .maybeSingle();
    if (!existingDeadline) {
      const { error: deadlineError } = await supabase.from("deadlines").insert({
        workspace_id: workspaceId,
        student_id: studentId,
        programme_id: programmeId,
        application_id: application.id,
        deadline_type: "application",
        title: `${programme.university_name} application`,
        due_at: `${programme.application_deadline}T12:00:00Z`,
      });
      if (deadlineError) throw deadlineError;
    }
  }
  const { error: studentError } = await supabase
    .from("students")
    .update({ status: "applying" })
    .eq("id", studentId);
  if (studentError) throw studentError;
  await supabase.from("activity_logs").insert({
    workspace_id: workspaceId,
    actor_id: authData.user.id,
    action: "application.created",
    entity_type: "application",
    entity_id: application.id,
    metadata: { student_id: studentId, programme_id: programmeId },
  });
  return application.id;
}

const conversionFrom = (
  row: Record<string, unknown> | null | undefined,
): Conversion => ({
  ectsPerCreditHour:
    numberOrNull(row?.ects_per_credit_hour) ??
    DEFAULT_CONVERSION.ectsPerCreditHour,
  passRatio:
    numberOrNull(row?.grade_pass_ratio) ?? DEFAULT_CONVERSION.passRatio,
});

export async function loadUniversities(): Promise<University[]> {
  const { data, error } = await createClient()
    .from("universities")
    .select(
      "id, slug, name, region, institution_type, is_telematic, mur_source_url, directory_verified_at, ects_per_credit_hour, grade_pass_ratio",
    )
    .order("name");
  if (error) return [];
  return (data ?? []).map((row) => ({
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    region: String(row.region ?? ""),
    institutionType:
      row.institution_type === "Non statale" ? "Non statale" : "Statale",
    isTelematic: Boolean(row.is_telematic),
    source: String(row.mur_source_url ?? ""),
    verifiedAt: String(row.directory_verified_at ?? ""),
    conversion: conversionFrom(row),
  }));
}

// Runs the deterministic engine against evidence-backed AI-reviewed or human-verified rules.
export async function runStudentMatch(workspaceId: string, studentId: string) {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user)
    throw new Error("Your session expired. Please sign in again.");
  const [academicResult, creditsResult, programmesResult, universitiesResult, studentResult] =
    await Promise.all([
      supabase
        .from("academic_profiles")
        .select("*")
        .eq("student_id", studentId)
        .maybeSingle(),
      supabase
        .from("subject_credits")
        .select("subject_area, ects, local_credits, confirmed")
        .eq("student_id", studentId),
      supabase
        .from("programmes")
        .select(
          "id, university_id, requirements, application_deadline, verification_status, annual_tuition_eur, intake, ai_confidence",
        )
        .in("verification_status", ["ai_reviewed", "verified"]),
      supabase
        .from("universities")
        .select("id, ects_per_credit_hour, grade_pass_ratio"),
      supabase
        .from("students")
        .select("annual_budget_eur, target_intake")
        .eq("id", studentId)
        .single(),
    ]);
  if (academicResult.error) throw academicResult.error;
  if (creditsResult.error) throw creditsResult.error;
  if (programmesResult.error) throw programmesResult.error;
  if (studentResult.error) throw studentResult.error;
  const academic = academicResult.data;
  if (!academic)
    throw new Error(
      "Add the student’s academic profile before running a match.",
    );
  if (!academic.confirmed_at)
    throw new Error(
      "Review and confirm the student’s academic profile before matching.",
    );
  const usableProgrammes = (programmesResult.data ?? []).filter((programme) =>
    hasEligibilityRules(normalizeRules(programme.requirements)),
  );
  if (!usableProgrammes.length)
    throw new Error(
      "No programmes have evidence-backed AI-reviewed or verified admission rules yet.",
    );

  const conversions = new Map(
    (universitiesResult.error ? [] : (universitiesResult.data ?? [])).map(
      (row) => [String(row.id), conversionFrom(row)],
    ),
  );
  const facts = mapAcademic(academic);
  const student = {
    degreeTitle: facts.degreeTitle,
    yearsOfEducation: facts.yearsOfEducation,
    cgpa: facts.cgpa,
    cgpaScale: facts.cgpaScale,
    englishTest:
      facts.englishOverall != null &&
      facts.englishTestType &&
      facts.englishTestType !== "None"
        ? { type: facts.englishTestType, score: facts.englishOverall }
        : null,
    mediumOfInstruction: facts.mediumOfInstruction,
    credits: (creditsResult.data ?? [])
      .filter((credit) => credit.confirmed)
      .map((credit) => ({
        area: String(credit.subject_area),
        creditHours: numberOrNull(credit.local_credits),
        ects: numberOrNull(credit.ects),
      })),
  };

  const rows = usableProgrammes.map((programme) => {
    const rules = normalizeRules(programme.requirements);
    const conversion =
      conversions.get(String(programme.university_id)) ?? DEFAULT_CONVERSION;
    const evaluation = evaluate(student, rules, {
      conversion,
      deadline: programme.application_deadline,
      requireDeadline: true,
      annualTuitionEur: numberOrNull(programme.annual_tuition_eur),
      annualBudgetEur: numberOrNull(studentResult.data.annual_budget_eur),
      programmeIntake: String(programme.intake ?? ""),
      targetIntake: String(studentResult.data.target_intake ?? ""),
      dataConfidence:
        programme.verification_status === "verified"
          ? 100
          : numberOrNull(programme.ai_confidence),
    });
    return {
      workspace_id: workspaceId,
      student_id: studentId,
      programme_id: programme.id,
      result: evaluation.result,
      score: evaluation.score,
      reasons: evaluation.checks.map((check) => check.detail),
      checks: evaluation.checks,
      rules_snapshot: {
        rules: serializeRules(rules),
        conversion,
        verification_status: programme.verification_status,
        data_confidence:
          programme.verification_status === "verified"
            ? 100
            : numberOrNull(programme.ai_confidence),
        eligibility_score: evaluation.eligibilityScore,
        fit_score: evaluation.fitScore,
        student,
      },
      generated_at: new Date().toISOString(),
    };
  });

  const { error: matchError } = await supabase
    .from("matches")
    .upsert(rows, { onConflict: "student_id,programme_id" });
  if (matchError) throw matchError;
  const { error: studentError } = await supabase
    .from("students")
    .update({ status: "shortlist_ready" })
    .eq("id", studentId);
  if (studentError) throw studentError;
  await supabase.from("activity_logs").insert({
    workspace_id: workspaceId,
    actor_id: authData.user.id,
    action: "matches.generated",
    entity_type: "student",
    entity_id: studentId,
    metadata: { programme_count: rows.length },
  });
  return rows.length;
}

/** Asks the server to read one uploaded document with AI. Nothing is confirmed until review. */
export async function extractDocument(
  documentId: string,
): Promise<TranscriptExtraction> {
  const response = await fetch(`/api/documents/${documentId}/extract`, {
    method: "POST",
  });
  const body = (await response.json().catch(() => ({}))) as {
    extraction?: TranscriptExtraction;
    error?: string;
  };
  if (!response.ok || !body.extraction)
    throw new Error(body.error ?? "Reading the document failed.");
  return body.extraction;
}

export type ConfirmedProfileInput = Omit<AcademicFacts, "confirmedAt"> & {
  credits: {
    area: string;
    creditHours: number | null;
    ects: number | null;
    courses: { title: string; creditHours: number | null; grade: string }[];
  }[];
  reviewedDocumentIds: string[];
};

/** Saves the counsellor-reviewed academic profile and subject credits. */
export async function saveConfirmedProfile(
  workspaceId: string,
  studentId: string,
  input: ConfirmedProfileInput,
) {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user)
    throw new Error("Your session expired. Please sign in again.");
  const now = new Date().toISOString();

  const { error: academicError } = await supabase
    .from("academic_profiles")
    .upsert(
      {
        student_id: studentId,
        workspace_id: workspaceId,
        degree_title: input.degreeTitle.trim() || null,
        institution: input.institution.trim() || null,
        graduation_year: input.graduationYear,
        years_of_education: input.yearsOfEducation,
        cgpa: input.cgpa,
        cgpa_scale: input.cgpaScale,
        total_credit_hours: input.totalCreditHours,
        english_test_type: input.englishTestType,
        english_overall: input.englishOverall,
        medium_of_instruction: input.mediumOfInstruction,
        confirmed_at: now,
        confirmed_by: authData.user.id,
      },
      { onConflict: "student_id" },
    );
  if (academicError) throw academicError;

  // One row per subject area: replace whatever was there with the reviewed totals.
  const { error: deleteError } = await supabase
    .from("subject_credits")
    .delete()
    .eq("student_id", studentId);
  if (deleteError) throw deleteError;
  const creditRows = input.credits
    .filter(
      (credit) =>
        credit.area &&
        ((credit.creditHours ?? 0) > 0 || (credit.ects ?? 0) > 0),
    )
    .map((credit) => ({
      workspace_id: workspaceId,
      student_id: studentId,
      subject_area: credit.area,
      local_credits: credit.creditHours,
      ects:
        credit.ects ??
        Math.round(
          (credit.creditHours ?? 0) * DEFAULT_CONVERSION.ectsPerCreditHour * 10,
        ) / 10,
      source_courses: credit.courses.map((course) => ({
        title: course.title,
        credit_hours: course.creditHours,
        grade: course.grade,
      })),
      confirmed: true,
    }));
  if (creditRows.length) {
    const { error: creditsError } = await supabase
      .from("subject_credits")
      .insert(creditRows);
    if (creditsError) throw creditsError;
  }

  if (input.reviewedDocumentIds.length) {
    const { error: documentsError } = await supabase
      .from("documents")
      .update({
        extraction_status: "verified",
        verified_at: now,
        verified_by: authData.user.id,
      })
      .in("id", input.reviewedDocumentIds);
    if (documentsError) throw documentsError;
  }
  await supabase
    .from("students")
    .update({ status: "needs_review" })
    .eq("id", studentId)
    .eq("status", "profile_processing");
  await supabase.from("activity_logs").insert({
    workspace_id: workspaceId,
    actor_id: authData.user.id,
    action: "profile.confirmed",
    entity_type: "student",
    entity_id: studentId,
    metadata: { subject_areas: creditRows.length },
  });
}

/** Verifier tool: AI drafts rules from an admissions call; nothing is saved here. */
export async function draftProgrammeRules(source: {
  sourceUrl?: string;
  text?: string;
}): Promise<ProgrammeDraft> {
  const response = await fetch("/api/programmes/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(source),
  });
  const body = (await response.json().catch(() => ({}))) as {
    draft?: ProgrammeDraft;
    error?: string;
  };
  if (!response.ok || !body.draft)
    throw new Error(body.error ?? "Drafting failed.");
  return body.draft;
}

export type ProgrammeInput = {
  id?: string;
  universityId: string | null;
  university: string;
  programme: string;
  city: string;
  degreeLevel: string;
  language: string;
  feeValue: number | null;
  intake: string;
  deadlineIso: string | null;
  applicationUrl: string;
  source: string;
  academicYear: string;
  notes: string;
  evidence: { field: string; quote: string }[];
  rules: ProgrammeRules;
  status: "unverified" | "in_review" | "ai_reviewed" | "verified";
  aiConfidence?: number | null;
};

/** Verifier tool: saves a programme. Marking it verified stamps who checked it and when. */
export async function saveProgramme(input: ProgrammeInput) {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user)
    throw new Error("Your session expired. Please sign in again.");
  if (!input.source.trim())
    throw new Error("Add the source link you checked the rules against.");
  if (["ai_reviewed", "verified"].includes(input.status) && !hasEligibilityRules(input.rules))
    throw new Error(
      "Add at least one admission requirement before publishing this programme.",
    );
  if (input.status === "ai_reviewed" && ((input.aiConfidence ?? 0) < 70 || !input.evidence.length))
    throw new Error("AI review needs at least 70% confidence and quoted source evidence.");
  const now = new Date().toISOString();
  const row = {
    university_id: input.universityId,
    university_name: input.university.trim(),
    programme_name: input.programme.trim(),
    country_code: "IT",
    city: input.city.trim() || null,
    degree_level: input.degreeLevel,
    teaching_language: input.language.trim() || "English",
    annual_tuition_eur: input.feeValue,
    intake: input.intake.trim() || null,
    application_deadline: input.deadlineIso || null,
    application_url: input.applicationUrl.trim() || null,
    source_url: input.source.trim(),
    academic_year: input.academicYear.trim(),
    requirements: serializeRules(input.rules),
    verification_evidence: input.evidence,
    verification_notes: input.notes.trim() || null,
    verification_status: input.status,
    review_assigned_to:
      input.status === "unverified" ? null : authData.user.id,
    review_started_at:
      input.status === "unverified" ? null : now,
    source_checked_at: input.status === "verified" ? now : null,
    ai_reviewed_at: input.status === "ai_reviewed" ? now : null,
    ai_confidence: input.status === "ai_reviewed" ? input.aiConfidence : null,
    ai_review_model: input.status === "ai_reviewed" ? "gemini-3.8-flash" : null,
    verified_at: input.status === "verified" ? now : null,
    verified_by: input.status === "verified" ? authData.user.id : null,
  };
  const { error } = input.id
    ? await supabase.from("programmes").update(row).eq("id", input.id)
    : await supabase.from("programmes").insert(row);
  if (error) throw error;
}

export async function aiReviewProgramme(programmeId: string): Promise<{
  status: "ai_reviewed" | "in_review";
  confidence: number;
}> {
  const response = await fetch("/api/programmes/ai-review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ programmeId }),
  });
  const body = (await response.json().catch(() => ({}))) as {
    status?: "ai_reviewed" | "in_review";
    confidence?: number;
    error?: string;
  };
  if (!response.ok || !body.status)
    throw new Error(body.error ?? "AI review failed.");
  return { status: body.status, confidence: body.confidence ?? 0 };
}

/** Verifier tool: per-university conversion rules used by every programme there. */
export async function saveUniversityConversion(
  universityId: string,
  conversion: Conversion,
) {
  const { error } = await createClient()
    .from("universities")
    .update({
      ects_per_credit_hour: conversion.ectsPerCreditHour,
      grade_pass_ratio: conversion.passRatio,
    })
    .eq("id", universityId);
  if (error) throw error;
}

export async function updateWorkspaceProfile(
  workspace: Workspace,
  fullName: string,
) {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user)
    throw new Error("Your session expired. Please sign in again.");
  const [workspaceResult, profileResult] = await Promise.all([
    supabase
      .from("workspaces")
      .update({
        name: workspace.name.trim(),
        business_email: workspace.businessEmail.trim() || null,
        phone: workspace.phone.trim() || null,
        city: workspace.city.trim() || null,
        tagline: workspace.tagline.trim(),
        settings: workspace.settings,
      })
      .eq("id", workspace.id),
    supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: workspace.phone.trim() || null,
      })
      .eq("id", authData.user.id),
  ]);
  if (workspaceResult.error) throw workspaceResult.error;
  if (profileResult.error) throw profileResult.error;
}
