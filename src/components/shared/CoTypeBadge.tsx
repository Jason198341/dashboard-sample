import { CheckCircle2, CircleDot, CirclePlus } from 'lucide-react'
import type { CoType } from '@/types'
import { useLang } from '@/lib/i18n'

export function CoTypeBadge({ type }: { type: CoType }) {
  const { t } = useLang()
  const config = {
    '1레벨 C/O': { icon: CheckCircle2, bg: 'bg-success-dim', text: 'text-success', label: t('cotype.full') },
    '2레벨 부분 C/O': { icon: CircleDot, bg: 'bg-[#DBEAFE]', text: 'text-primary', label: t('cotype.partial') },
    '신규개발': { icon: CirclePlus, bg: 'bg-secondary', text: 'text-text-muted', label: t('cotype.new') },
  }[type]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon size={12} />
      {config.label}
    </span>
  )
}
