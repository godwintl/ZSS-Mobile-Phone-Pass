import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../lib/format'

function ChartTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const point = payload[0].payload
  return (
    <div className="rounded-xl border border-card-border bg-[#0d1320] px-3 py-2 shadow-xl">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
        Age {Math.round(point.age)}
      </div>
      <div className="mt-0.5 text-sm font-bold text-ink">
        {formatCurrency(point.balance, { compact: true })}
      </div>
    </div>
  )
}

export default function ProjectionChart({ data, fireNumber, reached }) {
  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="age"
            tickFormatter={(v) => Math.round(v)}
            stroke="#475569"
            tick={{ fontSize: 11, fontFamily: 'DM Mono', fill: '#94a3b8' }}
            tickLine={false}
            axisLine={{ stroke: '#1e293b' }}
            minTickGap={24}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v, { compact: true, maximumFractionDigits: 0 })}
            stroke="#475569"
            tick={{ fontSize: 10, fontFamily: 'DM Mono', fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
          {Number.isFinite(fireNumber) && (
            <ReferenceLine
              y={fireNumber}
              stroke="#f59e0b"
              strokeDasharray="5 4"
              label={{
                value: 'FIRE',
                position: 'insideTopRight',
                fill: '#f59e0b',
                fontSize: 10,
                fontFamily: 'DM Mono',
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#areaGradient)"
            isAnimationActive
          />
        </AreaChart>
      </ResponsiveContainer>
      {!reached && (
        <p className="mt-2 text-center font-mono text-[11px] text-amber-brand">
          Goal not reached within 80 years — try increasing contributions or savings.
        </p>
      )}
    </div>
  )
}
