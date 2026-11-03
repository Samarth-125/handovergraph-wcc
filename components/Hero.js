import { Code2, FileText, GitPullRequest, Network } from 'lucide-react';

const chip = 'absolute grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-white/10';

export default function Hero({ kicker, title, text, meta = [] }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f1b3d] to-[#26378a] p-7 text-white">
      <p className="text-xs font-semibold tracking-widest text-indigo-200">● {kicker}</p>
      <h2 className="mt-3 max-w-lg text-2xl font-semibold sm:text-3xl">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-indigo-100/80">{text}</p>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-indigo-100/80">{meta.map((m) => <span key={m}>{m}</span>)}</div>
      <div aria-hidden className="absolute -right-6 top-1/2 hidden h-56 w-56 -translate-y-1/2 place-items-center rounded-full border border-white/10 sm:grid">
        <div className="grid h-36 w-36 place-items-center rounded-full border border-white/10">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-500"><Network size={26} /></div>
        </div>
        <span className={`${chip} -left-2 top-8`}><Code2 size={17} /></span>
        <span className={`${chip} right-10 top-1`}><GitPullRequest size={17} /></span>
        <span className={`${chip} bottom-6 left-6`}><FileText size={17} /></span>
      </div>
    </section>
  );
}
