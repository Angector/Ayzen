export function highValuePromptsPerWeek(events, prompts, weekStart) {
  const cutoff = weekStart ?? Date.now() - 7 * 24 * 60 * 60 * 1000;
  const copiedIds = new Set(
    events
      .filter(e => e.event === 'prompt.copy' && e.ts >= cutoff)
      .map(e => e.props?.promptId)
      .filter(Boolean),
  );
  return prompts.filter(
    p => copiedIds.has(p.id) && (p.rating?.overall ?? 0) >= 4,
  ).length;
}

export function day7Retention(events) {
  const firstSeen = new Map();
  for (const e of events) {
    if (!e.sessionId) continue;
    if (!firstSeen.has(e.sessionId)) firstSeen.set(e.sessionId, e.ts);
  }
  const cohorts = new Map();
  for (const [sid, ts] of firstSeen) {
    const day = new Date(ts).toISOString().slice(0, 10);
    if (!cohorts.has(day)) cohorts.set(day, { total: 0, returned: 0 });
    cohorts.get(day).total++;
    const returned = events.some(
      e =>
        e.sessionId === sid &&
        e.ts >= ts + 7 * 864e5 &&
        e.ts < ts + 8 * 864e5,
    );
    if (returned) cohorts.get(day).returned++;
  }
  const vals = [...cohorts.values()].map(c => c.returned / c.total);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

export function avgRating(prompts) {
  const rated = prompts.filter(p => (p.rating?.overall ?? 0) > 0);
  if (!rated.length) return 0;
  const sum = rated.reduce((acc, p) => acc + p.rating.overall, 0);
  return Math.round((sum / rated.length) * 10) / 10;
}