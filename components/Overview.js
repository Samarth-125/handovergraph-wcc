'use client';
import Panel from './Panel';
import Stats from './Stats';
import { KindIcon, StatusTag } from './Status';

const DOT = { high: 'bg-rose-500', medium: 'bg-amber-500', low: 'bg-stone-400' };
const link = 'text-sm text-brand hover:underline';

export default function Overview({ data, review, onTab, approve }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-5">
        <Panel className="lg:col-span-3" title="Recent claims" sub="Statements reconstructed from project activity." action={<button onClick={() => onTab('claims')} className={link}>View ledger →</button>}>
          <div className="divide-y">
            {data.claims.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-start gap-3 py-3">
                <KindIcon type={c.type} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{c.text}</p>
                  <p className="mt-0.5 text-xs text-mute">{data.sources[c.source]?.label} · evidence attached</p>
                </div>
                <StatusTag value={review[c.id]} />
              </div>
            ))}
          </div>
          {!data.claims.length && <p className="text-sm text-mute">No decisions, blockers or unfinished work were found in this history.</p>}
        </Panel>
        <div className="space-y-5 lg:col-span-2">
          <Panel title="Open questions" sub="Gaps the team should resolve." action={<button onClick={() => onTab('gaps')} className={link}>All →</button>}>
            <div className="space-y-3">
              {data.gaps.slice(0, 3).map((g) => (
                <p key={g.id} className="flex gap-2 text-sm"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT[g.severity]}`} />{g.text}</p>
              ))}
              {!data.gaps.length && <p className="text-sm text-mute">No gaps detected in this history.</p>}
            </div>
          </Panel>
          {approve}
        </div>
      </div>
      <Stats stats={data.stats} person={data.person} />
    </div>
  );
}
