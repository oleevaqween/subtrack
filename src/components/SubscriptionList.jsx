import { Trash2, Edit3, Pause, Play, Calendar, RefreshCw, Zap, AlertTriangle } from 'lucide-react'
import { format, parseISO, isPast, differenceInDays } from 'date-fns'
import { CURRENCIES } from '../App'

const CATEGORY_CONFIG = {
  entertainment: { color: 'bg-purple-500', ring: 'ring-purple-500/30' },
  productivity: { color: 'bg-indigo-500', ring: 'ring-indigo-500/30' },
  music: { color: 'bg-pink-500', ring: 'ring-pink-500/30' },
  gaming: { color: 'bg-emerald-500', ring: 'ring-emerald-500/30' },
  cloud: { color: 'bg-cyan-500', ring: 'ring-cyan-500/30' },
  fitness: { color: 'bg-amber-500', ring: 'ring-amber-500/30' },
  news: { color: 'bg-red-500', ring: 'ring-red-500/30' },
  education: { color: 'bg-teal-500', ring: 'ring-teal-500/30' },
  finance: { color: 'bg-blue-500', ring: 'ring-blue-500/30' },
  other: { color: 'bg-gray-400', ring: 'ring-gray-400/30' },
}

function getRenewalStatus(sub) {
  if (!sub.active || !sub.nextBilling) return 'normal'
  const billingDate = parseISO(sub.nextBilling)
  const today = new Date()

  if (isPast(billingDate)) return 'overdue'

  const daysUntil = differenceInDays(billingDate, today)
  const reminderDays = parseInt(sub.reminderDays) || 2

  if (daysUntil <= Math.floor(reminderDays / 2)) return 'urgent' // red, very close
  if (daysUntil <= reminderDays) return 'warning' // amber, within reminder window

  return 'normal'
}

function SubscriptionList({ subscriptions, filter, searchQuery, onFilterChange, onDelete, onToggleActive, onEdit }) {
  const filters = [
    { key: 'all', label: 'All', count: subscriptions.length },
    { key: 'active', label: 'Active', count: subscriptions.filter(s => s.active).length },
    { key: 'inactive', label: 'Paused', count: subscriptions.filter(s => !s.active).length },
  ]

  const filtered = subscriptions
    .filter(sub => {
      if (filter === 'active') return sub.active
      if (filter === 'inactive') return !sub.active
      return true
    })
    .filter(sub => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        sub.name.toLowerCase().includes(query) ||
        sub.category?.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      if (a.active && !b.active) return -1
      if (!a.active && b.active) return 1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  const formatCycleFull = (cycle) => {
    const labels = { weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly' }
    return labels[cycle] || cycle
  }

  const formatCycleShort = (cycle) => {
    const labels = { weekly: 'wk', monthly: 'mo', quarterly: 'qtr', yearly: 'yr' }
    return labels[cycle] || ''
  }

  const getCurrencySymbol = (code) => {
    return CURRENCIES[code]?.symbol || code
  }

  const getCardStyles = (status) => {
    switch (status) {
      case 'overdue':
        return 'border-red-500/60 shadow-red-500/10 shadow-lg bg-red-500/[0.03]'
      case 'urgent':
        return 'border-red-400/50 shadow-red-400/10 shadow-lg bg-red-400/[0.02]'
      case 'warning':
        return 'border-amber-400/50 shadow-amber-400/10 shadow-lg bg-amber-400/[0.02]'
      default:
        return 'border-border-default hover:border-purple-400/40'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'overdue':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-red-500/15 text-red-500">
            <AlertTriangle size={10} /> Overdue
          </span>
        )
      case 'urgent':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-red-500/10 text-red-400 animate-pulse">
            <AlertTriangle size={10} /> Due soon
          </span>
        )
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-amber-500/10 text-amber-500">
            <AlertTriangle size={10} /> Upcoming
          </span>
        )
      default:
        return null
    }
  }

  return (
    <section aria-label="Subscriptions list" className="flex flex-col gap-5 sm:gap-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-amber-500" />
          <h2 className="text-lg sm:text-xl font-bold text-text-primary">Subscriptions</h2>
        </div>
        <div className="flex bg-surface-card border border-border-default rounded-2xl p-1.5 gap-1 self-start sm:self-auto" role="tablist" aria-label="Filter subscriptions">
          {filters.map(f => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                filter === f.key
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-input'
              }`}
              onClick={() => onFilterChange(f.key)}
            >
              {f.label}
              <span className={`ml-1.5 text-[10px] ${filter === f.key ? 'text-white/70' : 'text-text-muted'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-surface-card border-2 border-dashed border-border-default rounded-3xl py-20 px-8 text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
            <span className="text-4xl">✨</span>
          </div>
          <h3 className="text-lg font-bold text-text-primary">No subscriptions yet</h3>
          <p className="text-sm text-text-secondary max-w-sm">
            Start tracking your subscriptions to get insights into your spending patterns.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(sub => {
            const catConfig = CATEGORY_CONFIG[sub.category] || CATEGORY_CONFIG.other
            const status = getRenewalStatus(sub)

            return (
              <div
                key={sub.id}
                className={`group relative bg-surface-card border rounded-3xl p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  !sub.active ? 'opacity-50 hover:opacity-80' : 'card-glow'
                } ${getCardStyles(status)}`}
              >
                {/* Top Row: Name + Amount */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-3 h-3 rounded-full ${catConfig.color} ring-4 ${catConfig.ring} shrink-0`} />
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-sm font-bold text-text-primary leading-tight truncate">{sub.name}</h3>
                      <span className="text-[11px] text-text-muted capitalize font-medium">{sub.category || 'Other'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-lg font-extrabold text-text-primary">
                      {getCurrencySymbol(sub.currency)}{parseFloat(sub.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">
                      per {formatCycleShort(sub.cycle)}
                    </span>
                  </div>
                </div>

                {/* Meta Row */}
                <div className="flex items-center gap-2 flex-wrap">
                  {sub.nextBilling && (
                    <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${
                      status === 'overdue' || status === 'urgent'
                        ? 'bg-red-500/10 text-red-500 dark:text-red-400'
                        : status === 'warning'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-surface-input text-text-secondary'
                    }`}>
                      <Calendar size={12} />
                      <span>{format(parseISO(sub.nextBilling), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-surface-input text-text-secondary">
                    <RefreshCw size={12} />
                    <span>{formatCycleFull(sub.cycle)}</span>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted px-2 py-0.5 rounded-md bg-surface-input border border-border-default uppercase tracking-wider">
                    {sub.currency || 'NGN'}
                  </span>
                  {getStatusBadge(status)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-border-default">
                  <button
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                      sub.active
                        ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/15'
                        : 'border-border-default text-text-muted hover:text-text-primary hover:bg-surface-input'
                    }`}
                    onClick={() => onToggleActive(sub.id)}
                    aria-label={sub.active ? 'Pause subscription' : 'Resume subscription'}
                  >
                    {sub.active ? <Pause size={13} /> : <Play size={13} />}
                    {sub.active ? 'Pause' : 'Resume'}
                  </button>
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      className="p-2 rounded-xl text-text-muted hover:text-indigo-500 hover:bg-indigo-500/10 transition-all duration-200"
                      onClick={() => onEdit(sub)}
                      aria-label="Edit subscription"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      className="p-2 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
                      onClick={() => onDelete(sub.id)}
                      aria-label="Delete subscription"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default SubscriptionList
