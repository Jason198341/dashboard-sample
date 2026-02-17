import { TrendingUp, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function StatCard({ icon: Icon, label, value, change, positive, suffix = '' }: {
  icon: LucideIcon; label: string; value: string; change: string; positive: boolean; suffix?: string
}) {
  return (
    <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-[12px] bg-primary-dim flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
        <span className={`text-sm font-medium flex items-center gap-1 ${positive ? 'text-success' : 'text-danger'}`}>
          {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </span>
      </div>
      <div>
        <p className="text-text-muted text-sm">{label}</p>
        <p className="text-2xl font-bold tracking-tight mt-1">{value}{suffix}</p>
      </div>
    </div>
  )
}
