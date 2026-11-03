import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze, verify } from '../lib/analyze.js';
import { sample } from '../lib/sample.js';

const result = analyze(sample.data, sample.person, sample.docs);
const gapTypes = result.gaps.map((g) => g.type);

test('every claim quote exists in its source', () => {
  for (const c of result.claims) assert.ok(result.sources[c.source].text.includes(c.quote), c.text);
});

test('verifier drops a claim with an invented quote', () => {
  const fake = { ...result.claims[0], quote: 'this was never written anywhere' };
  assert.equal(verify([fake], result.sources).length, 0);
});

test('finds decisions, blockers, dependencies and unfinished work', () => {
  const types = new Set(result.claims.map((c) => c.type));
  for (const t of ['decision', 'dependency', 'blocker', 'unfinished', 'ownership']) assert.ok(types.has(t), t);
});

test('detects the planted gaps', () => {
  for (const t of ['Orphaned work', 'Sole-owner area', 'Undocumented decision', 'Dangling reference', 'Stale reference', 'Possible contradiction']) {
    assert.ok(gapTypes.includes(t), t);
  }
});

test('stats count only the chosen person', () => {
  assert.equal(result.stats.commits, 7);
  assert.equal(result.stats.prsOpened, 2);
  assert.equal(result.stats.prsMerged, 1);
});

test('flags missing documentation when no notes are uploaded', () => {
  const noDocs = analyze(sample.data, sample.person, []);
  assert.ok(noDocs.gaps.some((g) => g.type === 'Missing documentation'));
});

test('flags low coverage when the person has almost no history', () => {
  const empty = { pulls: [], issues: [], comments: [], commits: [], details: [] };
  assert.ok(analyze(empty, 'nobody', []).gaps.some((g) => g.type === 'Low coverage'));
});

test('the sources list includes everything the person wrote, not only cited items', () => {
  assert.ok(Object.keys(result.sources).length > new Set(result.claims.map((c) => c.source)).size);
});
