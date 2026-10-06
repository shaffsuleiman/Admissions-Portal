export type ResearchEvidence = {
  field: string;
  quote: string;
  url: string;
};

const blockedHosts = [
  "mastersportal.com",
  "studyportals.com",
  "educations.com",
  "wikipedia.org",
  "reddit.com",
  "quora.com",
];

export function canonicalResearchSource(value: string) {
  try {
    const url = new URL(value);
    return `${url.hostname.toLowerCase()}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return "";
  }
}

export function isPermittedResearchSource(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !blockedHosts.some(
        (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
      )
    );
  } catch {
    return false;
  }
}

export function validateResearchEvidence(options: {
  evidence: ResearchEvidence[];
  requiredFields: string[];
  returnedSourceUrls: string[];
}) {
  const sourceKeys = new Set(
    options.returnedSourceUrls.map(canonicalResearchSource).filter(Boolean),
  );
  const evidence = options.evidence.filter(
    (item) =>
      Boolean(item.quote.trim()) &&
      isPermittedResearchSource(item.url) &&
      sourceKeys.has(canonicalResearchSource(item.url)),
  );
  const fields = new Set(evidence.map((item) => item.field));
  return {
    evidence,
    complete:
      evidence.length === options.evidence.length &&
      options.requiredFields.every((field) => fields.has(field)),
  };
}
