const tones = {
  green: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-rose-100 text-rose-800',
  grey: 'bg-stone-200 text-stone-700',
};

export default function Tag({ tone = 'grey', children }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
