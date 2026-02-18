import { useState, useRef, useCallback } from 'react'
import { Plus, Trash2, Check, Car, Package, FileText, FileSpreadsheet, Download, Upload, AlertTriangle, ChevronRight, ArrowLeft } from 'lucide-react'

import type { CoType, ReasonCategory, CoPossibility, SubPart } from '@/types'
import { getMergedVehicles } from '@/lib/storage'
import { downloadTemplate, parseExcelFile } from '@/lib/excel'
import type { ParsedExcel } from '@/lib/excel'
import { useLang } from '@/lib/i18n'

/* ─── Constants ─── */

type EntryTab = 'vehicle' | 'part' | 'reason' | 'excel'

const TAB_IDS: { id: EntryTab; labelKey: string; icon: typeof Car }[] = [
  { id: 'vehicle', labelKey: 'entry.tab.vehicle', icon: Car },
  { id: 'part', labelKey: 'entry.tab.part', icon: Package },
  { id: 'reason', labelKey: 'entry.tab.reason', icon: FileText },
  { id: 'excel', labelKey: 'entry.tab.excel', icon: FileSpreadsheet },
]

const STAGES = ['Pre-SOP', 'SOP', '양산']
const HALVES = ['H1', 'H2'] as const
const VTYPES = ['양산', '개발'] as const
const CO_TYPES: CoType[] = ['1레벨 C/O', '2레벨 부분 C/O', '신규개발']
const CATEGORIES: ReasonCategory[] = ['디자인', '사양변경', '법규', '신규사양', '형상차이', '성능']
const POSSIBILITIES: CoPossibility[] = ['high', 'medium', 'low', 'none']
const REGIONS = ['한국', '인도', '중국', '일본', '독일', '미국', '기타']

/* ─── Translation lookup maps (data value → dict key) ─── */

const REGION_KEYS: Record<string, string> = {
  '한국': 'region.korea', '인도': 'region.india', '중국': 'region.china',
  '일본': 'region.japan', '독일': 'region.germany', '미국': 'region.usa', '기타': 'region.other',
}

const CO_TYPE_KEYS: Record<string, string> = {
  '1레벨 C/O': 'cotype.1level', '2레벨 부분 C/O': 'cotype.2level', '신규개발': 'cotype.new',
}

const REASON_KEYS: Record<string, string> = {
  '디자인': 'reason.design', '사양변경': 'reason.spec-change', '법규': 'reason.regulation',
  '신규사양': 'reason.new-spec', '형상차이': 'reason.shape-diff', '성능': 'reason.performance',
}

const VTYPE_KEYS: Record<string, string> = {
  '양산': 'entry.vehicle.vtype.mass', '개발': 'entry.vehicle.vtype.dev',
}

const POSS_KEYS: Record<string, string> = {
  high: 'poss.high', medium: 'poss.medium', low: 'poss.low', none: 'poss.none',
}

const POSS_DESC_KEYS: Record<string, string> = {
  high: 'poss.high.desc', medium: 'poss.medium.desc', low: 'poss.low.desc', none: 'poss.none.desc',
}

const STORAGE = {
  vehicles: 'ds_added_vehicles',
  parts: 'ds_added_parts',
  reasons: 'ds_added_reasons',
}

/* ─── Helpers ─── */

function loadEntries<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') }
  catch { return [] }
}

function saveEntry<T>(key: string, entry: T) {
  const arr = loadEntries<T>(key)
  arr.unshift(entry)
  localStorage.setItem(key, JSON.stringify(arr))
}

/* ─── Reusable UI ─── */

const inputCls = 'w-full h-10 px-3 rounded-[var(--radius-button)] bg-secondary border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow'
const selectCls = inputCls + ' cursor-pointer'
const textareaCls = 'w-full px-3 py-2.5 rounded-[var(--radius-button)] bg-secondary border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow resize-none min-h-[80px]'

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-muted">
        {label}{required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-success text-white px-5 py-3 rounded-[var(--radius-card)] shadow-lg animate-[slideUp_0.3s_ease-out]">
      <Check size={18} />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/70 hover:text-white cursor-pointer">✕</button>
    </div>
  )
}

/* ─── Sub-Part Row ─── */

interface SubPartRow {
  partName: string; partNo: string; isCo: boolean
  coSource: string; supplier: string; supplierRegion: string; materialCost: number
}

function emptyRow(): SubPartRow {
  return { partName: '', partNo: '', isCo: true, coSource: '', supplier: '', supplierRegion: '한국', materialCost: 0 }
}

/* ─── Main Component ─── */

export function DataEntryView() {
  const { t } = useLang()
  const [tab, setTab] = useState<EntryTab>('vehicle')
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <>
      {/* Tab bar */}
      <div className="flex gap-2 mb-8">
        {TAB_IDS.map(tb => {
          const Icon = tb.icon
          return (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-button)] text-sm font-medium transition-colors cursor-pointer
                ${tab === tb.id ? 'bg-primary text-white' : 'bg-surface border border-border text-text-muted hover:bg-secondary'}`}
            >
              <Icon size={16} />
              {t(tb.labelKey)}
            </button>
          )
        })}
      </div>

      {tab === 'vehicle' && <VehicleForm onSuccess={showToast} />}
      {tab === 'part' && <PartForm onSuccess={showToast} />}
      {tab === 'reason' && <ReasonForm onSuccess={showToast} />}
      {tab === 'excel' && <ExcelUpload onSuccess={showToast} />}

      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}

/* ═══════════════════════════════════════════════
   Tab 1: Vehicle Registration
   ═══════════════════════════════════════════════ */

function VehicleForm({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const { t, lang } = useLang()
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [stage, setStage] = useState('Pre-SOP')
  const [date, setDate] = useState('')
  const [half, setHalf] = useState<'H1' | 'H2'>('H2')
  const [vtype, setVtype] = useState<'양산' | '개발'>('개발')

  const recent = loadEntries<{ code: string; name: string; date: string }>(STORAGE.vehicles)

  const stageLabel = (s: string) => s === '양산' ? t('entry.vehicle.vtype.mass') : s

  function handleSubmit() {
    if (!code.trim() || !name.trim()) return
    saveEntry(STORAGE.vehicles, {
      code: code.trim(), name: name.trim(), stage, date: date.trim(),
      half, type: vtype, parts: [], createdAt: new Date().toISOString(),
    })
    onSuccess(`${code} ${t('entry.vehicle.toast')}`)
    setCode(''); setName(''); setDate('')
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Form */}
      <div className="col-span-2 bg-surface rounded-[var(--radius-card)] border border-border p-6">
        <h3 className="text-base font-bold mb-1">{t('entry.vehicle.title')}</h3>
        <p className="text-sm text-text-muted mb-6">{t('entry.vehicle.desc')}</p>

        <div className="grid grid-cols-2 gap-5">
          <Field label={t('entry.vehicle.code')} required>
            <input className={inputCls} placeholder={lang === 'ko' ? '예: MY9' : 'e.g.: MY9'} value={code} onChange={e => setCode(e.target.value)} />
          </Field>
          <Field label={t('entry.vehicle.name')} required>
            <input className={inputCls} placeholder={lang === 'ko' ? '예: MY9 Compact SUV' : 'e.g.: MY9 Compact SUV'} value={name} onChange={e => setName(e.target.value)} />
          </Field>
          <Field label={t('entry.vehicle.stage')}>
            <select className={selectCls} value={stage} onChange={e => setStage(e.target.value)}>
              {STAGES.map(s => <option key={s} value={s}>{stageLabel(s)}</option>)}
            </select>
          </Field>
          <Field label={t('entry.vehicle.sop')}>
            <input className={inputCls} placeholder={lang === 'ko' ? '예: 26.09' : 'e.g.: 26.09'} value={date} onChange={e => setDate(e.target.value)} />
          </Field>
          <Field label={t('entry.vehicle.half')}>
            <select className={selectCls} value={half} onChange={e => setHalf(e.target.value as 'H1' | 'H2')}>
              {HALVES.map(h => <option key={h}>{h}</option>)}
            </select>
          </Field>
          <Field label={t('entry.vehicle.vtype')}>
            <select className={selectCls} value={vtype} onChange={e => setVtype(e.target.value as '양산' | '개발')}>
              {VTYPES.map(v => <option key={v} value={v}>{t(VTYPE_KEYS[v])}</option>)}
            </select>
          </Field>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!code.trim() || !name.trim()}
          className="mt-6 px-6 py-2.5 bg-primary text-white rounded-[var(--radius-button)] text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('entry.vehicle.submit')}
        </button>
      </div>

      {/* Recent entries */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
        <h3 className="text-base font-bold mb-4">{t('entry.vehicle.recent')}</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-text-muted">{t('entry.vehicle.empty')}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.slice(0, 8).map((v, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <span className="text-sm font-bold">{v.code}</span>
                  <span className="text-xs text-text-muted ml-2">{v.name}</span>
                </div>
                <span className="text-xs text-text-subtle">{v.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Tab 2: Part Registration (2-Step Wizard)
   Step 1 → L1 System Definition
   Step 2 → L2 Sub-Part Registration
   ═══════════════════════════════════════════════ */

function PartForm({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const { t, lang } = useLang()
  const vehicles = getMergedVehicles()
  const [step, setStep] = useState<1 | 2>(1)

  // Step 1: L1 system info
  const [vehicleCode, setVehicleCode] = useState(vehicles[0]?.code ?? '')
  const [system, setSystem] = useState('')
  const [baseVehicle, setBaseVehicle] = useState('')
  const [coType, setCoType] = useState<CoType>('2레벨 부분 C/O')

  // Step 2: L2 part list
  const [subParts, setSubParts] = useState<SubPartRow[]>([emptyRow()])

  function addRow() { setSubParts(prev => [...prev, emptyRow()]) }
  function removeRow(idx: number) { setSubParts(prev => prev.filter((_, i) => i !== idx)) }
  function updateRow(idx: number, field: keyof SubPartRow, value: string | number | boolean) {
    setSubParts(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }

  const canProceed = system.trim() && baseVehicle.trim()
  const selectedVehicle = vehicles.find(v => v.code === vehicleCode)

  const coTypeDesc = (ct: CoType) => {
    const m: Record<CoType, string> = {
      '1레벨 C/O': t('entry.part.coType.full'),
      '2레벨 부분 C/O': t('entry.part.coType.partial'),
      '신규개발': t('entry.part.coType.new'),
    }
    return m[ct]
  }

  function handleSubmit() {
    if (!canProceed) return
    const validSubs = subParts.filter(s => s.partName.trim() && s.partNo.trim())
    if (validSubs.length === 0) return
    const details: SubPart[] = validSubs.map(s => ({
      partName: s.partName.trim(),
      partNo: s.partNo.trim(),
      isCo: s.isCo,
      coSource: s.isCo ? s.coSource.trim() || baseVehicle.trim() : undefined,
      nonCoReason: s.isCo ? undefined : (lang === 'ko' ? '사유 미입력' : 'Reason not entered'),
      supplier: s.supplier.trim(),
      supplierRegion: s.supplierRegion,
      materialCost: s.materialCost,
    }))
    const coSubs = details.filter(d => d.isCo).length
    const coCost = details.filter(d => d.isCo).reduce((s, d) => s + d.materialCost, 0)
    const newDevCost = details.filter(d => !d.isCo).reduce((s, d) => s + d.materialCost, 0)

    saveEntry(STORAGE.parts, {
      vehicleCode,
      part: {
        system: system.trim(), baseVehicle: baseVehicle.trim(), coType,
        subParts: details.length, coSubParts: coSubs, coCost, newDevCost, details,
      },
      createdAt: new Date().toISOString(),
    })
    onSuccess(
      lang === 'ko'
        ? `${system} 시스템 (${details.length}개 부품)이 ${vehicleCode}에 등록되었습니다`
        : `${system} system (${details.length} parts) registered to ${vehicleCode}`
    )
    setStep(1); setSystem(''); setBaseVehicle('')
    setSubParts([emptyRow()])
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium ${
          step === 1 ? 'bg-primary text-white' : 'bg-success-dim text-success'
        }`}>
          {step > 1 ? <Check size={14} /> : <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</span>}
          {t('entry.part.step1.title')}
        </div>
        <ChevronRight size={16} className="text-text-subtle" />
        <div className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium ${
          step === 2 ? 'bg-primary text-white' : 'bg-secondary text-text-muted'
        }`}>
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</span>
          {t('entry.part.step2.title')}
        </div>
      </div>

      {/* ─── Step 1: L1 System ─── */}
      {step === 1 && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <h3 className="text-base font-bold">{t('entry.part.step1.full')}</h3>
          </div>
          <p className="text-sm text-text-muted mb-6 ml-4">
            {t('entry.part.step1.desc')}
          </p>

          <div className="grid grid-cols-2 gap-5 mb-5">
            <Field label={t('entry.part.vehicle')} required>
              <select className={selectCls} value={vehicleCode} onChange={e => setVehicleCode(e.target.value)}>
                {vehicles.map(v => <option key={v.code} value={v.code}>{v.code} – {v.name}</option>)}
              </select>
            </Field>
            <Field label={t('entry.part.coTypeLabel')} required>
              <select className={selectCls} value={coType} onChange={e => setCoType(e.target.value as CoType)}>
                {CO_TYPES.map(ct => <option key={ct} value={ct}>{t(CO_TYPE_KEYS[ct])}</option>)}
              </select>
              <span className="text-xs text-text-subtle mt-1">
                {coTypeDesc(coType)}
              </span>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-5 mb-6">
            <Field label={t('entry.part.systemName')} required>
              <input className={inputCls} placeholder={lang === 'ko' ? '예: 도어 트림, 좌석, 계기판' : 'e.g.: Door Trim, Seat, IP'} value={system} onChange={e => setSystem(e.target.value)} />
            </Field>
            <Field label={t('entry.part.baseVehicle')} required>
              <input className={inputCls} placeholder={lang === 'ko' ? '예: VN3 (공용화 대상 양산차)' : 'e.g.: VN3 (C/O target production vehicle)'} value={baseVehicle} onChange={e => setBaseVehicle(e.target.value)} />
            </Field>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!canProceed}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-[var(--radius-button)] text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('entry.part.next')}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ─── Step 2: L2 Parts ─── */}
      {step === 2 && (
        <>
          {/* L1 Summary (locked) */}
          <div className="bg-primary-dim/40 rounded-[var(--radius-card)] border border-primary/20 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{t('cotype.short.1level')}</span>
              </div>
              <span className="text-sm font-bold">{system}</span>
              <span className="text-xs text-text-muted">
                {selectedVehicle?.code} · {lang === 'ko' ? '기준' : 'Base'}: {baseVehicle} · {t(CO_TYPE_KEYS[coType])}
              </span>
            </div>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline cursor-pointer"
            >
              <ArrowLeft size={12} />
              {t('entry.part.edit')}
            </button>
          </div>

          {/* Sub-parts table */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <h3 className="text-base font-bold">{t('entry.part.step2.full')}</h3>
                </div>
                <p className="text-xs text-text-muted ml-4">
                  {lang === 'ko'
                    ? <>위 1레벨 시스템 <strong>{system}</strong>에 소속되는 부품을 입력합니다 ({subParts.length}개)</>
                    : <>Enter parts belonging to L1 system <strong>{system}</strong> ({subParts.length} items)</>
                  }
                </p>
              </div>
              <button onClick={addRow} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-[var(--radius-button)] text-xs font-medium hover:bg-primary-hover transition-colors cursor-pointer">
                <Plus size={14} /> {t('entry.part.addRow')}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted w-[180px]">{t('entry.part.col.partName')}</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted w-[140px]">{t('entry.part.col.partNo')}</th>
                    <th className="text-center px-3 py-2.5 font-semibold text-text-muted w-[70px]">{t('entry.part.col.co')}</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted w-[120px]">{t('entry.part.col.source')}</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted w-[120px]">{t('entry.part.col.supplier')}</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-text-muted w-[100px]">{t('entry.part.col.region')}</th>
                    <th className="text-right px-3 py-2.5 font-semibold text-text-muted w-[90px]">{t('entry.part.col.cost')}</th>
                    <th className="w-[40px]" />
                  </tr>
                </thead>
                <tbody>
                  {subParts.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-2 py-2">
                        <input className={inputCls} placeholder={lang === 'ko' ? '부품명' : 'Part name'} value={row.partName} onChange={e => updateRow(i, 'partName', e.target.value)} />
                      </td>
                      <td className="px-2 py-2">
                        <input className={inputCls} placeholder="87620-XXXXX" value={row.partNo} onChange={e => updateRow(i, 'partNo', e.target.value)} />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <input
                          type="checkbox" checked={row.isCo}
                          onChange={e => updateRow(i, 'isCo', e.target.checked)}
                          className="w-4 h-4 accent-primary cursor-pointer"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input className={inputCls} placeholder={row.isCo ? (lang === 'ko' ? '출처 차종' : 'Source vehicle') : '-'} disabled={!row.isCo} value={row.coSource} onChange={e => updateRow(i, 'coSource', e.target.value)} />
                      </td>
                      <td className="px-2 py-2">
                        <input className={inputCls} placeholder={lang === 'ko' ? '공급업체' : 'Supplier'} value={row.supplier} onChange={e => updateRow(i, 'supplier', e.target.value)} />
                      </td>
                      <td className="px-2 py-2">
                        <select className={selectCls} value={row.supplierRegion} onChange={e => updateRow(i, 'supplierRegion', e.target.value)}>
                          {REGIONS.map(r => <option key={r} value={r}>{t(REGION_KEYS[r])}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <input className={inputCls + ' text-right'} type="number" min={0} step={0.1} value={row.materialCost} onChange={e => updateRow(i, 'materialCost', parseFloat(e.target.value) || 0)} />
                      </td>
                      <td className="px-1 py-2">
                        {subParts.length > 1 && (
                          <button onClick={() => removeRow(i)} className="text-text-subtle hover:text-danger transition-colors cursor-pointer p-1">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-secondary text-text-muted rounded-[var(--radius-button)] text-sm font-medium hover:bg-secondary-hover transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                {t('entry.part.prev')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={subParts.filter(s => s.partName.trim() && s.partNo.trim()).length === 0}
                className="px-6 py-2.5 bg-primary text-white rounded-[var(--radius-button)] text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('entry.part.submit')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Tab 3: Non-C/O Reason Entry
   ═══════════════════════════════════════════════ */

function ReasonForm({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const { t, lang } = useLang()
  const vehicles = getMergedVehicles()
  const [vehicleCode, setVehicleCode] = useState(vehicles[0]?.code ?? '')
  const [systemIdx, setSystemIdx] = useState(0)
  const [subPartIdx, setSubPartIdx] = useState(0)

  // Reason fields
  const [category, setCategory] = useState<ReasonCategory>('디자인')
  const [baseSpec, setBaseSpec] = useState('')
  const [newSpec, setNewSpec] = useState('')
  const [diffDesc, setDiffDesc] = useState('')
  const [designIntent, setDesignIntent] = useState('')
  const [impactArea, setImpactArea] = useState('')
  const [possibility, setPossibility] = useState<CoPossibility>('medium')
  const [coCondition, setCoCondition] = useState('')
  const [addCost, setAddCost] = useState(0)

  const vehicle = vehicles.find(v => v.code === vehicleCode)
  const parts = vehicle?.parts ?? []
  const selectedPart = parts[systemIdx]
  const subParts = selectedPart?.details ?? []
  const selectedSub = subParts[subPartIdx]

  // Reset cascading selects
  function onVehicleChange(code: string) { setVehicleCode(code); setSystemIdx(0); setSubPartIdx(0) }
  function onSystemChange(idx: number) { setSystemIdx(idx); setSubPartIdx(0) }

  function handleSubmit() {
    if (!selectedSub || !baseSpec.trim() || !newSpec.trim()) return
    saveEntry(STORAGE.reasons, {
      vehicleCode,
      system: selectedPart.system,
      partName: selectedSub.partName,
      partNo: selectedSub.partNo,
      reason: {
        category, baseSpec: baseSpec.trim(), newSpec: newSpec.trim(),
        diffDescription: diffDesc.trim(), designIntent: designIntent.trim(),
        impactArea: impactArea.trim(), coPossibility: possibility,
        coCondition: coCondition.trim(), additionalCost: addCost,
      },
      createdAt: new Date().toISOString(),
    })
    onSuccess(
      lang === 'ko'
        ? `${selectedSub.partName}의 비C/O 사유가 등록되었습니다`
        : `${selectedSub.partName} non-C/O reason registered`
    )
    setBaseSpec(''); setNewSpec(''); setDiffDesc(''); setDesignIntent('')
    setImpactArea(''); setCoCondition(''); setAddCost(0)
  }

  const possibilityColors: Record<CoPossibility, string> = {
    high: 'text-success', medium: 'text-warning', low: 'text-[#F97316]', none: 'text-danger',
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Part selector */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
        <h3 className="text-base font-bold mb-4">{t('entry.reason.selectPart')}</h3>

        <div className="flex flex-col gap-4">
          <Field label={t('entry.reason.vehicle')} required>
            <select className={selectCls} value={vehicleCode} onChange={e => onVehicleChange(e.target.value)}>
              {vehicles.map(v => <option key={v.code} value={v.code}>{v.code} – {v.name}</option>)}
            </select>
          </Field>

          <Field label={t('entry.reason.system')} required>
            <select className={selectCls} value={systemIdx} onChange={e => onSystemChange(Number(e.target.value))}>
              {parts.map((p, i) => <option key={i} value={i}>{p.system}</option>)}
            </select>
          </Field>

          <Field label={t('entry.reason.part')} required>
            <select className={selectCls} value={subPartIdx} onChange={e => setSubPartIdx(Number(e.target.value))}>
              {subParts.length === 0
                ? <option>{t('entry.reason.noSub')}</option>
                : subParts.map((s, i) => (
                    <option key={i} value={i}>
                      {s.partName} ({s.partNo}) {s.isCo
                        ? '– C/O'
                        : lang === 'ko' ? '– 비C/O' : '– Non-C/O'}
                    </option>
                  ))
              }
            </select>
          </Field>

          {selectedSub && (
            <div className="mt-2 p-3 bg-secondary rounded-[var(--radius-button)]">
              <p className="text-xs text-text-muted">{t('entry.reason.selected')}</p>
              <p className="text-sm font-bold mt-1">{selectedSub.partName}</p>
              <p className="text-xs text-text-subtle font-mono mt-0.5">{selectedSub.partNo}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedSub.isCo ? 'bg-success-dim text-success' : 'bg-danger-dim text-danger'}`}>
                  {selectedSub.isCo ? 'C/O' : (lang === 'ko' ? '비C/O' : 'Non-C/O')}
                </span>
                <span className="text-xs text-text-muted">{selectedSub.supplier} · ${selectedSub.materialCost}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reason form */}
      <div className="col-span-2 bg-surface rounded-[var(--radius-card)] border border-border p-6">
        <h3 className="text-base font-bold mb-1">{t('entry.reason.title')}</h3>
        <p className="text-sm text-text-muted mb-6">{t('entry.reason.desc')}</p>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <Field label={t('entry.reason.category')} required>
            <select className={selectCls} value={category} onChange={e => setCategory(e.target.value as ReasonCategory)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{t(REASON_KEYS[c])}</option>)}
            </select>
          </Field>
          <Field label={t('entry.reason.possibility')}>
            <select className={selectCls} value={possibility} onChange={e => setPossibility(e.target.value as CoPossibility)}>
              {POSSIBILITIES.map(p => <option key={p} value={p}>{t(POSS_KEYS[p])}</option>)}
            </select>
            <span className={`text-xs font-medium mt-1 ${possibilityColors[possibility]}`}>
              {t(POSS_DESC_KEYS[possibility])}
            </span>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <Field label={t('entry.reason.baseSpec')} required>
            <textarea className={textareaCls} placeholder={lang === 'ko' ? '기존 양산차의 사양...' : 'Production vehicle spec...'} value={baseSpec} onChange={e => setBaseSpec(e.target.value)} />
          </Field>
          <Field label={t('entry.reason.newSpec')} required>
            <textarea className={textareaCls} placeholder={lang === 'ko' ? '개발차에 요구되는 사양...' : 'Required dev vehicle spec...'} value={newSpec} onChange={e => setNewSpec(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <Field label={t('entry.reason.diffDesc')}>
            <textarea className={textareaCls} placeholder={lang === 'ko' ? '두 사양 간 핵심 차이점...' : 'Key differences between specs...'} value={diffDesc} onChange={e => setDiffDesc(e.target.value)} />
          </Field>
          <Field label={t('entry.reason.designIntent')}>
            <textarea className={textareaCls} placeholder={lang === 'ko' ? '변경이 필요한 이유...' : 'Reason for change...'} value={designIntent} onChange={e => setDesignIntent(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-6">
          <Field label={t('entry.reason.impactArea')}>
            <input className={inputCls} placeholder={lang === 'ko' ? '예: 조립라인, 품질' : 'e.g.: Assembly line, Quality'} value={impactArea} onChange={e => setImpactArea(e.target.value)} />
          </Field>
          <Field label={t('entry.reason.coCondition')}>
            <input className={inputCls} placeholder={lang === 'ko' ? '예: 형상 일치시 전환 가능' : 'e.g.: Convertible if shape matches'} value={coCondition} onChange={e => setCoCondition(e.target.value)} />
          </Field>
          <Field label={t('entry.reason.addCost')}>
            <input className={inputCls + ' text-right'} type="number" min={0} step={0.1} value={addCost} onChange={e => setAddCost(parseFloat(e.target.value) || 0)} />
          </Field>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedSub || !baseSpec.trim() || !newSpec.trim()}
          className="px-6 py-2.5 bg-primary text-white rounded-[var(--radius-button)] text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('entry.reason.submit')}
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Tab 4: Excel Upload
   ═══════════════════════════════════════════════ */

function ExcelUpload({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const { t, lang } = useLang()
  const [parsed, setParsed] = useState<ParsedExcel | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      onSuccess(t('entry.excel.unsupported'))
      return
    }
    setLoading(true)
    setFileName(file.name)
    try {
      const result = await parseExcelFile(file)
      setParsed(result)
    } catch {
      onSuccess(t('entry.excel.parseError'))
    }
    setLoading(false)
  }, [onSuccess, t])

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleImport() {
    if (!parsed) return
    // Save vehicles
    if (parsed.vehicles.length > 0) {
      const existing = loadEntries<Record<string, unknown>>(STORAGE.vehicles)
      localStorage.setItem(STORAGE.vehicles, JSON.stringify([...parsed.vehicles.map(v => ({ ...v, createdAt: new Date().toISOString() })), ...existing]))
    }
    // Save parts
    if (parsed.parts.length > 0) {
      const existing = loadEntries<Record<string, unknown>>(STORAGE.parts)
      const newParts = parsed.parts.map(p => ({ ...p, createdAt: new Date().toISOString() }))
      localStorage.setItem(STORAGE.parts, JSON.stringify([...newParts, ...existing]))
    }
    // Save reasons
    if (parsed.reasons.length > 0) {
      const existing = loadEntries<Record<string, unknown>>(STORAGE.reasons)
      const newReasons = parsed.reasons.map(r => ({
        vehicleCode: r.vehicleCode, system: r.system, partNo: r.partNo,
        partName: '-', reason: r.reason, createdAt: new Date().toISOString(),
      }))
      localStorage.setItem(STORAGE.reasons, JSON.stringify([...newReasons, ...existing]))
    }
    const { vehicleCount, partCount, subPartCount, reasonCount } = parsed.summary
    onSuccess(
      lang === 'ko'
        ? `등록 완료: 차종 ${vehicleCount}건, 시스템 ${partCount}건 (부품 ${subPartCount}개), 사유 ${reasonCount}건`
        : `Import complete: ${vehicleCount} vehicles, ${partCount} systems (${subPartCount} parts), ${reasonCount} reasons`
    )
    setParsed(null); setFileName('')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Template download + Upload zone */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Template */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
          <h3 className="text-base font-bold mb-1">{t('entry.excel.template')}</h3>
          <p className="text-sm text-text-muted mb-4">{t('entry.excel.templateDesc')}</p>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-text-muted">Sheet 1:</span> <span className="font-medium">{t('entry.excel.sheet1')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-text-muted">Sheet 2:</span> <span className="font-medium">{t('entry.excel.sheet2')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-text-muted">Sheet 3:</span> <span className="font-medium">{t('entry.excel.sheet3')}</span>
            </div>
          </div>

          <p className="text-xs text-text-subtle mb-4">
            {t('entry.excel.templateNote')}<br />
            {t('entry.excel.requiredNote')}
          </p>

          <button
            onClick={downloadTemplate}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-[var(--radius-button)] text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <Download size={16} />
            {t('entry.excel.download')}
          </button>
        </div>

        {/* Right: Drop zone */}
        <div className="col-span-2">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`bg-surface rounded-[var(--radius-card)] border-2 border-dashed p-12 flex flex-col items-center justify-center cursor-pointer transition-colors
              ${dragging ? 'border-primary bg-primary-dim' : 'border-border hover:border-primary/40 hover:bg-primary-dim/30'}`}
          >
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFileChange} />
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-text-muted">{t('entry.excel.parsing')}</p>
              </div>
            ) : fileName ? (
              <div className="flex flex-col items-center gap-3">
                <FileSpreadsheet size={40} className="text-success" />
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-text-muted">{t('entry.excel.uploadOther')}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload size={40} className="text-text-subtle" />
                <p className="text-sm font-medium">{t('entry.excel.dropzone')}</p>
                <p className="text-xs text-text-subtle">{t('entry.excel.supported')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      {parsed && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4">
              <p className="text-xs text-text-muted">{t('entry.excel.sheet1')}</p>
              <p className="text-2xl font-bold mt-1">{parsed.summary.vehicleCount}<span className="text-sm font-normal text-text-muted ml-1">{t('common.count')}</span></p>
            </div>
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4">
              <p className="text-xs text-text-muted">{t('common.systems')}</p>
              <p className="text-2xl font-bold mt-1">{parsed.summary.partCount}<span className="text-sm font-normal text-text-muted ml-1">{t('common.count')}</span></p>
            </div>
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4">
              <p className="text-xs text-text-muted">{t('common.subParts')}</p>
              <p className="text-2xl font-bold mt-1">{parsed.summary.subPartCount}<span className="text-sm font-normal text-text-muted ml-1">{t('common.unit')}</span></p>
            </div>
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4">
              <p className="text-xs text-text-muted">{lang === 'ko' ? '비C/O 사유' : 'Non-C/O Reasons'}</p>
              <p className="text-2xl font-bold mt-1">{parsed.summary.reasonCount}<span className="text-sm font-normal text-text-muted ml-1">{t('common.count')}</span></p>
            </div>
          </div>

          {/* Errors */}
          {parsed.errors.length > 0 && (
            <div className="bg-warning-dim border border-warning/30 rounded-[var(--radius-card)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-warning" />
                <span className="text-sm font-bold text-warning">{t('entry.excel.warnings')} ({parsed.errors.length}{t('common.count')})</span>
              </div>
              <ul className="text-xs text-text-muted flex flex-col gap-1 max-h-[120px] overflow-y-auto">
                {parsed.errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Vehicle preview */}
          {parsed.vehicles.length > 0 && (
            <PreviewTable
              title={t('entry.excel.preview.vehicle')}
              headers={[t('entry.excel.h.code'), t('entry.excel.h.name'), t('entry.excel.h.stage'), t('entry.excel.h.schedule'), t('entry.excel.h.half'), t('entry.excel.h.type')]}
              rows={parsed.vehicles.map(v => [v.code, v.name, v.stage, v.date, v.half, v.type])}
              moreLabel={t('entry.excel.moreRows')}
            />
          )}

          {/* Parts preview */}
          {parsed.parts.length > 0 && (
            <PreviewTable
              title={t('entry.excel.preview.part')}
              headers={[t('entry.excel.h.vehicle'), t('entry.excel.h.system'), t('entry.excel.h.baseV'), t('entry.excel.h.coType'), t('entry.excel.h.partCount'), t('entry.excel.h.coCount'), t('entry.excel.h.coCost'), t('entry.excel.h.newCost')]}
              rows={parsed.parts.map(p => [
                p.vehicleCode, p.part.system, p.part.baseVehicle, p.part.coType,
                String(p.part.subParts), String(p.part.coSubParts),
                `$${p.part.coCost.toFixed(1)}`, `$${p.part.newDevCost.toFixed(1)}`,
              ])}
              moreLabel={t('entry.excel.moreRows')}
            />
          )}

          {/* Reasons preview */}
          {parsed.reasons.length > 0 && (
            <PreviewTable
              title={t('entry.excel.preview.reason')}
              headers={[t('entry.excel.h.vehicle'), t('entry.excel.h.system'), t('entry.excel.h.partNo'), t('entry.excel.h.category'), t('entry.excel.h.possibility'), t('entry.excel.h.addCost')]}
              rows={parsed.reasons.map(r => [
                r.vehicleCode, r.system, r.partNo,
                r.reason.category, r.reason.coPossibility.toUpperCase(),
                `$${r.reason.additionalCost}`,
              ])}
              moreLabel={t('entry.excel.moreRows')}
            />
          )}

          {/* Import button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setParsed(null); setFileName('') }}
              className="px-5 py-2.5 bg-secondary text-text-muted rounded-[var(--radius-button)] text-sm font-medium hover:bg-secondary-hover transition-colors cursor-pointer"
            >
              {t('entry.excel.cancel')}
            </button>
            <button
              onClick={handleImport}
              className="px-6 py-2.5 bg-primary text-white rounded-[var(--radius-button)] text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Check size={16} />
                {parsed.summary.vehicleCount + parsed.summary.partCount + parsed.summary.reasonCount}{t('entry.excel.import')}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── Preview Table (shared) ─── */

function PreviewTable({ title, headers, rows, moreLabel }: { title: string; headers: string[]; rows: string[][]; moreLabel?: string }) {
  return (
    <div className="bg-surface rounded-[var(--radius-card)] border border-border overflow-hidden">
      <div className="px-6 py-3 border-b border-border">
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              {headers.map((h, i) => (
                <th key={i} className="text-left px-4 py-2.5 font-semibold text-text-muted whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 20).map((row, i) => (
              <tr key={i} className="border-t border-border">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 whitespace-nowrap">{cell}</td>
                ))}
              </tr>
            ))}
            {rows.length > 20 && (
              <tr className="border-t border-border">
                <td colSpan={headers.length} className="px-4 py-2 text-center text-text-muted text-xs">
                  ... {rows.length - 20}{moreLabel ?? ''}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
