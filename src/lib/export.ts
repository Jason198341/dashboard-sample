import type { VehicleInfo } from '@/types'

export function exportMasterListCsv(vehicle: VehicleInfo) {
  const BOM = '\uFEFF'
  const header = ['시스템', '기준차종', '시스템 P/No', 'C/O Type', '부품명', '부품번호', '기준 P/No', 'C/O 여부', '비C/O사유', '사유카테고리', '공급업체', '지역', '소재비($)'].join(',')

  const rows: string[] = []
  for (const part of vehicle.parts) {
    if (part.details) {
      for (const sub of part.details) {
        rows.push([
          part.system,
          part.baseVehicle,
          part.systemPartNo ?? '',
          part.coType,
          sub.partName,
          sub.partNo,
          sub.coPartNo ?? '',
          sub.isCo ? 'Y' : 'N',
          sub.nonCoReason ?? '',
          sub.reasonDetail?.category ?? '',
          sub.supplier,
          sub.supplierRegion,
          sub.materialCost,
        ].join(','))
      }
    } else {
      rows.push([
        part.system,
        part.baseVehicle,
        part.systemPartNo ?? '',
        part.coType,
        '-', '-', '', '-', '', '',
        '-', '-', '-',
      ].join(','))
    }
  }

  const csv = BOM + header + '\n' + rows.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `${vehicle.code}_masterlist_${date}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
