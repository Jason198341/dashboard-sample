import { useState } from 'react'
import {
  LayoutDashboard, FolderKanban, BarChart3, Users, Settings, Search,
  Bell, ChevronDown, TrendingUp, TrendingDown, ArrowUpRight,
  Car, Wrench, Target, Calendar, Filter, Download, CheckCircle2, CircleDot, CirclePlus
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

/* ─── Data ─── */
const monthlyData = [
  { month: 'Jul', actual: 280, target: 300 },
  { month: 'Aug', actual: 320, target: 300 },
  { month: 'Sep', actual: 350, target: 320 },
  { month: 'Oct', actual: 310, target: 330 },
  { month: 'Nov', actual: 380, target: 340 },
  { month: 'Dec', actual: 420, target: 350 },
  { month: 'Jan', actual: 460, target: 360 },
  { month: 'Feb', actual: 412, target: 336 },
]

const coData = [
  { name: 'CT5i', rate: 78 },
  { name: 'VN3', rate: 85 },
  { name: 'AZ7i', rate: 72 },
  { name: 'TX6i', rate: 65 },
  { name: 'DX4i', rate: 58 },
]

const pieData = [
  { name: '100% C/O', value: 42, color: '#3182F6' },
  { name: 'Partial C/O', value: 31, color: '#93C5FD' },
  { name: 'New Dev', value: 27, color: '#E5E7EB' },
]

const projects = [
  { code: 'NX8', stage: '모델선정', date: "'28.8", progress: 35, status: 'active' },
  { code: 'TX6i', stage: '시작차', date: "'26.10", progress: 72, status: 'active' },
  { code: 'DX4i', stage: 'ALL도', date: "'27.8", progress: 48, status: 'active' },
  { code: 'EV2i', stage: '시작차', date: "'27.1", progress: 55, status: 'review' },
  { code: 'CT5i F/L', stage: '양산', date: "'26.6", progress: 88, status: 'active' },
]

const recentActivity = [
  { action: 'NX8 C/O 마스터리스트 업데이트', user: 'Kim S.', time: '2시간 전' },
  { action: 'CT5i Pre-SR 절감안 3건 등록', user: 'Lee J.', time: '4시간 전' },
  { action: 'TX6i 2열 시트 검토 완료', user: 'Choi M.', time: '어제' },
  { action: 'AZ7i NCAP 평가 결과 공유', user: 'Park H.', time: '어제' },
  { action: 'VN3 도어트림 FMEA 갱신', user: 'Jung D.', time: '2일 전' },
]

/* ─── 차종별 1레벨 마스터리스트 ─── */
type CoType = '1레벨 C/O' | '2레벨 부분 C/O' | '신규개발'

interface MasterPart {
  system: string
  baseVehicle: string
  coType: CoType
  subParts: number
  coSubParts: number
  coCost: number
  newDevCost: number
}

interface VehicleInfo {
  code: string
  name: string
  stage: string
  date: string
  half: 'H1' | 'H2'
  type: '양산' | '개발'
  parts: MasterPart[]
}

const vehicles: VehicleInfo[] = [
  // ─── H1 양산차 (베이스 DB 구축) ───
  {
    code: 'VN3', name: 'AY (Sedan-A)', stage: '양산', date: "'24.6", half: 'H1', type: '양산',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: '-', coType: '신규개발', subParts: 16, coSubParts: 0, coCost: 0, newDevCost: 118.4 },
      { system: 'Console', baseVehicle: '-', coType: '신규개발', subParts: 10, coSubParts: 0, coCost: 0, newDevCost: 52.8 },
      { system: 'Door Trim', baseVehicle: '-', coType: '신규개발', subParts: 20, coSubParts: 0, coCost: 0, newDevCost: 98.6 },
      { system: 'Seat (Fr/Rr)', baseVehicle: '-', coType: '신규개발', subParts: 34, coSubParts: 0, coCost: 0, newDevCost: 256.2 },
      { system: 'HVAC / Air Vent', baseVehicle: '-', coType: '신규개발', subParts: 14, coSubParts: 0, coCost: 0, newDevCost: 88.4 },
      { system: 'Headliner', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 48.2 },
      { system: 'Pillar Trim', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 24.6 },
      { system: 'Steering Wheel', baseVehicle: '-', coType: '신규개발', subParts: 6, coSubParts: 0, coCost: 0, newDevCost: 34.8 },
      { system: 'Carpet / Floor', baseVehicle: '-', coType: '신규개발', subParts: 6, coSubParts: 0, coCost: 0, newDevCost: 28.4 },
      { system: 'Garnish / Molding', baseVehicle: '-', coType: '신규개발', subParts: 10, coSubParts: 0, coCost: 0, newDevCost: 18.6 },
    ],
  },
  {
    code: 'CT5i', name: 'CT5i (SUV-B)', stage: '양산', date: "'24.1", half: 'H1', type: '양산',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: '-', coType: '신규개발', subParts: 18, coSubParts: 0, coCost: 0, newDevCost: 132.5 },
      { system: 'Console', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 12, coSubParts: 5, coCost: 48.2, newDevCost: 62.4 },
      { system: 'Door Trim', baseVehicle: '-', coType: '신규개발', subParts: 24, coSubParts: 0, coCost: 0, newDevCost: 124.8 },
      { system: 'Seat (Fr/Rr)', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 38, coSubParts: 12, coCost: 242.6, newDevCost: 298.4 },
      { system: 'HVAC / Air Vent', baseVehicle: '-', coType: '신규개발', subParts: 16, coSubParts: 0, coCost: 0, newDevCost: 101.0 },
      { system: 'Headliner', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 52.6 },
      { system: 'Pillar Trim', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 28.6 },
      { system: 'Steering Wheel', baseVehicle: 'VN3', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 34.8, newDevCost: 38.2 },
      { system: 'Carpet / Floor', baseVehicle: '-', coType: '신규개발', subParts: 6, coSubParts: 0, coCost: 0, newDevCost: 32.6 },
      { system: 'Garnish / Molding', baseVehicle: '-', coType: '신규개발', subParts: 10, coSubParts: 0, coCost: 0, newDevCost: 21.8 },
    ],
  },
  {
    code: 'AZ7i', name: 'AZ7i (MPV-C)', stage: '양산', date: "'25.12", half: 'H1', type: '양산',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 12, coCost: 98.4, newDevCost: 138.2 },
      { system: 'Console', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 12, coSubParts: 8, coCost: 48.6, newDevCost: 68.4 },
      { system: 'Door Trim', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 24, coSubParts: 16, coCost: 92.4, newDevCost: 132.8 },
      { system: 'Seat (Fr/Rr)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 38, coSubParts: 24, coCost: 228.6, newDevCost: 312.4 },
      { system: 'HVAC / Air Vent', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 16, coSubParts: 16, coCost: 101.0, newDevCost: 108.2 },
      { system: 'Headliner', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 10, coSubParts: 6, coCost: 44.8, newDevCost: 62.4 },
      { system: 'Pillar Trim', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 8, coSubParts: 8, coCost: 28.6, newDevCost: 32.4 },
      { system: 'Steering Wheel', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 38.2, newDevCost: 42.6 },
      { system: 'Carpet / Floor', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 6, coSubParts: 4, coCost: 26.8, newDevCost: 36.2 },
      { system: 'Package Tray', baseVehicle: '-', coType: '신규개발', subParts: 4, coSubParts: 0, coCost: 0, newDevCost: 16.8 },
    ],
  },
  // ─── H2 개발차 (공용화 현황) ───
  {
    code: 'DX4i', name: 'DX4i (Crossover)', stage: 'ALL도', date: "'27.8", half: 'H2', type: '개발',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 13, coCost: 92.4, newDevCost: 135.6 },
      { system: 'Console', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 12, coSubParts: 12, coCost: 62.4, newDevCost: 72.8 },
      { system: 'Door Trim', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 24, coSubParts: 18, coCost: 96.4, newDevCost: 138.2 },
      { system: 'Seat (Fr/Rr)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 36, coSubParts: 22, coCost: 218.4, newDevCost: 308.6 },
      { system: 'HVAC / Air Vent', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 16, coSubParts: 16, coCost: 101.0, newDevCost: 112.4 },
      { system: 'Headliner', baseVehicle: 'AZ7i', coType: '1레벨 C/O', subParts: 10, coSubParts: 10, coCost: 62.4, newDevCost: 68.2 },
      { system: 'Pillar Trim', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 8, coSubParts: 8, coCost: 28.6, newDevCost: 34.8 },
      { system: 'Steering Wheel', baseVehicle: 'VN3', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 34.8, newDevCost: 42.2 },
      { system: 'Carpet / Floor', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 32.6, newDevCost: 38.4 },
      { system: 'Garnish / Molding', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 10, coSubParts: 7, coCost: 16.2, newDevCost: 24.6 },
    ],
  },
  {
    code: 'EV2i', name: 'EV2i (Electric SUV)', stage: '시작차', date: "'27.1", half: 'H2', type: '개발',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 20, coSubParts: 10, coCost: 108.4, newDevCost: 168.2 },
      { system: 'Console', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 14, coSubParts: 6, coCost: 52.6, newDevCost: 82.4 },
      { system: 'Door Trim', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 24, coSubParts: 14, coCost: 98.4, newDevCost: 148.6 },
      { system: 'Seat (Fr/Rr)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 40, coSubParts: 18, coCost: 248.6, newDevCost: 362.4 },
      { system: 'HVAC / Air Vent', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 10, coCost: 88.4, newDevCost: 128.6 },
      { system: 'Headliner', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 10, coSubParts: 6, coCost: 48.2, newDevCost: 72.4 },
      { system: 'Pillar Trim', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 8, coSubParts: 4, coCost: 22.4, newDevCost: 38.6 },
      { system: 'Steering Wheel', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 52.8 },
      { system: 'Carpet / Floor', baseVehicle: 'AZ7i', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 36.2, newDevCost: 42.4 },
      { system: 'Battery Cover', baseVehicle: '-', coType: '신규개발', subParts: 6, coSubParts: 0, coCost: 0, newDevCost: 48.6 },
    ],
  },
  {
    code: 'TX6i', name: 'TX6i (SUV-F)', stage: '시작차', date: "'26.10", half: 'H2', type: '개발',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 11, coCost: 96.8, newDevCost: 142.4 },
      { system: 'Console', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 12, coSubParts: 8, coCost: 48.6, newDevCost: 74.2 },
      { system: 'Door Trim', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 24, coSubParts: 15, coCost: 94.8, newDevCost: 142.6 },
      { system: 'Seat (Fr/Rr)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 38, coSubParts: 20, coCost: 232.4, newDevCost: 328.6 },
      { system: 'HVAC / Air Vent', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 16, coSubParts: 16, coCost: 101.0, newDevCost: 118.4 },
      { system: 'Headliner', baseVehicle: 'AZ7i', coType: '1레벨 C/O', subParts: 10, coSubParts: 10, coCost: 62.4, newDevCost: 72.8 },
      { system: 'Pillar Trim', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 8, coSubParts: 8, coCost: 28.6, newDevCost: 36.2 },
      { system: 'Steering Wheel', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 6, coSubParts: 4, coCost: 32.4, newDevCost: 44.8 },
      { system: 'Carpet / Floor', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 32.6, newDevCost: 38.4 },
      { system: 'Garnish / Molding', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 10, coSubParts: 6, coCost: 14.8, newDevCost: 24.2 },
    ],
  },
  // ─── NX8 (기존) ───
  {
    code: 'NX8', name: 'NX8 (MPV-G)', stage: '모델선정', date: "'28.8", half: 'H2', type: '개발',
    parts: [
      { system: 'IP (Crash Pad)', baseVehicle: 'CT5i', coType: '2레벨 부분 C/O', subParts: 18, coSubParts: 14, coCost: 88.9, newDevCost: 129.8 },
      { system: 'Console', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 12, coSubParts: 8, coCost: 43.6, newDevCost: 66.9 },
      { system: 'Door Trim (Fr)', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 14, coSubParts: 10, coCost: 48.8, newDevCost: 72.8 },
      { system: 'Door Trim (Rr)', baseVehicle: 'AZ7i', coType: '1레벨 C/O', subParts: 10, coSubParts: 10, coCost: 36.8, newDevCost: 52.1 },
      { system: 'Seat (Fr)', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 22, coSubParts: 22, coCost: 151.9, newDevCost: 205.8 },
      { system: 'Seat (Rr)', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 15, coSubParts: 11, coCost: 61.2, newDevCost: 83.8 },
      { system: 'HVAC / Air Vent', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 16, coSubParts: 16, coCost: 67.0, newDevCost: 101.0 },
      { system: 'Headliner', baseVehicle: 'AZ7i', coType: '2레벨 부분 C/O', subParts: 8, coSubParts: 6, coCost: 40.4, newDevCost: 58.1 },
      { system: 'Pillar Trim', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 8, coSubParts: 8, coCost: 18.8, newDevCost: 28.6 },
      { system: 'Package Tray', baseVehicle: 'AZ7i', coType: '1레벨 C/O', subParts: 4, coSubParts: 4, coCost: 11.2, newDevCost: 16.8 },
      { system: 'Carpet / Floor', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 6, coSubParts: 6, coCost: 22.4, newDevCost: 32.6 },
      { system: 'Steering Wheel', baseVehicle: 'VN3', coType: '2레벨 부분 C/O', subParts: 6, coSubParts: 4, coCost: 28.5, newDevCost: 38.2 },
      { system: 'Sunroof (PGS)', baseVehicle: '-', coType: '신규개발', subParts: 8, coSubParts: 0, coCost: 0, newDevCost: 64.5 },
      { system: 'Garnish / Molding', baseVehicle: 'CT5i', coType: '1레벨 C/O', subParts: 10, coSubParts: 10, coCost: 14.6, newDevCost: 21.8 },
    ],
  },
]

// 차종 간 공용화 관계 매트릭스 (개발차 → 양산차 C/O 비율)
const allCodes = vehicles.map(v => v.code)
const matrixData: Record<string, Record<string, number>> = {}
for (const v of vehicles) {
  matrixData[v.code] = {}
  const totalSub = v.parts.reduce((s, p) => s + p.subParts, 0)
  for (const base of allCodes) {
    const coSub = v.parts.filter(p => p.baseVehicle === base).reduce((s, p) => s + p.coSubParts, 0)
    matrixData[v.code][base] = totalSub > 0 ? Math.round((coSub / totalSub) * 100) : 0
  }
}

// 차종별 합계 계산 유틸
function getVehicleTotals(parts: MasterPart[]) {
  const totalSystems = parts.length
  const totalSubParts = parts.reduce((s, p) => s + p.subParts, 0)
  const totalCoSubParts = parts.reduce((s, p) => s + p.coSubParts, 0)
  const totalCoCost = parts.reduce((s, p) => s + p.coCost, 0)
  const totalNewDevCost = parts.reduce((s, p) => s + p.newDevCost, 0)
  const totalEffect = totalNewDevCost - totalCoCost
  const coRate = totalSubParts > 0 ? Math.round((totalCoSubParts / totalSubParts) * 100) : 0
  return { totalSystems, totalSubParts, totalCoSubParts, totalCoCost, totalNewDevCost, totalEffect, coRate }
}

/* ─── Components ─── */
function StatCard({ icon: Icon, label, value, change, positive, suffix = '' }: {
  icon: typeof TrendingUp; label: string; value: string; change: string; positive: boolean; suffix?: string
}) {
  return (
    <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-[12px] bg-primary-dim flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
        <span className={`text-sm font-medium flex items-center gap-1 ${positive ? 'text-success' : 'text-danger'}`}>
          {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </span>
      </div>
      <div>
        <p className="text-text-muted text-sm">{label}</p>
        <p className="text-2xl font-bold tracking-tight mt-1">{value}{suffix}</p>
      </div>
    </div>
  )
}

function SidebarItem({ icon: Icon, label, active = false, onClick }: {
  icon: typeof LayoutDashboard; label: string; active?: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-button)] text-sm font-medium transition-colors cursor-pointer
        ${active
          ? 'bg-primary text-white'
          : 'text-text-muted hover:bg-secondary hover:text-text'
        }`}
    >
      <Icon size={18} />
      {label}
    </button>
  )
}

function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="h-2 bg-secondary rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/* ─── Status Badge ─── */
function CoTypeBadge({ type }: { type: CoType }) {
  const config = {
    '1레벨 C/O': { icon: CheckCircle2, bg: 'bg-success-dim', text: 'text-success', label: '1레벨 통째 C/O' },
    '2레벨 부분 C/O': { icon: CircleDot, bg: 'bg-[#DBEAFE]', text: 'text-primary', label: '2레벨 부분 C/O' },
    '신규개발': { icon: CirclePlus, bg: 'bg-secondary', text: 'text-text-muted', label: '신규개발' },
  }[type]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon size={12} />
      {config.label}
    </span>
  )
}

/* ─── Projects View (차종별 부품 공용화 마스터리스트) ─── */
function ProjectsView() {
  const [selectedVehicle, setSelectedVehicle] = useState('NX8')
  const [filterType, setFilterType] = useState<CoType | 'all'>('all')

  const vehicle = vehicles.find(v => v.code === selectedVehicle)!
  const totals = getVehicleTotals(vehicle.parts)
  const filtered = filterType === 'all' ? vehicle.parts : vehicle.parts.filter(p => p.coType === filterType)
  const filteredCoCost = filtered.reduce((s, p) => s + p.coCost, 0)
  const filteredNewCost = filtered.reduce((s, p) => s + p.newDevCost, 0)
  const filteredEffect = filteredNewCost - filteredCoCost

  const h1 = vehicles.filter(v => v.half === 'H1')
  const h2 = vehicles.filter(v => v.half === 'H2')

  // 선택된 차종의 시스템별 차트 데이터
  const chartData = vehicle.parts.map(p => ({
    name: p.system.length > 10 ? p.system.slice(0, 10) + '…' : p.system,
    fullName: p.system,
    coCost: p.coCost,
    newDevCost: p.newDevCost,
  }))

  // 선택된 차종의 공용화 구분 파이
  const coTypePie = [
    { name: '1레벨 통째 C/O', value: vehicle.parts.filter(p => p.coType === '1레벨 C/O').length, color: '#3182F6' },
    { name: '2레벨 부분 C/O', value: vehicle.parts.filter(p => p.coType === '2레벨 부분 C/O').length, color: '#93C5FD' },
    { name: '신규개발', value: vehicle.parts.filter(p => p.coType === '신규개발').length, color: '#E5E7EB' },
  ]

  return (
    <>
      {/* Vehicle Tabs */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 mb-6">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-text-subtle mb-2 font-medium">H1 양산차 (베이스 DB 구축)</p>
            <div className="flex gap-2">
              {h1.map(v => (
                <button
                  key={v.code}
                  onClick={() => { setSelectedVehicle(v.code); setFilterType('all') }}
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
            <p className="text-xs text-text-subtle mb-2 font-medium">H2 개발차 (공용화 현황 분석)</p>
            <div className="flex gap-2">
              {h2.map(v => (
                <button
                  key={v.code}
                  onClick={() => { setSelectedVehicle(v.code); setFilterType('all') }}
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
          <p className="text-text-muted text-sm">1레벨 시스템 수</p>
          <p className="text-2xl font-bold mt-1">{totals.totalSystems}<span className="text-base font-normal text-text-muted ml-1">개</span></p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-text-muted text-sm">2레벨 부품 공용화율</p>
          <p className="text-2xl font-bold mt-1">{totals.coRate}<span className="text-base font-normal text-text-muted ml-1">%</span></p>
          <p className="text-xs text-text-subtle mt-1">{totals.totalCoSubParts} / {totals.totalSubParts} parts</p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-text-muted text-sm">공용화 포함 재료비 (1대분)</p>
          <p className="text-2xl font-bold mt-1">${totals.totalCoCost.toFixed(1)}</p>
        </div>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <p className="text-text-muted text-sm">공용화 효과 합계</p>
          <p className="text-2xl font-bold text-success mt-1">${totals.totalEffect.toFixed(1)}</p>
          <p className="text-xs text-text-subtle mt-1">신규 ${totals.totalNewDevCost.toFixed(1)} − C/O ${totals.totalCoCost.toFixed(1)}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="col-span-2 bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">{vehicle.code} 시스템별 재료비 비교</h3>
          <p className="text-sm text-text-muted mb-4">공용화 포함 vs 신규개발 ($/대)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barGap={2} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} angle={-25} textAnchor="end" height={48} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(value: number, name: string) => [`$${value.toFixed(1)}`, name === 'coCost' ? '공용화 포함' : '신규개발']}
              />
              <Bar dataKey="coCost" name="공용화 포함" fill="#3182F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="newDevCost" name="신규개발" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">공용화 구분 (1레벨)</h3>
          <p className="text-sm text-text-muted mb-4">{vehicle.code} 시스템 수 기준</p>
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
                <span className="font-medium">{item.value}개</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-Vehicle Matrix */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 mb-8">
        <h3 className="text-base font-bold mb-1">차종 간 C/O 관계 매트릭스</h3>
        <p className="text-sm text-text-muted mb-4">개발차 → 베이스 차종 2레벨 부품 공용화율 (%)</p>
        <div className="overflow-x-auto">
          <table className="text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-text-muted border-b border-border">개발차 ↓ / 베이스 →</th>
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-base font-bold">{vehicle.code} 1레벨 마스터리스트</h3>
            <p className="text-sm text-text-muted mt-0.5">{vehicle.name} ({vehicle.date}, {vehicle.stage}) | BOM 기반 C/O 확인</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-text-subtle" />
              {(['all', '1레벨 C/O', '2레벨 부분 C/O', '신규개발'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                    filterType === type ? 'bg-primary text-white' : 'bg-secondary text-text-muted hover:bg-secondary-hover'
                  }`}
                >{type === 'all' ? '전체' : type}</button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-sm text-text-muted bg-secondary px-3 py-1.5 rounded-[var(--radius-button)] hover:bg-secondary-hover transition-colors">
              <Download size={14} /> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#FAFBFC]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted">No.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">1레벨 시스템</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">베이스 차종</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">공용화 구분</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-text-muted">2레벨 부품</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted">공용화 포함 ($/대)</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted">신규개발 시 ($/대)</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-text-muted">공용화 효과 ($)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((part, i) => {
                const effect = part.newDevCost - part.coCost
                return (
                  <tr key={i} className="border-b border-border last:border-b-0 hover:bg-[#FAFBFC] transition-colors">
                    <td className="px-6 py-3 text-text-subtle">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{part.system}</td>
                    <td className="px-4 py-3">
                      {part.baseVehicle === '-' ? (
                        <span className="text-text-subtle">—</span>
                      ) : (
                        <span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">{part.baseVehicle}</span>
                      )}
                    </td>
                    <td className="px-4 py-3"><CoTypeBadge type={part.coType} /></td>
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
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#FAFBFC] border-t-2 border-border">
                <td className="px-6 py-4" colSpan={2}>
                  <span className="font-bold">합계 (1대분)</span>
                  <span className="text-text-muted text-xs ml-2">({filtered.length}개 시스템)</span>
                </td>
                <td className="px-4 py-4" /><td className="px-4 py-4" />
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

/* ─── Dashboard View ─── */
function DashboardView() {
  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard icon={Target} label="C/O Effect (NX8)" value="$412" change="+22.6%" positive={true} />
        <StatCard icon={Wrench} label="Pre-SR 절감" value="$581" change="+21.8%" positive={true} />
        <StatCard icon={FolderKanban} label="Active Projects" value="5" change="+2" positive={true} suffix="건" />
        <StatCard icon={Calendar} label="일정 준수율" value="94" change="-1.2%" positive={false} suffix="%" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Area Chart */}
        <div className="col-span-2 bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold">C/O 절감 추이</h3>
              <p className="text-sm text-text-muted mt-0.5">월별 실적 vs 목표 ($)</p>
            </div>
            <button className="flex items-center gap-1.5 text-sm text-text-muted bg-secondary px-3 py-1.5 rounded-[var(--radius-button)] hover:bg-secondary-hover transition-colors">
              최근 8개월 <ChevronDown size={14} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData}>
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

        {/* Pie Chart */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">C/O 구성 비율</h3>
          <p className="text-sm text-text-muted mb-4">전체 부품 기준</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {pieData.map((item, i) => (
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
        {/* Bar Chart */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">차종별 C/O Rate</h3>
          <p className="text-sm text-text-muted mb-4">%</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={coData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB' }} />
              <Bar dataKey="rate" fill="#3182F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Projects Table */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold">Active Projects</h3>
            <button className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {projects.map((p, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{p.code}</span>
                    <span className="text-xs text-text-subtle bg-secondary px-2 py-0.5 rounded-full">
                      {p.date} {p.stage}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-text-muted">{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} />
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-4">Recent Activity</h3>
          <div className="flex flex-col gap-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{item.action}</p>
                  <p className="text-xs text-text-subtle mt-0.5">{item.user} &middot; {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Page titles ─── */
const pageTitles: Record<string, { title: string; sub: string }> = {
  dashboard: { title: 'Dashboard', sub: '2026년 2월 16일 (일)' },
  projects: { title: '부품 공용화 마스터리스트', sub: "H1 양산차 DB 구축 → H2 개발차 C/O 분석 | 차종 간 관계 매트릭스" },
  analytics: { title: 'Analytics', sub: '준비 중' },
  team: { title: 'Team', sub: '준비 중' },
  settings: { title: 'Settings', sub: '준비 중' },
}

/* ─── App ─── */
export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const page = pageTitles[activeNav] || pageTitles.dashboard

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'projects', icon: FolderKanban, label: 'C/O 마스터리스트' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-surface border-r border-border flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded-[10px] flex items-center justify-center">
            <Car size={16} className="text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">AutoDev R&D</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(item => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.id}
              onClick={() => setActiveNav(item.id)}
            />
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-primary-dim rounded-full flex items-center justify-center text-sm font-bold text-primary">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">J. Park</p>
              <p className="text-xs text-text-subtle truncate">Interior Design</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-lg font-bold tracking-tight">{page.title}</h1>
            <p className="text-xs text-text-subtle">{page.sub}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-56 pl-9 pr-4 rounded-[var(--radius-button)] bg-secondary border-none text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="relative w-9 h-9 rounded-[var(--radius-button)] bg-secondary flex items-center justify-center hover:bg-secondary-hover transition-colors">
              <Bell size={16} className="text-text-muted" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeNav === 'dashboard' && <DashboardView />}
          {activeNav === 'projects' && <ProjectsView />}
          {activeNav !== 'dashboard' && activeNav !== 'projects' && (
            <div className="flex items-center justify-center h-64 text-text-muted">
              준비 중입니다
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
