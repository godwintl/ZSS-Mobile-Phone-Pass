export function formatCurrency(value, { compact = false, currency = 'USD', maximumFractionDigits } = {}) {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: maximumFractionDigits ?? (compact ? 1 : 0),
  }).format(value)
}

export function formatPercent(fraction, { maximumFractionDigits = 1 } = {}) {
  if (!Number.isFinite(fraction)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits,
  }).format(fraction)
}

export function formatYears(years) {
  if (!Number.isFinite(years)) return '—'
  if (years <= 0) return 'Reached'
  const whole = Math.floor(years)
  const months = Math.round((years - whole) * 12)
  if (whole === 0) return `${months} mo`
  if (months === 0) return `${whole} yr`
  return `${whole} yr ${months} mo`
}

export function formatDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
}
