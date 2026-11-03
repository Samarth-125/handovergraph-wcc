'use client';
import { useState } from 'react';

const box = 'mt-1 w-full rounded-lg border bg-white px-3 py-2';

export default function RepoForm({ onDone }) {
  const [form, setForm] = useState({ repo: '', person: '', token: '' });
  const [docs, setDocs] = useState([]);
  const [status, setStatus] = useState({ busy: false, error: '' });
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function readFiles(e) {
    setDocs(await Promise.all([...e.target.files].map(async (f) => ({ name: f.name, text: await f.text() }))));
  }

  async function run(body) {
    setStatus({ busy: true, error: '' });
    const res = await fetch('/api/analyze', { method: 'POST', body: JSON.stringify(body) });
    const out = await res.json();
    if (!res.ok) return setStatus({ busy: false, error: out.error });
    setStatus({ busy: false, error: '' });
    onDone(out);
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); run({ ...form, docs }); }} className="space-y-4 rounded-xl border bg-white p-6">
      <div>
        <h1 className="text-2xl font-semibold">Someone is leaving. Let's capture what they know.</h1>
        <p className="mt-1 text-stone-500">Point us at the repository and the person. We read their commits, pull requests and issues, add any notes you upload, and draft a handover you can check.</p>
      </div>
      <label className="block text-sm font-medium">Repository
        <input required placeholder="owner/name" value={form.repo} onChange={set('repo')} className={box} />
      </label>
      <label className="block text-sm font-medium">Their GitHub username
        <input required placeholder="e.g. asha-dev" value={form.person} onChange={set('person')} className={box} />
      </label>
      <label className="block text-sm font-medium">Notes or docs (optional, .md or .txt)
        <input type="file" multiple accept=".md,.txt" onChange={readFiles} className={box} />
      </label>
      <label className="block text-sm font-medium">GitHub token (optional, for private repos or rate limits)
        <input type="password" value={form.token} onChange={set('token')} className={box} />
      </label>
      {status.error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{status.error}</p>}
      <div className="flex gap-3">
        <button disabled={status.busy} className="rounded-lg bg-teal-700 px-4 py-2 font-medium text-white disabled:opacity-60">
          {status.busy ? 'Reading the history…' : 'Build handover'}
        </button>
        <button type="button" disabled={status.busy} onClick={() => run({ useSample: true })} className="rounded-lg border px-4 py-2">
          Try the sample project
        </button>
      </div>
      <p className="text-xs text-stone-400">We only read. The token is used for this request and never stored.</p>
    </form>
  );
}
