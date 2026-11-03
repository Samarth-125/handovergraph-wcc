// Shows the exact quote, highlighted inside the text it came from.
export default function Evidence({ source, quote }) {
  const at = source.text.indexOf(quote);
  const start = Math.max(0, at - 120);
  const end = Math.min(source.text.length, at + quote.length + 120);

  return (
    <div className="mt-3 rounded-lg bg-soft p-3 text-sm text-ink">
      <p className="whitespace-pre-wrap">
        {start > 0 && '… '}
        {source.text.slice(start, at)}
        <mark className="bg-amber-300 text-stone-900">{quote}</mark>
        {source.text.slice(at + quote.length, end)}
        {end < source.text.length && ' …'}
      </p>
      <p className="mt-2 text-xs text-mute">
        {source.label} · {source.author}{' '}
        {source.url && <a href={source.url} target="_blank" rel="noreferrer" className="underline">open on GitHub</a>}
      </p>
    </div>
  );
}
