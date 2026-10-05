import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarDays,
  CalendarClock,
  ChevronRight,
  CheckCircle2,
  FileCheck2,
  FileText,
  LayoutDashboard,
  Link2,
  Plus,
  Scale,
  ScanText,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
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
            <p className="eyebrow"><Sparkles size={13} /> ADMISSIONS INTELLIGENCE FOR ITALY</p>
            <h1>Turn every student profile into a <span>defensible shortlist.</span></h1>
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
            <div className="site-hero-proof" aria-label="Product benefits">
              <span><CheckCircle2 size={15} /> No card required</span>
              <span><CheckCircle2 size={15} /> Official sources</span>
              <span><CheckCircle2 size={15} /> Human-reviewed</span>
            </div>
          </div>
          <div className="site-product-wrap">
            <div className="site-product-glow" aria-hidden="true" />
            <div className="site-product-frame">
              <div className="site-product-body">
                <aside className="site-product-nav" aria-hidden="true">
                  <div className="site-preview-brand"><i /><i /><i /></div>
                  <small>WORKSPACE</small>
                  <span className="is-active"><LayoutDashboard size={13} /> Overview</span>
                  <span><Users size={13} /> Students</span>
                  <span><Sparkles size={13} /> Matches</span>
                  <span><BookOpen size={13} /> Programmes</span>
                </aside>
                <div className="site-product-workspace">
                  <div className="site-product-topbar">
                    <div><span>Workspace</span><ChevronRight size={10} /><strong>Overview</strong></div>
                    <div><Search size={12} /><Bell size={12} /><span className="site-preview-avatar">AK</span></div>
                  </div>
                  <div className="site-product-main">
                    <div className="site-preview-welcome">
                      <Image src={milanPhoto} alt="" sizes="480px" />
                      <div>
                        <small>MONDAY, 5 OCTOBER</small>
                        <strong>Good morning, Ayesha.</strong>
                        <span>Here&apos;s what needs your attention.</span>
                      </div>
                      <button type="button"><Plus size={11} /> New student</button>
                    </div>
                    <div className="site-preview-metrics">
                      <div><span className="blue"><Users size={12} /></span><small>Active students</small><strong>24</strong><em>3 need review</em></div>
                      <div><span className="violet"><Sparkles size={12} /></span><small>Matches generated</small><strong>186</strong><em>42 eligible</em></div>
                      <div><span className="orange"><CalendarDays size={12} /></span><small>Due this week</small><strong>04</strong><em>11 upcoming</em></div>
                      <div><span className="green"><FileCheck2 size={12} /></span><small>Applications live</small><strong>18</strong><em>Across 9 students</em></div>
                    </div>
                    <div className="site-preview-panels">
                      <div className="site-preview-focus">
                        <div><small>FOCUS FOR TODAY</small><strong>3 profiles need your review</strong></div>
                        <div className="site-preview-row"><span className="violet"><Sparkles size={12} /></span><p><b>Review Samira&apos;s profile</b><small>82% complete · updated today</small></p><ChevronRight size={12} /></div>
                        <div className="site-preview-row"><span className="blue"><ScanText size={12} /></span><p><b>Confirm Bilal&apos;s transcript</b><small>Document reading complete</small></p><ChevronRight size={12} /></div>
                      </div>
                      <div className="site-preview-deadlines">
                        <div><small>UPCOMING</small><strong>Deadlines</strong></div>
                        <div><b>12<small>NOV</small></b><p>University of Bologna<span>Samira Khan</span></p><em>8 days</em></div>
                        <div><b>18<small>NOV</small></b><p>University of Padua<span>Hassan Ali</span></p><em>14 days</em></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="site-floating-card site-floating-card-top" aria-hidden="true">
              <span><ScanText size={14} /></span>
              <div><strong>Profile ready to review</strong><small>22 subjects identified</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section" id="how-it-works">
        <div className="site-shell">
          <div className="site-section-head">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2>From documents to a shortlist in one sitting</h2>
            <p>A repeatable, reviewable workflow your whole counselling team can trust.</p>
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
            <p className="eyebrow">THE PLATFORM</p>
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
