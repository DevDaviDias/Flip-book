// src/components/BookmarksPanel.tsx
'use client'
import { useReaderStore } from '@/lib/store'

interface Props {
  open: boolean
  onClose: () => void
  onNavigate: (page: number) => void
}

export default function BookmarksPanel({ open, onClose, onNavigate }: Props) {
  const bookmarks = useReaderStore((s) => s.progress[s.bookId]?.bookmarks ?? [])
  const removeBookmark = useReaderStore((s) => s.removeBookmark)

  const panelStyle: React.CSSProperties = {
    background: '#fdfaf4',
    boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
    transform: open ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.28)' }}
        onClick={onClose}
      />
      <aside
        className="fixed top-0 right-0 bottom-0 z-50 w-[min(320px,90vw)] rounded-l-2xl overflow-hidden flex flex-col"
        style={panelStyle}
      >
        <div className="flex items-center justify-between px-6 py-5 shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.1rem', color: '#2a1f14' }}>
            Páginas marcadas
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-colors"
            style={{ background: '#f0ebe0', color: '#6a5a4a' }}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: '#8a7a6a' }}>
              <span style={{ fontSize: '3rem', opacity: 0.3 }}>🔖</span>
              <p className="text-sm text-center">
                Nenhuma página marcada.<br />
                Use o botão 🔖 para marcar.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {bookmarks.map((page) => (
                <li
                  key={page}
                  className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors group"
                  style={{ ['--hover-bg' as any]: 'rgba(196,113,58,0.08)' }}
                  onClick={() => onNavigate(page)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(196,113,58,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.1rem', color: '#c4713a' }}>
                      Página {page}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#8a7a6a', fontFamily: '"DM Sans", sans-serif' }}>
                      Toque para navegar
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeBookmark(page) }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all opacity-0 group-hover:opacity-100"
                    style={{ background: '#f0ebe0', color: '#8a7a6a' }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#e05a3a')}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#8a7a6a')}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  )
}
