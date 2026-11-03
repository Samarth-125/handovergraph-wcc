'use client';
import { NAV } from './Shell';

export default function Tabs({ tab, onTab, gaps }) {
  return (
    <div className="no-print flex gap-1 overflow-x-auto border-b">
      {NAV.map(([key, Icon, text]) => (
        <button key={key} onClick={() => onTab(key)} className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 text-sm ${tab === key ? 'border-indigo-600 font-medium text-brand' : 'border-transparent text-mute hover:text-ink'}`}>
          <Icon size={15} />{text}
          {key === 'gaps' && <span className="rounded-full bg-amber-500/15 px-1.5 text-xs text-amber-700 dark:text-amber-300">{gaps}</span>}
        </button>
      ))}
    </div>
  );
}
