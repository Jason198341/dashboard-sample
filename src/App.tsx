import { useState, useCallback } from 'react'
import { LayoutDashboard, FolderKanban, GitBranch, BarChart3, ClipboardEdit, Settings } from 'lucide-react'

import type { PageId, NavItem, SearchResult } from '@/types'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { SearchModal } from '@/components/search/SearchModal'
import { DashboardView } from '@/views/DashboardView'
import { ProjectsView } from '@/views/ProjectsView'
import { OpportunityView } from '@/views/OpportunityView'
import { AnalyticsView } from '@/views/AnalyticsView'
import { DataEntryView } from '@/views/DataEntryView'
import { SettingsView } from '@/views/SettingsView'

const navItems: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'projects', icon: FolderKanban, label: 'C/O 마스터리스트' },
  { id: 'opportunity', icon: GitBranch, label: 'Part Traceability' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'data-entry', icon: ClipboardEdit, label: '데이터 입력' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

function getTodayString(): string {
  const d = new Date()
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
}

const pageTitles: Record<PageId, { title: string; sub: string | (() => string) }> = {
  dashboard: { title: 'Dashboard', sub: getTodayString },
  projects: { title: '부품 공용화 마스터리스트', sub: 'H1 양산차 DB 구축 → H2 개발차 C/O 분석 | 차종 간 관계 매트릭스' },
  opportunity: { title: 'Part Traceability', sub: '부품 공용화 추적 | 원본차종→적용차종 C/O 흐름 · 시스템별 부품 상세 · 타 차종 비교' },
  analytics: { title: 'Analytics', sub: '비C/O 사유 Pareto 분석 | 카테고리별 건수·비용·누적비율' },
  'data-entry': { title: '데이터 입력', sub: '차종 등록 · 부품 등록 · 비C/O 사유 입력' },
  settings: { title: 'Settings', sub: '데이터 관리 · 백업 · 시스템 정보' },
}

export default function App() {
  const [activeNav, setActiveNav] = useState<PageId>('dashboard')
  const [searchOpen, setSearchOpen] = useState(false)
  const [initialVehicle, setInitialVehicle] = useState<string | undefined>()

  const pageConfig = pageTitles[activeNav]
  const subtitle = typeof pageConfig.sub === 'function' ? pageConfig.sub() : pageConfig.sub

  const toggleSearch = useCallback(() => setSearchOpen(prev => !prev), [])

  function handleSearchSelect(result: SearchResult) {
    setInitialVehicle(result.vehicleCode)
    setActiveNav('projects')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar navItems={navItems} activeNav={activeNav} onNavigate={setActiveNav} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageConfig.title} subtitle={subtitle} onSearchClick={toggleSearch} />

        <div className="flex-1 overflow-y-auto p-8">
          {activeNav === 'dashboard' && <DashboardView />}
          {activeNav === 'projects' && <ProjectsView initialVehicle={initialVehicle} />}
          {activeNav === 'opportunity' && <OpportunityView />}
          {activeNav === 'analytics' && <AnalyticsView />}
          {activeNav === 'data-entry' && <DataEntryView />}
          {activeNav === 'settings' && <SettingsView />}
        </div>
      </main>

      <SearchModal open={searchOpen} onClose={toggleSearch} onSelect={handleSearchSelect} />
    </div>
  )
}
