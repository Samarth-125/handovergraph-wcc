const TONES = {
  indigo: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
  amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  green: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  violet: 'bg-violet-500/15 text-violet-600 dark:text-violet-300',
};

export default function Metrics({ items }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map(([Icon, label, value, detail, tone]) => (
        <div key={label} className="flex items-center gap-3 rounded-2xl border bg-card p-4">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${TONES[tone]}`}><Icon size={18} /></span>
          <span className="min-w-0">
            <span className="block text-xs text-mute">{label}</span>
            <b className="block text-xl leading-tight">{value}</b>
            <span className="block text-xs text-mute">{detail}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
