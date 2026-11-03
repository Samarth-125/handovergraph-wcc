'use client';

const ROLES = [
  ['lead', 'Lead', 'Sees everything, including gaps and evidence.'],
  ['successor', 'Successor', 'Sees approved claims with evidence, plus the open gaps.'],
  ['viewer', 'Viewer', 'Sees approved claims only. Restricted items stay hidden.'],
];

export default function ShareLinks({ links }) {
  return (
    <section className="space-y-3 rounded-xl border border-indigo-600 bg-indigo-500/10 p-5">
      <h2 className="text-lg font-semibold">Published. Share by role.</h2>
      {ROLES.map(([role, name, note]) => (
        <div key={role}>
          <p className="text-sm"><b>{name}</b> <span className="text-mute">{note}</span></p>
          <div className="mt-1 flex gap-2">
            <input readOnly value={links[role]} className="w-full rounded-lg border bg-card px-2 py-1 text-sm" />
            <button onClick={() => navigator.clipboard.writeText(links[role])} className="rounded-lg border bg-card px-3 text-sm hover:bg-soft">Copy</button>
            <a href={links[role]} target="_blank" className="rounded-lg border bg-card px-3 py-1 text-sm hover:bg-soft">Open</a>
          </div>
        </div>
      ))}
    </section>
  );
}
