import type { CoType, SubPart } from '@/types'
import { getMergedVehicles } from '@/lib/storage'

/* ═══════════════════════════════════════════════
   Part Traceability — Cross-vehicle C/O Analysis
   ═══════════════════════════════════════════════ */

/** A system-level C/O relationship (1 row in the main table) */
export interface SharedSystemRow {
  vehicleCode: string
  vehicleName: string
  system: string
  sourceVehicle: string
  coType: CoType
  totalParts: number
  coParts: number
  coCost: number
  newDevCost: number
  savings: number
  details?: SubPart[]
}

/** Summary per source (donor) vehicle */
export interface SourceSummary {
  code: string
  name: string
  adoptedByVehicles: number
  systemsShared: number
  partsShared: number
  totalSavings: number
}

/** Cross-vehicle view: same system across all vehicles */
export interface SystemCrossEntry {
  vehicleCode: string
  vehicleName: string
  vehicleType: '양산' | '개발'
  coType: CoType
  baseVehicle: string
  coRate: number
  coParts: number
  totalParts: number
  coCost: number
  newDevCost: number
  details?: SubPart[]
}

/** Build all shared system rows from vehicle data */
export function getSharedSystems(): SharedSystemRow[] {
  const vehicles = getMergedVehicles()
  const rows: SharedSystemRow[] = []

  for (const v of vehicles) {
    for (const part of v.parts) {
      if (part.baseVehicle === '-' || !part.baseVehicle) continue
      const savings = part.newDevCost - part.coCost
      rows.push({
        vehicleCode: v.code,
        vehicleName: v.name,
        system: part.system,
        sourceVehicle: part.baseVehicle,
        coType: part.coType,
        totalParts: part.subParts,
        coParts: part.coSubParts,
        coCost: part.coCost,
        newDevCost: part.newDevCost,
        savings: savings > 0 ? savings : 0,
        details: part.details,
      })
    }
  }

  return rows.sort((a, b) => b.savings - a.savings)
}

/** Summarize by source (donor) vehicle */
export function getSourceSummaries(rows: SharedSystemRow[]): SourceSummary[] {
  const vehicles = getMergedVehicles()
  const map = new Map<string, { adopters: Set<string>; systems: number; parts: number; savings: number }>()

  for (const r of rows) {
    if (!map.has(r.sourceVehicle)) {
      map.set(r.sourceVehicle, { adopters: new Set(), systems: 0, parts: 0, savings: 0 })
    }
    const entry = map.get(r.sourceVehicle)!
    entry.adopters.add(r.vehicleCode)
    entry.systems++
    entry.parts += r.coParts
    entry.savings += r.savings
  }

  return [...map.entries()].map(([code, e]) => {
    const v = vehicles.find(v => v.code === code)
    return {
      code,
      name: v?.name ?? code,
      adoptedByVehicles: e.adopters.size,
      systemsShared: e.systems,
      partsShared: e.parts,
      totalSavings: e.savings,
    }
  }).sort((a, b) => b.totalSavings - a.totalSavings)
}

/** Cross-vehicle view for a specific system */
export function getSystemCrossView(systemName: string): SystemCrossEntry[] {
  const vehicles = getMergedVehicles()
  const entries: SystemCrossEntry[] = []

  for (const v of vehicles) {
    const part = v.parts.find(p => p.system === systemName)
    if (!part) continue
    entries.push({
      vehicleCode: v.code,
      vehicleName: v.name,
      vehicleType: v.type,
      coType: part.coType,
      baseVehicle: part.baseVehicle,
      coRate: part.subParts > 0 ? Math.round((part.coSubParts / part.subParts) * 100) : 0,
      coParts: part.coSubParts,
      totalParts: part.subParts,
      coCost: part.coCost,
      newDevCost: part.newDevCost,
      details: part.details,
    })
  }

  return entries
}
