import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PAYMENT_OPTIONS, PLANS, PRICING_FAQ, type Plan } from "../content";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Plans and payment options for consultancies of every size.",
};

function Price({ plan }: { plan: Plan }) {
  if (plan.monthly === null) {
    return (
      <div className="site-price">
        <strong>Custom</strong>
        <small>Priced for your branches</small>
      </div>
    );
  }
  if (plan.monthly === 0) {
    return (
      <div className="site-price">
        <strong>Free</strong>
        <small>for 14 days</small>
      </div>
    );
  }
  return (
    <div className="site-price">
      <strong>
        ${plan.monthly}
        <span>/month</span>
      </strong>
      <small>or ${plan.yearly?.toLocaleString("en-US")} billed yearly</small>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="site-page-head">
        <div className="site-shell">
          <h1>Plans that grow with your consultancy</h1>
          <p className="site-lede">
            Every plan includes the full programme catalogue, transcript reading and per-student credit conversion.
            Prices are per workspace in US dollars.
          </p>
        </div>
      </section>

      <section className="site-section site-section-flush">
        <div className="site-shell site-plans">
          {PLANS.map((plan) => (
            <article key={plan.id} className={`site-plan ${plan.highlight ? "is-highlight" : ""}`}>
              {plan.highlight ? <span className="site-plan-badge">Most popular</span> : null}
              <h2>{plan.name}</h2>
              <p className="site-plan-blurb">{plan.blurb}</p>
              <Price plan={plan} />
              <ul>
                <li>
                  <Check size={15} /> {plan.profiles}
                </li>
                <li>
                  <Check size={15} /> {plan.seats}
                </li>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={15} /> {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.cta.href}
                className={`${plan.highlight ? "primary-button" : "secondary-button"} site-plan-cta`}
              >
                {plan.cta.label}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section site-section-tint">
        <div className="site-shell">
          <h2>Pay the way that suits your cash flow</h2>
          <div className="site-features site-features-3">
            {PAYMENT_OPTIONS.map((option) => (
              <article key={option.title}>
                <h3>{option.title}</h3>
                <p>{option.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-shell site-narrow">
          <h2>Common questions</h2>
          <div className="site-faq">
            {PRICING_FAQ.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <p className="site-muted">
            Not sure which plan fits? <Link href="/book">Book a consultation</Link> and we will help you choose.
          </p>
        </div>
      </section>
    </>
  );
}
