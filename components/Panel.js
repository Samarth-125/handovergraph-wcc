export default function Panel({ title, sub, action, className = '', children }) {
  return (
    <section className={`rounded-2xl border bg-card p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {sub && <p className="text-sm text-mute">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
