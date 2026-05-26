import { useMemo, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { computeFire, DEFAULT_INPUTS } from './lib/fire'
import { formatCurrency, formatDate, formatPercent, formatYears } from './lib/format'
import ProgressRing from './components/ProgressRing'
import StatCard from './components/StatCard'
import ProjectionChart from './components/ProjectionChart'
import MilestoneList from './components/MilestoneList'
import SettingsSheet from './components/SettingsSheet'

export default function App() {
  const [inputs, setInputs] = useLocalStorage('fire-inputs', DEFAULT_INPUTS)
  const [sheetOpen, setSheetOpen] = useState(false)

  const result = useMemo(() => computeFire(inputs), [inputs])

  return (
    <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-12 pt-5 sm:px-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight sm:text-2xl">
            <span aria-hidden="true">🔥</span> FIRE Tracker
          </h1>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Financial Independence · Retire Early
          </p>
        </div>
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-card-border bg-card px-3.5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-slate-500"
        >
          <span aria-hidden="true">⚙</span>
          <span className="hidden sm:inline">Edit numbers</span>
          <span className="sm:hidden">Edit</span>
        </button>
      </header>

      {/* Hero progress */}
      <section className="mt-6 rounded-3xl border border-card-border bg-card p-6 animate-fade-up sm:p-8">
        <ProgressRing
          progress={result.progress}
          current={inputs.currentNetWorth}
          target={result.fireNumber}
        />
        <div className="mt-6 flex items-center justify-center gap-2 text-center">
          {result.reached ? (
            <p className="text-sm font-semibold text-emerald-brand">
              🎉 You've reached financial independence!
            </p>
          ) : (
            <p className="text-sm text-muted">
              <span className="font-bold text-ink">{formatYears(result.yearsToFire)}</span> to go
              {Number.isFinite(result.fireAge) && (
                <>
                  {' · '}retire at{' '}
                  <span className="font-bold text-ink">age {Math.round(result.fireAge)}</span>
                </>
              )}
            </p>
          )}
        </div>
      </section>

      {/* KPI grid */}
      <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon="🎯"
          label="FIRE Number"
          value={formatCurrency(result.fireNumber, { compact: true })}
          sub={`at ${formatPercent(inputs.withdrawalRate / 100, { maximumFractionDigits: 1 })} withdrawal`}
          accent="amber"
        />
        <StatCard
          icon="💰"
          label="Net Worth"
          value={formatCurrency(inputs.currentNetWorth, { compact: true })}
          sub={`${formatPercent(result.progress)} of goal`}
          accent="emerald"
        />
        <StatCard
          icon="📈"
          label="Savings Rate"
          value={formatPercent(result.savingsRate)}
          sub={`${formatCurrency(result.annualSavings, { compact: true })}/yr saved`}
          accent="blue"
        />
        <StatCard
          icon="🏁"
          label="FIRE Date"
          value={result.reached ? 'Now' : formatDate(result.fireDate)}
          sub={formatYears(result.yearsToFire)}
          accent="ink"
        />
      </section>

      {/* Coast FIRE banner */}
      <section
        className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 ${
          result.coastReached
            ? 'border-emerald-brand/30 bg-emerald-brand/10'
            : 'border-card-border bg-card'
        }`}
      >
        <span className="text-lg" aria-hidden="true">
          {result.coastReached ? '🌴' : '⛵'}
        </span>
        <div className="text-sm">
          <p className="font-semibold text-ink">
            {result.coastReached ? 'Coast FIRE reached' : 'Coast FIRE target'}
          </p>
          <p className="mt-0.5 text-muted">
            {result.coastReached ? (
              <>
                Even with no new contributions, your investments should grow to your FIRE number by
                age&nbsp;65.
              </>
            ) : (
              <>
                Reach{' '}
                <span className="font-semibold text-ink">
                  {formatCurrency(result.coastNumber, { compact: true })}
                </span>{' '}
                and you could stop contributing — growth alone carries you to FIRE by age&nbsp;65.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Projection chart */}
      <section className="mt-4 rounded-3xl border border-card-border bg-card p-4 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            Net worth projection
          </h2>
          <span className="font-mono text-[10px] text-muted">
            {inputs.annualReturn}% return
          </span>
        </div>
        <ProjectionChart
          data={result.projection}
          fireNumber={result.fireNumber}
          reached={result.reached}
        />
      </section>

      {/* Milestones */}
      <section className="mt-4 rounded-3xl border border-card-border bg-card p-4 sm:p-6">
        <h2 className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          Milestones
        </h2>
        <MilestoneList milestones={result.milestones} />
      </section>

      <footer className="mt-6 text-center font-mono text-[10px] leading-relaxed text-muted">
        Projections are estimates, not financial advice. Enter a real (inflation-adjusted) return
        for today's-dollar figures. Saved locally on this device.
      </footer>

      <SettingsSheet
        open={sheetOpen}
        inputs={inputs}
        onClose={() => setSheetOpen(false)}
        onSave={setInputs}
      />
    </div>
  )
}
