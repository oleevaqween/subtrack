import { Plus, Search, Sparkles } from 'lucide-react'

function Header({ onAddClick, searchQuery, onSearchChange }) {
  return (
    <header className="sticky top-0 z-40 bg-surface-secondary/70 backdrop-blur-2xl border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <Sparkles size={22} />
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 animate-ping opacity-20" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-text-primary tracking-tight">
              SubTrack
            </h1>
            <span className="text-[10px] font-medium text-text-muted -mt-0.5">Subscription Manager</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search subscriptions"
              className="w-48 lg:w-56 pl-10 pr-4 py-2.5 text-sm bg-surface-input border border-border-default rounded-2xl text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus focus:ring-3 focus:ring-accent-light transition-all duration-200"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={onAddClick}
            aria-label="Add subscription"
            className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Add New</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
