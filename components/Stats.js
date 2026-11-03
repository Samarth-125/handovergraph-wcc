export default function Stats({ stats, person }) {
  const items = [['Commits', stats.commits], ['PRs opened', stats.prsOpened], ['PRs merged', stats.prsMerged], ['Issues raised', stats.issues], ['Comments', stats.comments]];
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h3 className="font-semibold">What {person} did</h3>
      <p className="text-sm text-mute">{stats.from ? `Commits from ${stats.from} to ${stats.to}` : 'Recent activity'}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center sm:grid-cols-5">
        {items.map(([label, n]) => (
          <div key={label} className="rounded-xl bg-soft py-2">
            <div className="text-xl font-semibold">{n}</div>
            <div className="text-xs text-mute">{label}</div>
          </div>
        ))}
      </div>
      {stats.areas.length > 0 && <p className="mt-3 text-sm text-mute">Main areas: <span className="text-ink">{stats.areas.join(', ')}</span></p>}
    </section>
  );
}
