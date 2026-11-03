'use client';
import { BookOpen, CirclePlus, LayoutDashboard, MessageSquareWarning, ShieldCheck } from 'lucide-react';
import Brand from './Brand';
import ThemeToggle from './ThemeToggle';

export const NAV = [
  ['overview', LayoutDashboard, 'Overview'],
  ['claims', ShieldCheck, 'Claim ledger'],
  ['gaps', MessageSquareWarning, 'Knowledge gaps'],
  ['sources', BookOpen, 'Sources'],
];

const label = 'px-2 text-xs font-semibold tracking-widest text-mute';

export default function Shell({ tab, onTab, gaps, name, onNew, children }) {
  return (
    <div className="lg:grid lg:grid-cols-[256px_1fr]">
      <aside className="no-print sticky top-0 hidden h-screen flex-col border-r bg-card p-4 lg:flex">
        <Brand />
        <div className="mt-5 flex items-center gap-3 rounded-xl border p-3 text-sm">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-soft text-xs font-semibold text-brand">HG</span>
          <span><b className="block">Engineering workspace</b><span className="text-xs text-mute">Hackathon demo</span></span>
        </div>
        <p className={`mt-6 ${label}`}>WORKSPACE</p>
        <nav className="mt-2 space-y-1">
          {NAV.map(([key, Icon, text]) => (
            <button key={key} onClick={() => onTab(key)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm ${tab === key ? 'bg-indigo-500/10 font-medium text-brand' : 'text-mute hover:bg-soft'}`}>
              <Icon size={17} />{text}
              {key === 'gaps' && gaps > 0 && <span className="ml-auto rounded-full bg-soft px-2 text-xs">{gaps}</span>}
            </button>
          ))}
        </nav>
        <p className={`mt-6 flex items-center justify-between ${label}`}>HANDOVERS <button onClick={onNew} aria-label="New handover" className="hover:text-brand"><CirclePlus size={15} /></button></p>
        <p className="mt-2 flex items-center gap-2 px-3 text-sm"><span className="h-2 w-2 rounded-full bg-indigo-500" />{name}</p>
        <div className="mt-auto rounded-xl border bg-soft p-3 text-xs">
          <b className="flex items-center gap-1.5 text-sm"><ShieldCheck size={15} />Review before sharing</b>
          <p className="mt-1 text-mute">Nothing leaves this workspace until a named reviewer approves it.</p>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="no-print flex items-center justify-between border-b bg-card px-6 py-3 text-sm">
          <span className="lg:hidden"><Brand /></span>
          <span className="hidden text-mute lg:block">Workspace / <b className="text-ink">{name}</b></span>
          <span className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-xs text-mute sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" />Hackathon demo</span>
            <ThemeToggle />
          </span>
        </div>
        <main className="mx-auto max-w-5xl space-y-6 p-6">{children}</main>
      </div>
    </div>
  );
}
