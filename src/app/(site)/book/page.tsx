import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
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
      <section className="site-page-head">
        <div className="site-shell">
          <p className="eyebrow">BOOK A CONSULTATION</p>
          <h1>See Eligify with your own students</h1>
          <p className="site-lede">
            A free 30 minute video call. Pick a day and time that suits you and we will confirm by email.
          </p>
        </div>
      </section>
      <section className="site-section site-section-flush">
        <div className="site-shell site-form-layout">
          <div className="site-form-card">
            <ConsultationForm plan={planId} />
          </div>
          <aside className="site-aside site-aside-photo">
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
