// src/components/Toolbar.tsx
'use client'
import { useReaderStore } from '@/lib/store'

interface Props {
  hidden: boolean
  onOpenSettings: () => void
  onOpenBookmarks: () => void
  onBookmarkToggle: () => void
}

export default function Toolbar({ hidden, onOpenSettings, onOpenBookmarks, onBookmarkToggle }: Props) {
  const bookName = useReaderStore((s) => s.bookName)
  const currentPage = useReaderStore((s) => s.currentPage)
  const totalPages = useReaderStore((s) => s.totalPages)
  const isBookmarked = useReaderStore((s) =>
    (s.progress[s.bookId]?.bookmarks ?? []).includes(s.currentPage)
  )
  const unloadBook = useReaderStore((s) => s.unloadBook)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center gap-2 px-4 transition-transform duration-300"
      style={{
        background: 'rgba(253,250,244,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      <Btn onClick={unloadBook} title="Fechar">←</Btn>

      <span
        className="flex-1 text-sm truncate"
        style={{ fontFamily: '"Playfair Display", serif', color: '#3a2e24' }}
      >
        {bookName}
      </span>

      <span
        className="text-xs tabular-nums whitespace-nowrap"
        style={{ color: '#8a7a6a', fontFamily: '"DM Sans", sans-serif' }}
      >
        {currentPage} / {totalPages}
      </span>

      <Btn onClick={onBookmarkToggle} active={isBookmarked} title="Marcar página">🔖</Btn>
      <Btn onClick={onOpenBookmarks} title="Favoritos">📑</Btn>
      <Btn onClick={onOpenSettings} title="Ajustes">⚙️</Btn>
    </header>
  )
}

function Btn({ children, onClick, active, title }: {
  children: React.ReactNode; onClick: () => void; active?: boolean; title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 transition-colors duration-150"
      style={{
        background: active ? 'rgba(196,113,58,0.18)' : 'transparent',
        color: active ? '#c4713a' : '#5a4a3a',
      }}
    >
      {children}
    </button>
  )
}
