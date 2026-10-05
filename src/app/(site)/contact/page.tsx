import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock, LifeBuoy } from "lucide-react";
import { ContactForm } from "../EnquiryForms";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about Eligify, pricing or your workspace. We reply within one working day.",
};

export default function ContactPage() {
  return (
    <>
      <section className="site-page-head site-contact-head">
        <div className="site-shell site-contact-head-inner">
          <div>
            <p className="eyebrow">CONTACT</p>
            <h1>Let&apos;s find the right next step.</h1>
            <p className="site-lede">Tell us what you are working through and the right person on our team will reply within one working day.</p>
          </div>
          <div className="site-contact-promise" aria-label="What to expect">
            <span><CheckCircle2 size={16} /> A reply from a real person</span>
            <span><CheckCircle2 size={16} /> No sales pressure</span>
            <span><CheckCircle2 size={16} /> Practical answers for your team</span>
          </div>
        </div>
      </section>
      <section className="site-section site-section-flush">
        <div className="site-shell site-form-layout site-contact-layout">
          <div className="site-form-card">
            <div className="site-form-intro">
              <p className="eyebrow">SEND A MESSAGE</p>
              <h2>How can we help?</h2>
              <p>Share a little context so we can give you a useful answer the first time.</p>
            </div>
            <ContactForm />
          </div>
          <aside className="site-aside site-contact-aside">
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
