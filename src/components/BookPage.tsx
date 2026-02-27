// src/components/BookPage.tsx
'use client'
import React, { forwardRef, useEffect, useRef } from 'react'

interface Props {
  pdfDoc: any
  pageNum: number
  width: number
  height: number
  filterStyle: string
  zoom?: number
  isBookmarked?: boolean
  onBookmarkToggle?: (page: number) => void
  className?: string
  children?: React.ReactNode
}

// react-pageflip REQUIRES forwardRef
const BookPage = forwardRef<HTMLDivElement, Props>(
  ({ pdfDoc, pageNum, width, height, filterStyle, zoom = 100, isBookmarked, onBookmarkToggle, className, children }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const taskRef = useRef<any>(null)

    useEffect(() => {
      if (!pdfDoc || !canvasRef.current || !pageNum) return
      let cancelled = false

      async function render() {
        taskRef.current?.cancel()
        try {
          const page = await pdfDoc.getPage(pageNum)
          if (cancelled) return
          const vp0 = page.getViewport({ scale: 1 })
          const scale = Math.min(
            (width - 24) / vp0.width,
            (height - 24) / vp0.height,
            3
          )
          const vp = page.getViewport({ scale })
          const canvas = canvasRef.current!
          canvas.width = vp.width
          canvas.height = vp.height
          const ctx = canvas.getContext('2d')!
          const task = page.render({ canvasContext: ctx, viewport: vp })
          taskRef.current = task
          await task.promise
        } catch (e: any) {
          if (e?.name !== 'RenderingCancelledException') console.error(e)
        }
      }

      render()
      return () => { cancelled = true; taskRef.current?.cancel() }
    }, [pdfDoc, pageNum, width, height])

    return (
      // The outer div is what react-pageflip grabs via ref
      <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}
        style={{ background: 'var(--paper)', userSelect: 'none' }}
      >
        {/* Page texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.18) 0%, transparent 60%)',
          }}
        />

        {/* Bookmark ribbon */}
        {onBookmarkToggle && (
          <button
            onClick={(e) => { e.stopPropagation(); onBookmarkToggle(pageNum) }}
            title="Marcar página"
            className="absolute top-0 right-5 z-20 transition-all duration-200 hover:scale-110"
            style={{
              width: 22,
              height: 38,
              background: isBookmarked ? '#c4713a' : 'rgba(196,113,58,0.25)',
              clipPath: 'polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)',
              transition: 'background 0.25s',
            }}
          />
        )}

        {/* Canvas */}
        <div
          className="w-full h-full flex items-center justify-center overflow-hidden"
          style={{ filter: filterStyle, transition: 'filter 0.5s' }}
        >
          <div style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <canvas
              ref={canvasRef}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Page number */}
        <span
          className="absolute bottom-3 left-0 right-0 text-center text-[10px] pointer-events-none z-20"
          style={{ color: 'var(--ink-muted)', fontFamily: 'DM Sans, sans-serif' }}
        >
          {pageNum}
        </span>

        {children}
      </div>
    )
  }
)

BookPage.displayName = 'BookPage'
export default BookPage
