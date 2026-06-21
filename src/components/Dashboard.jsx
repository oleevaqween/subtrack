import { Wallet, TrendingUp, CreditCard, Bell, ArrowRightLeft, Calendar } from 'lucide-react'
import { isAfter, addDays, parseISO, getMonth, getDaysInMonth } from 'date-fns'
import { CURRENCIES } from '../App'

function Dashboard({ subscriptions, exchangeRate, onExchangeRateChange }) {
  const activeSubscriptions = subscriptions.filter(s => s.active)
  const rate = parseFloat(exchangeRate) || 1600

  // Calculate monthly totals per currency
  const monthlyByCurrency = {}
  activeSubscriptions.forEach(sub => {
    const amount = parseFloat(sub.amount) || 0
    const currency = sub.currency || 'NGN'
    let monthly = 0
    switch (sub.cycle) {
      case 'weekly': monthly = amount * 4.33; break
      case 'monthly': monthly = amount; break
      case 'quarterly': monthly = amount / 3; break
      case 'yearly': monthly = amount / 12; break
      default: monthly = amount
    }
    monthlyByCurrency[currency] = (monthlyByCurrency[currency] || 0) + monthly
  })

  // Yearly projection: remaining months in the year (including current month's remaining portion)
  const now = new Date()
  const currentMonth = getMonth(now) // 0-indexed (Jan=0)
  const currentDay = now.getDate()
  const daysInCurrentMonth = getDaysInMonth(now)
  const remainingFractionThisMonth = (daysInCurrentMonth - currentDay) / daysInCurrentMonth
  const fullMonthsRemaining = 12 - currentMonth - 1 // full months after current
  const remainingMonths = remainingFractionThisMonth + fullMonthsRemaining

  const formatMultiCurrency = (multiplier = 1) => {
    const parts = Object.entries(monthlyByCurrency).map(([code, amount]) => {
      const info = CURRENCIES[code] || { symbol: code }
      const val = (amount * multiplier).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      return `${info.symbol}${val}`
    })
    return parts.length > 0 ? parts : ['₦0.00']
  }

  // Consolidated figure: convert everything to NGN for the rest of the year
  const consolidatedNGN = Object.entries(monthlyByCurrency).reduce((total, [code, monthly]) => {
    const projected = monthly * remainingMonths
    if (code === 'NGN') return total + projected
    if (code === 'USD') return total + (projected * rate)
    return total + projected
  }, 0)

  // Full year figure: monthly × 12, all converted to NGN (static — only changes when subs change)
  const fullYearNGN = Object.entries(monthlyByCurrency).reduce((total, [code, monthly]) => {
    const yearly = monthly * 12
    if (code === 'NGN') return total + yearly
    if (code === 'USD') return total + (yearly * rate)
    return total + yearly
  }, 0)

  const upcomingRenewals = activeSubscriptions.filter(sub => {
    if (!sub.nextBilling) return false
    const billingDate = parseISO(sub.nextBilling)
    const sevenDaysFromNow = addDays(new Date(), 7)
    return isAfter(sevenDaysFromNow, billingDate) && isAfter(billingDate, new Date())
  }).length

  const handleRateChange = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    onExchangeRateChange(raw)
  }

  const formatRateDisplay = (value) => {
    if (!value) return ''
    const parts = value.split('.')
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart
  }

  const stats = [
    {
      label: 'Monthly Spend',
      values: formatMultiCurrency(1),
      icon: Wallet,
      gradient: 'from-indigo-500 to-purple-600',
      bgGlow: 'bg-indigo-500/10',
      iconBg: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400',
    },
    {
      label: `Rest of Year (${Math.round(remainingMonths)} mo left)`,
      values: formatMultiCurrency(remainingMonths),
      icon: Calendar,
      gradient: 'from-pink-500 to-rose-500',
      bgGlow: 'bg-pink-500/10',
      iconBg: 'bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400',
    },
    {
      label: 'Active Subscriptions',
      values: [String(activeSubscriptions.length)],
      icon: CreditCard,
      gradient: 'from-emerald-500 to-teal-500',
      bgGlow: 'bg-emerald-500/10',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      label: 'Renewals Soon',
      values: [String(upcomingRenewals)],
      subtitle: 'within 7 days',
      icon: Bell,
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'bg-amber-500/10',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    },
  ]

  return (
    <section aria-label="Subscription statistics" className="flex flex-col gap-5">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative bg-surface-card border border-border-default rounded-3xl p-6 flex flex-col gap-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className={`absolute -top-10 -right-10 w-32 h-32 ${stat.bgGlow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className={`relative w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center`}>
              <stat.icon size={22} />
            </div>
            <div className="relative flex flex-col gap-1">
              <div className="flex flex-col">
                {stat.values.map((val, i) => (
                  <span key={i} className="text-xl font-bold text-text-primary tracking-tight">
                    {val}
                  </span>
                ))}
              </div>
              <span className="text-xs font-medium text-text-secondary">{stat.label}</span>
              {stat.subtitle && <span className="text-[11px] text-text-muted">{stat.subtitle}</span>}
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </div>
        ))}
      </div>

      {/* Exchange rate + Projections */}
      <div className="bg-surface-card border border-border-default rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 items-center">
        {/* Exchange rate input */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0">
            <ArrowRightLeft size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">USD → NGN Rate</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-bold text-text-secondary">$1 =</span>
              <input
                type="text"
                inputMode="decimal"
                value={formatRateDisplay(exchangeRate)}
                onChange={handleRateChange}
                className="w-24 px-3 py-1.5 text-sm font-bold bg-surface-input border border-border-default rounded-xl text-text-primary outline-none focus:border-border-focus focus:ring-2 focus:ring-accent-light transition-all"
                aria-label="Exchange rate: 1 USD to NGN"
              />
              <span className="text-sm font-bold text-text-secondary">₦</span>
            </div>
          </div>
        </div>

        {/* Full Year total (Jan - Dec, static based on current subs) */}
        <div className="flex flex-col gap-1 sm:border-l sm:border-border-default sm:pl-6">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Full Year (Jan – Dec)
          </span>
          <span className="text-2xl font-extrabold text-text-primary tracking-tight">
            ₦{fullYearNGN.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-text-muted">
            12 months × current subs
          </span>
        </div>

        {/* Remaining projection (till Dec) */}
        <div className="flex flex-col gap-1 sm:border-l sm:border-border-default sm:pl-6">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Remaining (till Dec)
          </span>
          <span className="text-2xl font-extrabold text-text-primary tracking-tight">
            ₦{consolidatedNGN.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-text-muted">
            ~{Math.round(remainingMonths)} months left • all in Naira
          </span>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
