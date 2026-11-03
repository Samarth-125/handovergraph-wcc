'use client';

// Print (the browser can save it as a PDF) and a plain Markdown copy of exactly what this role can see.
export default function Actions({ title, claims, gaps, sources }) {
  function download() {
    const lines = [`# ${title}`, ''];
    for (const c of claims.filter((x) => !x.hidden)) {
      lines.push(`- ${c.text} (${sources[c.source]?.label ?? 'source'})`);
      if (c.quote) lines.push(`  > ${c.quote}`);
    }
    if (gaps.length) lines.push('', '## Open questions', ...gaps.map((g) => `- ${g.text}${g.answer ? `\n  Answer: ${g.answer}` : ''}`));
    const link = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/markdown' })),
      download: 'handover.md',
    });
    link.click();
  }
  const btn = 'rounded-lg border bg-card px-3 py-1 text-sm hover:bg-soft';
  return (
    <div className="no-print flex gap-2">
      <button onClick={download} className={btn}>Download Markdown</button>
      <button onClick={() => window.print()} className={btn}>Print or save as PDF</button>
    </div>
  );
}
