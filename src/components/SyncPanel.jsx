import { useState } from 'react'
import { Cloud, CloudOff, Link, Unlink, Eye, EyeOff } from 'lucide-react'

function SyncPanel({ syncStatus, passphrase, onConnect, onDisconnect }) {
  const [input, setInput] = useState('')
  const [showPassphrase, setShowPassphrase] = useState(false)

  const handleConnect = (e) => {
    e.preventDefault()
    if (input.trim().length < 4) return
    onConnect(input.trim())
    setInput('')
  }

  if (syncStatus === 'connected') {
    return (
      <div className="bg-surface-card border border-border-default rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Cloud size={18} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-primary">Sync Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-text-muted">Passphrase:</span>
              <span className="text-[11px] font-mono text-text-secondary">
                {showPassphrase ? passphrase : '••••••••'}
              </span>
              <button
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="p-0.5 text-text-muted hover:text-text-primary transition-colors"
                aria-label={showPassphrase ? 'Hide passphrase' : 'Show passphrase'}
              >
                {showPassphrase ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-border-default rounded-xl text-text-secondary hover:text-red-500 hover:border-red-400/50 hover:bg-red-500/5 transition-all sm:ml-auto"
        >
          <Unlink size={14} />
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="bg-surface-card border border-border-default rounded-3xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-white">
          <CloudOff size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-text-primary">Sync Across Devices</span>
          <span className="text-[11px] text-text-muted">
            Enter a secret passphrase to sync your data in real-time across all your devices.
          </span>
        </div>
      </div>

      <form onSubmit={handleConnect} className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a secret passphrase (min 4 chars)"
          className="flex-1 px-4 py-2.5 text-sm bg-surface-input border border-border-default rounded-xl text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus focus:ring-2 focus:ring-accent-light transition-all"
          minLength={4}
        />
        <button
          type="submit"
          disabled={input.trim().length < 4}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-purple-500/20 transition-all"
        >
          <Link size={14} />
          Connect
        </button>
      </form>

      <p className="text-[10px] text-text-muted">
        Use the same passphrase on all devices. Anyone with your passphrase can access your data — keep it secret.
      </p>
    </div>
  )
}

export default SyncPanel
