import Tag from './Tag';

// Each gap doubles as a question for the person leaving. Their answer is saved with the handover.
export default function GapList({ gaps, answers, onAnswer }) {
  if (!gaps.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">What we could not work out</h2>
      {gaps.map((g) => (
        <article key={g.id} className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <div className="mb-1 flex gap-2">
            <Tag tone={g.severity === 'high' ? 'red' : 'amber'}>{g.severity}</Tag>
            <Tag>{g.type}</Tag>
          </div>
          <p>{g.text}</p>
          {onAnswer && (
            <textarea
              value={answers[g.id] ?? ''}
              onChange={(e) => onAnswer(g.id, e.target.value)}
              placeholder="Answer from the person leaving (optional)"
              rows={2}
              className="mt-3 w-full rounded-lg border bg-white p-2 text-sm"
            />
          )}
          {g.answer && <p className="mt-3 rounded-lg bg-white p-2 text-sm"><b>Answer:</b> {g.answer}</p>}
        </article>
      ))}
    </section>
  );
}
