const tones = {
  green: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  red: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
  grey: 'bg-soft text-ink',
};

export default function Tag({ tone = 'grey', children }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
