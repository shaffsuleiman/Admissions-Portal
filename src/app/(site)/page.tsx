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
import { PHOTOS } from "./content";

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
      <section className="archive-hero" aria-labelledby="archive-hero-title">
        <div className="archive-hero-frame">
          <div className="archive-intro">
            <p className="archive-meta">ACCESSION RECORD <span>A/2026/0173</span></p>
            <h1 id="archive-hero-title">Turn every student profile into a defensible shortlist.</h1>
            <p className="archive-summary">
              Read academic documents, convert credits fairly and check every recommendation against official programme requirements.
            </p>
            <div className="archive-actions">
              <Link href="/book" className="primary-button archive-primary-action">
                Book a consultation <ArrowRight size={17} />
              </Link>
              <Link href="/pricing" className="archive-secondary-action">
                See pricing <ArrowRight size={15} />
              </Link>
            </div>

            <div className="archive-evidence-footer">
              <dl className="archive-source-index" aria-label="Evidence status">
                <div><dt>Official sources</dt><dd>Verified</dd></div>
                <div><dt>Transcripts</dt><dd>Structured</dd></div>
                <div><dt>Qualifications</dt><dd>Standardised</dd></div>
                <div><dt>Programme data</dt><dd>Matched</dd></div>
                <div><dt>Counsellor review</dt><dd>Required</dd></div>
              </dl>

              <div className="archive-seal" aria-label="A higher standard of evidence">
                <span>ARCHIVE OF EVIDENCE</span>
                <strong>ELIGIFY</strong>
                <p>A higher standard<br />of evidence.</p>
              </div>
            </div>
          </div>

          <div className="archive-visual">
            <Image
              className="archive-assembly"
              src="/images/site/archive-assembly.png"
              alt=""
              width={2048}
              height={1555}
              priority
              sizes="(max-width: 1079px) 0px, 64vw"
            />

            <ol className="archive-records" aria-label="How a profile becomes a verified shortlist">
              <li className="archive-record archive-record-student">
                <span className="archive-record-number">01</span>
                <span className="archive-record-icon"><Users size={18} /></span>
                <div><small>Student profile</small><strong>Samira Khan</strong></div>
                <code>PROFILE / A2026-0173</code>
              </li>
              <li className="archive-record archive-record-transcript">
                <span className="archive-record-number">02</span>
                <span className="archive-record-icon"><ScanText size={18} /></span>
                <div><strong>Transcript processed</strong><small>22 subjects identified</small></div>
                <code>TRANSCRIPT / T024-4510</code>
              </li>
              <li className="archive-record archive-record-credits">
                <span className="archive-record-number">03</span>
                <span className="archive-record-icon"><Scale size={18} /></span>
                <div><small>Converted credits</small><strong>128 ECTS</strong></div>
                <code>CREDITS / C2026-0087</code>
              </li>
              <li className="archive-record archive-record-matches">
                <span className="archive-record-number">04</span>
                <span className="archive-record-icon"><Sparkles size={18} /></span>
                <div><strong>34 programme matches</strong></div>
                <code>MATCHING / M2026-1204</code>
              </li>
              <li className="archive-record archive-record-match">
                <span className="archive-record-number">05</span>
                <div className="archive-match-copy">
                  <small>Top programme match</small>
                  <strong>MSc Computer Science</strong>
                  <span>University of Milan</span>
                </div>
                <span className="archive-match-score">98% match</span>
                <dl>
                  <div><dt>Programme code</dt><dd>M-PSC-1023</dd></div>
                  <div><dt>Degree</dt><dd>MSc</dd></div>
                  <div><dt>Location</dt><dd>Milan, Italy</dd></div>
                </dl>
              </li>
              <li className="archive-record archive-record-source">
                <span className="archive-record-number">06</span>
                <span className="archive-record-icon is-verified"><BadgeCheck size={19} /></span>
                <div><strong>Official source verified</strong></div>
                <code>VERIFICATION / V2026-6621</code>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="site-section" id="how-it-works">
        <div className="site-shell">
          <div className="site-section-head archive-section-heading">
            <h2>How Eligify builds the shortlist</h2>
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
            <p>Book a 30-minute call and we will run a real profile through Eligify with you.</p>
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
