import type { LucideIcon } from 'lucide-react'

/* ─── Core domain types ─── */

export type CoType = '1레벨 C/O' | '2레벨 부분 C/O' | '신규개발'

export type ReasonCategory = '디자인' | '사양변경' | '법규' | '신규사양' | '형상차이' | '성능'

export type CoPossibility = 'high' | 'medium' | 'low' | 'none'

export interface ReasonDetail {
  category: ReasonCategory
  baseSpec: string
  newSpec: string
  diffDescription: string
  designIntent: string
  impactArea: string
  coPossibility: CoPossibility
  coCondition?: string
  additionalCost: number
}

export interface SubPart {
  partName: string
  partNo: string
  isCo: boolean
  coSource?: string
  nonCoReason?: string
  reasonDetail?: ReasonDetail
  supplier: string
  supplierRegion: string
  materialCost: number
}

export interface MasterPart {
  system: string
  baseVehicle: string
  coType: CoType
  subParts: number
  coSubParts: number
  coCost: number
  newDevCost: number
  details?: SubPart[]
}

export interface VehicleInfo {
  code: string
  name: string
  stage: string
  date: string
  half: 'H1' | 'H2'
  type: '양산' | '개발'
  parts: MasterPart[]
}

/* ─── UI types ─── */

export type PageId = 'dashboard' | 'projects' | 'opportunity' | 'analytics' | 'data-entry' | 'settings'

export interface NavItem {
  id: PageId
  icon: LucideIcon
  label: string
}

export interface VehicleTotals {
  totalSystems: number
  totalSubParts: number
  totalCoSubParts: number
  totalCoCost: number
  totalNewDevCost: number
  totalEffect: number
  coRate: number
}

/* ─── Search types ─── */

export interface SearchResult {
  vehicleCode: string
  vehicleName: string
  system: string
  partName: string
  partNo: string
  supplier: string
  isCo: boolean
  materialCost: number
}

/* ─── Opportunity types ─── */

export interface OpportunityItem {
  vehicleCode: string
  vehicleName: string
  system: string
  partName: string
  partNo: string
  coPossibility: CoPossibility
  coCondition: string
  additionalCost: number
  category: ReasonCategory
  supplier: string
}
