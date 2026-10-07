import type { Metadata } from "next";
import Image from "next/image";
import { CAMPUS_PHOTOS } from "@/lib/campus-photos";
import credits from "../../../../public/images/campus/credits.json";

export const metadata: Metadata = {
  title: "Photo credits",
  description: "The photographers and licences behind the university photos used in MatchED.",
};

const commonsLink = (title: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title.replace(/ /g, "_"))}`;

export default function CreditsPage() {
  return (
    <>
      <section className="site-page-head">
        <div className="site-shell">
          <h1>Photo credits</h1>
          <p className="site-lede">
            Every university photo in MatchED comes from Wikimedia Commons under a free licence. Thank you to the
            photographers who shared them.
          </p>
        </div>
      </section>
      <section className="site-section site-section-flush">
        <div className="site-shell">
          <h2 className="site-credits-heading">City photos</h2>
          <ul className="site-credits">
            {credits.map((credit) => (
              <li key={credit.slug}>
                <span>
                  <strong>{credit.title.replace(/\.(jpe?g|png)$/i, "")}</strong>
                  <small>
                    {credit.author} · {credit.license}
                  </small>
                </span>
                <a href={commonsLink(credit.title)} target="_blank" rel="noreferrer">
                  Source
                </a>
              </li>
            ))}
          </ul>
          <h2 className="site-credits-heading">University photos</h2>
          <ul className="site-credits">
            {CAMPUS_PHOTOS.map((entry) => (
              <li key={entry.slug}>
                <span className="site-credits-thumb">
                  <Image src={entry.photo} alt="" fill sizes="56px" />
                </span>
                <span>
                  <strong>{entry.university}</strong>
                  <small>
                    {entry.place} · {entry.author} · {entry.license}
                  </small>
                </span>
                <a href={entry.source} target="_blank" rel="noreferrer">
                  Source
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
