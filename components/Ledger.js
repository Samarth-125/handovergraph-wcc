'use client';
import { Search } from 'lucide-react';
import Panel from './Panel';
import ClaimList from './ClaimList';

export default function Ledger({ data, review, onReview, search, setSearch, approve }) {
  const claims = data.claims.filter((c) => `${c.text} ${c.type}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <Panel
        title="Claim ledger"
        sub="Open the evidence on any claim to see the exact words it came from."
        action={
          <label className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm">
            <Search size={14} className="text-mute" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a claim" className="w-32 bg-transparent outline-none" />
          </label>
        }
      >
        <ClaimList claims={claims} sources={data.sources} review={review} onReview={onReview} showEvidence />
        {!claims.length && <p className="text-sm text-mute">No claims match.</p>}
        <p className="mt-5 text-xs text-mute">
          The check proves the quote exists in the source. It does not prove the statement is true, so use your judgement before approving.
          {data.stats.rejected > 0 && ` ${data.stats.rejected} claim(s) were dropped automatically because their quote could not be found.`}
        </p>
      </Panel>
      {approve}
    </div>
  );
}
