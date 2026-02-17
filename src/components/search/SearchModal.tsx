import { useState, useEffect, useRef } from 'react'
import { Search, X, ArrowRight } from 'lucide-react'
import type { SearchResult } from '@/types'
import { searchParts } from '@/lib/search'

export function SearchModal({ open, onClose, onSelect }: {
  open: boolean
  onClose: () => void
  onSelect: (result: SearchResult) => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setResults(searchParts(query))
  }, [query])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!open) onClose() // parent toggles
      }
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-[560px] bg-surface rounded-[var(--radius-card)] border border-border shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
          <Search size={18} className="text-text-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="차종, 시스템, 부품명, 부품번호, 공급업체 검색..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-subtle"
          />
          <button onClick={onClose} className="text-text-subtle hover:text-text transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto">
          {query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-text-muted">
              검색 결과가 없습니다
            </div>
          )}
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => { onSelect(r); onClose() }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary bg-primary-dim px-1.5 py-0.5 rounded">
                    {r.vehicleCode}
                  </span>
                  <span className="text-sm font-medium truncate">{r.partName}</span>
                </div>
                <p className="text-xs text-text-muted mt-0.5 truncate">
                  {r.system} · {r.partNo} · {r.supplier}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${r.isCo ? 'bg-success-dim text-success' : 'bg-secondary text-text-muted'}`}>
                  {r.isCo ? 'C/O' : '비C/O'}
                </span>
                <ArrowRight size={14} className="text-text-subtle" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[10px] text-text-subtle">
          <span><kbd className="bg-secondary px-1 py-0.5 rounded font-mono">↑↓</kbd> 이동</span>
          <span><kbd className="bg-secondary px-1 py-0.5 rounded font-mono">Enter</kbd> 선택</span>
          <span><kbd className="bg-secondary px-1 py-0.5 rounded font-mono">Esc</kbd> 닫기</span>
        </div>
      </div>
    </div>
  )
}
