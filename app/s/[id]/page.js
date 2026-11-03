import { CheckCircle2 } from 'lucide-react';
import { load } from '@/lib/store';
import Header from '@/components/Header';
import Stats from '@/components/Stats';
import ClaimList from '@/components/ClaimList';
import GapList from '@/components/GapList';
import Actions from '@/components/Actions';

// Who you are is decided by the key in the link. Everything a role may not see is removed here on the
// server, before the page is built, so it never reaches that person's browser at all.
export default async function SharedHandover({ params, searchParams }) {
  const { id } = await params;
  const { k } = await searchParams;
  const handover = await load(`handover:${id}`);
  const role = handover && Object.keys(handover.keys).find((r) => handover.keys[r] === k);

  if (!role) {
    return (
      <>
        <Header />
        <p className="mx-auto mt-8 max-w-3xl rounded-2xl border bg-card p-6">This link is not valid, or the handover has expired.</p>
      </>
    );
  }

  const trusted = role !== 'viewer';
  const claims = handover.claims.map((c) => {
    if (trusted) return c;
    if (c.visibility === 'restricted') return { id: c.id, type: c.type, hidden: true };
    const { quote, ...plain } = c;
    return plain;
  });
  const visible = new Set(claims.filter((c) => !c.hidden).map((c) => c.source));
  const sources = Object.fromEntries(Object.entries(handover.sources)
    .filter(([sid]) => visible.has(sid))
    .map(([sid, s]) => [sid, trusted ? s : { label: s.label }]));
  const gaps = trusted ? handover.gaps : [];

  return (
    <>
      <Header>
        <span className="no-print flex items-center gap-1.5 text-emerald-600 dark:text-emerald-300"><CheckCircle2 size={15} />Approved · v{handover.version}</span>
      </Header>
      <main className="mx-auto max-w-3xl space-y-6 px-5 py-8">
        <div>
          <p className="text-xs font-semibold tracking-widest text-brand">PROJECT HANDOVER</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{handover.person}'s handover</h1>
          <p className="text-mute">{handover.repo}. Every claim below was approved by a reviewer.</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 text-sm">
          <span>
            <b>{handover.reviewer}</b> approved this on {handover.approvedAt?.slice(0, 10)} · version {handover.version}
            <span className="block text-xs text-mute">You are viewing as {role}.</span>
          </span>
          <Actions title={`${handover.person}'s handover`} claims={claims} gaps={gaps} sources={sources} />
        </div>
        <Stats stats={handover.stats} person={handover.person} />
        <ClaimList claims={claims} sources={sources} showEvidence={trusted} />
        {gaps.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-mute">Open questions to carry forward</h3>
            <GapList gaps={gaps} />
          </section>
        )}
      </main>
    </>
  );
}
