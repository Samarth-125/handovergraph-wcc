import Panel from './Panel';

export default function SourceList({ sources }) {
  return (
    <Panel title="Sources" sub="The original records every claim is checked against.">
      <div className="divide-y">
        {sources.map((s) => (
          <article key={s.id} className="py-3">
            <p className="text-sm font-medium">
              {s.url ? <a href={s.url} target="_blank" rel="noreferrer" className="text-brand hover:underline">{s.label}</a> : s.label}
              <span className="font-normal text-mute"> · {s.author}</span>
            </p>
            <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-mute">{s.text}</p>
          </article>
        ))}
      </div>
      {!sources.length && <p className="text-sm text-mute">No records were found.</p>}
    </Panel>
  );
}
