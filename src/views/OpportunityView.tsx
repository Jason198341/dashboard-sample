import { useState, useMemo } from 'react'
import {
  GitBranch, ArrowRight, ChevronDown, ChevronUp,
  Layers, Package, Download,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

import type { CoType, SubPart } from '@/types'
import {
  getSharedSystems, getSourceSummaries, getSystemCrossView,
} from '@/lib/part-trace'
import type { SharedSystemRow, SystemCrossEntry } from '@/lib/part-trace'

const CO_COLORS: Record<CoType, string> = {
  '1레벨 C/O': '#10B981',
  '2레벨 부분 C/O': '#3182F6',
  '신규개발': '#9CA3AF',
}

const SOURCE_COLORS = ['#3182F6', '#8B5CF6', '#F97316', '#10B981', '#EF4444', '#F59E0B']

/* ═══════════════════════════════════════════════
   Main View
   ═══════════════════════════════════════════════ */

export function OpportunityView() {
  const allRows = useMemo(() => getSharedSystems(), [])
  const sources = useMemo(() => getSourceSummaries(allRows), [allRows])
  const [sourceFilter, setSourceFilter] = useState<string | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (sourceFilter === 'all') return allRows
    return allRows.filter(r => r.sourceVehicle === sourceFilter)
  }, [allRows, sourceFilter])

  const totalSavings = sources.reduce((s, src) => s + src.totalSavings, 0)
  const totalSharedParts = sources.reduce((s, src) => s + src.partsShared, 0)

  // Chart data: savings by source vehicle
  const chartData = sources.map((s, i) => ({
    source: s.code,
    savings: Math.round(s.totalSavings * 10) / 10,
    fill: SOURCE_COLORS[i % SOURCE_COLORS.length],
  }))

  function exportCsv() {
    const BOM = '\uFEFF'
    const header = ['적용차종', '시스템', '원본차종', 'C/O레벨', 'C/O부품', '총부품', '공용화비용($)', '신규개발비용($)', '절감기여($)'].join(',')
    const rows = filtered.map(r => [
      r.vehicleCode, r.system, r.sourceVehicle, r.coType,
      r.coParts, r.totalParts, r.coCost, r.newDevCost, r.savings,
    ].join(','))
    const csv = BOM + header + '\n' + rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `part_traceability_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <SummaryCard
          label="원본차종 (Donor)"
          value={`${sources.length}개`}
          sub="C/O 소스 차종 수"
          color="#8B5CF6"
        />
        <SummaryCard
          label="공용화 시스템"
          value={`${allRows.length}건`}
          sub={`${totalSharedParts}개 부품 공용`}
          color="#3182F6"
        />
        <SummaryCard
          label="총 절감 기여"
          value={`$${totalSavings.toFixed(1)}`}
          sub="신규개발 대비"
          color="#10B981"
        />
        <SummaryCard
          label="평균 절감/시스템"
          value={allRows.length > 0 ? `$${(totalSavings / allRows.length).toFixed(1)}` : '$0'}
          sub="시스템당 평균"
          color="#F97316"
        />
      </div>

      {/* ── Source Vehicle Cards + Chart ── */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">원본차종별 절감 기여</h3>
          <p className="text-sm text-text-muted mb-4">각 양산차가 개발차에 기여한 원가 절감 ($/대)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="source" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} unit="$" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(v: number | undefined) => [`$${v ?? 0}`, '절감 기여']}
              />
              <Bar dataKey="savings" radius={[6, 6, 0, 0]}>
                {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Source filter pills */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 flex flex-col">
          <h3 className="text-base font-bold mb-4">원본차종 필터</h3>
          <div className="flex flex-col gap-2 mb-4 flex-1">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium text-left transition-colors cursor-pointer
                ${sourceFilter === 'all' ? 'bg-primary text-white' : 'bg-secondary text-text-muted hover:bg-secondary-hover'}`}
            >
              전체 ({allRows.length}건)
            </button>
            {sources.map((s, i) => (
              <button
                key={s.code}
                onClick={() => setSourceFilter(s.code)}
                className={`px-4 py-2.5 rounded-[var(--radius-button)] text-sm text-left transition-colors cursor-pointer
                  ${sourceFilter === s.code ? 'text-white' : 'bg-secondary text-text-muted hover:bg-secondary-hover'}`}
                style={sourceFilter === s.code ? { backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] } : undefined}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{s.code}</span>
                  <span className="text-xs opacity-80">{s.systemsShared}시스템 · ${s.totalSavings.toFixed(0)}</span>
                </div>
                <div className="text-xs opacity-70 mt-0.5">{s.adoptedByVehicles}개 차종에서 사용</div>
              </button>
            ))}
          </div>
          <button
            onClick={exportCsv}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-[var(--radius-button)] text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Main Table ── */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">부품 공용화 추적 (Part Traceability)</h3>
            <p className="text-sm text-text-muted mt-0.5">클릭하여 2레벨 부품 상세 + 타 차종 비교 확인</p>
          </div>
          <span className="text-sm text-text-muted">{filtered.length}건</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              <th className="w-8 px-3 py-3" />
              <th className="text-left px-4 py-3 font-semibold text-text-muted">적용차종</th>
              <th className="text-left px-4 py-3 font-semibold text-text-muted">시스템</th>
              <th className="text-left px-4 py-3 font-semibold text-text-muted">원본</th>
              <th className="text-left px-4 py-3 font-semibold text-text-muted">C/O 레벨</th>
              <th className="text-center px-4 py-3 font-semibold text-text-muted">C/O 부품</th>
              <th className="text-right px-4 py-3 font-semibold text-text-muted">공용화비($/대)</th>
              <th className="text-right px-4 py-3 font-semibold text-text-muted">신규시($/대)</th>
              <th className="text-right px-4 py-3 font-semibold text-text-muted">절감기여($)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => {
              const key = `${row.vehicleCode}::${row.system}`
              const isExpanded = expanded === key
              return (
                <SystemRow
                  key={key}
                  row={row}
                  isExpanded={isExpanded}
                  onToggle={() => setExpanded(isExpanded ? null : key)}
                />
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-text-muted">
                  해당 조건의 공용화 데이터가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════ */

function SummaryCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <p className="text-sm text-text-muted">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-text-muted mt-1">{sub}</p>
    </div>
  )
}

function SystemRow({ row, isExpanded, onToggle }: {
  row: SharedSystemRow
  isExpanded: boolean
  onToggle: () => void
}) {
  const hasDetail = row.coType === '2레벨 부분 C/O' && row.details && row.details.length > 0
  const clickable = hasDetail

  return (
    <>
      <tr
        onClick={clickable ? onToggle : undefined}
        className={`border-t border-border transition-colors
          ${clickable ? 'cursor-pointer hover:bg-secondary/50' : ''}
          ${isExpanded ? 'bg-primary/5' : ''}`}
      >
        <td className="px-3 py-3 text-center">
          {clickable && (isExpanded
            ? <ChevronUp size={14} className="text-text-muted mx-auto" />
            : <ChevronDown size={14} className="text-text-muted mx-auto" />
          )}
          {!clickable && row.coType === '1레벨 C/O' && (
            <Layers size={14} className="text-emerald-500 mx-auto" />
          )}
        </td>
        <td className="px-4 py-3">
          <span className="font-bold">{row.vehicleCode}</span>
          <span className="text-text-muted text-xs ml-1">{row.vehicleName}</span>
        </td>
        <td className="px-4 py-3 font-medium">{row.system}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">{row.sourceVehicle}</span>
            <ArrowRight size={12} className="text-text-muted" />
            <span className="font-medium">{row.vehicleCode}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <CoTypeBadge type={row.coType} />
        </td>
        <td className="px-4 py-3 text-center">
          <span className="font-bold">{row.coParts}</span>
          <span className="text-text-muted">/{row.totalParts}</span>
        </td>
        <td className="px-4 py-3 text-right">${row.coCost.toFixed(1)}</td>
        <td className="px-4 py-3 text-right text-text-muted">${row.newDevCost.toFixed(1)}</td>
        <td className="px-4 py-3 text-right">
          <span className={`font-bold ${row.savings > 0 ? 'text-emerald-600' : 'text-text-muted'}`}>
            {row.savings > 0 ? `$${row.savings.toFixed(1)}` : '-'}
          </span>
        </td>
      </tr>
      {isExpanded && hasDetail && (
        <tr>
          <td colSpan={9} className="p-0">
            <DetailPanel row={row} />
          </td>
        </tr>
      )}
    </>
  )
}

function CoTypeBadge({ type }: { type: CoType }) {
  const color = CO_COLORS[type]
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {type === '1레벨 C/O' && <Layers size={10} />}
      {type === '2레벨 부분 C/O' && <Package size={10} />}
      {type}
    </span>
  )
}

/* ═══════════════════════════════════════════════
   Detail Panel (expanded)
   ═══════════════════════════════════════════════ */

function DetailPanel({ row }: { row: SharedSystemRow }) {
  const crossView = useMemo(() => getSystemCrossView(row.system), [row.system])

  return (
    <div className="bg-[#F8FAFC] border-t border-border">
      <div className="grid grid-cols-5 gap-6 p-6">
        {/* Left: Sub-part detail table */}
        <div className="col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch size={14} className="text-primary" />
            <h4 className="text-sm font-bold">
              {row.system} — 2레벨 부품 상세
            </h4>
            <span className="text-xs text-text-muted">
              ({row.vehicleCode} 기준)
            </span>
          </div>
          <div className="bg-white rounded-lg border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary">
                  <th className="text-left px-3 py-2 font-semibold text-text-muted">부품명</th>
                  <th className="text-left px-3 py-2 font-semibold text-text-muted">파트넘버</th>
                  <th className="text-center px-3 py-2 font-semibold text-text-muted">C/O</th>
                  <th className="text-left px-3 py-2 font-semibold text-text-muted">출처/사유</th>
                  <th className="text-left px-3 py-2 font-semibold text-text-muted">협력사</th>
                  <th className="text-right px-3 py-2 font-semibold text-text-muted">소재비($)</th>
                </tr>
              </thead>
              <tbody>
                {(row.details ?? []).map((sub, i) => (
                  <SubPartRow key={i} sub={sub} baseVehicle={row.sourceVehicle} />
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-secondary border-t border-border font-medium">
                  <td className="px-3 py-2" colSpan={2}>
                    소계
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="text-emerald-600">{row.coParts}</span>
                    <span className="text-text-muted"> / {row.totalParts}</span>
                  </td>
                  <td className="px-3 py-2 text-text-muted">
                    C/O율 {row.totalParts > 0 ? Math.round((row.coParts / row.totalParts) * 100) : 0}%
                    {' | 비C/O '}
                    {row.totalParts - row.coParts}건
                  </td>
                  <td className="px-3 py-2" />
                  <td className="px-3 py-2 text-right">
                    ${(row.coCost + row.newDevCost).toFixed(1)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right: Cross-vehicle comparison */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={14} className="text-violet-500" />
            <h4 className="text-sm font-bold">타 차종 비교</h4>
            <span className="text-xs text-text-muted">같은 시스템</span>
          </div>
          <div className="space-y-2">
            {crossView.map(entry => (
              <CrossVehicleCard
                key={entry.vehicleCode}
                entry={entry}
                isCurrentRow={entry.vehicleCode === row.vehicleCode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SubPartRow({ sub, baseVehicle }: { sub: SubPart; baseVehicle: string }) {
  return (
    <tr className="border-t border-border hover:bg-blue-50/30 transition-colors">
      <td className="px-3 py-2">{sub.partName}</td>
      <td className="px-3 py-2 font-mono text-[10px] text-text-muted">{sub.partNo}</td>
      <td className="px-3 py-2 text-center">
        {sub.isCo ? (
          <span className="inline-flex items-center gap-0.5 text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            C/O
          </span>
        ) : (
          <span className="inline-flex items-center gap-0.5 text-orange-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            신규
          </span>
        )}
      </td>
      <td className="px-3 py-2">
        {sub.isCo ? (
          <span className="text-emerald-700">{sub.coSource ?? baseVehicle} C/O</span>
        ) : (
          <span className="text-orange-600 truncate block max-w-[160px]" title={sub.nonCoReason}>
            {sub.nonCoReason ?? '-'}
          </span>
        )}
      </td>
      <td className="px-3 py-2 text-text-muted">{sub.supplier}</td>
      <td className="px-3 py-2 text-right font-medium">${sub.materialCost.toFixed(1)}</td>
    </tr>
  )
}

function CrossVehicleCard({ entry, isCurrentRow }: { entry: SystemCrossEntry; isCurrentRow: boolean }) {
  const isSource = entry.baseVehicle === '-' || !entry.baseVehicle
  return (
    <div className={`rounded-lg border p-3 text-xs transition-colors
      ${isCurrentRow ? 'border-primary/40 bg-primary/5' : 'border-border bg-white'}`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-bold">{entry.vehicleCode}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium
            ${entry.vehicleType === '양산' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
            {entry.vehicleType}
          </span>
          {isCurrentRow && <span className="text-[10px] text-primary font-medium">현재</span>}
        </div>
        <CoTypeBadge type={entry.coType} />
      </div>
      <div className="flex items-center justify-between text-text-muted">
        <span>
          {isSource
            ? '원본 (신규개발)'
            : <>기준: {entry.baseVehicle} → C/O율 <span className="font-bold text-text">{entry.coRate}%</span> ({entry.coParts}/{entry.totalParts})</>
          }
        </span>
        {!isSource && entry.newDevCost > entry.coCost && (
          <span className="text-emerald-600 font-bold">
            -${(entry.newDevCost - entry.coCost).toFixed(1)}
          </span>
        )}
      </div>
    </div>
  )
}
