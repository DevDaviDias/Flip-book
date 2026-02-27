// src/components/BottomBar.tsx
'use client'
import { useReaderStore } from '@/lib/store'

interface Props {
  hidden: boolean
  isSpread: boolean
  onNext: () => void
  onPrev: () => void
}

export default function BottomBar({ hidden }: Props) {
  const currentPage = useReaderStore((s) => s.currentPage)
  const totalPages = useReaderStore((s) => s.totalPages)
  const setPage = useReaderStore((s) => s.setPage)
  const isDark = useReaderStore((s) => s.settings.theme === 'dark')

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center px-6 gap-3 transition-transform duration-300"
      style={{
        height: 60,
        background: isDark ? 'rgba(26,24,20,0.92)' : 'rgba(253,250,244,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`,
        transform: hidden ? 'translateY(100%)' : 'translateY(0)',
      }}
    >
      <input
        type="range"
        min={1}
        max={totalPages || 1}
        value={currentPage}
        onChange={(e) => setPage(parseInt(e.target.value))}
        className="flex-1 max-w-sm cursor-pointer"
        style={{ accentColor: '#c4713a' }}
      />
      <p
        className="tabular-nums whitespace-nowrap shrink-0"
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.78rem',
          color: isDark ? '#6a5a4a' : '#8a7a6a',
          minWidth: 72,
          textAlign: 'right',
        }}
      >
        {currentPage} / {totalPages}
      </p>
    </nav>
  )
}
