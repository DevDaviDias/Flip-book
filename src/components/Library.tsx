// src/components/Library.tsx
'use client'
import { useRef, useCallback, useState } from 'react'
import { useReaderStore, SavedBook } from '@/lib/store'
import { loadPdf } from '@/lib/pdfStorage'

export default function Library() {
  const library = useReaderStore((s) => s.library)
  const loadBook = useReaderStore((s) => s.loadBook)
  const removeFromLibrary = useReaderStore((s) => s.removeFromLibrary)
  const settings = useReaderStore((s) => s.settings)
  const updateSettings = useReaderStore((s) => s.updateSettings)
  const progress = useReaderStore((s) => s.progress)
  const inputRef = useRef<HTMLInputElement>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const isDark = settings.theme === 'dark'

  // Novo arquivo selecionado via file picker
  function handleFileSelected(file: File | null | undefined) {
    if (!file || file.type !== 'application/pdf') return
    loadBook(file)
  }

  // Abre livro da biblioteca direto do IndexedDB — sem re-upload
  async function handleCardClick(book: SavedBook) {
    setLoadingId(book.id)
    try {
      const file = await loadPdf(book.id)
      if (file) {
        loadBook(file)
      } else {
        // Cache do browser foi limpo — pede o arquivo de novo
        alert(`O arquivo "${book.name}" precisa ser reimportado.\nSelecione o PDF novamente.`)
        inputRef.current?.click()
      }
    } catch {
      inputRef.current?.click()
    } finally {
      setLoadingId(null)
    }
  }

  const bg = isDark ? '#1a1814' : '#f5f0e8'
  const headerBg = isDark ? 'rgba(26,24,20,0.92)' : 'rgba(245,240,232,0.92)'
  const titleColor = isDark ? '#f0e8d8' : '#2a1f14'
  const mutedColor = isDark ? '#6a5a4a' : '#8a7a6a'
  const divider = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg, transition: 'background 0.4s' }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
        style={{ background: headerBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: `1px solid ${divider}` }}
      >
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.4rem,4vw,2rem)', color: titleColor, fontWeight: 400 }}>
          Folio
        </h1>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-colors"
            style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', color: isDark ? '#c4a882' : '#5a4a3a' }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Add book */}
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: '#c4713a', color: '#fff', fontFamily: '"DM Sans", sans-serif', boxShadow: '0 4px 16px rgba(196,113,58,0.3)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#b5622c')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#c4713a')}
          >
            <span>+</span>
            <span>Adicionar PDF</span>
          </button>
        </div>
      </header>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => handleFileSelected(e.target.files?.[0])}
      />

      {/* ── Main ── */}
      <main className="flex-1 px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
        {library.length === 0 ? (

          /* ── Empty state ── */
          <div
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFileSelected(e.dataTransfer.files[0]) }}
          >
            <div
              className="w-32 h-44 rounded-2xl flex items-center justify-center text-5xl relative"
              style={{
                background: isDark ? '#252220' : '#fdfaf4',
                boxShadow: isDark ? '6px 6px 0 #0f0d0b, 12px 12px 30px rgba(0,0,0,0.3)' : '6px 6px 0 #e8e2d5, 12px 12px 30px rgba(0,0,0,0.08)',
              }}
            >
              📖
              <div className="absolute left-0 top-2 bottom-2 w-2 rounded-l-sm" style={{ background: 'linear-gradient(to right, #c8bfb0, #e0d8cc)' }} />
            </div>

            <div>
              <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: isDark ? '#c4a882' : '#5a4a3a', marginBottom: 8 }}>
                Sua biblioteca está vazia
              </p>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.9rem', color: mutedColor }}>
                Adicione seu primeiro PDF para começar a ler
              </p>
            </div>

            <button
              onClick={() => inputRef.current?.click()}
              className="px-6 py-3 rounded-2xl text-sm font-medium"
              style={{ background: '#c4713a', color: '#fff', fontFamily: '"DM Sans", sans-serif', boxShadow: '0 8px 24px rgba(196,113,58,0.3)' }}
            >
              Escolher arquivo PDF
            </button>

            <p style={{ fontSize: '0.8rem', color: isDark ? '#4a3a2a' : '#b0a090' }}>
              ou arraste um PDF aqui
            </p>
          </div>

        ) : (

          /* ── Grid de livros ── */
          <>
            <p className="mb-6" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: mutedColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {library.length} {library.length === 1 ? 'livro' : 'livros'}
            </p>

            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFileSelected(e.dataTransfer.files[0]) }}
            >
              {library.map((book) => {
                const prog = progress[book.id]
                const percent = book.totalPages > 0 ? Math.round(((prog?.page ?? 1) / book.totalPages) * 100) : 0
                return (
                  <BookCard
                    key={book.id}
                    book={book}
                    percent={percent}
                    isDark={isDark}
                    loading={loadingId === book.id}
                    onClick={() => handleCardClick(book)}
                    onRemove={() => removeFromLibrary(book.id)}
                  />
                )
              })}

              {/* Card "adicionar mais" */}
              <button
                onClick={() => inputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl transition-all"
                style={{
                  aspectRatio: '0.7',
                  border: `2px dashed ${isDark ? '#3a2e24' : '#d0c8b8'}`,
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#c4713a'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(196,113,58,0.05)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = isDark ? '#3a2e24' : '#d0c8b8'
                  ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <span style={{ fontSize: '1.5rem', opacity: 0.4, color: isDark ? '#c4a882' : '#5a4a3a' }}>+</span>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: mutedColor }}>Adicionar</span>
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// ── BookCard ──────────────────────────────────────────────
function BookCard({
  book, percent, isDark, loading, onClick, onRemove,
}: {
  book: SavedBook
  percent: number
  isDark: boolean
  loading: boolean
  onClick: () => void
  onRemove: () => void
}) {
  const palette = [
    ['#3d2b1f', '#6b4226'],
    ['#1a2a3a', '#2a4a6a'],
    ['#2a1f35', '#4a3060'],
    ['#1f2a1a', '#3a5230'],
    ['#2a2a1f', '#5a5020'],
    ['#2a1a1a', '#6a2820'],
  ]
  const [c1, c2] = palette[book.name.charCodeAt(0) % palette.length]

  return (
    <div className="flex flex-col gap-2 group relative" style={{ cursor: 'pointer' }}>
      {/* Remove */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full text-xs hidden group-hover:flex items-center justify-center"
        style={{ background: '#e05a3a', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
      >
        ✕
      </button>

      {/* Capa */}
      <div
        onClick={onClick}
        className="relative rounded-lg overflow-hidden"
        style={{
          aspectRatio: '0.7',
          background: `linear-gradient(160deg, ${c1} 0%, ${c2} 100%)`,
          boxShadow: isDark ? '4px 4px 0 #0f0d0b, 8px 8px 20px rgba(0,0,0,0.4)' : '4px 4px 0 #d0c8b8, 8px 8px 20px rgba(0,0,0,0.12)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) rotate(-1deg)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = isDark
            ? '6px 10px 0 #0f0d0b, 10px 16px 30px rgba(0,0,0,0.5)'
            : '6px 10px 0 #c0b8a8, 10px 16px 30px rgba(0,0,0,0.18)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0) rotate(0)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = isDark
            ? '4px 4px 0 #0f0d0b, 8px 8px 20px rgba(0,0,0,0.4)'
            : '4px 4px 0 #d0c8b8, 8px 8px 20px rgba(0,0,0,0.12)'
        }}
      >
        {/* Spine */}
        <div className="absolute left-0 top-0 bottom-0 w-3" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.45), rgba(0,0,0,0.08))' }} />

        {/* Grain */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        {/* Loading spinner */}
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          /* Título na capa */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 gap-2">
            <div className="w-6 h-px opacity-40" style={{ background: '#f5e6c8' }} />
            <p
              className="text-center leading-tight"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontStyle: 'italic',
                fontSize: '0.65rem',
                color: '#f5e6c8',
                opacity: 0.85,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
              } as any}
            >
              {book.name}
            </p>
            <div className="w-6 h-px opacity-40" style={{ background: '#f5e6c8' }} />
          </div>
        )}

        {/* Barra de progresso */}
        {percent > 0 && percent < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full" style={{ width: `${percent}%`, background: '#c4713a', transition: 'width 0.5s' }} />
          </div>
        )}

        {/* Concluído */}
        {percent >= 100 && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: '#c4713a' }}>✓</div>
        )}
      </div>

      {/* Info abaixo */}
      <div className="px-0.5">
        <p className="truncate" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', fontWeight: 500, color: isDark ? '#c4a882' : '#3a2e24' }}>
          {book.name}
        </p>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.65rem', color: isDark ? '#5a4a3a' : '#8a7a6a' }}>
          {percent > 0 ? `${percent}% lido` : `${book.totalPages || '?'} páginas`}
        </p>
      </div>
    </div>
  )
}
