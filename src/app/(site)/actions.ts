"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type EnquiryState = {
  status: "idle" | "sent" | "error";
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
  // Echoed back so the form keeps what the visitor typed after React resets it.
  values?: Record<string, string>;
};

const TEAM_SIZES = ["1-3", "4-10", "11-25", "26+"];
const TIMES = ["morning", "afternoon", "evening"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, name: string, max: number) {
  const value = String(formData.get(name) ?? "").trim();
  return value.slice(0, max);
}

function submitted(formData: FormData) {
  const values: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string" && !key.startsWith("$ACTION") && key !== "website") values[key] = value.slice(0, 4000);
  });
  return values;
}

async function save(row: Record<string, string | null>, values: Record<string, string>): Promise<EnquiryState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "We could not send this right now. Please try again later.", values };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("website_enquiries").insert(row);
  if (error) {
    return { status: "error", message: "Something went wrong while sending. Please try again in a minute.", values };
  }
  return { status: "sent" };
}

export async function sendContactMessage(_previous: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // Bots fill every field, including this one that people never see.
  if (text(formData, "website", 200)) return { status: "sent" };

  const fullName = text(formData, "fullName", 120);
  const email = text(formData, "email", 254);
  const message = text(formData, "message", 4000);
  const fieldErrors: Record<string, string> = {};
  if (fullName.length < 2) fieldErrors.fullName = "Tell us your name.";
  if (!EMAIL.test(email)) fieldErrors.email = "Enter an email address we can reply to.";
  if (message.length < 10) fieldErrors.message = "Write a little more so we can help.";
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors, values: submitted(formData) };

  return save({
    kind: "contact",
    full_name: fullName,
    email,
    consultancy_name: text(formData, "consultancyName", 160) || null,
    topic: text(formData, "topic", 80) || null,
    message,
  }, submitted(formData));
}

export async function requestConsultation(_previous: EnquiryState, formData: FormData): Promise<EnquiryState> {
  if (text(formData, "website", 200)) return { status: "sent" };

  const fullName = text(formData, "fullName", 120);
  const email = text(formData, "email", 254);
  const consultancyName = text(formData, "consultancyName", 160);
  const teamSize = text(formData, "teamSize", 10);
  const preferredDate = text(formData, "preferredDate", 10);
  const preferredTime = text(formData, "preferredTime", 12);
  const fieldErrors: Record<string, string> = {};
  if (fullName.length < 2) fieldErrors.fullName = "Tell us your name.";
  if (!EMAIL.test(email)) fieldErrors.email = "Enter an email address we can reply to.";
  if (consultancyName.length < 2) fieldErrors.consultancyName = "Which consultancy are you with?";
  if (!TEAM_SIZES.includes(teamSize)) fieldErrors.teamSize = "Choose your team size.";
  if (!TIMES.includes(preferredTime)) fieldErrors.preferredTime = "Choose a time of day.";

  const date = /^\d{4}-\d{2}-\d{2}$/.test(preferredDate) ? new Date(`${preferredDate}T12:00:00Z`) : null;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (!date || Number.isNaN(date.getTime()) || date < today) {
    fieldErrors.preferredDate = "Pick a date from today onwards.";
  } else if ([0, 6].includes(date.getUTCDay())) {
    fieldErrors.preferredDate = "We hold calls Monday to Friday.";
  }
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors, values: submitted(formData) };

  return save({
    kind: "consultation",
    full_name: fullName,
    email,
    phone: text(formData, "phone", 40) || null,
    consultancy_name: consultancyName,
    team_size: teamSize,
    preferred_date: preferredDate,
    preferred_time: preferredTime,
    timezone: text(formData, "timezone", 64) || null,
    message: text(formData, "message", 4000) || null,
  }, submitted(formData));
}
