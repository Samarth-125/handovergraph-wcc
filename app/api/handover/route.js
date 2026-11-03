import { load, save, newId } from '@/lib/store';
import { verify } from '@/lib/analyze';

export async function POST(req) {
  const { id, review = {}, answers = {} } = await req.json();
  const draft = await load(`case:${id}`);
  if (!draft) return Response.json({ error: 'This analysis has expired. Please run it again.' }, { status: 404 });

  // Only claims a person approved go out, and each is re-checked against the stored sources.
  const approved = draft.claims.filter((c) => ['approve', 'restrict'].includes(review[c.id]));
  const claims = verify(approved, draft.sources).map((c) => ({ ...c, visibility: review[c.id] === 'restrict' ? 'restricted' : 'team' }));
  if (!claims.length) return Response.json({ error: 'Approve at least one claim first.' }, { status: 400 });

  const keys = { lead: crypto.randomUUID(), successor: crypto.randomUUID(), viewer: crypto.randomUUID() };
  const handover = {
    repo: draft.repo, person: draft.person, stats: draft.stats, claims, keys,
    gaps: draft.gaps.map((g) => ({ ...g, answer: String(answers[g.id] ?? '').slice(0, 500) })),
    sources: Object.fromEntries(claims.map((c) => [c.source, draft.sources[c.source]])),
  };
  const hid = newId();
  await save(`handover:${hid}`, handover);

  const origin = new URL(req.url).origin;
  const links = Object.fromEntries(Object.entries(keys).map(([role, k]) => [role, `${origin}/s/${hid}?k=${k}`]));
  return Response.json({ links });
}
