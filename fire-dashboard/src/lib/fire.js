// Core FIRE (Financial Independence, Retire Early) projections.
// All figures are nominal; the expected return should be entered as a real
// (inflation-adjusted) return if the user wants today's-dollar projections.

export const DEFAULT_INPUTS = {
  currentAge: 30,
  currentNetWorth: 50000,
  annualIncome: 90000,
  annualExpenses: 45000,
  monthlyContribution: 2500,
  annualReturn: 7, // percent
  withdrawalRate: 4, // percent (the "4% rule")
}

const MAX_MONTHS = 80 * 12

export function computeFire(inputs) {
  const {
    currentAge,
    currentNetWorth,
    annualIncome,
    annualExpenses,
    monthlyContribution,
    annualReturn,
    withdrawalRate,
  } = inputs

  const swr = withdrawalRate / 100
  const fireNumber = swr > 0 ? annualExpenses / swr : Infinity

  const progress = fireNumber > 0 ? currentNetWorth / fireNumber : 0

  const annualSavings = annualIncome - annualExpenses
  const savingsRate = annualIncome > 0 ? annualSavings / annualIncome : 0

  const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1

  // Coast FIRE: the amount that, left untouched, grows to the FIRE number by
  // a target retirement age (assumed 65) without further contributions.
  const coastTargetAge = 65
  const coastYears = Math.max(coastTargetAge - currentAge, 0)
  const coastNumber =
    annualReturn !== 0
      ? fireNumber / Math.pow(1 + annualReturn / 100, coastYears)
      : fireNumber
  const coastReached = currentNetWorth >= coastNumber

  // Simulate net worth month by month until the FIRE number is reached.
  let balance = currentNetWorth
  let months = 0
  const yearly = [{ year: 0, age: currentAge, balance }]
  let reached = balance >= fireNumber

  while (balance < fireNumber && months < MAX_MONTHS) {
    balance = balance * (1 + monthlyReturn) + monthlyContribution
    months += 1
    if (months % 12 === 0) {
      yearly.push({ year: months / 12, age: currentAge + months / 12, balance })
    }
    if (balance >= fireNumber) {
      reached = true
      break
    }
  }

  // Capture a final partial-year point so the chart ends exactly at FIRE.
  if (reached && months % 12 !== 0) {
    yearly.push({ year: months / 12, age: currentAge + months / 12, balance })
  }

  const yearsToFire = reached ? months / 12 : Infinity
  const fireAge = reached ? currentAge + yearsToFire : Infinity

  let fireDate = null
  if (reached) {
    fireDate = new Date()
    fireDate.setMonth(fireDate.getMonth() + months)
  }

  const milestones = buildMilestones({
    fireNumber,
    currentNetWorth,
    monthlyReturn,
    monthlyContribution,
    currentAge,
  })

  return {
    fireNumber,
    progress,
    savingsRate,
    annualSavings,
    monthlyReturn,
    coastNumber,
    coastReached,
    yearsToFire,
    fireAge,
    fireDate,
    reached,
    projection: yearly,
    milestones,
  }
}

function monthsToReach(target, start, monthlyReturn, contribution) {
  if (start >= target) return 0
  let balance = start
  let months = 0
  while (balance < target && months < MAX_MONTHS) {
    balance = balance * (1 + monthlyReturn) + contribution
    months += 1
  }
  return balance >= target ? months : Infinity
}

function buildMilestones({ fireNumber, currentNetWorth, monthlyReturn, monthlyContribution, currentAge }) {
  const stops = [0.25, 0.5, 0.75, 1]
  return stops.map((pct) => {
    const target = fireNumber * pct
    const months = monthsToReach(target, currentNetWorth, monthlyReturn, monthlyContribution)
    const done = currentNetWorth >= target
    let date = null
    if (Number.isFinite(months)) {
      date = new Date()
      date.setMonth(date.getMonth() + months)
    }
    return {
      pct,
      target,
      done,
      months,
      age: Number.isFinite(months) ? currentAge + months / 12 : Infinity,
      date,
    }
  })
}
