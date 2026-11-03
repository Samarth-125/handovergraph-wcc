'use client';
import { useState } from 'react';
import { BookOpen, FileText, MessageSquareWarning, ShieldCheck } from 'lucide-react';
import Landing from '@/components/Landing';
import Shell from '@/components/Shell';
import Hero from '@/components/Hero';
import Metrics from '@/components/Metrics';
import Tabs from '@/components/Tabs';
import Overview from '@/components/Overview';
import Ledger from '@/components/Ledger';
import Panel from '@/components/Panel';
import GapList from '@/components/GapList';
import SourceList from '@/components/SourceList';
import Workflow from '@/components/Workflow';
import ApprovePanel from '@/components/ApprovePanel';

export default function Home() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('overview');
  const [review, setReview] = useState({});
  const [answers, setAnswers] = useState({});
  const [reviewer, setReviewer] = useState('');
  const [links, setLinks] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  if (!data) return <Landing onDone={setData} />;

  const total = data.claims.length;
  const decided = Object.keys(review).length;
  const approved = Object.values(review).filter((v) => v !== 'reject').length;

  async function publish() {
    setError('');
    const res = await fetch('/api/handover', { method: 'POST', body: JSON.stringify({ id: data.id, review, answers, reviewer }) });
    const out = await res.json();
    if (!res.ok) return setError(out.error);
    setLinks(out.links);
  }

  const reset = () => { setData(null); setTab('overview'); setReview({}); setAnswers({}); setLinks(null); setSearch(''); };
  const { stats } = data;
  const approve = <ApprovePanel {...{ total, decided, approved, reviewer, setReviewer, error, links }} onPublish={publish} />;

  return (
    <Shell tab={tab} onTab={setTab} gaps={data.gaps.length} name={`${data.person}'s handover`} onNew={reset}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-brand">● HANDOVER WORKSPACE</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{data.person}'s handover</h1>
          <p className="text-mute">A source-linked view of work in progress, decisions and unanswered questions.</p>
        </div>
        <button onClick={reset} className="rounded-lg border bg-card px-4 py-2 text-sm hover:bg-soft">New handover</button>
      </div>

      <Hero
        kicker={links ? 'PUBLISHED' : 'REVIEW IN PROGRESS'}
        title={`Pick up where ${data.person} left off.`}
        text="Check the evidence, answer the open questions, and approve a handover the next developer can trust."
        meta={[data.repo, `${stats.read} records read`, stats.from && `Commits ${stats.from} to ${stats.to}`].filter(Boolean)}
      />
      <Metrics items={[
        [FileText, 'Evidence-backed claims', total, `${approved} approved`, 'indigo'],
        [MessageSquareWarning, 'Knowledge gaps', data.gaps.length, `${data.gaps.filter((g) => g.severity === 'high').length} need attention`, 'amber'],
        [BookOpen, 'Records read', stats.read, `${Object.keys(data.sources).length} listed as sources`, 'green'],
        [ShieldCheck, 'Handover status', links ? 'Published' : 'In review', links ? 'Share links ready' : `${total - decided} claims need a decision`, 'violet'],
      ]} />
      <Tabs tab={tab} onTab={setTab} gaps={data.gaps.length} />

      {tab === 'overview' && <Overview data={data} review={review} onTab={setTab} approve={approve} />}
      {tab === 'claims' && <Ledger data={data} review={review} onReview={(id, choice) => setReview({ ...review, [id]: choice })} search={search} setSearch={setSearch} approve={approve} />}
      {tab === 'gaps' && (
        <Panel title="Knowledge gaps" sub="Each one is a question for the person leaving. Their answers are saved with the handover.">
          <GapList gaps={data.gaps} answers={answers} onAnswer={(id, text) => setAnswers({ ...answers, [id]: text })} />
        </Panel>
      )}
      {tab === 'sources' && <SourceList sources={Object.values(data.sources)} />}

      <Workflow at={links ? 4 : decided >= total && total > 0 ? 3 : 2} />
    </Shell>
  );
}
