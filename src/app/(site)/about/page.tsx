import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Link2, UserCheck } from "lucide-react";
import pisaPhoto from "../../../../public/images/campus/pisa.jpg";
import { CATALOGUE, PHOTOS } from "../content";

export const metadata: Metadata = {
  title: "About",
  description: "Why we built Eligify and the principles behind every match it makes.",
};

const PRINCIPLES = [
  {
    icon: Link2,
    title: "Official sources first",
    body: "Every programme in Eligify comes from the university's own website, and every match links back to it. We do not rely on rankings sites or second-hand lists.",
  },
  {
    icon: UserCheck,
    title: "A counsellor always confirms",
    body: "Eligify reads documents and suggests matches, but a person on your team confirms the profile before anything is matched and checks the official page before advising.",
  },
  {
    icon: BookOpenCheck,
    title: "Honest about what we know",
    body: "When a programme's rules have not been reviewed yet, or a deadline is not published, we say so on the result instead of guessing.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="site-page-head">
        <div className="site-shell">
          <p className="eyebrow">ABOUT ELIGIFY</p>
          <h1>Fair, checkable advice for every student going to Italy</h1>
          <p className="site-lede">
            Eligify is admissions software for study-abroad consultancies. We started with Italy because its
            English-taught programmes are excellent value and their entry rules are hard to compare.
          </p>
        </div>
      </section>

      <section className="site-section">
        <div className="site-shell site-split">
          <div>
            <h2>The problem we kept seeing</h2>
            <p>
              A student with a four year degree and 133 credit hours applies to a programme that asks for 180 ECTS. Is
              that enough? The answer depends on how their credits convert, which grade scale the university uses,
              which subjects count and whether the English test meets the minimum.
            </p>
            <p>
              Counsellors work this out by hand, programme by programme, and two counsellors can reach different
              answers for the same student. Students pay application fees for programmes they were never eligible for,
              and miss ones they would have got into.
            </p>
            <h2>What we built</h2>
            <p>
              Eligify converts each student&apos;s credits using their own ratio of ECTS to credit hours, then checks
              them against the entry rules of {CATALOGUE.programmes} English-taught programmes at{" "}
              {CATALOGUE.universities} Italian universities. Every result says why it matched or nearly matched, and
              links to the official programme page so the counsellor can confirm it.
            </p>
          </div>
          <figure className="site-split-photo">
            <Image src={pisaPhoto} alt="Palazzo della Sapienza at the University of Pisa" sizes="(max-width: 900px) 100vw, 44vw" placeholder="blur" />
            <figcaption>{PHOTOS.pisa}</figcaption>
          </figure>
        </div>
      </section>

      <section className="site-section site-section-tint">
        <div className="site-shell">
          <p className="eyebrow">HOW WE WORK</p>
          <h2>Three principles behind every match</h2>
          <div className="site-features site-features-3">
            {PRINCIPLES.map(({ icon: Icon, title, body }) => (
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
        <div className="site-shell site-narrow">
          <h2>Who Eligify is for</h2>
          <p>
            Consultancies of every size, from a single counsellor to networks with branches in several cities. If you
            place students in Italian universities each September or February intake, Eligify is built for the way you
            work.
          </p>
          <div className="site-actions">
            <Link href="/book" className="primary-button site-button-lg">
              Book a consultation <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="secondary-button site-button-lg">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
