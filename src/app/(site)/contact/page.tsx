import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, LifeBuoy } from "lucide-react";
import { ContactForm } from "../EnquiryForms";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about Eligify, pricing or your workspace. We reply within one working day.",
};

export default function ContactPage() {
  return (
    <>
      <section className="site-page-head">
        <div className="site-shell">
          <p className="eyebrow">CONTACT</p>
          <h1>Get in touch</h1>
          <p className="site-lede">Questions about Eligify, pricing or your workspace. We reply within one working day.</p>
        </div>
      </section>
      <section className="site-section site-section-flush">
        <div className="site-shell site-form-layout">
          <div className="site-form-card">
            <ContactForm />
          </div>
          <aside className="site-aside">
            <div>
              <Clock size={18} />
              <h2>Response time</h2>
              <p>Within one working day, Monday to Friday.</p>
            </div>
            <div>
              <CalendarDays size={18} />
              <h2>Prefer to talk?</h2>
              <p>
                <Link href="/book">Book a consultation</Link> and we will walk you through Eligify with one of your own
                students.
              </p>
            </div>
            <div>
              <LifeBuoy size={18} />
              <h2>Already a customer?</h2>
              <p>
                <Link href="/app">Sign in</Link> and use Help in the sidebar, or choose &ldquo;Support with my
                workspace&rdquo; here.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
