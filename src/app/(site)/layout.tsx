import type { Metadata } from "next";
import Link from "next/link";
import { SiteBrand, SiteHeader } from "./SiteHeader";
import { TAGLINE } from "./content";
import "./site.css";

export const metadata: Metadata = {
  title: {
    template: "%s · MatchED",
    default: "MatchED · From transcript to the right university",
  },
  description:
    "MatchED helps study-abroad consultancies find the English-taught Italian programmes each student can get into, with every result linked to the official university page.",
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="site">
      <a href="#main" className="site-skip">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="site-shell site-footer-inner">
          <div className="site-footer-brand">
            <Link href="/" aria-label="MatchED home">
              <SiteBrand />
            </Link>
            <p>
              <strong className="site-tagline">{TAGLINE}</strong> Admissions matching for consultancies sending
              students to Italy.
            </p>
          </div>
          <div className="site-footer-links">
            <nav aria-label="Product">
              <strong>Product</strong>
              <Link href="/#how-it-works">How it works</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/book">Book a demo</Link>
            </nav>
            <nav aria-label="Company">
              <strong>Company</strong>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/app">Sign in</Link>
            </nav>
          </div>
        </div>
        <div className="site-shell site-footer-base">
          <small>© {new Date().getFullYear()} MatchED</small>
          <small>
            University photos from Wikimedia Commons. <Link href="/credits">Photo credits</Link>
          </small>
        </div>
      </footer>
    </div>
  );
}
