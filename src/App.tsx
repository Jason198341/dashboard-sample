import { useState, useCallback } from 'react'
import { LayoutDashboard, FolderKanban, GitBranch, BarChart3, ClipboardEdit, Settings } from 'lucide-react'

import type { PageId, NavItem, SearchResult } from '@/types'
import { LangProvider, useLang } from '@/lib/i18n'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { SearchModal } from '@/components/search/SearchModal'
import { DashboardView } from '@/views/DashboardView'
import { ProjectsView } from '@/views/ProjectsView'
import { OpportunityView } from '@/views/OpportunityView'
import { AnalyticsView } from '@/views/AnalyticsView'
import { DataEntryView } from '@/views/DataEntryView'
import { SettingsView } from '@/views/SettingsView'

const NAV_ICONS: Record<PageId, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  projects: FolderKanban,
  opportunity: GitBranch,
  analytics: BarChart3,
  'data-entry': ClipboardEdit,
  settings: Settings,
}

const NAV_LABEL_KEYS: Record<PageId, string> = {
  dashboard: 'nav.dashboard',
  projects: 'nav.masterlist',
  opportunity: 'nav.traceability',
  analytics: 'nav.analytics',
  'data-entry': 'nav.data-entry',
  settings: 'nav.settings',
}

const PAGE_IDS: PageId[] = ['dashboard', 'projects', 'opportunity', 'analytics', 'data-entry', 'settings']

const PAGE_TITLE_KEYS: Record<PageId, { title: string; sub: string }> = {
  dashboard: { title: 'nav.dashboard', sub: '' },
  projects: { title: 'page.masterlist.title', sub: 'page.masterlist.sub' },
  opportunity: { title: 'nav.traceability', sub: 'page.traceability.sub' },
  analytics: { title: 'nav.analytics', sub: 'page.analytics.sub' },
  'data-entry': { title: 'page.data-entry.title', sub: 'page.data-entry.sub' },
  settings: { title: 'nav.settings', sub: 'page.settings.sub' },
}

function AppContent() {
  const { t, lang } = useLang()
  const [activeNav, setActiveNav] = useState<PageId>('dashboard')
  const [searchOpen, setSearchOpen] = useState(false)
  const [initialVehicle, setInitialVehicle] = useState<string | undefined>()

  const navItems: NavItem[] = PAGE_IDS.map(id => ({
    id,
    icon: NAV_ICONS[id],
    label: t(NAV_LABEL_KEYS[id]),
  }))

  const pageCfg = PAGE_TITLE_KEYS[activeNav]
  const title = t(pageCfg.title)

  let subtitle: string
  if (activeNav === 'dashboard') {
    const d = new Date()
    if (lang === 'ko') {
      const days = ['일', '월', '화', '수', '목', '금', '토']
      subtitle = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
    } else {
      subtitle = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
  } else {
    subtitle = t(pageCfg.sub)
  }

  const toggleSearch = useCallback(() => setSearchOpen(prev => !prev), [])

  function handleSearchSelect(result: SearchResult) {
    setInitialVehicle(result.vehicleCode)
    setActiveNav('projects')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar navItems={navItems} activeNav={activeNav} onNavigate={setActiveNav} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} subtitle={subtitle} onSearchClick={toggleSearch} />

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

export default function App() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  )
}
