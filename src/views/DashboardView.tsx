import { useMemo } from 'react'
import {
  Target, Wrench, FolderKanban, Calendar,
  ChevronDown,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

import { getMergedVehicles } from '@/lib/storage'
import { getVehicleTotals } from '@/lib/calculations'
import { StatCard } from '@/components/shared/StatCard'
import { ProgressBar } from '@/components/shared/ProgressBar'

/* ─── Compute dashboard data from real vehicles ─── */

function useDashboardData() {
  return useMemo(() => {
    const vehicles = getMergedVehicles()
    const h2Vehicles = vehicles.filter(v => v.half === 'H2')
    const allVehicles = vehicles

    // Global totals — single pass over all parts
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

    // H2 (development) vehicle totals — single pass
    const h2Parts = h2Vehicles.flatMap(v => v.parts)
    let h2CoCost = 0, h2NewDevCost = 0
    for (const p of h2Parts) {
      h2CoCost += p.coCost
      h2NewDevCost += p.newDevCost
    }
    const h2Effect = h2CoCost

    // KPI cards
    const coEffect = h2Effect > 0 ? h2Effect : totalCoCost
    const preSrSavings = h2NewDevCost > 0 ? h2NewDevCost - h2CoCost : totalNewDevCost - totalCoCost
    const activeProjects = h2Vehicles.length
    const overallCoRate = globalCoRate

    // Per-vehicle C/O rate bar chart
    const coRateData = allVehicles
      .filter(v => v.parts.length > 0)
      .map(v => {
        const totals = getVehicleTotals(v.parts)
        return { name: v.code, rate: totals.coRate }
      })

    // Pie chart — CoType distribution (counts computed in single pass above)
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

    // Projects table — H2 development vehicles
    const projects = h2Vehicles.map(v => {
      const totals = getVehicleTotals(v.parts)
      // Progress = C/O rate as a proxy for completion
      const progress = totals.coRate
      return {
        code: v.code,
        name: v.name,
        stage: v.stage,
        date: v.date,
        progress,
        systems: totals.totalSystems,
        effect: totals.totalCoCost,
      }
    })

    // Recent activity — from localStorage timestamps
    const recentActivity = buildRecentActivity()

    // Summary stats
    const summary = {
      totalVehicles: allVehicles.length,
      h1Count: vehicles.filter(v => v.half === 'H1').length,
      h2Count: h2Vehicles.length,
      totalSystems: allParts.length,
      totalSubParts,
      totalCoSubParts,
    }

    return {
      coEffect, preSrSavings, activeProjects, overallCoRate,
      coRateData, pieData, projects, recentActivity, summary,
    }
  }, [])
}

/** Seed activities shown when no user data exists yet */
const SEED_ACTIVITIES = [
  { action: 'NX8 C/O 마스터리스트 초기 구축', time: '시드 데이터' },
  { action: 'CT5i Console 2레벨 C/O 분석 완료 (12개 부품)', time: '시드 데이터' },
  { action: 'TX6i IP/Door Trim 3개 시스템 등록', time: '시드 데이터' },
  { action: 'AZ7i Seat 1레벨 C/O 확정', time: '시드 데이터' },
  { action: 'DX4i HVAC 비C/O 사유 6건 등록', time: '시드 데이터' },
  { action: 'EV2i 신규 개발차 등록 (Pre-SOP)', time: '시드 데이터' },
]

function buildRecentActivity(): { action: string; time: string }[] {
  const activities: { action: string; time: number }[] = []

  try {
    const vehicles = JSON.parse(localStorage.getItem('ds_added_vehicles') ?? '[]')
    for (const v of vehicles) {
      if (v.createdAt) activities.push({
        action: `${v.code} ${v.name} 차종 등록`,
        time: new Date(v.createdAt).getTime(),
      })
    }

    const parts = JSON.parse(localStorage.getItem('ds_added_parts') ?? '[]')
    for (const p of parts) {
      if (p.createdAt) activities.push({
        action: `${p.vehicleCode} ${p.part?.system ?? ''} 시스템 등록`,
        time: new Date(p.createdAt).getTime(),
      })
    }

    const reasons = JSON.parse(localStorage.getItem('ds_added_reasons') ?? '[]')
    for (const r of reasons) {
      if (r.createdAt) activities.push({
        action: `${r.vehicleCode} ${r.partName ?? r.system} 비C/O 사유 등록`,
        time: new Date(r.createdAt).getTime(),
      })
    }
  } catch { /* ignore parse errors */ }

  // If no user activities, show seed activities
  if (activities.length === 0) return SEED_ACTIVITIES

  activities.sort((a, b) => b.time - a.time)

  return activities.slice(0, 6).map(a => ({
    action: a.action,
    time: formatTimeAgo(a.time),
  }))
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`
  return new Date(timestamp).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

/* ─── Monthly trend (keep as illustrative — needs server for real history) ─── */

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

/* ─── Component ─── */

export function DashboardView() {
  const data = useDashboardData()

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Target}
          label="C/O Effect (전체)"
          value={`$${data.coEffect.toFixed(0)}`}
          change={`${data.summary.totalCoSubParts}건 C/O`}
          positive={data.coEffect > 0}
        />
        <StatCard
          icon={Wrench}
          label="신규개발 비용"
          value={`$${data.preSrSavings.toFixed(0)}`}
          change={`${data.summary.totalSystems} 시스템`}
          positive={true}
        />
        <StatCard
          icon={FolderKanban}
          label="개발 프로젝트"
          value={String(data.activeProjects)}
          change={`H1: ${data.summary.h1Count}대`}
          positive={true}
          suffix="건"
        />
        <StatCard
          icon={Calendar}
          label="전체 C/O Rate"
          value={String(data.overallCoRate)}
          change={`${data.summary.totalCoSubParts}/${data.summary.totalSubParts}`}
          positive={data.overallCoRate >= 50}
          suffix="%"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Area Chart */}
        <div className="col-span-2 bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold">C/O 절감 추이</h3>
              <p className="text-sm text-text-muted mt-0.5">월별 실적 vs 목표 ($) — 예시 데이터</p>
            </div>
            <span className="flex items-center gap-1.5 text-sm text-text-muted bg-secondary px-3 py-1.5 rounded-[var(--radius-button)]">
              최근 8개월 <ChevronDown size={14} />
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
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Area type="monotone" dataKey="actual" stroke="#3182F6" strokeWidth={2.5} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="target" stroke="#E5E7EB" strokeWidth={1.5} strokeDasharray="6 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — LIVE from vehicle data */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">C/O 구성 비율</h3>
          <p className="text-sm text-text-muted mb-4">전체 시스템 기준</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={data.pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {data.pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {data.pieData.map((item, i) => (
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

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Bar Chart — LIVE C/O rate per vehicle */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">차종별 C/O Rate</h3>
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

        {/* Projects Table — LIVE from H2 vehicles */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold">개발 프로젝트 (H2)</h3>
            <span className="text-xs text-text-muted bg-secondary px-2 py-1 rounded-full">
              {data.projects.length}건
            </span>
          </div>
          {data.projects.length === 0 ? (
            <p className="text-sm text-text-muted py-8 text-center">H2 개발 차종이 없습니다</p>
          ) : (
            <div className="flex flex-col gap-4">
              {data.projects.map((p, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{p.code}</span>
                      <span className="text-xs text-text-subtle bg-secondary px-2 py-0.5 rounded-full">
                        {p.date} {p.stage}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-text-muted">
                      C/O {p.progress}%
                    </span>
                  </div>
                  <ProgressBar value={p.progress} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed — LIVE from localStorage entries */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-4">최근 활동</h3>
          {data.recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-text-muted">아직 활동 기록이 없습니다</p>
              <p className="text-xs text-text-subtle mt-1">데이터 입력 시 자동 기록됩니다</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {data.recentActivity.map((item, i) => (
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
