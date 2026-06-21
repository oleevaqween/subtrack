import { useState, useEffect, useRef } from 'react'
import { X, Sparkles, CalendarDays } from 'lucide-react'
import { CURRENCIES } from '../App'

const CATEGORIES = [
  'entertainment',
  'productivity',
  'music',
  'gaming',
  'cloud',
  'fitness',
  'news',
  'education',
  'finance',
  'other',
]

const REMINDER_OPTIONS = [
  { value: '1', label: '1 day before' },
  { value: '2', label: '2 days before' },
  { value: '3', label: '3 days before' },
  { value: '5', label: '5 days before' },
  { value: '7', label: '1 week before' },
  { value: '14', label: '2 weeks before' },
]

const POPULAR_SERVICES = [
  { name: 'Netflix', category: 'entertainment', amount: '15.49', cycle: 'monthly', currency: 'USD' },
  { name: 'Spotify', category: 'music', amount: '10.99', cycle: 'monthly', currency: 'USD' },
  { name: 'Disney+', category: 'entertainment', amount: '13.99', cycle: 'monthly', currency: 'USD' },
  { name: 'YouTube Premium', category: 'entertainment', amount: '13.99', cycle: 'monthly', currency: 'USD' },
  { name: 'ChatGPT Plus', category: 'productivity', amount: '20.00', cycle: 'monthly', currency: 'USD' },
  { name: 'Showmax', category: 'entertainment', amount: '2900', cycle: 'monthly', currency: 'NGN' },
  { name: 'MTN Data', category: 'cloud', amount: '1500', cycle: 'monthly', currency: 'NGN' },
  { name: 'GitHub Pro', category: 'productivity', amount: '4.00', cycle: 'monthly', currency: 'USD' },
  { name: 'Xbox Game Pass', category: 'gaming', amount: '16.99', cycle: 'monthly', currency: 'USD' },
  { name: 'Gym', category: 'fitness', amount: '15000', cycle: 'monthly', currency: 'NGN' },
]

function AddSubscription({ onAdd, onUpdate, onClose, editingSub }) {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    cycle: 'monthly',
    category: 'other',
    currency: 'NGN',
    nextBilling: '',
    reminderDays: '2',
    notes: '',
    active: true,
  })

  const dateInputRef = useRef(null)

  useEffect(() => {
    if (editingSub) {
      setForm({
        name: editingSub.name || '',
        amount: editingSub.amount || '',
        cycle: editingSub.cycle || 'monthly',
        category: editingSub.category || 'other',
        currency: editingSub.currency || 'NGN',
        nextBilling: editingSub.nextBilling || '',
        reminderDays: editingSub.reminderDays || '2',
        notes: editingSub.notes || '',
        active: editingSub.active ?? true,
      })
    }
  }, [editingSub])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    // Prevent multiple decimals
    const parts = raw.split('.')
    const sanitized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : raw
    setForm(prev => ({ ...prev, amount: sanitized }))
  }

  const formatAmountDisplay = (value) => {
    if (!value) return ''
    const parts = value.split('.')
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart
  }

  const handleQuickAdd = (service) => {
    setForm(prev => ({
      ...prev,
      name: service.name,
      category: service.category,
      amount: service.amount,
      cycle: service.cycle,
      currency: service.currency,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.amount) return

    if (editingSub) {
      onUpdate({ ...editingSub, ...form })
    } else {
      onAdd(form)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const openDatePicker = () => {
    dateInputRef.current?.showPicker?.()
    dateInputRef.current?.focus()
  }

  const inputClasses = "w-full px-4 py-3 text-sm bg-surface-input border border-border-default rounded-2xl text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus focus:ring-3 focus:ring-accent-light transition-all duration-200"
  const labelClasses = "text-[11px] font-semibold text-text-primary/70 mb-2 block uppercase tracking-wider"

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1000] p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={editingSub ? 'Edit subscription' : 'Add subscription'}
    >
      <div className="relative bg-surface-secondary border border-border-default rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/10 dark:shadow-black/40">
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <h2 className="text-lg font-bold text-text-primary">
              {editingSub ? 'Edit Subscription' : 'New Subscription'}
            </h2>
          </div>
          <button
            className="p-2.5 rounded-2xl text-text-muted hover:text-text-primary hover:bg-surface-input transition-all duration-200"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Add Chips */}
        {!editingSub && (
          <div className="px-6 pt-3 pb-1">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Popular services</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SERVICES.map(service => (
                <button
                  key={service.name}
                  type="button"
                  className="group px-3.5 py-2 text-xs font-medium bg-surface-input border border-border-default rounded-2xl text-text-primary/70 hover:text-text-primary hover:border-purple-400/50 hover:bg-purple-500/5 transition-all duration-200"
                  onClick={() => handleQuickAdd(service)}
                >
                  {service.name}
                  <span className="ml-1.5 text-text-muted group-hover:text-purple-400 transition-colors">
                    {CURRENCIES[service.currency]?.symbol}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-5 flex flex-col gap-5">
          {/* Name + Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sub-name" className={labelClasses}>Service Name</label>
              <input
                id="sub-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Netflix"
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="sub-amount" className={labelClasses}>
                Amount ({CURRENCIES[form.currency]?.symbol})
              </label>
              <input
                id="sub-amount"
                type="text"
                inputMode="decimal"
                name="amount"
                value={formatAmountDisplay(form.amount)}
                onChange={handleAmountChange}
                placeholder={form.currency === 'NGN' ? '30,000' : '9.99'}
                required
                className={inputClasses}
              />
            </div>
          </div>

          {/* Currency + Cycle + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="sub-currency" className={labelClasses}>Currency</label>
              <select id="sub-currency" name="currency" value={form.currency} onChange={handleChange} className={inputClasses}>
                {Object.values(CURRENCIES).map(cur => (
                  <option key={cur.code} value={cur.code}>
                    {cur.symbol} {cur.code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sub-cycle" className={labelClasses}>Cycle</label>
              <select id="sub-cycle" name="cycle" value={form.cycle} onChange={handleChange} className={inputClasses}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label htmlFor="sub-category" className={labelClasses}>Category</label>
              <select id="sub-category" name="category" value={form.category} onChange={handleChange} className={inputClasses}>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Next Billing Date, clickable */}
          <div>
            <label htmlFor="sub-billing" className={labelClasses}>Next Billing Date</label>
            <div className="relative">
              <input
                id="sub-billing"
                ref={dateInputRef}
                type="date"
                name="nextBilling"
                value={form.nextBilling}
                onChange={handleChange}
                className={`${inputClasses} pr-12`}
              />
              <button
                type="button"
                onClick={openDatePicker}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-text-muted hover:text-accent hover:bg-accent-light transition-all"
                aria-label="Open date picker"
              >
                <CalendarDays size={18} />
              </button>
            </div>
          </div>

          {/* Reminder */}
          <div>
            <label htmlFor="sub-reminder" className={labelClasses}>Remind me before renewal</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {REMINDER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, reminderDays: opt.value }))}
                  className={`px-2 py-2.5 text-[11px] font-semibold rounded-xl border transition-all duration-200 text-center ${
                    form.reminderDays === opt.value
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-lg shadow-amber-500/20'
                      : 'bg-surface-input border-border-default text-text-primary/70 hover:border-amber-400/50 hover:text-amber-600 dark:hover:text-amber-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-text-muted mt-2">
              Your subscription card will glow amber/red when it's within this window.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="sub-notes" className={labelClasses}>Notes</label>
            <textarea
              id="sub-notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional details..."
              rows={2}
              className={`${inputClasses} resize-y min-h-[60px]`}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              className="px-5 py-3 text-sm font-semibold text-text-secondary border border-border-default rounded-2xl hover:bg-surface-input hover:text-text-primary transition-all duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              {editingSub ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSubscription
