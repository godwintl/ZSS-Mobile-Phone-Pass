export default function StatCard({ icon, label, value, sub, accent = 'emerald' }) {
  const accents = {
    emerald: 'text-emerald-brand',
    blue: 'text-blue-brand',
    amber: 'text-amber-brand',
    ink: 'text-ink',
  }
  return (
    <div className="rounded-2xl border border-card-border bg-card p-4 transition-colors hover:border-slate-600">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        <span>{label}</span>
      </div>
      <div className={`mt-2 text-xl font-bold tracking-tight sm:text-2xl ${accents[accent]}`}>
        {value}
      </div>
      {sub ? <div className="mt-1 font-mono text-[11px] text-muted">{sub}</div> : null}
    </div>
  )
}
