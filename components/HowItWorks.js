const CARDS = [
  ['1. We read', 'Their commits, pull requests, issues and comments, plus any notes you upload. Read-only.'],
  ['2. You check', 'Every claim comes with the exact words it was taken from. Approve, restrict or reject each one.'],
  ['3. You share', 'Only approved claims go out, by role. Anything we could not work out is listed as a question.'],
];

export default function HowItWorks() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {CARDS.map(([title, text]) => (
        <div key={title} className="rounded-xl border bg-card p-4">
          <h3 className="font-medium">{title}</h3>
          <p className="mt-1 text-sm text-mute">{text}</p>
        </div>
      ))}
    </div>
  );
}
