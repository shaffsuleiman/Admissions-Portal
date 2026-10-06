"use client";

import Link from "next/link";
import { useActionState, useSyncExternalStore } from "react";
import { CheckCircle2 } from "lucide-react";
import { requestConsultation, sendContactMessage, type EnquiryState } from "./actions";

const initial: EnquiryState = { status: "idle" };

function FieldError({ state, name }: { state: EnquiryState; name: string }) {
  const message = state.fieldErrors?.[name];
  return message ? (
    <span className="site-field-error" id={`${name}-error`} role="alert">
      {message}
    </span>
  ) : null;
}

function describedBy(state: EnquiryState, name: string) {
  return state.fieldErrors?.[name] ? `${name}-error` : undefined;
}

// Hidden from people and screen readers; bots tend to fill it in.
function Honeypot() {
  return (
    <div className="site-honeypot" aria-hidden="true">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function Sent({ title, body }: { title: string; body: string }) {
  return (
    <div className="site-form-sent" role="status">
      <CheckCircle2 size={28} />
      <h2>{title}</h2>
      <p>{body}</p>
      <Link href="/" className="secondary-button">
        Back to home
      </Link>
    </div>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, initial);

  if (state.status === "sent")
    return <Sent title="Message sent" body="Thanks for getting in touch. We reply within one working day." />;

  return (
    <form action={action} className="site-form" noValidate>
      <Honeypot />
      <div className="site-form-row">
        <label>
          Your name
          <input name="fullName" defaultValue={state.values?.fullName} autoComplete="name" maxLength={120} required aria-invalid={!!state.fieldErrors?.fullName} aria-describedby={describedBy(state, "fullName")} />
          <FieldError state={state} name="fullName" />
        </label>
        <label>
          Work email
          <input name="email" defaultValue={state.values?.email} type="email" autoComplete="email" maxLength={254} required aria-invalid={!!state.fieldErrors?.email} aria-describedby={describedBy(state, "email")} />
          <FieldError state={state} name="email" />
        </label>
      </div>
      <div className="site-form-row">
        <label>
          <span>
            Consultancy <span className="site-optional">optional</span>
          </span>
          <input name="consultancyName" defaultValue={state.values?.consultancyName} autoComplete="organization" maxLength={160} />
        </label>
        <label>
          Topic
          <select name="topic" defaultValue={state.values?.topic ?? "General question"}>
            <option>General question</option>
            <option>Pricing and billing</option>
            <option>Programme data</option>
            <option>Support with my workspace</option>
            <option>Partnerships</option>
          </select>
        </label>
      </div>
      <label>
        Message
        <textarea name="message" rows={6} defaultValue={state.values?.message} maxLength={4000} required aria-invalid={!!state.fieldErrors?.message} aria-describedby={describedBy(state, "message")} />
        <FieldError state={state} name="message" />
      </label>
      {state.message ? (
        <p className="site-form-error" role="alert">
          {state.message}
        </p>
      ) : null}
      <button type="submit" className="primary-button site-submit" disabled={pending}>
        {pending ? <span className="spinner" /> : null}
        {pending ? "Sending" : "Send message"}
      </button>
    </form>
  );
}

function nextWeekday(from: Date) {
  const date = new Date(from);
  do date.setDate(date.getDate() + 1);
  while ([0, 6].includes(date.getDay()));
  return date;
}

const subscribeNever = () => () => {};

function isoDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function ConsultationForm({ plan }: { plan?: string }) {
  const [state, action, pending] = useActionState(requestConsultation, initial);
  // Both values depend on the visitor's clock, so the server renders blanks and the browser fills them in.
  const minDate = useSyncExternalStore(subscribeNever, () => isoDate(nextWeekday(new Date())), () => "");
  const timezone = useSyncExternalStore(subscribeNever, () => Intl.DateTimeFormat().resolvedOptions().timeZone, () => "");

  if (state.status === "sent")
    return (
      <Sent
        title="Request received"
        body="We will email you within one working day to confirm a time. The call takes about 30 minutes."
      />
    );

  return (
    <form action={action} className="site-form" noValidate>
      <Honeypot />
      <input type="hidden" name="timezone" value={timezone} />
      <div className="site-form-row">
        <label>
          Your name
          <input name="fullName" defaultValue={state.values?.fullName} autoComplete="name" maxLength={120} required aria-invalid={!!state.fieldErrors?.fullName} aria-describedby={describedBy(state, "fullName")} />
          <FieldError state={state} name="fullName" />
        </label>
        <label>
          Work email
          <input name="email" defaultValue={state.values?.email} type="email" autoComplete="email" maxLength={254} required aria-invalid={!!state.fieldErrors?.email} aria-describedby={describedBy(state, "email")} />
          <FieldError state={state} name="email" />
        </label>
      </div>
      <div className="site-form-row">
        <label>
          Consultancy
          <input name="consultancyName" defaultValue={state.values?.consultancyName} autoComplete="organization" maxLength={160} required aria-invalid={!!state.fieldErrors?.consultancyName} aria-describedby={describedBy(state, "consultancyName")} />
          <FieldError state={state} name="consultancyName" />
        </label>
        <label>
          <span>
            Phone or WhatsApp <span className="site-optional">optional</span>
          </span>
          <input name="phone" defaultValue={state.values?.phone} type="tel" autoComplete="tel" maxLength={40} />
        </label>
      </div>
      <fieldset className="site-choice" aria-describedby={describedBy(state, "teamSize")}>
        <legend>How many counsellors are on your team?</legend>
        <div>
          {["1-3", "4-10", "11-25", "26+"].map((size) => (
            <label key={size}>
              <input type="radio" name="teamSize" value={size} defaultChecked={(state.values?.teamSize ?? "1-3") === size} />
              <span>{size}</span>
            </label>
          ))}
        </div>
        <FieldError state={state} name="teamSize" />
      </fieldset>
      <div className="site-form-row">
        <label>
          Preferred date
          <input key={minDate} name="preferredDate" type="date" min={minDate || undefined} defaultValue={state.values?.preferredDate ?? minDate} required aria-invalid={!!state.fieldErrors?.preferredDate} aria-describedby={describedBy(state, "preferredDate")} />
          <FieldError state={state} name="preferredDate" />
        </label>
        <label>
          Time of day
          <select name="preferredTime" defaultValue={state.values?.preferredTime ?? "morning"} aria-describedby={describedBy(state, "preferredTime")}>
            <option value="morning">Morning (9 to 12)</option>
            <option value="afternoon">Afternoon (12 to 17)</option>
            <option value="evening">Evening (17 to 19)</option>
          </select>
          <FieldError state={state} name="preferredTime" />
        </label>
      </div>
      <p className="site-hint">
        Times are in your timezone{timezone ? ` (${timezone})` : ""}. Calls run Monday to Friday.
      </p>
      <label>
        <span>
          What would you like to cover? <span className="site-optional">optional</span>
        </span>
        <textarea
          name="message"
          rows={4}
          maxLength={4000}
          defaultValue={
            state.values?.message ??
            (plan ? `I'm interested in the ${plan.charAt(0).toUpperCase()}${plan.slice(1)} plan.` : "")
          }
        />
      </label>
      {state.message ? (
        <p className="site-form-error" role="alert">
          {state.message}
        </p>
      ) : null}
      <button type="submit" className="primary-button site-submit" disabled={pending}>
        {pending ? <span className="spinner" /> : null}
        {pending ? "Sending" : "Request a call"}
      </button>
    </form>
  );
}
