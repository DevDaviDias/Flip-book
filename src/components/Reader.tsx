// src/components/Reader.tsx
'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useReaderStore } from '@/lib/store'
import { usePdfRenderer } from '@/hooks/usePdfRenderer'
import Toolbar from './Toolbar'
import BottomBar from './BottomBar'
import SettingsPanel from './SettingsPanel'
import BookmarksPanel from './BookmarksPanel'
import BookPage from './BookPage'
import CoverPage from './CoverPage'
import Toast from './Toast'

const HTMLFlipBook = dynamic(
  () => import('react-pageflip').then((m: any) => m.default ?? m),
  { ssr: false }
) as any

export default function Reader() {
  const pdfFile = useReaderStore((s) => s.pdfFile)
  const currentPage = useReaderStore((s) => s.currentPage)
  const totalPages = useReaderStore((s) => s.totalPages)
  const settings = useReaderStore((s) => s.settings)
  const bookName = useReaderStore((s) => s.bookName)
  const bookmarks = useReaderStore((s) => s.progress[s.bookId]?.bookmarks ?? [])
  const setPage = useReaderStore((s) => s.setPage)
  const setTotalPages = useReaderStore((s) => s.setTotalPages)
  const toggleBookmark = useReaderStore((s) => s.toggleBookmark)

  const { pdfDoc, loading, loadDocument } = usePdfRenderer()
  const flipBookRef = useRef<any>(null)

  const [barsHidden, setBarsHidden] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [bookmarksOpen, setBookmarksOpen] = useState(false)
  const [toast, setToast] = useState({ msg: '', visible: false })
  const hideTimer = useRef<any>()
  const toastTimer = useRef<any>()
  const [dims, setDims] = useState({ w: 0, h: 0, isSpread: false })

  // ── Dimensões ──────────────────────────────────────────
  // PC: usa ~90% da altura disponível → livro bem maior
  // Mobile: usa quase toda a largura
  useEffect(() => {
    function compute() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const toolbar = 56
      const bottomBar = 72
      const padding = 32
      const available = vh - toolbar - bottomBar - padding

      const isDesktop = vw >= 860
      const isSpread = isDesktop

      let pageH: number
      let pageW: number

      if (isDesktop) {
        // Livro grande: ocupa até 90% da altura disponível
        pageH = Math.min(available * 0.92, 820)
        // Proporção A4
        pageW = Math.min(pageH / 1.414, (vw - 120) / 2)
        // Ajusta altura se largura limitou
        pageH = Math.min(pageH, pageW * 1.414)
      } else {
        // Mobile: usa quase toda a largura
        pageW = Math.min(vw - 24, 480)
        pageH = Math.min(pageW * 1.414, available * 0.95)
        pageW = Math.min(pageW, pageH / 1.414)
      }

      setDims({ w: Math.floor(pageW), h: Math.floor(pageH), isSpread })
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  useEffect(() => { if (pdfFile) loadDocument(pdfFile) }, [pdfFile])
  useEffect(() => { if (pdfDoc) setTotalPages((pdfDoc as any).numPages) }, [pdfDoc])

  const lastExternalPage = useRef(-1)
  useEffect(() => {
    if (lastExternalPage.current === currentPage) return
    try { flipBookRef.current?.pageFlip?.()?.turnToPage(currentPage) } catch {}
  }, [currentPage])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (settingsOpen || bookmarksOpen) return
      if (e.key === 'ArrowRight') flipBookRef.current?.pageFlip?.()?.flipNext()
      if (e.key === 'ArrowLeft') flipBookRef.current?.pageFlip?.()?.flipPrev()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [settingsOpen, bookmarksOpen])

  const resetBarsTimer = useCallback(() => {
    clearTimeout(hideTimer.current)
    setBarsHidden(false)
    hideTimer.current = setTimeout(() => setBarsHidden(true), 3500)
  }, [])

  useEffect(() => { resetBarsTimer(); return () => clearTimeout(hideTimer.current) }, [])

  function showToast(msg: string) {
    clearTimeout(toastTimer.current)
    setToast({ msg, visible: true })
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000)
  }

  function handleBookmarkToggle(page: number) {
    const was = bookmarks.includes(page)
    toggleBookmark(page)
    showToast(was ? 'Marcador removido' : 'Página marcada 🔖')
  }

  function onFlip(e: any) {
    const idx: number = e.data
    lastExternalPage.current = idx
    setPage(Math.max(1, idx))
  }

  const filterStyle = `sepia(${settings.sepia}%)`
  const zoom = settings.zoom ?? 100
  const isDark = settings.theme === 'dark'
  const barsVisible = !barsHidden || settingsOpen || bookmarksOpen

  return (
    <div
      className="flex flex-col h-[100dvh] overflow-hidden"
      style={{
        background: isDark ? '#1a1814' : '#f0ebe0',
        transition: 'background 0.4s',
      }}
      onMouseMove={resetBarsTimer}
      onTouchStart={resetBarsTimer}
    >
      <Toolbar
        hidden={!barsVisible}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenBookmarks={() => setBookmarksOpen(true)}
        onBookmarkToggle={() => handleBookmarkToggle(currentPage)}
      />

      {/* Stage */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        style={{ paddingTop: 56, paddingBottom: 72 }}
        onClick={resetBarsTimer}
      >
        {loading || dims.w === 0 ? (
          <div className="flex flex-col items-center gap-3" style={{ color: isDark ? '#6a5a4a' : '#8a7a6a' }}>
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: isDark ? '#3a2e24' : '#d0c8b8', borderTopColor: '#c4713a' }}
            />
            <span style={{ fontFamily: '"Playfair Display", serif' }}>Carregando...</span>
          </div>
        ) : pdfDoc && totalPages > 0 ? (
          <HTMLFlipBook
            ref={flipBookRef}
            width={dims.w}
            height={dims.h}
            size="fixed"
            minWidth={dims.w}
            maxWidth={dims.w}
            minHeight={dims.h}
            maxHeight={dims.h}
            showCover={true}
            flippingTime={700}
            usePortrait={!dims.isSpread}
            startPage={currentPage > 0 ? currentPage : 0}
            drawShadow={true}
            useMouseEvents={true}
            onFlip={onFlip}
          >
            <CoverPage bookName={bookName} totalPages={totalPages} />

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <BookPage
                key={pNum}
                pdfDoc={pdfDoc}
                pageNum={pNum}
                width={dims.w}
                height={dims.h}
                filterStyle={filterStyle}
                zoom={zoom}
                isBookmarked={bookmarks.includes(pNum)}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}

            <CoverPage bookName={bookName} totalPages={totalPages} />
          </HTMLFlipBook>
        ) : null}
      </div>

      <BottomBar
        hidden={!barsVisible}
        isSpread={dims.isSpread}
        onNext={() => flipBookRef.current?.pageFlip?.()?.flipNext()}
        onPrev={() => flipBookRef.current?.pageFlip?.()?.flipPrev()}
      />

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <BookmarksPanel
        open={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
        onNavigate={(p) => {
          lastExternalPage.current = p
          flipBookRef.current?.pageFlip?.()?.turnToPage(p)
          setPage(p)
          setBookmarksOpen(false)
        }}
      />

      <Toast message={toast.msg} visible={toast.visible} />
    </div>
  )
}
