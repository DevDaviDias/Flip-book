// src/components/CoverPage.tsx
'use client'
import { forwardRef } from 'react'

interface Props {
  bookName: string
  totalPages: number
  className?: string
  children?: React.ReactNode
}

const CoverPage = forwardRef<HTMLDivElement, Props>(
  ({ bookName, totalPages, className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden flex flex-col items-center justify-center ${className ?? ''}`}
        style={{
          background: 'linear-gradient(160deg, #2a1f14 0%, #1a1208 50%, #0f0a04 100%)',
          userSelect: 'none',
        }}
      >
        {/* Decorative grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '200px',
          }}
        />

        {/* Gold ornament top */}
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2 opacity-50">
            <div className="h-px w-12 bg-amber-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <div className="h-px w-12 bg-amber-400" />
          </div>
        </div>

        {/* Book icon */}
        <div className="text-6xl mb-6 opacity-80">📖</div>

        {/* Title */}
        <h1
          className="text-center px-8 leading-tight mb-3"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 4vw, 1.5rem)',
            color: '#f5e6c8',
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            maxWidth: '90%',
          }}
        >
          {bookName}
        </h1>

        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.7rem',
            color: '#8a7a5a',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          {totalPages} páginas
        </p>

        {/* Gold ornament bottom */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2 opacity-50">
            <div className="h-px w-12 bg-amber-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <div className="h-px w-12 bg-amber-400" />
          </div>
        </div>

        {children}
      </div>
    )
  }
)

CoverPage.displayName = 'CoverPage'
export default CoverPage
