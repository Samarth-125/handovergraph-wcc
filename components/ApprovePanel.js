'use client';
import { ShieldCheck } from 'lucide-react';
import ShareLinks from './ShareLinks';

export default function ApprovePanel({ total, decided, approved, reviewer, setReviewer, onPublish, error, links }) {
  if (links) return <ShareLinks links={links} />;
  return (
    <section className="space-y-3 rounded-2xl border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"><ShieldCheck size={18} /></span>
        <div>
          <h3 className="font-semibold">Ready for a human review?</h3>
          <p className="text-sm text-mute">{decided} of {total} claims reviewed, {approved} will be published. Anything you have not reviewed stays out.</p>
        </div>
      </div>
      <label className="block text-xs font-medium text-mute">Reviewer name
        <input value={reviewer} onChange={(e) => setReviewer(e.target.value)} placeholder="Who is approving this?" className="mt-1 w-full rounded-lg border bg-card px-3 py-2 text-sm text-ink" />
      </label>
      {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      <button onClick={onPublish} disabled={!approved || !reviewer.trim()} className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-40">
        {approved ? 'Approve and publish' : 'Approve a claim to continue'}
      </button>
      <p className="text-xs text-mute">The name is recorded on the handover. It is typed in, not a verified sign-in.</p>
    </section>
  );
}
