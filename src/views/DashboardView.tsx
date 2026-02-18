import { useState, useMemo } from 'react'
import {
  Target, Wrench, FolderKanban, Calendar,
  ChevronDown, Trophy, Medal, Star, Award, Sparkles, Crown,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

import { getMergedVehicles } from '@/lib/storage'
import { getVehicleTotals, calcNarrativeMetrics, calcCrossVehicleRanking } from '@/lib/calculations'
import { StatCard } from '@/components/shared/StatCard'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { useLang } from '@/lib/i18n'

/* ─── Compute dashboard data from real vehicles ─── */

function useDashboardData() {
  return useMemo(() => {
    const vehicles = getMergedVehicles()
    const h2Vehicles = vehicles.filter(v => v.half === 'H2')
    const allVehicles = vehicles

    const allParts = allVehicles.flatMap(v => v.parts)
    let totalSubParts = 0, totalCoSubParts = 0, totalCoCost = 0, totalNewDevCost = 0
    let fullCo = 0, partialCo = 0, newDev = 0
    for (const p of allParts) {
      totalSubParts += p.subParts
      totalCoSubParts += p.coSubParts
      totalCoCost += p.coCost
      totalNewDevCost += p.newDevCost
      if (p.coType === '1레벨 C/O') fullCo++
      else if (p.coType === '2레벨 부분 C/O') partialCo++
      else newDev++
    }
    const globalCoRate = totalSubParts > 0 ? Math.round((totalCoSubParts / totalSubParts) * 100) : 0

    const h2Parts = h2Vehicles.flatMap(v => v.parts)
    let h2CoCost = 0, h2NewDevCost = 0
    for (const p of h2Parts) {
      h2CoCost += p.coCost
      h2NewDevCost += p.newDevCost
    }
    const h2Effect = h2CoCost

    const coEffect = h2Effect > 0 ? h2Effect : totalCoCost
    const preSrSavings = h2NewDevCost > 0 ? h2NewDevCost - h2CoCost : totalNewDevCost - totalCoCost
    const activeProjects = h2Vehicles.length
    const overallCoRate = globalCoRate

    const coRateData = allVehicles
      .filter(v => v.parts.length > 0)
      .map(v => {
        const totals = getVehicleTotals(v.parts)
        return { name: v.code, rate: totals.coRate }
      })

    const pieTotal = fullCo + partialCo + newDev
    const pieData = pieTotal > 0 ? [
      { name: '100% C/O', value: Math.round((fullCo / pieTotal) * 100), color: '#3182F6' },
      { name: 'Partial C/O', value: Math.round((partialCo / pieTotal) * 100), color: '#93C5FD' },
      { name: 'New Dev', value: Math.round((newDev / pieTotal) * 100), color: '#E5E7EB' },
    ] : [
      { name: '100% C/O', value: 0, color: '#3182F6' },
      { name: 'Partial C/O', value: 0, color: '#93C5FD' },
      { name: 'New Dev', value: 100, color: '#E5E7EB' },
    ]

    const projects = h2Vehicles.map(v => {
      const totals = getVehicleTotals(v.parts)
      return {
        code: v.code, name: v.name, stage: v.stage, date: v.date,
        progress: totals.coRate, systems: totals.totalSystems, effect: totals.totalCoCost,
      }
    })

    const summary = {
      totalVehicles: allVehicles.length,
      h1Count: vehicles.filter(v => v.half === 'H1').length,
      h2Count: h2Vehicles.length,
      totalSystems: allParts.length,
      totalSubParts,
      totalCoSubParts,
    }

    return {
      vehicles, h2Vehicles,
      coEffect, preSrSavings, activeProjects, overallCoRate,
      coRateData, pieData, projects, summary,
    }
  }, [])
}

const monthlyTrend = [
  { month: 'Jul', actual: 280, target: 300 },
  { month: 'Aug', actual: 320, target: 300 },
  { month: 'Sep', actual: 350, target: 320 },
  { month: 'Oct', actual: 310, target: 330 },
  { month: 'Nov', actual: 380, target: 340 },
  { month: 'Dec', actual: 420, target: 350 },
  { month: 'Jan', actual: 460, target: 360 },
  { month: 'Feb', actual: 412, target: 336 },
]

const STEP_COLORS = [
  { bg: '#EFF6FF', border: '#BFDBFE', accent: '#3B82F6', label: 'STEP 1' },
  { bg: '#ECFDF5', border: '#A7F3D0', accent: '#10B981', label: 'STEP 2' },
  { bg: '#FFFBEB', border: '#FDE68A', accent: '#F59E0B', label: 'STEP 3' },
  { bg: '#FFF7ED', border: '#FDBA74', accent: '#EA580C', label: 'STEP 4' },
]

/* ─── Recent activity ─── */

function useRecentActivity() {
  const { t, lang } = useLang()
  return useMemo(() => {
    const SEED_ACTIVITIES = [
      { action: t('seed.nx8-init'), time: t('time.seed') },
      { action: t('seed.ct5i-console'), time: t('time.seed') },
      { action: t('seed.tx6i-systems'), time: t('time.seed') },
      { action: t('seed.az7i-seat'), time: t('time.seed') },
      { action: t('seed.dx4i-hvac'), time: t('time.seed') },
      { action: t('seed.ev2i-new'), time: t('time.seed') },
    ]

    const activities: { action: string; time: number }[] = []
    try {
      const vehicles = JSON.parse(localStorage.getItem('ds_added_vehicles') ?? '[]')
      for (const v of vehicles) {
        if (v.createdAt) activities.push({
          action: `${v.code} ${v.name} ${t('seed.vehicle.register')}`,
          time: new Date(v.createdAt).getTime(),
        })
      }
      const parts = JSON.parse(localStorage.getItem('ds_added_parts') ?? '[]')
      for (const p of parts) {
        if (p.createdAt) activities.push({
          action: `${p.vehicleCode} ${p.part?.system ?? ''} ${t('seed.system.register')}`,
          time: new Date(p.createdAt).getTime(),
        })
      }
      const reasons = JSON.parse(localStorage.getItem('ds_added_reasons') ?? '[]')
      for (const r of reasons) {
        if (r.createdAt) activities.push({
          action: `${r.vehicleCode} ${r.partName ?? r.system} ${t('seed.reason.register')}`,
          time: new Date(r.createdAt).getTime(),
        })
      }
    } catch { /* ignore */ }

    if (activities.length === 0) return SEED_ACTIVITIES

    activities.sort((a, b) => b.time - a.time)
    return activities.slice(0, 6).map(a => ({
      action: a.action,
      time: formatTimeAgo(a.time, t, lang),
    }))
  }, [t, lang])
}

function formatTimeAgo(timestamp: number, t: (k: string) => string, lang: string): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return t('time.justNow')
  if (minutes < 60) return `${minutes}${t('time.minsAgo')}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}${t('time.hoursAgo')}`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}${t('time.daysAgo')}`
  return new Date(timestamp).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { month: 'short', day: 'numeric' })
}

/* ─── Component ─── */

export function DashboardView() {
  const { t, lang } = useLang()
  const data = useDashboardData()
  const recentActivity = useRecentActivity()
  const [narrativeVehicle, setNarrativeVehicle] = useState('NX8')
  const [multiplier, setMultiplier] = useState(1.5)

  const selectedV = data.vehicles.find(v => v.code === narrativeVehicle)
  const narrative = useMemo(
    () => selectedV ? calcNarrativeMetrics(selectedV.parts, multiplier) : null,
    [selectedV, multiplier],
  )
  const ranking = useMemo(
    () => calcCrossVehicleRanking(data.vehicles, multiplier),
    [data.vehicles, multiplier],
  )

  const summaryText = selectedV && narrative
    ? lang === 'ko'
      ? `${selectedV.code}는 ${narrative.totalParts}개 부품 중 ${narrative.coParts}개(${narrative.coRateByCount}%)를 공용화하여, 신규 개발 대비 $${narrative.savings.toFixed(1)} (${narrative.savingsRate}%)을 절감했습니다.`
      : `${selectedV.code} commonized ${narrative.coParts} of ${narrative.totalParts} parts (${narrative.coRateByCount}%), saving $${narrative.savings.toFixed(1)} (${narrative.savingsRate}%) vs new development.`
    : ''

  const pieNames = [t('dash.chart.pie.full'), t('dash.chart.pie.partial'), t('dash.chart.pie.newdev')]
  const localPie = data.pieData.map((d, i) => ({ ...d, name: pieNames[i] }))

  return (
    <>
      {/* ═══ C/O Narrative View ═══ */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              {t('dash.narrative.title')}
            </h3>
            <p className="text-sm text-text-muted mt-0.5">{t('dash.narrative.sub')}</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={narrativeVehicle}
              onChange={e => setNarrativeVehicle(e.target.value)}
              className="text-sm border border-border rounded-[var(--radius-button)] px-3 py-1.5 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {data.h2Vehicles.map(v => (
                <option key={v.code} value={v.code}>{v.code} — {v.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">{t('dash.narrative.multiplier')}</span>
              <input
                type="range" min="1.0" max="2.0" step="0.1"
                value={multiplier}
                onChange={e => setMultiplier(parseFloat(e.target.value))}
                className="w-20 accent-primary"
              />
              <span className="text-xs font-bold text-primary w-8">{multiplier.toFixed(1)}x</span>
            </div>
          </div>
        </div>

        {narrative && selectedV && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="rounded-[14px] border-2 p-4 relative" style={{ backgroundColor: STEP_COLORS[0].bg, borderColor: STEP_COLORS[0].border }}>
                <span className="text-[10px] font-black tracking-wider" style={{ color: STEP_COLORS[0].accent }}>{STEP_COLORS[0].label}</span>
                <p className="text-xs text-text-muted mt-1">{t('dash.step1.label')}</p>
                <p className="text-2xl font-black mt-2" style={{ color: STEP_COLORS[0].accent }}>${narrative.totalCost.toFixed(1)}</p>
                <p className="text-[11px] text-text-muted mt-1">{lang === 'ko' ? '1레벨' : 'L1'} {selectedV.parts.length}{t('dash.step1.systems')} · {lang === 'ko' ? '2레벨' : 'L2'} {narrative.totalParts}{t('dash.step1.parts')}</p>
                <p className="text-[10px] text-text-subtle mt-0.5">{lang === 'ko' ? '판매' : 'Sales'} {(selectedV.salesVolume / 1000).toFixed(0)}{t('dash.step1.sales')}</p>
              </div>

              <div className="rounded-[14px] border-2 p-4 relative" style={{ backgroundColor: STEP_COLORS[1].bg, borderColor: STEP_COLORS[1].border }}>
                <span className="text-[10px] font-black tracking-wider" style={{ color: STEP_COLORS[1].accent }}>{STEP_COLORS[1].label}</span>
                <p className="text-xs text-text-muted mt-1">{t('dash.step2.label')}</p>
                <p className="text-2xl font-black mt-2" style={{ color: STEP_COLORS[1].accent }}>{narrative.coRateByCount}%</p>
                <p className="text-[11px] text-text-muted mt-1">{t('dash.step2.partcount')} {narrative.coParts}/{narrative.totalParts}{lang === 'ko' ? '개' : ''}</p>
                <p className="text-[10px] text-text-subtle mt-0.5">{t('dash.step2.byamount')} {narrative.coRateByAmount}% (${narrative.coCost.toFixed(1)})</p>
              </div>

              <div className="rounded-[14px] border-2 p-4 relative" style={{ backgroundColor: STEP_COLORS[2].bg, borderColor: STEP_COLORS[2].border }}>
                <span className="text-[10px] font-black tracking-wider" style={{ color: STEP_COLORS[2].accent }}>{STEP_COLORS[2].label}</span>
                <p className="text-xs text-text-muted mt-1">{t('dash.step3.label')}</p>
                <p className="text-2xl font-black mt-2" style={{ color: STEP_COLORS[2].accent }}>${narrative.counterfactualCost.toFixed(1)}</p>
                <p className="text-[11px] text-text-muted mt-1">{t('dash.step3.extra')} +${(narrative.counterfactualCost - narrative.totalCost).toFixed(1)}</p>
                <p className="text-[10px] text-text-subtle mt-0.5">{t('dash.step3.factor')} {multiplier.toFixed(1)}x {t('dash.step3.applied')}</p>
              </div>

              <div className="rounded-[14px] border-2 p-4 relative" style={{ backgroundColor: STEP_COLORS[3].bg, borderColor: STEP_COLORS[3].border }}>
                <span className="text-[10px] font-black tracking-wider" style={{ color: STEP_COLORS[3].accent }}>{STEP_COLORS[3].label}</span>
                <p className="text-xs text-text-muted mt-1">{t('dash.step4.label')}</p>
                <p className="text-2xl font-black mt-2" style={{ color: STEP_COLORS[3].accent }}>${narrative.savings.toFixed(1)}</p>
                <p className="text-[11px] text-text-muted mt-1">{t('dash.step4.rate')} {narrative.savingsRate}%</p>
                <p className="text-[10px] text-text-subtle mt-0.5">{t('dash.step4.annual')} ${((narrative.savings * selectedV.salesVolume) / 1000).toFixed(0)}K {t('dash.step4.saving')}</p>
              </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-[10px] border border-border/60 px-4 py-2.5 text-[12px] text-text-muted leading-relaxed">
              <span className="font-bold text-text">{summaryText}</span>
              {' '}{t('dash.narrative.annualvol')} {(selectedV.salesVolume / 1000).toFixed(0)}K{lang === 'ko' ? '대' : ' units'}{lang === 'ko' ? ' 기준, 총 절감 효과' : ', total savings'} <span className="font-bold text-primary">${((narrative.savings * selectedV.salesVolume) / 1000000).toFixed(2)}M</span>
            </div>
          </>
        )}
      </div>

      {/* ═══ Cross-Vehicle C/O Ranking ═══ */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                {t('dash.ranking.title')}
              </h3>
              <p className="text-sm text-text-muted mt-0.5">{t('dash.ranking.sub')}</p>
            </div>
            <span className="text-xs text-text-muted bg-secondary px-2 py-1 rounded-full">
              {t('dash.ranking.factor')} {multiplier.toFixed(1)}x
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-[#FAFBFC]">
                  <th className="text-center px-3 py-2.5 font-semibold text-text-muted w-12">{t('dash.ranking.col.rank')}</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-text-muted">{t('dash.ranking.col.vehicle')}</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-text-muted">{t('dash.ranking.col.system')}</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-text-muted">{t('dash.ranking.col.type')}</th>
                  <th className="text-right px-3 py-2.5 font-semibold text-text-muted">{t('dash.ranking.col.savings')}</th>
                  <th className="text-right px-3 py-2.5 font-semibold text-text-muted">{t('dash.ranking.col.volume')}</th>
                  <th className="text-right px-3 py-2.5 font-semibold text-text-muted">{t('dash.ranking.col.total')}</th>
                  <th className="text-right px-3 py-2.5 font-semibold text-text-muted">{t('dash.ranking.col.score')}</th>
                </tr>
              </thead>
              <tbody>
                {ranking.slice(0, 10).map((item) => (
                  <tr key={`${item.vehicleCode}-${item.system}`} className="border-b border-border/50 hover:bg-primary-dim/10 transition-colors">
                    <td className="px-3 py-2.5 text-center">
                      {item.rank <= 3 ? (
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-[10px] font-black ${
                          item.rank === 1 ? 'bg-amber-500' : item.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'
                        }`}>{item.rank}</span>
                      ) : (
                        <span className="text-text-subtle font-medium">{item.rank}</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5"><span className="font-bold">{item.vehicleCode}</span></td>
                    <td className="px-3 py-2.5 font-medium">{item.system}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        item.coType === '1레벨 C/O' ? 'bg-blue-100 text-blue-700' : 'bg-cyan-100 text-cyan-700'
                      }`}>{item.coType === '1레벨 C/O' ? t('cotype.short.1level') : t('cotype.short.partial')}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-success">${item.savingsPerUnit.toFixed(1)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-text-muted">{(item.salesVolume / 1000).toFixed(0)}K</td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold">${(item.totalSavings / 1000).toFixed(0)}K</td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(100, (item.combinedScore / (ranking[0]?.combinedScore || 1)) * 100)}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-text-muted w-8 text-right">{(item.combinedScore / 1000).toFixed(0)}K</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Awards Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[var(--radius-card)] border border-amber-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Medal size={20} className="text-amber-600" />
              <h3 className="text-sm font-bold text-amber-900">{t('dash.monthly.title')}</h3>
            </div>
            {ranking[0] && (
              <div className="bg-white/80 rounded-[10px] p-3 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={16} className="text-amber-500" />
                  <span className="text-xs font-black text-amber-800">{ranking[0].vehicleCode} — {ranking[0].system}</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  {ranking[0].coType}{t('dash.monthly.savings')} <span className="font-bold">${ranking[0].savingsPerUnit.toFixed(1)}</span> {lang === 'ko' ? '절감' : 'saved'},
                  {' '}{lang === 'ko' ? '판매량' : 'Vol.'} {(ranking[0].salesVolume / 1000).toFixed(0)}K{t('dash.monthly.volume')}
                  {' '}{t('dash.monthly.annual')} <span className="font-bold text-amber-900">${(ranking[0].totalSavings / 1000).toFixed(0)}K</span> {t('dash.monthly.effect')}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{t('dash.monthly.bestof')}</span>
                  <span className="text-[9px] text-amber-500">{new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'long' })}</span>
                </div>
              </div>
            )}
            <p className="text-[10px] text-amber-600 mt-2.5 leading-relaxed">{t('dash.monthly.desc')}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[var(--radius-card)] border border-purple-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award size={20} className="text-purple-600" />
              <h3 className="text-sm font-bold text-purple-900">{t('dash.annual.title')}</h3>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-white/80 rounded-[8px] p-2.5 border border-purple-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0"><Trophy size={14} className="text-amber-600" /></div>
                <div>
                  <p className="text-[11px] font-bold text-purple-900">Gold — C/O Champion</p>
                  <p className="text-[10px] text-purple-600">{t('dash.annual.gold')}</p>
                </div>
              </div>
              <div className="bg-white/80 rounded-[8px] p-2.5 border border-purple-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><Star size={14} className="text-gray-500" /></div>
                <div>
                  <p className="text-[11px] font-bold text-purple-900">Silver — Best New C/O</p>
                  <p className="text-[10px] text-purple-600">{t('dash.annual.silver')}</p>
                </div>
              </div>
              <div className="bg-white/80 rounded-[8px] p-2.5 border border-purple-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0"><Sparkles size={14} className="text-orange-500" /></div>
                <div>
                  <p className="text-[11px] font-bold text-purple-900">Bronze — Innovation Award</p>
                  <p className="text-[10px] text-purple-600">{t('dash.annual.bronze')}</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-purple-600 mt-2.5 leading-relaxed">{t('dash.annual.desc')}</p>
          </div>
        </div>
      </div>

      {/* ═══ Original Dashboard Content ═══ */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard icon={Target} label={t('dash.stat.coeffect')} value={`$${data.coEffect.toFixed(0)}`} change={`${data.summary.totalCoSubParts}${t('dash.stat.co')}`} positive={data.coEffect > 0} />
        <StatCard icon={Wrench} label={t('dash.stat.newdev')} value={`$${data.preSrSavings.toFixed(0)}`} change={`${data.summary.totalSystems}${t('dash.stat.systems')}`} positive={true} />
        <StatCard icon={FolderKanban} label={t('dash.stat.devprojects')} value={String(data.activeProjects)} change={`H1: ${data.summary.h1Count}${lang === 'ko' ? '대' : ''}`} positive={true} suffix={lang === 'ko' ? '건' : ''} />
        <StatCard icon={Calendar} label={t('dash.stat.coRate')} value={String(data.overallCoRate)} change={`${data.summary.totalCoSubParts}/${data.summary.totalSubParts}`} positive={data.overallCoRate >= 50} suffix="%" />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold">{t('dash.chart.trend.title')}</h3>
              <p className="text-sm text-text-muted mt-0.5">{t('dash.chart.trend.sub')}</p>
            </div>
            <span className="flex items-center gap-1.5 text-sm text-text-muted bg-secondary px-3 py-1.5 rounded-[var(--radius-button)]">
              {t('dash.chart.trend.period')} <ChevronDown size={14} />
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3182F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3182F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="actual" stroke="#3182F6" strokeWidth={2.5} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="target" stroke="#E5E7EB" strokeWidth={1.5} strokeDasharray="6 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">{t('dash.chart.pie.title')}</h3>
          <p className="text-sm text-text-muted mb-4">{t('dash.chart.pie.sub')}</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={localPie} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {localPie.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {localPie.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-text-muted">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">{t('dash.chart.bar.title')}</h3>
          <p className="text-sm text-text-muted mb-4">%</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.coRateData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
              <Bar dataKey="rate" fill="#3182F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold">{t('dash.projects.title')}</h3>
            <span className="text-xs text-text-muted bg-secondary px-2 py-1 rounded-full">{data.projects.length}{lang === 'ko' ? '건' : ''}</span>
          </div>
          {data.projects.length === 0 ? (
            <p className="text-sm text-text-muted py-8 text-center">{t('dash.projects.empty')}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {data.projects.map((p, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{p.code}</span>
                      <span className="text-xs text-text-subtle bg-secondary px-2 py-0.5 rounded-full">{p.date} {p.stage}</span>
                    </div>
                    <span className="text-xs font-medium text-text-muted">C/O {p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-4">{t('dash.activity.title')}</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-text-muted">{t('dash.activity.empty')}</p>
              <p className="text-xs text-text-subtle mt-1">{t('dash.activity.emptySub')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{item.action}</p>
                    <p className="text-xs text-text-subtle mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
