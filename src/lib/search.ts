import type { SearchResult } from '@/types'
import { getMergedVehicles } from '@/lib/storage'

export function searchParts(query: string): SearchResult[] {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  const results: SearchResult[] = []

  for (const v of getMergedVehicles()) {
    const vehicleMatch = v.code.toLowerCase().includes(q) || v.name.toLowerCase().includes(q)

    for (const part of v.parts) {
      if (!part.details) {
        // System-level match (no sub-parts): create a summary result
        if (vehicleMatch || part.system.toLowerCase().includes(q) || part.baseVehicle.toLowerCase().includes(q)) {
          results.push({
            vehicleCode: v.code,
            vehicleName: v.name,
            system: part.system,
            partName: `${part.system} (${part.coType})`,
            partNo: '-',
            supplier: part.baseVehicle === '-' ? '신규' : `C/O from ${part.baseVehicle}`,
            isCo: part.coType !== '신규개발',
            materialCost: part.coCost + part.newDevCost,
          })
        }
        continue
      }
      for (const sub of part.details) {
        if (
          vehicleMatch ||
          sub.partName.toLowerCase().includes(q) ||
          sub.partNo.toLowerCase().includes(q) ||
          (sub.coPartNo && sub.coPartNo.toLowerCase().includes(q)) ||
          sub.supplier.toLowerCase().includes(q) ||
          part.system.toLowerCase().includes(q) ||
          part.baseVehicle.toLowerCase().includes(q) ||
          (sub.nonCoReason && sub.nonCoReason.toLowerCase().includes(q))
        ) {
          results.push({
            vehicleCode: v.code,
            vehicleName: v.name,
            system: part.system,
            partName: sub.partName,
            partNo: sub.partNo,
            supplier: sub.supplier,
            isCo: sub.isCo,
            materialCost: sub.materialCost,
          })
        }
      }
    }
  }
  return results.slice(0, 50)
}
