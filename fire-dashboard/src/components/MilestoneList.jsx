import { formatCurrency, formatDate, formatPercent } from '../lib/format'

export default function MilestoneList({ milestones }) {
  return (
    <ul className="flex flex-col">
      {milestones.map((m, i) => (
        <li
          key={m.pct}
          className="flex items-center gap-3 border-b border-white/5 py-3 last:border-0"
        >
          <span
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              m.done
                ? 'bg-emerald-brand/15 text-emerald-brand'
                : 'bg-card-border/60 text-muted'
            }`}
            aria-hidden="true"
          >
            {m.done ? '✓' : i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink">{formatPercent(m.pct, { maximumFractionDigits: 0 })} to FIRE</span>
              {m.done && (
                <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-brand">
                  reached
                </span>
              )}
            </div>
            <div className="font-mono text-[11px] text-muted">
              {formatCurrency(m.target, { compact: true })}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="font-mono text-xs text-ink">
              {m.done ? '—' : formatDate(m.date)}
            </div>
            {!m.done && Number.isFinite(m.age) && (
              <div className="font-mono text-[10px] text-muted">age {Math.round(m.age)}</div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
