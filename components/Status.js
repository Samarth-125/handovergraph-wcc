import { BookOpen, FileText, GitPullRequest, Link2, ShieldAlert, UserRound } from 'lucide-react';
import Tag from './Tag';

const ICONS = { decision: BookOpen, dependency: Link2, blocker: ShieldAlert, unfinished: GitPullRequest, ownership: UserRound };
const STATUS = { approve: ['green', 'Approved'], restrict: ['grey', 'Restricted'], reject: ['red', 'Rejected'] };

export function KindIcon({ type }) {
  const Icon = ICONS[type] ?? FileText;
  return <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-soft text-mute"><Icon size={16} /></span>;
}

export function StatusTag({ value }) {
  const [tone, label] = STATUS[value] ?? ['amber', 'Needs review'];
  return <Tag tone={tone}>{label}</Tag>;
}
