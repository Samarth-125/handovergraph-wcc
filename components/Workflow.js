import { Check } from 'lucide-react';

// Four steps; everything before `at` is done, `at` is where the reviewer is now.
export default function Workflow({ at }) {
  const steps = ['Connect', 'Reconstruct', 'Review', 'Handover'];
  return (
    <div className="no-print flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border bg-card px-5 py-3 text-sm">
      <span className="text-xs font-semibold tracking-widest text-mute">HANDOVER FLOW</span>
      {steps.map((name, i) => (
        <span key={name} className="flex items-center gap-2">
          <span className={`grid h-5 w-5 place-items-center rounded-full text-xs ${i < at ? 'bg-emerald-500 text-white' : i === at ? 'bg-indigo-600 text-white' : 'bg-soft text-mute'}`}>
            {i < at ? <Check size={12} /> : i + 1}
          </span>
          <b className={i > at ? 'font-medium text-mute' : ''}>{name}</b>
        </span>
      ))}
    </div>
  );
}
