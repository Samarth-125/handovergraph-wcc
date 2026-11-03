import { load } from '@/lib/store';
import Stats from '@/components/Stats';
import ClaimList from '@/components/ClaimList';
import GapList from '@/components/GapList';

// Who you are is decided by the key in the link. The page only ever receives what that role may see.
export default async function SharedHandover({ params, searchParams }) {
  const { id } = await params;
  const { k } = await searchParams;
  const handover = await load(`handover:${id}`);
  const role = handover && Object.keys(handover.keys).find((r) => handover.keys[r] === k);

  if (!role) return <p className="rounded-xl border bg-white p-6">This link is not valid, or the handover has expired.</p>;

  const trusted = role !== 'viewer';
  const claims = handover.claims.map((c) => {
    if (trusted) return c;
    if (c.visibility === 'restricted') return { id: c.id, type: c.type, hidden: true };
    return { id: c.id, type: c.type, text: c.text, status: c.status };
  });

  return (
    <>
      <Stats stats={handover.stats} person={handover.person} repo={handover.repo} />
      <p className="text-sm text-stone-500">You are viewing as <b>{role}</b>. Every claim was approved by a reviewer.</p>
      <ClaimList claims={claims} sources={trusted ? handover.sources : {}} showEvidence={trusted} />
      {trusted && <GapList gaps={handover.gaps} />}
    </>
  );
}
