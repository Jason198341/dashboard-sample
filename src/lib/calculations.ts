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

/* ─── Narrative metrics for a single vehicle ─── */

export interface NarrativeMetrics {
  totalCost: number
  totalParts: number
  coParts: number
  coRateByCount: number
  coRateByAmount: number
  coCost: number
  counterfactualCost: number
  savings: number
  savingsRate: number
}

export function calcNarrativeMetrics(parts: MasterPart[], multiplier: number): NarrativeMetrics {
  let totalCost = 0, coCost = 0, totalParts = 0, coParts = 0
  for (const p of parts) {
    totalCost += p.coCost + p.newDevCost
    coCost += p.coCost
    totalParts += p.subParts
    coParts += p.coSubParts
  }
  const coRateByCount = totalParts > 0 ? Math.round((coParts / totalParts) * 100) : 0
  const coRateByAmount = totalCost > 0 ? Math.round((coCost / totalCost) * 100) : 0
  // Counterfactual: C/O parts cost × multiplier + non-C/O parts cost as-is
  const counterfactualCost = coCost * multiplier + (totalCost - coCost)
  const savings = counterfactualCost - totalCost
  const savingsRate = counterfactualCost > 0 ? Math.round((savings / counterfactualCost) * 100) : 0
  return { totalCost, totalParts, coParts, coRateByCount, coRateByAmount, coCost, counterfactualCost, savings, savingsRate }
}

/* ─── Cross-vehicle system ranking (C/O effect) ─── */

export interface RankedSystem {
  rank: number
  vehicleCode: string
  vehicleName: string
  system: string
  savingsPerUnit: number
  salesVolume: number
  totalSavings: number
  investmentSaved: number
  combinedScore: number
  coType: string
}

export function calcCrossVehicleRanking(vehicles: VehicleInfo[], multiplier: number): RankedSystem[] {
  const items: Omit<RankedSystem, 'rank'>[] = []
  for (const v of vehicles) {
    if (v.half !== 'H2') continue // only development vehicles
    for (const p of v.parts) {
      if (p.coType === '신규개발') continue // no savings on pure new dev
      const savingsPerUnit = p.newDevCost - p.coCost
      const investmentSaved = p.coCost * (multiplier - 1) // money we didn't spend on new dev
      const totalSavings = savingsPerUnit * v.salesVolume
      const totalInvestment = investmentSaved * v.salesVolume
      // Combined score: 60% material savings × volume + 40% investment saved × volume
      const combinedScore = totalSavings * 0.6 + totalInvestment * 0.4
      items.push({
        vehicleCode: v.code, vehicleName: v.name, system: p.system,
        savingsPerUnit, salesVolume: v.salesVolume,
        totalSavings, investmentSaved: totalInvestment,
        combinedScore, coType: p.coType,
      })
    }
  }
  items.sort((a, b) => b.combinedScore - a.combinedScore)
  return items.map((item, i) => ({ ...item, rank: i + 1 }))
}
