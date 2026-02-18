import { useMemo } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
  BarChart, Cell,
} from 'recharts'

import type { VehicleInfo, ReasonCategory } from '@/types'
import { getMergedVehicles } from '@/lib/storage'
import { useLang } from '@/lib/i18n'

const CATEGORIES: ReasonCategory[] = ['디자인', '사양변경', '법규', '신규사양', '형상차이', '성능']
const COLORS = ['#3182F6', '#F97316', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B']

const REASON_KEYS: Record<ReasonCategory, string> = {
  '디자인': 'reason.design',
  '사양변경': 'reason.spec-change',
  '법규': 'reason.regulation',
  '신규사양': 'reason.new-spec',
  '형상차이': 'reason.shape-diff',
  '성능': 'reason.performance',
}

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
  const { t } = useLang()
  const vehicles = getMergedVehicles()
  const paretoData = useMemo(() => buildParetoData(vehicles), [vehicles])
  const vehicleData = useMemo(() => buildVehicleReasonData(vehicles), [vehicles])
  const totalNonCo = paretoData.reduce((s, d) => s + d.count, 0)
  const totalCost = paretoData.reduce((s, d) => s + d.cost, 0)

  const rl = (cat: string) => t(REASON_KEYS[cat as ReasonCategory] ?? cat)

  return (
    <>
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-sm text-text-muted">{t('anal.totalNonCo')}</p>
          <p className="text-3xl font-bold mt-1">{totalNonCo}<span className="text-base font-normal text-text-muted ml-1">{t('common.count')}</span></p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-sm text-text-muted">{t('anal.totalCost')}</p>
          <p className="text-3xl font-bold mt-1">${totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-sm text-text-muted">{t('anal.topReasons')}</p>
          <p className="text-3xl font-bold mt-1">
            {paretoData[0] ? rl(paretoData[0].category) : '-'}, {paretoData[1] ? rl(paretoData[1].category) : '-'}
          </p>
        </div>
      </div>

      {/* Pareto Chart */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 mb-8">
        <h3 className="text-base font-bold mb-1">{t('anal.pareto.title')}</h3>
        <p className="text-sm text-text-muted mb-6">{t('anal.pareto.sub')}</p>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={paretoData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={rl} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} unit="%" />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} labelFormatter={(label) => rl(String(label))} />
            <Legend />
            <Bar yAxisId="left" dataKey="count" name={t('anal.pareto.count')} barSize={40} radius={[6, 6, 0, 0]}>
              {paretoData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
            <Line yAxisId="right" type="monotone" dataKey="cumPct" name={t('anal.pareto.cumPct')} stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4, fill: '#EF4444' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Category table */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-bold">{t('anal.detail.title')}</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="text-left px-4 py-2.5 font-semibold text-text-muted">{t('anal.detail.col.reason')}</th>
                <th className="text-right px-4 py-2.5 font-semibold text-text-muted">{t('anal.detail.col.count')}</th>
                <th className="text-right px-4 py-2.5 font-semibold text-text-muted">{t('anal.detail.col.cost')}</th>
                <th className="text-right px-4 py-2.5 font-semibold text-text-muted">{t('anal.detail.col.ratio')}</th>
                <th className="text-right px-4 py-2.5 font-semibold text-text-muted">{t('anal.detail.col.cumPct')}</th>
              </tr>
            </thead>
            <tbody>
              {paretoData.map((d, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      {rl(d.category)}
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
          <h3 className="text-base font-bold mb-1">{t('anal.vehicle.title')}</h3>
          <p className="text-sm text-text-muted mb-4">{t('anal.vehicle.sub')}</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={vehicleData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="vehicle" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
              <Legend />
              {CATEGORIES.map((cat, i) => (
                <Bar key={cat} dataKey={cat} name={rl(cat)} stackId="a" fill={COLORS[i]} radius={i === CATEGORIES.length - 1 ? [4, 4, 0, 0] : undefined} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
