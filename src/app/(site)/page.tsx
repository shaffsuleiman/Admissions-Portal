import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  FileText,
  Link2,
  Scale,
  ScanText,
  Users,
} from "lucide-react";
import romePhoto from "../../../public/images/campus/rome.jpg";
import milanPhoto from "../../../public/images/campus/milan.jpg";
import { CATALOGUE, PHOTOS } from "./content";

const STEPS = [
  {
    title: "Upload the documents",
    body: "Drop in transcripts, degree certificates and test scores. Eligify reads grades, credit hours and subjects for you.",
  },
  {
    title: "Confirm the profile",
    body: "A counsellor checks what was read and fixes anything that looks off. Nothing is matched until a person confirms it.",
  },
  {
    title: "Share the shortlist",
    body: "See exact and close matches with the reason for each one, then send families a clean PDF report.",
  },
];

const FEATURES = [
  {
    icon: Scale,
    title: "Credits converted per student",
    body: "Each student gets their own ECTS ratio from their degree length and total credit hours, so a 133 credit hour degree is counted fairly.",
  },
  {
    icon: BadgeCheck,
    title: "Exact and close matches",
    body: "Programmes are split into ones the student meets and ones they nearly meet, with a plain reason for every gap.",
  },
  {
    icon: Link2,
    title: "Official links on every result",
    body: "Each match links to the university's own programme page, so counsellors can confirm the details at the source.",
  },
  {
    icon: ScanText,
    title: "Transcript reading",
    body: "Grades, scales and subject areas are pulled from uploaded documents, ready for a counsellor to review.",
  },
  {
    icon: CalendarClock,
    title: "Deadlines and applications",
    body: "Track every application and get reminders before calls close, across intakes and universities.",
  },
  {
    icon: Users,
    title: "Built for teams",
    body: "Managers and counsellors share one workspace, with student records kept private to your consultancy.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="site-hero">
        <div className="site-shell site-hero-inner">
          <div className="site-hero-copy">
            <p className="eyebrow">ADMISSIONS MATCHING FOR ITALY</p>
            <h1>Know which Italian programmes each student can really get into.</h1>
            <p className="site-lede">
              Eligify reads your students&apos; documents, converts their credits fairly and checks them against{" "}
              {CATALOGUE.programmes} English-taught programmes at {CATALOGUE.universities} universities. Your
              counsellors get clear matches, each linked to the official university page.
            </p>
            <div className="site-actions">
              <Link href="/book" className="primary-button site-button-lg">
                Book a consultation <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="secondary-button site-button-lg">
                See pricing
              </Link>
            </div>
          </div>
          <figure className="site-hero-photo">
            <Image
              src={romePhoto}
              alt="Sapienza University of Rome"
              preload
              sizes="(max-width: 900px) 100vw, 46vw"
              placeholder="blur"
            />
            <div className="site-hero-card" aria-hidden="true">
              <span className="site-pill site-pill-ok">Exact match</span>
              <strong>MSc Data Science</strong>
              <small>Credits 128 of 120 ECTS · IELTS 6.5 of 6.0</small>
            </div>
            <figcaption>{PHOTOS.rome}</figcaption>
          </figure>
        </div>
      </section>

      <section className="site-stats" aria-label="Catalogue">
        <div className="site-shell site-stats-inner">
          <div>
            <strong>{CATALOGUE.programmes}</strong>
            <span>English-taught programmes</span>
          </div>
          <div>
            <strong>{CATALOGUE.universities}</strong>
            <span>Italian universities</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>of results linked to an official page</span>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-shell">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>From documents to a shortlist in one sitting</h2>
          <ol className="site-steps">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="site-step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="site-section site-section-tint">
        <div className="site-shell">
          <p className="eyebrow">WHAT YOU GET</p>
          <h2>Everything a counsellor needs to advise with confidence</h2>
          <div className="site-features">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <article key={title}>
                <span className="site-feature-icon">
                  <Icon size={19} />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-shell site-split">
          <figure className="site-split-photo">
            <Image src={milanPhoto} alt="The Ca' Granda courtyard at the University of Milan" sizes="(max-width: 900px) 100vw, 44vw" placeholder="blur" />
            <figcaption>{PHOTOS.milan}</figcaption>
          </figure>
          <div>
            <p className="eyebrow">WHY CONSULTANCIES SWITCH</p>
            <h2>Stop checking programme pages one by one</h2>
            <p>
              Entry rules for Italian programmes are spread across hundreds of university websites, each with its own
              way of describing credits, grades and English tests. Eligify brings them into one place and checks every
              student the same way.
            </p>
            <ul className="site-checks">
              <li>Fewer applications to programmes a student was never eligible for</li>
              <li>The same standard applied by every counsellor on the team</li>
              <li>Families see why a programme is on the list, not just its name</li>
            </ul>
            <Link href="/about" className="site-text-link">
              Read about our approach <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="site-cta-band">
        <div className="site-shell site-cta-inner">
          <div>
            <h2>See it with your own students</h2>
            <p>Book a 30 minute call and we will run a real profile through Eligify with you.</p>
          </div>
          <div className="site-actions">
            <Link href="/book" className="primary-button site-button-lg site-button-light">
              Book a consultation
            </Link>
            <Link href="/contact" className="site-text-link site-text-link-light">
              <FileText size={15} /> Ask a question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
