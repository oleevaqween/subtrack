import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import SubscriptionList from './components/SubscriptionList'
import AddSubscription from './components/AddSubscription'
import Header from './components/Header'
import ThemeToggle from './components/ThemeToggle'

const STORAGE_KEY = 'subtrack_subscriptions'
const THEME_KEY = 'subtrack_theme'
const RATE_KEY = 'subtrack_exchange_rate'

export const CURRENCIES = {
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
}

function loadSubscriptions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function loadExchangeRate() {
  try {
    const saved = localStorage.getItem(RATE_KEY)
    return saved ? saved : '1600'
  } catch {
    return '1600'
  }
}

function saveSubscriptions(subs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs))
}

function App() {
  const [subscriptions, setSubscriptions] = useState(loadSubscriptions)
  const [showAdd, setShowAdd] = useState(false)
  const [editingSub, setEditingSub] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(loadTheme)
  const [exchangeRate, setExchangeRate] = useState(loadExchangeRate)

  useEffect(() => {
    saveSubscriptions(subscriptions)
  }, [subscriptions])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(RATE_KEY, exchangeRate)
  }, [exchangeRate])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const addSubscription = (sub) => {
    const newSub = {
      ...sub,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setSubscriptions(prev => [...prev, newSub])
    setShowAdd(false)
  }

  const updateSubscription = (updated) => {
    setSubscriptions(prev =>
      prev.map(s => (s.id === updated.id ? { ...s, ...updated } : s))
    )
    setEditingSub(null)
    setShowAdd(false)
  }

  const deleteSubscription = (id) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id))
  }

  const toggleActive = (id) => {
    setSubscriptions(prev =>
      prev.map(s => (s.id === id ? { ...s, active: !s.active } : s))
    )
  }

  const handleEdit = (sub) => {
    setEditingSub(sub)
    setShowAdd(true)
  }

  const handleCloseForm = () => {
    setShowAdd(false)
    setEditingSub(null)
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <Header
        onAddClick={() => setShowAdd(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <Dashboard
          subscriptions={subscriptions}
          exchangeRate={exchangeRate}
          onExchangeRateChange={setExchangeRate}
        />
        <SubscriptionList
          subscriptions={subscriptions}
          filter={filter}
          searchQuery={searchQuery}
          onFilterChange={setFilter}
          onDelete={deleteSubscription}
          onToggleActive={toggleActive}
          onEdit={handleEdit}
        />
      </main>

      {showAdd && (
        <AddSubscription
          onAdd={addSubscription}
          onUpdate={updateSubscription}
          onClose={handleCloseForm}
          editingSub={editingSub}
        />
      )}

      {/* Floating theme toggle */}
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
    </div>
  )
}

export default App
