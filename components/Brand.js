import { Network } from 'lucide-react';

export default function Brand() {
  return (
    <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white"><Network size={18} /></span>
      <span>handover<span className="font-normal text-mute">graph</span></span>
    </span>
  );
}
