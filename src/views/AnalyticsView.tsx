import { useMemo } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
  BarChart, Cell,
} from 'recharts'

import type { VehicleInfo, ReasonCategory } from '@/types'
import { getMergedVehicles } from '@/lib/storage'

const CATEGORIES: ReasonCategory[] = ['디자인', '사양변경', '법규', '신규사양', '형상차이', '성능']
const COLORS = ['#3182F6', '#F97316', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B']

function buildParetoData(vehicles: VehicleInfo[]) {
  const counts = new Map<ReasonCategory, { count: number; cost: number }>()
  for (const cat of CATEGORIES) counts.set(cat, { count: 0, cost: 0 })

  for (const v of vehicles) {
    for (const part of v.parts) {
      if (!part.details) continue
      for (const sub of part.details) {
        if (!sub.isCo && sub.reasonDetail) {
          const entry = counts.get(sub.reasonDetail.category)!
          entry.count++
          entry.cost += sub.reasonDetail.additionalCost
        }
      }
    }
  }

  const data = [...counts.entries()]
    .map(([category, { count, cost }]) => ({ category, count, cost }))
    .sort((a, b) => b.count - a.count)

  const totalCount = data.reduce((s, d) => s + d.count, 0)
  let cumulative = 0
  return data.map(d => {
    cumulative += d.count
    return { ...d, ratio: totalCount ? Math.round((d.count / totalCount) * 100) : 0, cumPct: totalCount ? Math.round((cumulative / totalCount) * 100) : 0 }
  })
}

function buildVehicleReasonData(vehicles: VehicleInfo[]) {
  return vehicles.map(v => {
    const row: Record<string, number | string> = { vehicle: v.code }
    for (const cat of CATEGORIES) row[cat] = 0
    for (const part of v.parts) {
      if (!part.details) continue
      for (const sub of part.details) {
        if (!sub.isCo && sub.reasonDetail) {
          const cat = sub.reasonDetail.category
          row[cat] = (row[cat] as number) + 1
        }
      }
    }
    return row
  })
}

export function AnalyticsView() {
  const vehicles = getMergedVehicles()
  const paretoData = useMemo(() => buildParetoData(vehicles), [vehicles])
  const vehicleData = useMemo(() => buildVehicleReasonData(vehicles), [vehicles])
  const totalNonCo = paretoData.reduce((s, d) => s + d.count, 0)
  const totalCost = paretoData.reduce((s, d) => s + d.cost, 0)

  return (
    <>
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-sm text-text-muted">총 비C/O 부품</p>
          <p className="text-3xl font-bold mt-1">{totalNonCo}<span className="text-base font-normal text-text-muted ml-1">건</span></p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-sm text-text-muted">총 추가비용</p>
          <p className="text-3xl font-bold mt-1">${totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-sm text-text-muted">주요 사유 (Top 2)</p>
          <p className="text-3xl font-bold mt-1">
            {paretoData[0]?.category ?? '-'}, {paretoData[1]?.category ?? '-'}
          </p>
        </div>
      </div>

      {/* Pareto Chart */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 mb-8">
        <h3 className="text-base font-bold mb-1">비C/O 사유 Pareto 분석</h3>
        <p className="text-sm text-text-muted mb-6">카테고리별 건수 + 누적 비율 (%)</p>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={paretoData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} unit="%" />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
            <Legend />
            <Bar yAxisId="left" dataKey="count" name="건수" barSize={40} radius={[6, 6, 0, 0]}>
              {paretoData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
            <Line yAxisId="right" type="monotone" dataKey="cumPct" name="누적 %" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4, fill: '#EF4444' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Category table */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-bold">카테고리별 상세</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="text-left px-4 py-2.5 font-semibold text-text-muted">사유</th>
                <th className="text-right px-4 py-2.5 font-semibold text-text-muted">건수</th>
                <th className="text-right px-4 py-2.5 font-semibold text-text-muted">추가비용</th>
                <th className="text-right px-4 py-2.5 font-semibold text-text-muted">비율</th>
                <th className="text-right px-4 py-2.5 font-semibold text-text-muted">누적</th>
              </tr>
            </thead>
            <tbody>
              {paretoData.map((d, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      {d.category}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right">{d.count}</td>
                  <td className="px-4 py-2.5 text-right">${d.cost.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right">{d.ratio}%</td>
                  <td className="px-4 py-2.5 text-right font-medium">{d.cumPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vehicle distribution chart */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">차종별 비C/O 사유 분포</h3>
          <p className="text-sm text-text-muted mb-4">Stacked Bar</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={vehicleData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="vehicle" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
              <Legend />
              {CATEGORIES.map((cat, i) => (
                <Bar key={cat} dataKey={cat} stackId="a" fill={COLORS[i]} radius={i === CATEGORIES.length - 1 ? [4, 4, 0, 0] : undefined} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
