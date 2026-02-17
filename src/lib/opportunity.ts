import type { OpportunityItem, CoPossibility } from '@/types'
import { getMergedVehicles } from '@/lib/storage'

export function getOpportunities(): OpportunityItem[] {
  const items: OpportunityItem[] = []

  for (const v of getMergedVehicles()) {
    for (const part of v.parts) {
      if (!part.details) continue
      for (const sub of part.details) {
        if (!sub.reasonDetail) continue
        const p = sub.reasonDetail.coPossibility
        if (p === 'high' || p === 'medium') {
          items.push({
            vehicleCode: v.code,
            vehicleName: v.name,
            system: part.system,
            partName: sub.partName,
            partNo: sub.partNo,
            coPossibility: p,
            coCondition: sub.reasonDetail.coCondition ?? '-',
            additionalCost: sub.reasonDetail.additionalCost,
            category: sub.reasonDetail.category,
            supplier: sub.supplier,
          })
        }
      }
    }
  }
  return items
}

export function getOpportunitySummary(items: OpportunityItem[]) {
  const high = items.filter(i => i.coPossibility === 'high')
  const medium = items.filter(i => i.coPossibility === 'medium')
  const totalSavings = items.reduce((s, i) => s + i.additionalCost, 0)

  const bySystem = new Map<string, number>()
  for (const item of items) {
    bySystem.set(item.system, (bySystem.get(item.system) ?? 0) + item.additionalCost)
  }
  const systemChart = [...bySystem.entries()]
    .map(([system, savings]) => ({ system, savings }))
    .sort((a, b) => b.savings - a.savings)

  return { total: items.length, highCount: high.length, mediumCount: medium.length, totalSavings, systemChart }
}

export function filterOpportunities(items: OpportunityItem[], filter: CoPossibility | 'all') {
  if (filter === 'all') return items
  return items.filter(i => i.coPossibility === filter)
}
