import { loadRepo } from '@/lib/github';
import { analyze } from '@/lib/analyze';
import { sample } from '@/lib/sample';
import { save, newId } from '@/lib/store';

export async function POST(req) {
  const { repo, person, token, docs = [], useSample } = await req.json();
  const ok = useSample || (/^[A-Za-z0-9][\w.-]*\/[A-Za-z0-9][\w.-]*$/.test(repo ?? '') && /^[\w-]+$/.test(person ?? ''));
  if (!ok) return Response.json({ error: 'Enter the repository as owner/name and a GitHub username.' }, { status: 400 });

  try {
    const input = useSample ? sample : { repo, person, docs, data: await loadRepo(repo, token) };
    const result = { repo: input.repo, person: input.person, ...analyze(input.data, input.person, input.docs) };
    // The server keeps this snapshot, so approval later is checked against it, not against what the browser sends back.
    const id = newId();
    await save(`case:${id}`, result);
    return Response.json({ id, ...result });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
