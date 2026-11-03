'use client';
import { useState } from 'react';
import Tag from './Tag';
import Evidence from './Evidence';
import { KindIcon, StatusTag } from './Status';

const CHOICES = [['approve', 'Approve'], ['restrict', 'Approve, restricted'], ['reject', 'Reject']];

export default function ClaimCard({ claim, source, value, onChange, showEvidence = true }) {
  const [open, setOpen] = useState(false);

  if (claim.hidden) {
    return <p className="rounded-xl border border-dashed p-3 text-sm italic text-mute">Hidden by the reviewer.</p>;
  }
  return (
    <article className={`rounded-xl border bg-card p-4 ${value === 'reject' ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <KindIcon type={claim.type} />
        <div className="min-w-0 flex-1">
          <p>{claim.text}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-mute">
            <Tag tone={claim.status === 'Confirmed' ? 'green' : 'amber'}>{claim.status}</Tag>
            {source && <span>{source.label}</span>}
            {showEvidence && source && (
              <button onClick={() => setOpen(!open)} className="text-brand underline">{open ? 'Hide evidence' : 'Show evidence'}</button>
            )}
          </div>
        </div>
        {onChange ? <StatusTag value={value} /> : claim.visibility === 'restricted' && <Tag>Restricted</Tag>}
      </div>
      {open && <Evidence source={source} quote={claim.quote} />}
      {onChange && (
        <div className="mt-3 flex flex-wrap gap-2 pl-11">
          {CHOICES.map(([key, label]) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`rounded-lg border px-3 py-1 text-sm ${value === key ? 'border-indigo-600 bg-indigo-600 text-white' : 'hover:bg-soft'}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
