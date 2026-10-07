import type { CSSProperties } from "react";
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
  Sparkles,
  Users,
} from "lucide-react";
import milanPhoto from "../../../public/images/campus/milan.jpg";
import { CATALOGUE, PHOTOS, TAGLINE } from "./content";

const STEPS = [
  {
    title: "Upload the documents",
    body: "Drop in transcripts, degree certificates and test scores. MatchED reads grades, credit hours and subjects for you.",
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
      <section className="evidence-hero" aria-labelledby="evidence-hero-title">
        <div className="evidence-hero-inner">
          <div className="evidence-copy">
            <p className="evidence-kicker">{TAGLINE.replace(/\.$/, "")}</p>
            <h1 id="evidence-hero-title">Turn every student profile into a defensible shortlist.</h1>
            <p className="evidence-summary">
              MatchED reads academic documents, converts credits for each student and checks them against official
              programme requirements, so every recommendation comes with its reasons.
            </p>
            <div className="evidence-actions">
              <Link href="/book" className="primary-button evidence-primary">
                Book a consultation <ArrowRight size={17} />
              </Link>
              <Link href="/pricing" className="evidence-secondary">
                See pricing <ArrowRight size={15} />
              </Link>
            </div>
            <dl className="evidence-proof">
              <div>
                <dt>{CATALOGUE.programmes}</dt>
                <dd>English-taught programmes</dd>
              </div>
              <div>
                <dt>{CATALOGUE.universities}</dt>
                <dd>Italian universities</dd>
              </div>
              <div>
                <dt>100%</dt>
                <dd>of matches linked to an official page</dd>
              </div>
            </dl>
          </div>

          <figure className="evidence-file">
            <ol className="evidence-records" aria-label="Example: how one student profile becomes a shortlist">
              <li className="evidence-record" style={{ "--i": 0 } as CSSProperties}>
                <span className="evidence-index" aria-hidden="true">01</span>
                <div className="evidence-card">
                  <span className="evidence-icon"><Users size={17} /></span>
                  <div className="evidence-text">
                    <small>Student profile</small>
                    <strong>Samira Khan</strong>
                  </div>
                  <code>BSc Computer Science · 4 years</code>
                </div>
              </li>
              <li className="evidence-record" style={{ "--i": 1 } as CSSProperties}>
                <span className="evidence-index" aria-hidden="true">02</span>
                <div className="evidence-card">
                  <span className="evidence-icon"><ScanText size={17} /></span>
                  <div className="evidence-text">
                    <small>Transcript read</small>
                    <strong>133 credit hours</strong>
                  </div>
                  <code>22 subjects · CGPA 3.4 of 4</code>
                </div>
              </li>
              <li className="evidence-record" style={{ "--i": 2 } as CSSProperties}>
                <span className="evidence-index" aria-hidden="true">03</span>
                <div className="evidence-card">
                  <span className="evidence-icon"><Scale size={17} /></span>
                  <div className="evidence-text">
                    <small>Credits converted</small>
                    <strong>240 ECTS</strong>
                  </div>
                  <code>240 ÷ 133 = 1.80 per credit hour</code>
                </div>
              </li>
              <li className="evidence-record" style={{ "--i": 3 } as CSSProperties}>
                <span className="evidence-index" aria-hidden="true">04</span>
                <div className="evidence-card">
                  <span className="evidence-icon"><Sparkles size={17} /></span>
                  <div className="evidence-text">
                    <small>Programmes checked</small>
                    <strong>18 exact · 11 close</strong>
                  </div>
                  <code>Each with a written reason</code>
                </div>
              </li>
              <li className="evidence-record evidence-record-match" style={{ "--i": 4 } as CSSProperties}>
                <span className="evidence-index" aria-hidden="true">05</span>
                <div className="evidence-card">
                  <div className="evidence-match-head">
                    <div className="evidence-text">
                      <small>Top programme match</small>
                      <strong>MSc Computer Science</strong>
                      <span>University of Milan</span>
                    </div>
                    <span className="evidence-pill">Exact match</span>
                  </div>
                  <ul className="evidence-checks">
                    <li><BadgeCheck size={15} /> Credits <b>240 of 180 ECTS</b></li>
                    <li><BadgeCheck size={15} /> English <b>IELTS 6.5 of 6.0</b></li>
                    <li><BadgeCheck size={15} /> Background <b>Computer Science</b></li>
                  </ul>
                  <p className="evidence-source">
                    <Link2 size={14} /> Official programme page attached for counsellor review
                  </p>
                  <Image
                    className="evidence-photo"
                    src={milanPhoto}
                    alt=""
                    sizes="120px"
                    placeholder="blur"
                  />
                </div>
              </li>
            </ol>
            <figcaption>Example record. {PHOTOS.milan}</figcaption>
          </figure>
        </div>
      </section>

      <section className="site-section" id="how-it-works">
        <div className="site-shell">
          <div className="site-section-head archive-section-heading">
            <h2>How MatchED builds the shortlist</h2>
            <p>From academic records to a recommendation your counsellors can explain and verify.</p>
          </div>
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
          <div className="site-section-head">
            <h2>Everything a counsellor needs to advise with confidence</h2>
            <p>One workspace for eligibility, programme research, deadlines and client-ready reporting.</p>
          </div>
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
            <h2>Stop checking programme pages one by one</h2>
            <p>
              Entry rules for Italian programmes are spread across hundreds of university websites, each with its own
              way of describing credits, grades and English tests. MatchED brings them into one place and checks every
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
            <p>Book a 30-minute call and we will run a real profile through MatchED with you.</p>
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
