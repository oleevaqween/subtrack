import { Sun, Moon } from 'lucide-react'

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'

  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative w-14 h-14 rounded-2xl bg-surface-card border border-border-default shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center overflow-hidden">
        {/* Animated background glow */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          isDark
            ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20 opacity-100'
            : 'bg-gradient-to-br from-amber-400/20 to-orange-400/20 opacity-100'
        }`} />

        {/* Sun icon */}
        <Sun
          size={22}
          className={`absolute transition-all duration-500 ${
            isDark
              ? 'rotate-90 scale-0 opacity-0 text-amber-400'
              : 'rotate-0 scale-100 opacity-100 text-amber-500'
          }`}
        />

        {/* Moon icon */}
        <Moon
          size={20}
          className={`absolute transition-all duration-500 ${
            isDark
              ? 'rotate-0 scale-100 opacity-100 text-indigo-300'
              : '-rotate-90 scale-0 opacity-0 text-indigo-500'
          }`}
        />

        {/* Orbiting dot decoration */}
        <div className={`absolute w-1.5 h-1.5 rounded-full transition-all duration-700 ${
          isDark
            ? 'bg-indigo-400 top-2 right-2.5 opacity-80'
            : 'bg-amber-400 top-2.5 right-2 opacity-80'
        }`} />
        <div className={`absolute w-1 h-1 rounded-full transition-all duration-700 ${
          isDark
            ? 'bg-purple-400 bottom-3 left-2.5 opacity-60'
            : 'bg-orange-300 bottom-2.5 left-3 opacity-60'
        }`} />
      </div>

      {/* Tooltip */}
      <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 text-xs font-medium bg-surface-card border border-border-default text-text-primary rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
        {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
      </span>
    </button>
  )
}

export default ThemeToggle
