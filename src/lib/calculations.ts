import type { VehicleInfo, MasterPart, VehicleTotals } from '@/types'

/* ─── Cross-vehicle C/O matrix ─── */

export function getAllCodes(vehicles: VehicleInfo[]): string[] {
  return vehicles.map(v => v.code)
}

export function getMatrixData(vehicles: VehicleInfo[]): Record<string, Record<string, number>> {
  const codes = getAllCodes(vehicles)
  const matrix: Record<string, Record<string, number>> = {}
  for (const v of vehicles) {
    matrix[v.code] = {}
    const totalSub = v.parts.reduce((s, p) => s + p.subParts, 0)
    for (const base of codes) {
      const coSub = v.parts.filter(p => p.baseVehicle === base).reduce((s, p) => s + p.coSubParts, 0)
      matrix[v.code][base] = totalSub > 0 ? Math.round((coSub / totalSub) * 100) : 0
    }
  }
  return matrix
}

/* ─── Vehicle totals utility ─── */

export function getVehicleTotals(parts: MasterPart[]): VehicleTotals {
  const totalSystems = parts.length
  let totalSubParts = 0, totalCoSubParts = 0, totalCoCost = 0, totalNewDevCost = 0
  for (const p of parts) {
    totalSubParts += p.subParts
    totalCoSubParts += p.coSubParts
    totalCoCost += p.coCost
    totalNewDevCost += p.newDevCost
  }
  const totalEffect = totalNewDevCost - totalCoCost
  const coRate = totalSubParts > 0 ? Math.round((totalCoSubParts / totalSubParts) * 100) : 0
  return { totalSystems, totalSubParts, totalCoSubParts, totalCoCost, totalNewDevCost, totalEffect, coRate }
}
