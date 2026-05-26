import { useEffect, useState } from 'react'
import { DEFAULT_INPUTS } from '../lib/fire'

const FIELDS = [
  { key: 'currentAge', label: 'Current age', prefix: '', suffix: 'yrs', step: 1 },
  { key: 'currentNetWorth', label: 'Invested net worth', prefix: '$', step: 1000 },
  { key: 'annualIncome', label: 'Annual income (after tax)', prefix: '$', step: 1000 },
  { key: 'annualExpenses', label: 'Annual spending', prefix: '$', step: 1000 },
  { key: 'monthlyContribution', label: 'Monthly contribution', prefix: '$', step: 100 },
  { key: 'annualReturn', label: 'Expected annual return', suffix: '%', step: 0.5 },
  { key: 'withdrawalRate', label: 'Safe withdrawal rate', suffix: '%', step: 0.1 },
]

export default function SettingsSheet({ open, inputs, onClose, onSave }) {
  const [draft, setDraft] = useState(inputs)

  useEffect(() => {
    if (open) setDraft(inputs)
  }, [open, inputs])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function update(key, raw) {
    const num = raw === '' ? 0 : Number(raw)
    setDraft((d) => ({ ...d, [key]: Number.isNaN(num) ? d[key] : num }))
  }

  function save() {
    onSave(draft)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Edit assumptions"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl border border-card-border bg-card animate-fade-up sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-card-border px-5 py-4">
          <h2 className="text-base font-bold tracking-tight">Your numbers</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <label key={f.key} className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                  {f.label}
                </span>
                <div className="flex items-center rounded-xl border border-card-border bg-black/30 px-3 transition-colors focus-within:border-blue-brand focus-within:ring-2 focus-within:ring-blue-brand/20">
                  {f.prefix && <span className="font-mono text-sm text-muted">{f.prefix}</span>}
                  <input
                    type="number"
                    inputMode="decimal"
                    step={f.step}
                    value={draft[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="w-full bg-transparent py-2.5 px-1 text-base font-semibold text-ink outline-none"
                  />
                  {f.suffix && <span className="font-mono text-xs text-muted">{f.suffix}</span>}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div
          className="flex items-center gap-3 border-t border-card-border px-5 py-4"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={() => setDraft(DEFAULT_INPUTS)}
            className="rounded-xl border border-card-border px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-slate-500 hover:text-ink"
          >
            Reset
          </button>
          <button
            onClick={save}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-brand to-blue-brand py-3 text-sm font-bold text-white shadow-glow transition-transform active:scale-[0.98]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
