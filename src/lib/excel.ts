import * as XLSX from 'xlsx'
import type { VehicleInfo, MasterPart, SubPart, CoType, ReasonCategory, CoPossibility, ReasonDetail } from '@/types'

/* ═══════════════════════════════════════════════
   Template Download
   ═══════════════════════════════════════════════ */

const VEHICLE_HEADERS = ['차종코드*', '차종명*', '단계', '일정(SOP)', '반기(H1/H2)', '구분(양산/개발)']
const VEHICLE_EXAMPLE = ['MY9', 'MY9 Compact SUV', 'Pre-SOP', '27.03', 'H2', '개발']

// Sheet 2: 1레벨 시스템 (1행 = 1시스템)
const SYSTEM_HEADERS = ['차종코드*', '시스템명*', '기준차종*', '시스템 P/No', 'C/O Type*']
const SYSTEM_EXAMPLES = [
  ['NX8', '도어 트림', 'VN3', 'VN-DT-MOD', '2레벨 부분 C/O'],
  ['NX8', 'Seat (Fr)', 'CT5i', 'CT-SF-MOD', '1레벨 C/O'],
  ['NX8', 'Sunroof (PGS)', '', '', '신규개발'],
]

// Sheet 3: 2레벨 부품 (차종코드+시스템명으로 1레벨에 연결)
const SUBPART_HEADERS = [
  '차종코드*', '시스템명*',
  '부품명*', '부품번호*', 'C/O여부(Y/N)*', 'C/O출처', 'C/O P/No', '비C/O사유',
  '사유카테고리(디자인/사양변경/법규/신규사양/형상차이/성능)',
  '공급업체*', '지역', '소재비($)*',
]
const SUBPART_EXAMPLES = [
  ['NX8', '도어 트림', 'Door Trim Upper', '87610-NX001', 'Y', 'VN3', '87610-VN001', '', '', 'Motherson', '인도', '12.5'],
  ['NX8', '도어 트림', 'Door Map Pocket', '87640-NX002', 'N', '', '', '형상 차이', '형상차이', 'Hyundai Mobis', '한국', '3.2'],
]

const REASON_HEADERS = [
  '차종코드*', '시스템명*', '부품번호*',
  '사유카테고리*', '기준사양*', '변경사양*', '차이설명',
  '설계의도', '영향영역', 'C/O가능성(high/medium/low/none)', 'C/O조건', '추가비용($)',
]
const REASON_EXAMPLE = [
  'NX8', '도어 트림', '87640-NX002',
  '형상차이', 'VN3: 세단형 도어 포켓', 'NX8: SUV 대형 포켓 (음료 2개)', '용량 200% 증가로 금형 신규',
  'SUV 사용 패턴 반영', '금형, 조립 라인', 'medium', '포켓 규격 통일시 전환 가능', '1.8',
]

export function downloadTemplate() {
  const wb = XLSX.utils.book_new()

  // Sheet 1: 차종
  const wsVehicle = XLSX.utils.aoa_to_sheet([VEHICLE_HEADERS, VEHICLE_EXAMPLE])
  wsVehicle['!cols'] = VEHICLE_HEADERS.map(() => ({ wch: 18 }))
  XLSX.utils.book_append_sheet(wb, wsVehicle, '차종')

  // Sheet 2: 1레벨 시스템
  const wsSystem = XLSX.utils.aoa_to_sheet([SYSTEM_HEADERS, ...SYSTEM_EXAMPLES])
  wsSystem['!cols'] = SYSTEM_HEADERS.map(() => ({ wch: 20 }))
  XLSX.utils.book_append_sheet(wb, wsSystem, '1레벨시스템')

  // Sheet 3: 2레벨 부품
  const wsSubPart = XLSX.utils.aoa_to_sheet([SUBPART_HEADERS, ...SUBPART_EXAMPLES])
  wsSubPart['!cols'] = SUBPART_HEADERS.map((_, i) => ({ wch: i === 2 || i === 3 ? 22 : 16 }))
  XLSX.utils.book_append_sheet(wb, wsSubPart, '2레벨부품')

  // Sheet 4: 비C/O 사유
  const wsReason = XLSX.utils.aoa_to_sheet([REASON_HEADERS, REASON_EXAMPLE])
  wsReason['!cols'] = REASON_HEADERS.map((_, i) => ({ wch: i >= 4 && i <= 8 ? 28 : 18 }))
  XLSX.utils.book_append_sheet(wb, wsReason, '비CO사유')

  XLSX.writeFile(wb, 'CO_등록양식_template.xlsx')
}

/* ═══════════════════════════════════════════════
   Parse Uploaded Excel
   ═══════════════════════════════════════════════ */

export interface ParsedExcel {
  vehicles: VehicleInfo[]
  parts: { vehicleCode: string; part: MasterPart }[]
  reasons: { vehicleCode: string; system: string; partNo: string; reason: ReasonDetail }[]
  errors: string[]
  summary: { vehicleCount: number; partCount: number; subPartCount: number; reasonCount: number }
}

function str(val: unknown): string {
  if (val == null) return ''
  return String(val).trim()
}

function num(val: unknown): number {
  const n = parseFloat(String(val))
  return isNaN(n) ? 0 : n
}

export function parseExcelFile(file: File): Promise<ParsedExcel> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer)
      const wb = XLSX.read(data, { type: 'array' })
      const errors: string[] = []

      // Parse vehicles
      const vehicles = parseVehicleSheet(wb, errors)

      // Parse 1레벨 systems + 2레벨 sub-parts → grouped MasterParts
      const parts = parseSystemAndSubParts(wb, errors)

      // Parse reasons
      const reasons = parseReasonSheet(wb, errors)

      const subPartCount = parts.reduce((s, p) => s + (p.part.details?.length ?? 0), 0)

      resolve({
        vehicles, parts, reasons, errors,
        summary: {
          vehicleCount: vehicles.length,
          partCount: parts.length,
          subPartCount,
          reasonCount: reasons.length,
        },
      })
    }
    reader.readAsArrayBuffer(file)
  })
}

function parseVehicleSheet(wb: XLSX.WorkBook, errors: string[]): VehicleInfo[] {
  const ws = wb.Sheets['차종']
  if (!ws) return []
  const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }).slice(1) // skip header
  const vehicles: VehicleInfo[] = []

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    if (!r || r.length === 0 || !str(r[0])) continue
    const code = str(r[0])
    const name = str(r[1])
    if (!code || !name) {
      errors.push(`[차종] ${i + 2}행: 코드 또는 차종명 누락`)
      continue
    }
    const half = str(r[4])
    const type = str(r[5])
    vehicles.push({
      code, name,
      stage: str(r[2]) || 'Pre-SOP',
      date: str(r[3]) || '',
      half: (half === 'H1' ? 'H1' : 'H2'),
      type: (type === '양산' ? '양산' : '개발'),
      salesVolume: 10000,
      parts: [],
    })
  }
  return vehicles
}

function parseSystemAndSubParts(wb: XLSX.WorkBook, errors: string[]): { vehicleCode: string; part: MasterPart }[] {
  // --- Step 1: Parse 1레벨시스템 sheet (also fallback to legacy '부품' sheet) ---
  const wsSystem = wb.Sheets['1레벨시스템']
  const wsLegacy = wb.Sheets['부품']

  const groups = new Map<string, { vehicleCode: string; system: string; baseVehicle: string; systemPartNo?: string; coType: CoType; subs: SubPart[] }>()

  if (wsSystem) {
    // New 4-sheet format
    const sysRows = XLSX.utils.sheet_to_json<string[]>(wsSystem, { header: 1 }).slice(1)
    for (let i = 0; i < sysRows.length; i++) {
      const r = sysRows[i]
      if (!r || r.length === 0 || !str(r[0])) continue
      const vehicleCode = str(r[0])
      const system = str(r[1])
      if (!vehicleCode || !system) {
        errors.push(`[1레벨시스템] ${i + 2}행: 차종코드 또는 시스템명 누락`)
        continue
      }
      const systemPartNo = str(r[3]) || undefined
      const coTypeStr = str(r[4])
      const coType: CoType = coTypeStr === '1레벨 C/O' ? '1레벨 C/O'
        : coTypeStr === '신규개발' ? '신규개발'
        : '2레벨 부분 C/O'

      const key = `${vehicleCode}::${system}`
      groups.set(key, { vehicleCode, system, baseVehicle: str(r[2]), systemPartNo, coType, subs: [] })
    }

    // Parse 2레벨부품 sheet
    const wsSubPart = wb.Sheets['2레벨부품']
    if (wsSubPart) {
      const subRows = XLSX.utils.sheet_to_json<string[]>(wsSubPart, { header: 1 }).slice(1)
      for (let i = 0; i < subRows.length; i++) {
        const r = subRows[i]
        if (!r || r.length === 0 || !str(r[0])) continue
        const vehicleCode = str(r[0])
        const system = str(r[1])
        const key = `${vehicleCode}::${system}`
        const group = groups.get(key)
        if (!group) {
          errors.push(`[2레벨부품] ${i + 2}행: 1레벨시스템 시트에 "${system}" 미등록 (차종: ${vehicleCode})`)
          continue
        }
        const partName = str(r[2])
        const partNo = str(r[3])
        if (!partName || !partNo) {
          errors.push(`[2레벨부품] ${i + 2}행: 부품명 또는 부품번호 누락`)
          continue
        }
        const isCo = str(r[4]).toUpperCase() === 'Y'
        const coPartNo = isCo ? (str(r[6]) || undefined) : undefined
        const nonCoReason = isCo ? undefined : (str(r[7]) || '미입력')
        const catStr = str(r[8]) as ReasonCategory
        const validCats: ReasonCategory[] = ['디자인', '사양변경', '법규', '신규사양', '형상차이', '성능']
        group.subs.push({
          partName, partNo, isCo,
          coSource: isCo ? (str(r[5]) || group.baseVehicle) : undefined,
          coPartNo,
          nonCoReason,
          reasonDetail: !isCo && validCats.includes(catStr) ? {
            category: catStr,
            baseSpec: '-', newSpec: '-',
            diffDescription: nonCoReason || '-',
            designIntent: '-', impactArea: '-',
            coPossibility: 'medium' as CoPossibility,
            additionalCost: 0,
          } : undefined,
          supplier: str(r[9]) || '-',
          supplierRegion: str(r[10]) || '-',
          materialCost: num(r[11]),
        })
      }
    }
  } else if (wsLegacy) {
    // Legacy 3-sheet format (backward compatible)
    const rows = XLSX.utils.sheet_to_json<string[]>(wsLegacy, { header: 1 }).slice(1)
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]
      if (!r || r.length === 0 || !str(r[0])) continue
      const vehicleCode = str(r[0])
      const system = str(r[1])
      if (!vehicleCode || !system) {
        errors.push(`[부품] ${i + 2}행: 차종코드 또는 시스템명 누락`)
        continue
      }
      const coTypeStr = str(r[3])
      const coType: CoType = coTypeStr === '1레벨 C/O' ? '1레벨 C/O'
        : coTypeStr === '신규개발' ? '신규개발'
        : '2레벨 부분 C/O'
      const key = `${vehicleCode}::${system}`
      if (!groups.has(key)) {
        groups.set(key, { vehicleCode, system, baseVehicle: str(r[2]), coType, subs: [] })
      }
      const group = groups.get(key)!
      const partName = str(r[4])
      const partNo = str(r[5])
      if (!partName || !partNo) {
        errors.push(`[부품] ${i + 2}행: 부품명 또는 부품번호 누락`)
        continue
      }
      const isCo = str(r[6]).toUpperCase() === 'Y'
      group.subs.push({
        partName, partNo, isCo,
        coSource: isCo ? (str(r[7]) || group.baseVehicle) : undefined,
        nonCoReason: isCo ? undefined : (str(r[8]) || '미입력'),
        supplier: str(r[9]) || '-',
        supplierRegion: str(r[10]) || '-',
        materialCost: num(r[11]),
      })
    }
  }

  return [...groups.values()].map(g => ({
    vehicleCode: g.vehicleCode,
    part: {
      system: g.system,
      baseVehicle: g.baseVehicle,
      systemPartNo: g.systemPartNo,
      coType: g.coType,
      subParts: g.subs.length,
      coSubParts: g.subs.filter(s => s.isCo).length,
      coCost: g.subs.filter(s => s.isCo).reduce((s, p) => s + p.materialCost, 0),
      newDevCost: g.subs.filter(s => !s.isCo).reduce((s, p) => s + p.materialCost, 0),
      details: g.subs,
    },
  }))
}

function parseReasonSheet(wb: XLSX.WorkBook, errors: string[]): ParsedExcel['reasons'] {
  const ws = wb.Sheets['비CO사유']
  if (!ws) return []
  const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }).slice(1)
  const results: ParsedExcel['reasons'] = []

  const validCategories: ReasonCategory[] = ['디자인', '사양변경', '법규', '신규사양', '형상차이', '성능']
  const validPossibilities: CoPossibility[] = ['high', 'medium', 'low', 'none']

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    if (!r || r.length === 0 || !str(r[0])) continue

    const vehicleCode = str(r[0])
    const system = str(r[1])
    const partNo = str(r[2])
    if (!vehicleCode || !partNo) {
      errors.push(`[사유] ${i + 2}행: 차종코드 또는 부품번호 누락`)
      continue
    }

    const catStr = str(r[3]) as ReasonCategory
    const category = validCategories.includes(catStr) ? catStr : '디자인'
    const possStr = str(r[9]).toLowerCase() as CoPossibility
    const coPossibility = validPossibilities.includes(possStr) ? possStr : 'medium'

    results.push({
      vehicleCode, system, partNo,
      reason: {
        category,
        baseSpec: str(r[4]) || '-',
        newSpec: str(r[5]) || '-',
        diffDescription: str(r[6]) || '-',
        designIntent: str(r[7]) || '-',
        impactArea: str(r[8]) || '-',
        coPossibility,
        coCondition: str(r[10]) || '',
        additionalCost: num(r[11]),
      },
    })
  }
  return results
}
