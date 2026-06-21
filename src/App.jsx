import { useState, useEffect, useRef, useCallback } from 'react'
import Dashboard from './components/Dashboard'
import SubscriptionList from './components/SubscriptionList'
import AddSubscription from './components/AddSubscription'
import Header from './components/Header'
import ThemeToggle from './components/ThemeToggle'
import SyncPanel from './components/SyncPanel'
import { syncToFirebase, subscribeToFirebase, isFirebaseConfigured } from './firebase'

const STORAGE_KEY = 'subtrack_subscriptions'
const THEME_KEY = 'subtrack_theme'
const RATE_KEY = 'subtrack_exchange_rate'
const SYNC_KEY = 'subtrack_sync_passphrase'

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

function loadSyncPassphrase() {
  try {
    return localStorage.getItem(SYNC_KEY) || ''
  } catch {
    return ''
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
  const [syncPassphrase, setSyncPassphrase] = useState(loadSyncPassphrase)
  const [syncStatus, setSyncStatus] = useState(loadSyncPassphrase() ? 'connected' : 'disconnected')

  const unsubscribeRef = useRef(null)
  const isRemoteUpdate = useRef(false)
  const firebaseEnabled = isFirebaseConfigured()

  // Save to localStorage
  useEffect(() => {
    saveSubscriptions(subscriptions)
  }, [subscriptions])

  useEffect(() => {
    localStorage.setItem(RATE_KEY, exchangeRate)
  }, [exchangeRate])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  // Sync to Firebase whenever data changes (if connected)
  useEffect(() => {
    if (!firebaseEnabled || !syncPassphrase || syncStatus !== 'connected') return
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false
      return
    }

    const timeout = setTimeout(() => {
      syncToFirebase(syncPassphrase, {
        subscriptions,
        exchangeRate,
      }).catch(console.error)
    }, 500) // debounce

    return () => clearTimeout(timeout)
  }, [subscriptions, exchangeRate, syncPassphrase, syncStatus, firebaseEnabled])

  // Subscribe to Firebase real-time updates
  const startSync = useCallback(async (passphrase) => {
    if (!firebaseEnabled) return

    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
    }

    try {
      const unsub = await subscribeToFirebase(passphrase, (data) => {
        isRemoteUpdate.current = true
        if (data.subscriptions) {
          setSubscriptions(data.subscriptions)
          saveSubscriptions(data.subscriptions)
        }
        if (data.exchangeRate) {
          setExchangeRate(data.exchangeRate)
          localStorage.setItem(RATE_KEY, data.exchangeRate)
        }
      })
      unsubscribeRef.current = unsub
      setSyncStatus('connected')
    } catch (err) {
      console.error('Sync failed:', err)
      setSyncStatus('disconnected')
    }
  }, [firebaseEnabled])

  // Auto-reconnect on load if passphrase exists
  useEffect(() => {
    if (firebaseEnabled && syncPassphrase) {
      startSync(syncPassphrase)
    }
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleConnect = async (passphrase) => {
    setSyncPassphrase(passphrase)
    localStorage.setItem(SYNC_KEY, passphrase)

    // Push current local data first, then subscribe
    await syncToFirebase(passphrase, { subscriptions, exchangeRate })
    await startSync(passphrase)
  }

  const handleDisconnect = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }
    setSyncPassphrase('')
    setSyncStatus('disconnected')
    localStorage.removeItem(SYNC_KEY)
  }

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

        {firebaseEnabled && (
          <SyncPanel
            syncStatus={syncStatus}
            passphrase={syncPassphrase}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        )}

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
