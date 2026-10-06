/**
 * The catalogue can hold the same course for two cycles under slightly different names
 * ("Data Science" for 2026/27, "MSc Data Science" for 2027/28). Match each course once,
 * using its newest academic year, and prefer human-verified rules within the same year.
 */
export function latestProgrammeEditions<
  T extends {
    university_id?: unknown;
    university_name?: unknown;
    programme_name?: unknown;
    degree_level?: unknown;
    academic_year?: unknown;
    verification_status?: unknown;
  },
>(programmes: T[]) {
  const courseKey = (programme: T) =>
    [
      String(programme.university_id ?? programme.university_name ?? ""),
      String(programme.degree_level ?? "").toLowerCase(),
      String(programme.programme_name ?? "")
        .toLowerCase()
        .replace(/^(msc|m\.sc\.?|ma|mba|bsc|b\.sc\.?|ba|beng|meng|master(?:'s)?(?: degree)?(?: of| in)?|bachelor(?:'s)?(?: degree)?(?: of| in)?)\s+/, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim(),
    ].join("|");
  const rank = (programme: T) =>
    String(programme.academic_year ?? "") + (programme.verification_status === "verified" ? "1" : "0");
  const best = new Map<string, T>();
  for (const programme of programmes) {
    const key = courseKey(programme);
    const current = best.get(key);
    if (!current || rank(programme) > rank(current)) best.set(key, programme);
  }
  return [...best.values()];
}
