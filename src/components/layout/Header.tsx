import { Search, Bell } from 'lucide-react'

export function Header({ title, subtitle, onSearchClick }: {
  title: string
  subtitle: string
  onSearchClick: () => void
}) {
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 shrink-0">
      <div>
        <h1 className="text-lg font-bold tracking-tight">{title}</h1>
        <p className="text-xs text-text-subtle">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onSearchClick}
          className="h-9 w-56 pl-3 pr-4 rounded-[var(--radius-button)] bg-secondary text-sm text-text-subtle flex items-center gap-2 hover:bg-secondary-hover transition-colors cursor-pointer"
        >
          <Search size={16} />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="text-[10px] bg-white border border-border px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </button>
        <button className="relative w-9 h-9 rounded-[var(--radius-button)] bg-secondary flex items-center justify-center hover:bg-secondary-hover transition-colors">
          <Bell size={16} className="text-text-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
      </div>
    </header>
  )
}
