export default function Stats({ stats, person, repo }) {
  const items = [['Commits', stats.commits], ['PRs opened', stats.prsOpened], ['PRs merged', stats.prsMerged], ['Issues raised', stats.issues], ['Comments', stats.comments]];
  return (
    <section className="rounded-xl border bg-white p-5">
      <h1 className="text-xl font-semibold">{person}'s handover</h1>
      <p className="text-sm text-stone-500">
        {repo}{stats.from && ` · activity from ${stats.from} to ${stats.to}`}
      </p>
      <div className="mt-4 grid grid-cols-5 gap-2 text-center">
        {items.map(([label, n]) => (
          <div key={label} className="rounded-lg bg-stone-100 py-2">
            <div className="text-xl font-semibold">{n}</div>
            <div className="text-xs text-stone-500">{label}</div>
          </div>
        ))}
      </div>
      {stats.areas.length > 0 && <p className="mt-3 text-sm">Main areas: {stats.areas.join(', ')}</p>}
    </section>
  );
}
