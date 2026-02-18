import { useState, useMemo, Fragment } from 'react'
import {
  ChevronRight, Filter, Download, CheckCircle2, X,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

import type { CoType, ReasonCategory } from '@/types'
import { getMergedVehicles } from '@/lib/storage'
import { getAllCodes, getMatrixData, getVehicleTotals } from '@/lib/calculations'
import { CoTypeBadge } from '@/components/shared/CoTypeBadge'
import { exportMasterListCsv } from '@/lib/export'
import { useLang } from '@/lib/i18n'

const REASON_KEYS: Record<ReasonCategory, string> = {
  '디자인': 'reason.design',
  '사양변경': 'reason.spec-change',
  '법규': 'reason.regulation',
  '신규사양': 'reason.new-spec',
  '형상차이': 'reason.shape-diff',
  '성능': 'reason.performance',
}

export function ProjectsView({ initialVehicle }: { initialVehicle?: string }) {
  const { t } = useLang()
  const [selectedVehicle, setSelectedVehicle] = useState(initialVehicle ?? 'NX8')
  const [filterType, setFilterType] = useState<CoType | 'all'>('all')
  const [filterReason, setFilterReason] = useState<ReasonCategory | 'all'>('all')
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [expandedDetail, setExpandedDetail] = useState<string | null>(null)

  const vehicles = useMemo(() => getMergedVehicles(), [])
  const allCodes = useMemo(() => getAllCodes(vehicles), [vehicles])
  const matrixData = useMemo(() => getMatrixData(vehicles), [vehicles])

  const vehicle = vehicles.find(v => v.code === selectedVehicle)!
  const totals = useMemo(() => getVehicleTotals(vehicle?.parts ?? []), [vehicle])

  const filtered = useMemo(() => {
    let result = vehicle?.parts ?? []
    if (filterType !== 'all') result = result.filter(p => p.coType === filterType)
    if (filterReason !== 'all') result = result.filter(p =>
      p.details?.some(sub => sub.reasonDetail?.category === filterReason)
    )
    return result
  }, [vehicle, filterType, filterReason])

  const { filteredCoCost, filteredNewCost, filteredEffect } = useMemo(() => {
    let coCost = 0, newCost = 0
    for (const p of filtered) { coCost += p.coCost; newCost += p.newDevCost }
    return { filteredCoCost: coCost, filteredNewCost: newCost, filteredEffect: newCost - coCost }
  }, [filtered])

  const h1 = vehicles.filter(v => v.half === 'H1')
  const h2 = vehicles.filter(v => v.half === 'H2')

  const chartData = vehicle.parts.map(p => ({
    name: p.system.length > 10 ? p.system.slice(0, 10) + '…' : p.system,
    fullName: p.system,
    coCost: p.coCost,
    newDevCost: p.newDevCost,
  }))

  const coTypePie = useMemo(() => {
    let fullCo = 0, partialCo = 0, newDev = 0
    for (const p of vehicle.parts) {
      if (p.coType === '1레벨 C/O') fullCo++
      else if (p.coType === '2레벨 부분 C/O') partialCo++
      else newDev++
    }
    return [
      { name: t('cotype.full'), value: fullCo, color: '#3182F6' },
      { name: t('cotype.partial'), value: partialCo, color: '#93C5FD' },
      { name: t('cotype.new'), value: newDev, color: '#E5E7EB' },
    ]
  }, [vehicle, t])

  const rl = (cat: string) => t(REASON_KEYS[cat as ReasonCategory] ?? cat)

  const coTypeLabel = (ct: CoType) => {
    const m: Record<CoType, string> = {
      '1레벨 C/O': t('cotype.1level'),
      '2레벨 부분 C/O': t('cotype.2level'),
      '신규개발': t('cotype.new'),
    }
    return m[ct]
  }

  return (
    <>
      {/* Vehicle Tabs */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 mb-6">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-text-subtle mb-2 font-medium">{t('proj.h1.label')}</p>
            <div className="flex gap-2">
              {h1.map(v => (
                <button
                  key={v.code}
                  onClick={() => { setSelectedVehicle(v.code); setFilterType('all'); setFilterReason('all'); setExpandedRow(null); setExpandedDetail(null) }}
                  className={`px-3 py-1.5 rounded-[var(--radius-button)] text-sm font-medium transition-colors cursor-pointer ${
                    selectedVehicle === v.code ? 'bg-primary text-white' : 'bg-secondary text-text-muted hover:bg-secondary-hover'
                  }`}
                >
                  {v.code}
                  <span className="text-xs opacity-70 ml-1">{v.stage}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div>
            <p className="text-xs text-text-subtle mb-2 font-medium">{t('proj.h2.label')}</p>
            <div className="flex gap-2">
              {h2.map(v => (
                <button
                  key={v.code}
                  onClick={() => { setSelectedVehicle(v.code); setFilterType('all'); setFilterReason('all'); setExpandedRow(null); setExpandedDetail(null) }}
                  className={`px-3 py-1.5 rounded-[var(--radius-button)] text-sm font-medium transition-colors cursor-pointer ${
                    selectedVehicle === v.code ? 'bg-primary text-white' : 'bg-secondary text-text-muted hover:bg-secondary-hover'
                  }`}
                >
                  {v.code}
                  <span className="text-xs opacity-70 ml-1">{v.date}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-text-muted text-sm">{t('proj.stat.systems')}</p>
          <p className="text-2xl font-bold mt-1">{totals.totalSystems}<span className="text-base font-normal text-text-muted ml-1">{t('common.unit')}</span></p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-text-muted text-sm">{t('proj.stat.coRate')}</p>
          <p className="text-2xl font-bold mt-1">{totals.coRate}<span className="text-base font-normal text-text-muted ml-1">%</span></p>
          <p className="text-xs text-text-subtle mt-1">{totals.totalCoSubParts} / {totals.totalSubParts} parts</p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-text-muted text-sm">{t('proj.stat.coCost')}</p>
          <p className="text-2xl font-bold mt-1">${totals.totalCoCost.toFixed(1)}</p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-text-muted text-sm">{t('proj.stat.effect')}</p>
          <p className="text-2xl font-bold text-success mt-1">${totals.totalEffect.toFixed(1)}</p>
          <p className="text-xs text-text-subtle mt-1">{t('proj.chart.newDev')} ${totals.totalNewDevCost.toFixed(1)} − C/O ${totals.totalCoCost.toFixed(1)}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">{vehicle.code} {t('proj.chart.compare')}</h3>
          <p className="text-sm text-text-muted mb-4">{t('proj.chart.compareSub')}</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barGap={2} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} angle={-25} textAnchor="end" height={48} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(value) => [`$${Number(value).toFixed(1)}`]}
              />
              <Bar dataKey="coCost" name={t('proj.chart.coWith')} fill="#3182F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="newDevCost" name={t('proj.chart.newDev')} fill="#E5E7EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">{t('proj.chart.coDist')}</h3>
          <p className="text-sm text-text-muted mb-4">{vehicle.code} {t('proj.chart.coDistSub')}</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={coTypePie} cx="50%" cy="50%" innerRadius={42} outerRadius={64} paddingAngle={4} dataKey="value">
                {coTypePie.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {coTypePie.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-text-muted">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}{t('common.unit')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-Vehicle Matrix */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 mb-8">
        <h3 className="text-base font-bold mb-1">{t('proj.matrix.title')}</h3>
        <p className="text-sm text-text-muted mb-4">{t('proj.matrix.sub')}</p>
        <div className="overflow-x-auto">
          <table className="text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-text-muted border-b border-border">{t('proj.matrix.label')}</th>
                {allCodes.map(code => (
                  <th key={code} className={`px-4 py-2 text-center text-xs font-semibold border-b border-border ${
                    code === selectedVehicle ? 'text-primary' : 'text-text-muted'
                  }`}>{code}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allCodes.map(row => (
                <tr key={row} className={row === selectedVehicle ? 'bg-primary-dim/30' : ''}>
                  <td className={`px-4 py-2.5 text-sm border-b border-border ${
                    row === selectedVehicle ? 'font-bold text-primary' : 'font-medium'
                  }`}>{row}</td>
                  {allCodes.map(col => {
                    const val = matrixData[row]?.[col] || 0
                    const isSelf = row === col
                    return (
                      <td key={col} className="px-4 py-2.5 text-center border-b border-border">
                        {isSelf ? (
                          <span className="text-text-subtle">—</span>
                        ) : val > 0 ? (
                          <span className={`inline-block min-w-[36px] px-2 py-0.5 rounded text-xs font-medium ${
                            val >= 30 ? 'bg-primary text-white' :
                            val >= 15 ? 'bg-primary-dim text-primary' :
                            val > 0 ? 'bg-secondary text-text-muted' : ''
                          }`}>{val}%</span>
                        ) : (
                          <span className="text-text-subtle text-xs">0</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-text-subtle">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary" /> 30%+</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary-dim" /> 15~29%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-secondary" /> 1~14%</span>
        </div>
      </div>

      {/* Master List Table */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold">{vehicle.code} {t('proj.table.title')}</h3>
              <p className="text-sm text-text-muted mt-0.5">{vehicle.name} ({vehicle.date}, {vehicle.stage}) | {t('proj.table.sub')}</p>
            </div>
            <button
              onClick={() => exportMasterListCsv(vehicle)}
              className="flex items-center gap-1.5 text-sm text-text-muted bg-secondary px-3 py-1.5 rounded-[var(--radius-button)] hover:bg-secondary-hover transition-colors cursor-pointer"
            >
              <Download size={14} /> Export
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-text-subtle shrink-0" />
              <span className="text-[10px] text-text-subtle font-medium w-10 shrink-0">{t('proj.filter.coType')}</span>
              {(['all', '1레벨 C/O', '2레벨 부분 C/O', '신규개발'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => { setFilterType(type); setExpandedRow(null); setExpandedDetail(null) }}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                    filterType === type ? 'bg-primary text-white' : 'bg-secondary text-text-muted hover:bg-secondary-hover'
                  }`}
                >{type === 'all' ? t('proj.filter.all') : coTypeLabel(type)}</button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-[14px] shrink-0" />
              <span className="text-[10px] text-text-subtle font-medium w-10 shrink-0">{t('proj.filter.reason')}</span>
              {(['all', '디자인', '법규', '사양변경', '성능', '신규사양', '형상차이'] as const).map(reason => (
                <button
                  key={reason}
                  onClick={() => { setFilterReason(reason); setExpandedRow(null); setExpandedDetail(null) }}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                    filterReason === reason
                      ? 'bg-[#EA580C] text-white'
                      : 'bg-secondary text-text-muted hover:bg-secondary-hover'
                  }`}
                >{reason === 'all' ? t('proj.filter.all') : rl(reason)}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#FAFBFC]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted">{t('proj.table.col.no')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">{t('proj.table.col.system')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">{t('proj.table.col.base')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">{t('proj.table.col.basePNo')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">{t('proj.table.col.coType')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">{t('proj.table.col.reason')}</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-text-muted">{t('proj.table.col.parts')}</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted">{t('proj.table.col.coCost')}</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted">{t('proj.table.col.newCost')}</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-text-muted">{t('proj.table.col.effect')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((part, i) => {
                const effect = part.newDevCost - part.coCost
                const hasDetails = part.details && part.details.length > 0
                const isExpanded = expandedRow === i
                return (
                  <Fragment key={i}>
                    <tr
                      onClick={() => { if (hasDetails) { setExpandedRow(isExpanded ? null : i); setExpandedDetail(null) } }}
                      className={`border-b border-border last:border-b-0 transition-colors ${
                        hasDetails ? 'cursor-pointer hover:bg-primary-dim/20' : 'hover:bg-[#FAFBFC]'
                      } ${isExpanded ? 'bg-primary-dim/30' : ''}`}
                    >
                      <td className="px-6 py-3 text-text-subtle">
                        <div className="flex items-center gap-1">
                          {hasDetails && (
                            <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                              <ChevronRight size={14} className="text-primary" />
                            </span>
                          )}
                          {i + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {part.system}
                        {hasDetails && (
                          <span className="ml-2 text-[10px] text-primary font-normal bg-primary-dim px-1.5 py-0.5 rounded">
                            {part.details!.length}{t('proj.table.detail')}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {part.baseVehicle === '-' ? (
                          <span className="text-text-subtle">—</span>
                        ) : (
                          <span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">{part.baseVehicle}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {part.systemPartNo ? (
                          <span className="font-mono text-xs text-text-muted">{part.systemPartNo}</span>
                        ) : (
                          <span className="text-text-subtle">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3"><CoTypeBadge type={part.coType} /></td>
                      <td className="px-4 py-3">
                        {(() => {
                          if (part.coType === '1레벨 C/O') return <span className="text-text-subtle">—</span>
                          const cats = [...new Set(
                            (part.details ?? [])
                              .filter(sub => !sub.isCo && sub.reasonDetail?.category)
                              .map(sub => sub.reasonDetail!.category)
                          )]
                          if (cats.length === 0) return <span className="text-text-subtle text-xs">—</span>
                          const catColors: Record<string, string> = {
                            '디자인': 'bg-purple-100 text-purple-700',
                            '사양변경': 'bg-amber-100 text-amber-700',
                            '법규': 'bg-blue-100 text-blue-700',
                            '신규사양': 'bg-emerald-100 text-emerald-700',
                            '형상차이': 'bg-rose-100 text-rose-700',
                            '성능': 'bg-orange-100 text-orange-700',
                          }
                          return (
                            <div className="flex flex-wrap gap-1">
                              {cats.map(c => (
                                <span key={c} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${catColors[c] ?? 'bg-secondary text-text-muted'}`}>
                                  {rl(c)}
                                </span>
                              ))}
                            </div>
                          )
                        })()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-medium">{part.coSubParts}</span>
                        <span className="text-text-subtle">/{part.subParts}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {part.coCost > 0 ? `$${part.coCost.toFixed(1)}` : <span className="text-text-subtle">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">${part.newDevCost.toFixed(1)}</td>
                      <td className="px-6 py-3 text-right font-mono font-medium text-success">${effect.toFixed(1)}</td>
                    </tr>

                    {/* 2레벨 상세 확장 영역 */}
                    {isExpanded && hasDetails && (
                      <tr key={`detail-${i}`}>
                        <td colSpan={10} className="p-0">
                          <div className="bg-[#F8FAFF] border-y border-primary/10">
                            <div className="flex items-center justify-between px-6 py-3 border-b border-primary/10">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-primary">{part.system}</span>
                                <span className="text-xs text-text-muted">{t('proj.detail.title')}</span>
                                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                                  C/O {part.details!.filter(d => d.isCo).length}/{part.details!.length}
                                </span>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); setExpandedRow(null); setExpandedDetail(null) }}
                                className="text-text-subtle hover:text-text transition-colors cursor-pointer"
                              >
                                <X size={16} />
                              </button>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-[#EEF2FF]">
                                    <th className="text-left px-4 py-2.5 font-semibold text-text-muted w-10">No.</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted">{t('proj.detail.col.partName')}</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted">{t('proj.detail.col.partNo')}</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted">{t('proj.detail.col.basePNo')}</th>
                                    <th className="text-center px-3 py-2.5 font-semibold text-text-muted w-16">{t('proj.detail.col.co')}</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted">{t('proj.detail.col.source')}</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted">{t('proj.detail.col.supplier')}</th>
                                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted">{t('proj.detail.col.region')}</th>
                                    <th className="text-right px-4 py-2.5 font-semibold text-text-muted">{t('proj.detail.col.cost')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {part.details!.map((sub, j) => {
                                    const hasReasonDetail = !sub.isCo && sub.reasonDetail
                                    const isDetailOpen = expandedDetail === sub.partNo
                                    const coPossLabels = { high: t('poss.high'), medium: t('poss.medium'), low: t('poss.low'), none: t('poss.none') }
                                    return (
                                      <Fragment key={j}>
                                        <tr
                                          className={`border-b border-primary/5 last:border-b-0 ${
                                            sub.isCo ? 'bg-white' : 'bg-danger-dim/30'
                                          } ${isDetailOpen ? 'bg-danger-dim/50' : ''}`}
                                        >
                                          <td className="px-4 py-2 text-text-subtle">{j + 1}</td>
                                          <td className="px-3 py-2 font-medium text-text">{sub.partName}</td>
                                          <td className="px-3 py-2 font-mono text-text-muted">{sub.partNo}</td>
                                          <td className="px-3 py-2">
                                            {sub.coPartNo ? (
                                              <span className="font-mono text-[11px] text-success">{sub.coPartNo}</span>
                                            ) : (
                                              <span className="text-text-subtle">—</span>
                                            )}
                                          </td>
                                          <td className="px-3 py-2 text-center">
                                            {sub.isCo ? (
                                              <span className="inline-flex items-center gap-0.5 text-success font-medium">
                                                <CheckCircle2 size={12} /> C/O
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center gap-0.5 text-danger font-medium">
                                                <X size={12} /> {t('proj.detail.new')}
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-3 py-2">
                                            {sub.isCo ? (
                                              <span className="bg-success-dim text-success px-2 py-0.5 rounded text-[10px] font-medium">
                                                {sub.coSource} C/O
                                              </span>
                                            ) : hasReasonDetail ? (
                                              <button
                                                onClick={(e) => { e.stopPropagation(); setExpandedDetail(isDetailOpen ? null : sub.partNo) }}
                                                className="text-left group cursor-pointer"
                                              >
                                                <span className="text-danger/80 text-[11px] leading-tight underline decoration-dashed decoration-danger/40 group-hover:decoration-danger group-hover:text-danger transition-colors">
                                                  {sub.nonCoReason}
                                                </span>
                                                <span className={`ml-1.5 inline-flex items-center transition-transform duration-200 ${isDetailOpen ? 'rotate-90' : ''}`}>
                                                  <ChevronRight size={10} className="text-danger/60" />
                                                </span>
                                              </button>
                                            ) : (
                                              <span className="text-danger/80 text-[11px] leading-tight">
                                                {sub.nonCoReason}
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-3 py-2 text-text-muted">{sub.supplier}</td>
                                          <td className="px-3 py-2">
                                            <span className="bg-secondary px-1.5 py-0.5 rounded text-[10px] font-medium text-text-muted">
                                              {sub.supplierRegion}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2 text-right font-mono font-medium">
                                            ${sub.materialCost.toFixed(1)}
                                          </td>
                                        </tr>

                                        {/* 3레벨: 비C/O 사유 상세 */}
                                        {isDetailOpen && hasReasonDetail && (() => {
                                          const rd = sub.reasonDetail!
                                          const coPossWidth = { high: '75%', medium: '50%', low: '25%', none: '5%' }
                                          const coPossColor = { high: '#22C55E', medium: '#F59E0B', low: '#EF4444', none: '#9CA3AF' }
                                          const catEmoji: Record<string, string> = { '디자인': '🎨', '사양변경': '🔧', '법규': '📋', '신규사양': '✨', '형상차이': '📐', '성능': '⚡' }
                                          return (
                                          <tr>
                                            <td colSpan={10} className="p-0">
                                              <div className="bg-gradient-to-b from-[#FFF5F5] to-[#FFF9F5] border-y border-danger/10">
                                                <div className="flex items-center justify-between px-5 py-2.5 border-b border-danger/8 bg-white/60">
                                                  <div className="flex items-center gap-3">
                                                    <span className="text-base">{catEmoji[rd.category]}</span>
                                                    <span className="text-xs font-bold text-text">{sub.partName}</span>
                                                    <span className="text-[10px] font-mono text-text-subtle">{sub.partNo}</span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-danger bg-danger-dim">{rl(rd.category)}</span>
                                                  </div>
                                                  <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                      <span className="text-[10px] text-text-subtle block">{t('proj.reason.addCost')}</span>
                                                      <span className="text-base font-black text-danger">${rd.additionalCost.toFixed(1)}</span>
                                                    </div>
                                                    <button onClick={(e) => { e.stopPropagation(); setExpandedDetail(null) }} className="text-text-subtle hover:text-text cursor-pointer">
                                                      <X size={14} />
                                                    </button>
                                                  </div>
                                                </div>

                                                <div className="grid grid-cols-[1fr_auto_1fr] gap-0 px-5 py-3">
                                                  <div className="bg-white rounded-l-[12px] border border-r-0 border-border p-3">
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                      <div className="w-2 h-2 rounded-full bg-text-subtle" />
                                                      <span className="text-[10px] font-bold text-text-subtle uppercase tracking-wider">{t('proj.reason.base')}</span>
                                                    </div>
                                                    <p className="text-[11px] text-text leading-relaxed">{rd.baseSpec}</p>
                                                  </div>
                                                  <div className="flex items-center px-2 bg-gradient-to-r from-white to-white border-y border-border">
                                                    <div className="flex flex-col items-center gap-1">
                                                      <span className="text-danger text-lg font-black">→</span>
                                                      <span className="text-[8px] text-danger font-bold">{t('proj.reason.change')}</span>
                                                    </div>
                                                  </div>
                                                  <div className="bg-white rounded-r-[12px] border border-l-0 border-danger/30 p-3">
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                      <div className="w-2 h-2 rounded-full bg-danger" />
                                                      <span className="text-[10px] font-bold text-danger uppercase tracking-wider">{t('proj.reason.devReq')}</span>
                                                    </div>
                                                    <p className="text-[11px] text-text leading-relaxed">{rd.newSpec}</p>
                                                  </div>
                                                </div>

                                                <div className="grid grid-cols-4 gap-2.5 px-5 pb-3">
                                                  <div className="bg-white rounded-[10px] border border-border p-2.5 col-span-2">
                                                    <p className="text-[9px] font-bold text-text-subtle uppercase tracking-wider mb-1">{t('proj.reason.keyDiff')}</p>
                                                    <p className="text-[11px] text-text leading-snug line-clamp-3">{rd.diffDescription}</p>
                                                  </div>
                                                  <div className="bg-white rounded-[10px] border border-border p-2.5">
                                                    <p className="text-[9px] font-bold text-text-subtle uppercase tracking-wider mb-1">{t('proj.reason.whyChange')}</p>
                                                    <p className="text-[11px] text-text leading-snug line-clamp-3">{rd.designIntent}</p>
                                                  </div>
                                                  <div className="bg-white rounded-[10px] border border-border p-2.5">
                                                    <p className="text-[9px] font-bold text-text-subtle uppercase tracking-wider mb-1">{t('proj.reason.impact')}</p>
                                                    <p className="text-[11px] text-text leading-snug line-clamp-3">{rd.impactArea}</p>
                                                  </div>
                                                </div>

                                                <div className="px-5 pb-3">
                                                  <div className="bg-white rounded-[10px] border border-border p-2.5 flex items-center gap-4">
                                                    <div className="shrink-0">
                                                      <p className="text-[9px] font-bold text-text-subtle uppercase tracking-wider">{t('proj.reason.coPoss')}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: coPossWidth[rd.coPossibility], backgroundColor: coPossColor[rd.coPossibility] }} />
                                                      </div>
                                                    </div>
                                                    <span className="text-xs font-black shrink-0" style={{ color: coPossColor[rd.coPossibility] }}>
                                                      {coPossLabels[rd.coPossibility]}
                                                    </span>
                                                    {rd.coCondition && (
                                                      <span className="text-[10px] text-text-muted shrink-0 max-w-[280px] truncate" title={rd.coCondition}>
                                                        {rd.coCondition}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                          )
                                        })()}
                                      </Fragment>
                                    )
                                  })}
                                </tbody>
                                <tfoot>
                                  <tr className="bg-[#EEF2FF] border-t border-primary/10">
                                    <td colSpan={4} className="px-4 py-2.5 font-bold text-text">{t('proj.detail.subtotal')}</td>
                                    <td className="px-3 py-2.5 text-center font-bold">
                                      <span className="text-success">{part.details!.filter(d => d.isCo).length}</span>
                                      <span className="text-text-subtle"> / {part.details!.length}</span>
                                    </td>
                                    <td colSpan={2} className="px-3 py-2.5 text-[11px] text-text-muted">
                                      {t('proj.detail.coRate')} {Math.round((part.details!.filter(d => d.isCo).length / part.details!.length) * 100)}%
                                      {' | '}{t('proj.detail.nonCo')} {part.details!.filter(d => !d.isCo).length}{t('common.count')}
                                    </td>
                                    <td className="px-3 py-2.5" />
                                    <td className="px-4 py-2.5 text-right font-mono font-bold">
                                      ${part.details!.reduce((s, d) => s + d.materialCost, 0).toFixed(1)}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#FAFBFC] border-t-2 border-border">
                <td className="px-6 py-4" colSpan={2}>
                  <span className="font-bold">{t('proj.table.footer')}</span>
                  <span className="text-text-muted text-xs ml-2">({filtered.length}{t('proj.table.footerSystems')})</span>
                </td>
                <td className="px-4 py-4" /><td className="px-4 py-4" /><td className="px-4 py-4" /><td className="px-4 py-4" />
                <td className="px-4 py-4 text-center font-medium">
                  {filtered.reduce((s, p) => s + p.coSubParts, 0)}/{filtered.reduce((s, p) => s + p.subParts, 0)}
                </td>
                <td className="px-4 py-4 text-right font-mono font-bold">${filteredCoCost.toFixed(1)}</td>
                <td className="px-4 py-4 text-right font-mono font-bold">${filteredNewCost.toFixed(1)}</td>
                <td className="px-6 py-4 text-right font-mono font-bold text-success">${filteredEffect.toFixed(1)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  )
}
