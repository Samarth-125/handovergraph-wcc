'use client';
import { useState } from 'react';
import Tag from './Tag';
import Evidence from './Evidence';

const CHOICES = [['approve', 'Approve'], ['restrict', 'Approve, restricted'], ['reject', 'Reject']];

export default function ClaimCard({ claim, source, value, onChange, showEvidence = true }) {
  const [open, setOpen] = useState(false);

  if (claim.hidden) {
    return <p className="rounded-xl border border-dashed p-3 text-sm italic text-stone-400">Hidden by the reviewer.</p>;
  }
  return (
    <article className={`rounded-xl border bg-white p-4 ${value === 'reject' ? 'opacity-50' : ''}`}>
      <p>{claim.text}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-stone-500">
        <Tag tone={claim.status === 'Confirmed' ? 'green' : 'amber'}>{claim.status}</Tag>
        {claim.visibility === 'restricted' && <Tag>Restricted</Tag>}
        {source && <span>{source.label}</span>}
        {showEvidence && source && (
          <button onClick={() => setOpen(!open)} className="underline">{open ? 'Hide evidence' : 'Show evidence'}</button>
        )}
      </div>
      {open && <Evidence source={source} quote={claim.quote} />}
      {onChange && (
        <div className="mt-3 flex flex-wrap gap-2">
          {CHOICES.map(([key, label]) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`rounded-lg border px-3 py-1 text-sm ${value === key ? 'border-teal-700 bg-teal-700 text-white' : 'hover:bg-stone-100'}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
