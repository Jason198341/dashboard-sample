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

  // 1. User-added vehicles
  const addedVehicles = load<VehicleInfo & { createdAt?: string }>(STORAGE.vehicles)
  for (const av of addedVehicles) {
    if (merged.find(v => v.code === av.code)) continue
    merged.push({
      code: av.code, name: av.name,
      stage: av.stage ?? 'Pre-SOP', date: av.date ?? '',
      half: av.half ?? 'H2', type: av.type ?? '개발',
      parts: [],
    })
  }

  // 2. User-added parts → push into matching vehicle
  const addedParts = load<{ vehicleCode: string; part: MasterPart }>(STORAGE.parts)
  for (const ap of addedParts) {
    const vehicle = merged.find(v => v.code === ap.vehicleCode)
    if (vehicle) vehicle.parts.push(ap.part)
  }

  // 3. User-added reasons → attach to matching sub-part
  const addedReasons = load<{ vehicleCode: string; system: string; partNo: string; reason: ReasonDetail }>(STORAGE.reasons)
  for (const ar of addedReasons) {
    const vehicle = merged.find(v => v.code === ar.vehicleCode)
    if (!vehicle) continue
    const part = vehicle.parts.find(p => p.system === ar.system)
    if (!part?.details) continue
    const sub = part.details.find(s => s.partNo === ar.partNo)
    if (sub) sub.reasonDetail = ar.reason
  }

  return merged
}
