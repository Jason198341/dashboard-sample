import { useState } from 'react'
import { Database, Download, Upload, Trash2, HardDrive, AlertTriangle, Check, Info } from 'lucide-react'
import { getMergedVehicles } from '@/lib/storage'

const STORAGE_KEYS = {
  vehicles: 'ds_added_vehicles',
  parts: 'ds_added_parts',
  reasons: 'ds_added_reasons',
}

function countEntries(key: string): number {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]').length }
  catch { return 0 }
}

function getAllUserData() {
  const data: Record<string, unknown[]> = {}
  for (const [name, key] of Object.entries(STORAGE_KEYS)) {
    try { data[name] = JSON.parse(localStorage.getItem(key) ?? '[]') }
    catch { data[name] = [] }
  }
  return data
}

export function SettingsView() {
  const [toast, setToast] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const vehicles = getMergedVehicles()
  const userVehicles = countEntries(STORAGE_KEYS.vehicles)
  const userParts = countEntries(STORAGE_KEYS.parts)
  const userReasons = countEntries(STORAGE_KEYS.reasons)
  const totalUserEntries = userVehicles + userParts + userReasons

  const allParts = vehicles.flatMap(v => v.parts)
  const allSubParts = allParts.reduce((s, p) => s + p.subParts, 0)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleExport() {
    const data = getAllUserData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `co-dashboard-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('백업 파일이 다운로드되었습니다')
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        for (const [name, key] of Object.entries(STORAGE_KEYS)) {
          if (Array.isArray(data[name])) {
            const existing = JSON.parse(localStorage.getItem(key) ?? '[]')
            const merged = [...data[name], ...existing]
            localStorage.setItem(key, JSON.stringify(merged))
          }
        }
        showToast('데이터가 성공적으로 복원되었습니다. 새로고침 해주세요.')
      } catch {
        showToast('잘못된 백업 파일입니다')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleClearData() {
    for (const key of Object.values(STORAGE_KEYS)) {
      localStorage.removeItem(key)
    }
    setConfirmClear(false)
    showToast('사용자 추가 데이터가 초기화되었습니다. 새로고침 해주세요.')
  }

  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Data Statistics */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Database size={20} className="text-primary" />
            <h3 className="text-base font-bold">데이터 현황</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Seed data */}
            <div>
              <p className="text-sm font-medium text-text-muted mb-3">시드 데이터 (내장)</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm">차종</span>
                  <span className="text-sm font-bold">{vehicles.length - userVehicles}대</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm">1레벨 시스템</span>
                  <span className="text-sm font-bold">{allParts.length - userParts}건</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm">2레벨 부품</span>
                  <span className="text-sm font-bold">{allSubParts}개</span>
                </div>
              </div>
            </div>

            {/* User data */}
            <div>
              <p className="text-sm font-medium text-text-muted mb-3">사용자 추가 데이터</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm">추가 차종</span>
                  <span className="text-sm font-bold text-primary">{userVehicles}대</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm">추가 시스템</span>
                  <span className="text-sm font-bold text-primary">{userParts}건</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm">추가 비C/O 사유</span>
                  <span className="text-sm font-bold text-primary">{userReasons}건</span>
                </div>
              </div>
            </div>
          </div>

          {/* Storage usage */}
          <div className="mt-6 p-4 bg-secondary rounded-[var(--radius-button)]">
            <div className="flex items-center gap-2">
              <HardDrive size={14} className="text-text-muted" />
              <span className="text-xs text-text-muted">
                localStorage 사용량: ~{Math.round(
                  Object.values(STORAGE_KEYS).reduce((s, key) => s + (localStorage.getItem(key)?.length ?? 0), 0) / 1024
                )}KB
              </span>
            </div>
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center gap-2 mb-2">
            <Download size={20} className="text-primary" />
            <h3 className="text-base font-bold">백업 & 복원</h3>
          </div>
          <p className="text-sm text-text-muted mb-6">
            사용자가 추가한 데이터를 JSON 파일로 백업/복원합니다. 시드 데이터는 항상 포함됩니다.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleExport}
              disabled={totalUserEntries === 0}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-[var(--radius-button)] text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              JSON 백업 다운로드
            </button>

            <label className="flex items-center justify-center gap-2 px-5 py-3 bg-secondary text-text rounded-[var(--radius-button)] text-sm font-medium hover:bg-secondary-hover transition-colors cursor-pointer border border-border">
              <Upload size={16} />
              백업 파일 복원
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-danger/30 p-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={20} className="text-danger" />
            <h3 className="text-base font-bold text-danger">초기화</h3>
          </div>
          <p className="text-sm text-text-muted mb-4">
            사용자가 추가한 데이터(차종, 부품, 사유)를 모두 삭제합니다. 시드 데이터는 유지됩니다.
          </p>

          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              disabled={totalUserEntries === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-danger/10 text-danger rounded-[var(--radius-button)] text-sm font-medium hover:bg-danger/20 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              사용자 데이터 초기화 ({totalUserEntries}건)
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-danger font-medium">정말 삭제하시겠습니까?</span>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-danger text-white rounded-[var(--radius-button)] text-sm font-medium hover:bg-danger/90 transition-colors cursor-pointer"
              >
                삭제 확인
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="px-4 py-2 bg-secondary text-text-muted rounded-[var(--radius-button)] text-sm font-medium hover:bg-secondary-hover transition-colors cursor-pointer"
              >
                취소
              </button>
            </div>
          )}
        </div>

        {/* System Info */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info size={20} className="text-primary" />
            <h3 className="text-base font-bold">시스템 정보</h3>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between py-1.5">
              <span className="text-text-muted">버전</span>
              <span className="font-mono text-text-subtle">v1.0.0 (Phase 1)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-text-muted">데이터 저장</span>
              <span className="font-mono text-text-subtle">localStorage</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-text-muted">스택</span>
              <span className="font-mono text-text-subtle">React 19 + Vite 7 + Tailwind v4</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-text-muted">Phase 2 예정</span>
              <span className="text-text-subtle">Supabase 멀티유저, 로그인, 감사로그</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-success text-white px-5 py-3 rounded-[var(--radius-card)] shadow-lg">
          <Check size={18} />
          <span className="text-sm font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-white/70 hover:text-white cursor-pointer">✕</button>
        </div>
      )}
    </>
  )
}
