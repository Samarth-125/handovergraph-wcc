'use client';
import { useState } from 'react';
import RepoForm from '@/components/RepoForm';
import Stats from '@/components/Stats';
import ClaimList from '@/components/ClaimList';
import GapList from '@/components/GapList';
import ShareLinks from '@/components/ShareLinks';

export default function Home() {
  const [data, setData] = useState(null);
  const [review, setReview] = useState({});
  const [answers, setAnswers] = useState({});
  const [links, setLinks] = useState(null);
  const [error, setError] = useState('');

  if (!data) return <RepoForm onDone={setData} />;

  const approved = Object.values(review).filter((v) => v !== 'reject').length;

  async function publish() {
    setError('');
    const res = await fetch('/api/handover', { method: 'POST', body: JSON.stringify({ id: data.id, review, answers }) });
    const out = await res.json();
    if (!res.ok) return setError(out.error);
    setLinks(out.links);
  }

  return (
    <>
      <Stats stats={data.stats} person={data.person} repo={data.repo} />
      <p className="text-sm text-stone-500">
        Review each claim against its evidence. Only what you approve is published. {data.stats.rejected > 0 && `${data.stats.rejected} claim(s) were dropped before this step because they could not be verified.`}
      </p>
      <ClaimList claims={data.claims} sources={data.sources} review={review} onReview={(id, choice) => setReview({ ...review, [id]: choice })} showEvidence />
      <GapList gaps={data.gaps} answers={answers} onAnswer={(id, text) => setAnswers({ ...answers, [id]: text })} />
      {links ? <ShareLinks links={links} /> : (
        <div className="sticky bottom-4 flex items-center justify-between rounded-xl border bg-white p-4 shadow">
          <span className="text-sm">{approved} approved of {data.claims.length}</span>
          {error && <span className="text-sm text-rose-700">{error}</span>}
          <button onClick={publish} disabled={!approved} className="rounded-lg bg-teal-700 px-4 py-2 font-medium text-white disabled:opacity-40">Publish handover</button>
        </div>
      )}
      <button onClick={() => { setData(null); setReview({}); setAnswers({}); setLinks(null); }} className="text-sm underline">Start over</button>
    </>
  );
}
