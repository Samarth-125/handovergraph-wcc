'use client';

const ROLES = [
  ['lead', 'Lead', 'Sees everything, including gaps and evidence.'],
  ['successor', 'Successor', 'Sees approved claims with evidence, plus the open gaps.'],
  ['viewer', 'Viewer', 'Sees approved claims only. Restricted items stay hidden.'],
];

export default function ShareLinks({ links }) {
  return (
    <section className="space-y-3 rounded-xl border border-teal-700 bg-teal-50 p-5">
      <h2 className="text-lg font-semibold">Published. Share by role.</h2>
      {ROLES.map(([role, name, note]) => (
        <div key={role}>
          <p className="text-sm"><b>{name}</b> <span className="text-stone-500">{note}</span></p>
          <div className="mt-1 flex gap-2">
            <input readOnly value={links[role]} className="w-full rounded-lg border bg-white px-2 py-1 text-sm" />
            <button onClick={() => navigator.clipboard.writeText(links[role])} className="rounded-lg border bg-white px-3 text-sm hover:bg-stone-100">Copy</button>
            <a href={links[role]} target="_blank" className="rounded-lg border bg-white px-3 py-1 text-sm hover:bg-stone-100">Open</a>
          </div>
        </div>
      ))}
    </section>
  );
}
