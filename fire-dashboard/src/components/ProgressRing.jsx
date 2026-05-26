import { formatCurrency, formatPercent } from '../lib/format'

export default function ProgressRing({ progress, current, target }) {
  const size = 232
  const stroke = 16
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(progress, 1))
  const offset = circumference * (1 - clamped)

  return (
    <div className="relative mx-auto" style={{ width: size, height: size, maxWidth: '100%' }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full -rotate-90"
        role="img"
        aria-label={`${formatPercent(progress)} of FIRE goal reached`}
      >
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          To Financial Independence
        </span>
        <span className="mt-1 bg-gradient-to-r from-emerald-brand to-blue-brand bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
          {formatPercent(progress)}
        </span>
        <span className="mt-2 font-mono text-xs text-ink">
          {formatCurrency(current, { compact: true })}
          <span className="text-muted"> / {formatCurrency(target, { compact: true })}</span>
        </span>
      </div>
    </div>
  )
}
