import type { Metadata } from "next";
import Image from "next/image";
import { CalendarCheck2, Check, Clock3, ShieldCheck, Video } from "lucide-react";
import turinPhoto from "../../../../public/images/campus/turin.jpg";
import { PHOTOS, PLANS } from "../content";
import { ConsultationForm } from "../EnquiryForms";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "A 30 minute call where we run one of your students through Eligify and answer your questions.",
};

export default async function BookPage({ searchParams }: PageProps<"/book">) {
  const { plan } = await searchParams;
  const planId = typeof plan === "string" && PLANS.some((p) => p.id === plan) ? plan : undefined;

  return (
    <>
      <section className="site-page-head site-book-head">
        <div className="site-shell site-book-head-inner">
          <div>
            <h1>See what Eligify changes for your team.</h1>
            <p className="site-lede">
              Bring a real student profile and we will show you the complete journey from documents to a defensible shortlist.
            </p>
          </div>
          <aside className="site-book-summary" aria-label="Consultation details">
            <div className="site-book-summary-head">
              <span><Video size={18} /></span>
              <div><small>FREE PRODUCT WALKTHROUGH</small><strong>A focused working session</strong></div>
            </div>
            <div className="site-book-facts">
              <span><Clock3 size={15} /><b>30 minutes</b><small>Video call</small></span>
              <span><CalendarCheck2 size={15} /><b>Your timezone</b><small>You choose the day</small></span>
              <span><ShieldCheck size={15} /><b>No commitment</b><small>No card required</small></span>
            </div>
          </aside>
        </div>
      </section>
      <section className="site-section site-section-flush">
        <div className="site-shell site-form-layout site-book-layout">
          <div className="site-form-card">
            <div className="site-form-intro">
              <h2>Choose what works for you</h2>
              <p>Tell us who is joining and your preferred time. We will confirm the meeting by email.</p>
            </div>
            <ConsultationForm plan={planId} />
          </div>
          <aside className="site-aside site-aside-photo site-book-aside">
            <figure>
              <Image src={turinPhoto} alt="Valentino Castle in Turin" sizes="(max-width: 900px) 100vw, 34vw" placeholder="blur" />
              <figcaption>{PHOTOS.turin}</figcaption>
            </figure>
            <div>
              <h2>On the call we will</h2>
              <ul className="site-checks">
                <li>Run a real student profile through matching</li>
                <li>Show how credits are converted for that student</li>
                <li>Walk through shortlists, deadlines and reports</li>
                <li>Help you pick the right plan</li>
              </ul>
            </div>
            <p className="site-muted">
              <Check size={14} /> No payment details needed
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
