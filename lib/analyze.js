// Turns raw GitHub activity (plus any uploaded notes) into evidence-backed claims and gaps.
// Nothing here guesses: every claim carries an exact quote from a stored source,
// and verify() throws away any claim whose quote can't be found there.

const SPLIT = /(?<=[.!?])\s+|\n+/;

const RULES = {
  decision: /\b(decided|we chose|going with|went with|switch(ed)? to|instead of|rather than)\b/i,
  dependency: /\b(depends on|relies on|requires)\b/i,
  blocker: /\b(blocked|waiting (on|for)|stuck|can'?t .{3,40} until)\b/i,
  unfinished: /\b(todo|fixme|wip|not (yet )?(done|implemented|finished)|still (need|to)|follow[- ]?up|remaining)\b/i,
};

// Used to spot two sources disagreeing about the same kind of choice.
const TOPICS = {
  database: ['postgres', 'mysql', 'mongodb', 'sqlite', 'firebase'],
  'API style': ['rest', 'graphql', 'grpc'],
  authentication: ['jwt', 'oauth', 'session'],
  hosting: ['vercel', 'netlify', 'aws', 'heroku'],
};

const LEVEL = { high: 0, medium: 1, low: 2 };
const sentences = (text) => text.split(SPLIT).map((s) => s.trim()).filter((s) => s.length >= 25 && s.length <= 300);
// "src/payments/queue.js" -> "src/payments", so projects that keep everything under src/ still split into areas.
const folder = (file) => file.split('/').slice(0, -1).slice(0, 2).join('/') || '(root)';

export const verify = (claims, sources) => claims.filter((c) => sources[c.source]?.text.includes(c.quote));

export function analyze({ pulls, issues, comments, commits, details }, person, docs = []) {
  const me = person.toLowerCase();
  const mine = (user) => user?.login?.toLowerCase() === me;
  const involved = (item) => mine(item.user) || item.assignees?.some(mine);

  // 1. Put everything we read into one lookup, so every claim can point back to it.
  const sources = {};
  const addSource = (id, label, url, author, text, extra = {}) => {
    if (text?.trim()) sources[id] = { id, label, url, author, text: text.trim().slice(0, extra.doc ? 12000 : 4000), ...extra };
  };
  const issueCommentCount = {};
  for (const i of issues) {
    issueCommentCount[i.number] = i.comments;
    if (!i.pull_request) addSource(`i${i.number}`, `Issue #${i.number}`, i.html_url, i.user?.login, `${i.title}\n${i.body ?? ''}`, { own: involved(i) });
  }
  for (const p of pulls) addSource(`p${p.number}`, `PR #${p.number}`, p.html_url, p.user?.login, `${p.title}\n${p.body ?? ''}`, { own: involved(p) });
  for (const c of comments) {
    const number = c.issue_url?.split('/').pop();
    addSource(`m${c.id}`, `Comment on #${number}`, c.html_url, c.user?.login, c.body, { own: mine(c.user) });
  }
  for (const c of commits) addSource(`c${c.sha.slice(0, 7)}`, `Commit ${c.sha.slice(0, 7)}`, c.html_url, c.author?.login, c.commit.message, { own: mine(c.author) });
  docs.slice(0, 10).forEach((d, n) => addSource(`d${n}`, d.name, '', 'uploaded', String(d.text).slice(0, 20000), { own: true, doc: true }));

  // 2. Claims from the person's own words and from uploaded notes.
  const claims = [];
  const claim = (type, text, quote, source, status) =>
    claims.push({ id: `k${claims.length + 1}`, type, text, quote, source, status, visibility: 'team' });

  for (const s of Object.values(sources)) {
    if (!s.own) continue;
    for (const line of sentences(s.text)) {
      const type = Object.keys(RULES).find((t) => RULES[t].test(line));
      if (type) claim(type, line, line, s.id, 'Inferred');
    }
  }

  // 3. Plain facts straight from GitHub's state: open work the person still holds.
  for (const p of pulls) {
    if (p.state === 'open' && mine(p.user)) claim('unfinished', `PR #${p.number} is still open${p.draft ? ' as a draft' : ''}: ${p.title}`, p.title, `p${p.number}`, 'Confirmed');
  }
  for (const i of issues) {
    if (!i.pull_request && i.state === 'open' && involved(i)) claim('unfinished', `Issue #${i.number} is still open: ${i.title}`, i.title, `i${i.number}`, 'Confirmed');
  }

  // 4. Which folders did they touch, and did anyone else?
  const areas = {};
  for (const d of details) {
    const who = d.author?.login?.toLowerCase();
    for (const dir of new Set(d.files?.map((f) => folder(f.filename)))) {
      areas[dir] ??= { mine: [], others: new Set(), total: 0 };
      areas[dir].total++;
      if (who === me) areas[dir].mine.push(d);
      else areas[dir].others.add(who);
    }
  }
  const topAreas = Object.entries(areas).filter(([, a]) => a.mine.length).sort((a, b) => b[1].mine.length - a[1].mine.length);
  for (const [dir, a] of topAreas.slice(0, 4)) {
    const latest = a.mine[0];
    claim('ownership', `${person} made ${a.mine.length} of the ${a.total} recent commits to ${dir}/`, latest.commit.message, `c${latest.sha.slice(0, 7)}`, 'Confirmed');
  }

  // 5. Gaps: things the handover cannot answer on its own.
  const gaps = [];
  const gap = (type, severity, text, refs = []) => gaps.push({ id: `g${gaps.length + 1}`, type, severity, text, refs });
  const allItems = [...pulls, ...issues.filter((i) => !i.pull_request)];
  const docText = docs.map((d) => String(d.text)).join('\n');

  for (const p of pulls) {
    if (p.state === 'open' && mine(p.user)) {
      const reviewed = p.requested_reviewers?.length > 0;
      gap('Orphaned work', reviewed ? 'medium' : 'high', `PR #${p.number} "${p.title}" is open${reviewed ? '' : ' and has no reviewer'}. Who should finish or close it?`, [`p${p.number}`]);
    }
  }
  for (const i of issues) {
    if (!i.pull_request && i.state === 'open' && involved(i)) gap('Orphaned work', 'medium', `Issue #${i.number} "${i.title}" is open and tied to ${person}. Who picks it up?`, [`i${i.number}`]);
  }
  for (const [dir, a] of topAreas) {
    if (a.mine.length >= 3 && a.others.size === 0) gap('Sole-owner area', 'high', `Only ${person} shows up in the recent history of ${dir}/ (${a.mine.length} commits). What should the next owner know about it?`);
  }
  for (const item of allItems) {
    const talk = issueCommentCount[item.number] ?? 0;
    if (mine(item.user) && talk >= 4 && !docText.includes(`#${item.number}`)) {
      gap('Undocumented decision', 'medium', `#${item.number} "${item.title}" had ${talk} comments but no uploaded document mentions it. Where is the reasoning written down?`, [`${item.head ? 'p' : 'i'}${item.number}`]);
    }
  }
  const byNumber = Object.fromEntries(allItems.map((i) => [i.number, i]));
  docs.forEach((d, n) => {
    for (const line of sentences(String(d.text))) {
      for (const [, num] of line.matchAll(/#(\d+)/g)) {
        const item = byNumber[num];
        if (!item) gap('Dangling reference', 'medium', `${d.name} mentions #${num}, which is not in the recent history. Does it still exist?`, [`d${n}`]);
        else if (item.state === 'closed' && /\b(open|in progress|pending|wip)\b/i.test(line)) gap('Stale reference', 'medium', `${d.name} describes #${num} as ongoing, but it is closed.`, [`d${n}`]);
      }
    }
  });
  for (const [topic, terms] of Object.entries(TOPICS)) {
    const seen = {};
    for (const c of claims.filter((x) => x.type === 'decision')) {
      // The option named first in the sentence is the one being chosen ("JWT rather than sessions").
      const hits = terms.map((t) => [t, c.quote.search(new RegExp(`\\b${t}s?\\b`, 'i'))]).filter(([, at]) => at >= 0);
      if (hits.length) seen[hits.sort((a, b) => a[1] - b[1])[0][0]] ??= c;
    }
    const found = Object.entries(seen);
    if (found.length > 1 && new Set(found.map(([, c]) => c.source)).size > 1) {
      gap('Possible contradiction', 'medium', `Sources disagree on ${topic}: ${found.map(([t, c]) => `${t} (${sources[c.source].label})`).join(' vs ')}. Which one is current?`, found.map(([, c]) => c.source));
    }
  }
  if (!docs.length) gap('Missing documentation', 'medium', 'No documents or meeting notes were uploaded, so nothing could be cross-checked.');
  const activity = Object.values(sources).filter((s) => s.own && !s.doc).length;
  if (activity < 3) gap('Low coverage', 'high', `Only ${activity} item(s) by ${person} were found in the recent history, so this handover may be thin.`);

  // 6. Keep only what survives verification, and only the sources still needed.
  const seenQuotes = new Set();
  const kept = verify(claims, sources).filter((c) => !seenQuotes.has(c.quote) && seenQuotes.add(c.quote)).slice(0, 40);
  // Everything the person wrote is listed in the Sources tab; claims and gaps can only point at these.
  const own = Object.values(sources).filter((s) => s.own).slice(0, 60).map((s) => s.id);
  const shown = new Set([...own, ...kept.map((c) => c.source), ...gaps.flatMap((g) => g.refs)]);
  const dates = commits.filter((c) => mine(c.author)).map((c) => c.commit.author.date).sort();

  return {
    claims: kept,
    gaps: gaps.sort((a, b) => LEVEL[a.severity] - LEVEL[b.severity]),
    sources: Object.fromEntries([...shown].filter((id) => sources[id]).map((id) => [id, sources[id]])),
    stats: {
      commits: commits.filter((c) => mine(c.author)).length,
      prsOpened: pulls.filter((p) => mine(p.user)).length,
      prsMerged: pulls.filter((p) => mine(p.user) && p.merged_at).length,
      issues: issues.filter((i) => !i.pull_request && mine(i.user)).length,
      comments: comments.filter((c) => mine(c.user)).length,
      areas: topAreas.slice(0, 3).map(([dir]) => dir),
      from: dates[0]?.slice(0, 10),
      to: dates.at(-1)?.slice(0, 10),
      read: Object.keys(sources).length,
      rejected: claims.length - kept.length,
    },
  };
}
