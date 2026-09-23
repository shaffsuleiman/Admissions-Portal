import { createClient } from "@/lib/supabase/client";

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
};

export type SubjectCredit = {
  id: string;
  area: string;
  ects: number;
  confirmed: boolean;
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
  fee: string;
  deadline: string;
  verified: string;
  logo: string;
  tone: string;
  reasons: string[];
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

export type WorkspaceData = {
  workspace: Workspace;
  currentUser: TeamMember;
  team: TeamMember[];
  students: Student[];
  programmes: Programme[];
  matches: MatchResult[];
  applications: Application[];
  deadlines: DeadlineItem[];
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
      : "Not verified",
    status: String(row.verification_status ?? "unverified"),
    tone: toneFor(String(row.id)),
    source: String(row.source_url ?? "#"),
    language: String(row.teaching_language ?? "English"),
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
        .select("id, full_name, phone")
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
      })),
      credits: credits.map((credit) => ({
        id: String(credit.id),
        area: String(credit.subject_area),
        ects: Number(credit.ects ?? 0),
        confirmed: Boolean(credit.confirmed),
      })),
    };
  });

  const programmes = (
    (programmesResult.data ?? []) as Record<string, unknown>[]
  ).map(mapProgramme);
  const matches: MatchResult[] = (
    (matchesResult.data ?? []) as Record<string, unknown>[]
  ).map((row) => {
    const programme = asObject(row.programmes) ?? {};
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
          : null,
      ),
      logo: programmeCode(university),
      tone: toneFor(String(row.programme_id)),
      reasons: Array.isArray(row.reasons) ? row.reasons.map(String) : [],
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

  return {
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
    const { error: uploadError } = await supabase.storage
      .from("student-documents")
      .upload(storagePath, file, {
        contentType: file.type || undefined,
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
      mime_type: file.type || null,
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

export async function runStudentMatch(workspaceId: string, studentId: string) {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user)
    throw new Error("Your session expired. Please sign in again.");
  const [academicResult, creditsResult, programmesResult] = await Promise.all([
    supabase
      .from("academic_profiles")
      .select("*")
      .eq("student_id", studentId)
      .maybeSingle(),
    supabase
      .from("subject_credits")
      .select("subject_area, ects")
      .eq("student_id", studentId),
    supabase
      .from("programmes")
      .select("id, programme_name, requirements")
      .eq("verification_status", "verified"),
  ]);
  if (academicResult.error) throw academicResult.error;
  if (creditsResult.error) throw creditsResult.error;
  if (programmesResult.error) throw programmesResult.error;
  if (!academicResult.data)
    throw new Error(
      "Add the student’s academic profile before running a match.",
    );
  if (!programmesResult.data?.length)
    throw new Error("No verified programmes are available to match.");

  const academic = academicResult.data;
  const creditMap = new Map(
    (creditsResult.data ?? []).map((credit) => [
      String(credit.subject_area).toLowerCase(),
      Number(credit.ects),
    ]),
  );
  const cgpa = Number(academic.cgpa ?? 0);
  const scale = Number(academic.cgpa_scale ?? 4);
  const normalizedCgpa = scale > 0 ? (cgpa / scale) * 4 : 0;
  const english = Number(academic.english_overall ?? 0);
  const rows = programmesResult.data.map((programme) => {
    const requirements =
      programme.requirements && typeof programme.requirements === "object"
        ? (programme.requirements as Record<string, unknown>)
        : {};
    const minimumCgpa = Number(requirements.minimum_cgpa ?? 0);
    const mathRequired = Number(requirements.math_ects ?? 0);
    const csRequired = Number(requirements.cs_ects ?? 0);
    const englishRequired = Number(requirements.english_ielts ?? 0);
    const mathActual =
      creditMap.get("mathematics") ?? creditMap.get("math") ?? 0;
    const csActual =
      creditMap.get("computer science") ?? creditMap.get("cs") ?? 0;
    const reasons: string[] = [];
    let score = 100;
    let hardFailure = false;

    if (minimumCgpa) {
      if (normalizedCgpa >= minimumCgpa)
        reasons.push(
          `CGPA ${normalizedCgpa.toFixed(2)} meets ${minimumCgpa.toFixed(2)}`,
        );
      else {
        score -= Math.min(35, (minimumCgpa - normalizedCgpa) * 30);
        hardFailure = normalizedCgpa < minimumCgpa - 0.35;
        reasons.push(
          `CGPA ${normalizedCgpa.toFixed(2)} below ${minimumCgpa.toFixed(2)}`,
        );
      }
    }
    if (mathRequired) {
      if (mathActual >= mathRequired)
        reasons.push(`Math credits: ${mathActual} / ${mathRequired} ECTS`);
      else {
        score -= Math.min(30, (mathRequired - mathActual) * 1.5);
        hardFailure ||= mathActual < mathRequired * 0.65;
        reasons.push(`Math credits: ${mathActual} / ${mathRequired} ECTS`);
      }
    }
    if (csRequired) {
      if (csActual >= csRequired)
        reasons.push(`CS credits: ${csActual} / ${csRequired} ECTS`);
      else {
        score -= Math.min(30, csRequired - csActual);
        hardFailure ||= csActual < csRequired * 0.65;
        reasons.push(`CS credits: ${csActual} / ${csRequired} ECTS`);
      }
    }
    if (englishRequired) {
      if (english >= englishRequired || academic.medium_of_instruction)
        reasons.push(
          academic.medium_of_instruction
            ? "English medium of instruction recorded"
            : `IELTS ${english.toFixed(1)} meets ${englishRequired.toFixed(1)}`,
        );
      else {
        score -= 20;
        reasons.push(
          `English result below IELTS ${englishRequired.toFixed(1)}`,
        );
      }
    }
    if (!reasons.length)
      reasons.push("General academic profile requirements met");
    score = Math.max(0, Math.min(100, Math.round(score)));
    const result =
      hardFailure || score < 65
        ? "not_eligible"
        : score < 85
          ? "borderline"
          : "eligible";
    return {
      workspace_id: workspaceId,
      student_id: studentId,
      programme_id: programme.id,
      result,
      score,
      reasons,
      rules_snapshot: {
        requirements,
        academic: { cgpa: normalizedCgpa, english },
        credits: Object.fromEntries(creditMap),
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
