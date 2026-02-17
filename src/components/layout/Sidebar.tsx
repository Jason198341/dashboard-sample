import { Car } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PageId, NavItem } from '@/types'

function SidebarItem({ icon: Icon, label, active = false, onClick }: {
  icon: LucideIcon; label: string; active?: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-button)] text-sm font-medium transition-colors cursor-pointer
        ${active
          ? 'bg-primary text-white'
          : 'text-text-muted hover:bg-secondary hover:text-text'
        }`}
    >
      <Icon size={18} />
      {label}
    </button>
  )
}

export function Sidebar({ navItems, activeNav, onNavigate }: {
  navItems: NavItem[]
  activeNav: PageId
  onNavigate: (id: PageId) => void
}) {
  return (
    <aside className="w-[240px] bg-surface border-r border-border flex flex-col p-4 shrink-0">
      <div className="flex items-center gap-2.5 px-3 py-2 mb-6">
        <div className="w-8 h-8 bg-primary rounded-[10px] flex items-center justify-center">
          <Car size={16} className="text-white" />
        </div>
        <span className="text-base font-bold tracking-tight">AutoDev R&D</span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(item => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeNav === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-primary-dim rounded-full flex items-center justify-center text-sm font-bold text-primary">
            M
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">J. Park</p>
            <p className="text-xs text-text-subtle truncate">Interior Design</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
