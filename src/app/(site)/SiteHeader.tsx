"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function SiteBrand() {
  return (
    <span className="brand">
      <span className="brand-symbol" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>
        <strong>Eligify</strong>
        <small>ADMISSIONS OS</small>
      </span>
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  // The menu closes on navigation because it only stays open for the page it was opened on.
  const open = openPath === pathname;

  return (
    <header className="site-header">
      <div className="site-shell site-header-inner">
        <Link href="/" className="site-brand-link" aria-label="Eligify home">
          <SiteBrand />
        </Link>
        <button
          type="button"
          className="site-menu-button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpenPath(open ? null : pathname)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
        <nav id="site-nav" className={`site-nav ${open ? "is-open" : ""}`} aria-label="Main">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/app" className="site-signin">
            Sign in
          </Link>
          <Link href="/book" className="primary-button site-cta">
            Book a consultation
          </Link>
        </nav>
      </div>
    </header>
  );
}
