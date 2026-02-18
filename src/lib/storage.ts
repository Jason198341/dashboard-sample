import type { VehicleInfo, MasterPart, ReasonDetail } from '@/types'
import { vehicles as staticVehicles } from '@/data/vehicles'

const STORAGE = {
  vehicles: 'ds_added_vehicles',
  parts: 'ds_added_parts',
  reasons: 'ds_added_reasons',
}

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') }
  catch { return [] }
}

/** Merge static seed data + localStorage entries → unified VehicleInfo[] */
export function getMergedVehicles(): VehicleInfo[] {
  const merged = structuredClone(staticVehicles)

  // Build lookup map for O(1) vehicle access
  const vehicleMap = new Map(merged.map(v => [v.code, v]))

  // 1. User-added vehicles
  const addedVehicles = load<VehicleInfo & { createdAt?: string }>(STORAGE.vehicles)
  for (const av of addedVehicles) {
    if (vehicleMap.has(av.code)) continue
    const newV: VehicleInfo = {
      code: av.code, name: av.name,
      stage: av.stage ?? 'Pre-SOP', date: av.date ?? '',
      half: av.half ?? 'H2', type: av.type ?? '개발',
      salesVolume: av.salesVolume ?? 10000,
      parts: [],
    }
    merged.push(newV)
    vehicleMap.set(av.code, newV)
  }

  // 2. User-added parts → push into matching vehicle
  const addedParts = load<{ vehicleCode: string; part: MasterPart }>(STORAGE.parts)
  for (const ap of addedParts) {
    const vehicle = vehicleMap.get(ap.vehicleCode)
    if (vehicle) vehicle.parts.push(ap.part)
  }

  // 3. User-added reasons → attach to matching sub-part
  const addedReasons = load<{ vehicleCode: string; system: string; partNo: string; reason: ReasonDetail }>(STORAGE.reasons)
  for (const ar of addedReasons) {
    const vehicle = vehicleMap.get(ar.vehicleCode)
    if (!vehicle) continue
    const part = vehicle.parts.find(p => p.system === ar.system)
    if (!part?.details) continue
    const sub = part.details.find(s => s.partNo === ar.partNo)
    if (sub) sub.reasonDetail = ar.reason
  }

  return merged
}
