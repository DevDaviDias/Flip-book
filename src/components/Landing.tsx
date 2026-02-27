// src/components/Landing.tsx
'use client'
import { useCallback, useRef } from 'react'
import { useReaderStore } from '@/lib/store'

export default function Landing() {
  const loadBook = useReaderStore((s) => s.loadBook)
  const inputRef = useRef<HTMLInputElement>(null)
  const isDragging = useRef(false)

  const handleFile = useCallback(
    (file: File | null | undefined) => {
      if (!file || file.type !== 'application/pdf') return
      loadBook(file)
    },
    [loadBook]
  )

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-bg-light dark:bg-bg-dark px-4 animate-fade-in">
      <h1 className="font-serif text-[clamp(3rem,10vw,6rem)] font-normal text-stone-800 dark:text-stone-100 tracking-tight mb-1">
        Folio
      </h1>
      <p className="text-xs tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400 mb-12">
        Your PDF, beautifully read
      </p>

      {/* Drop zone */}
      <div
        className="
          w-full max-w-md aspect-[4/3] rounded-3xl border-2 border-dashed border-stone-300 dark:border-stone-600
          bg-paper-light dark:bg-paper-dark
          flex flex-col items-center justify-center gap-4
          cursor-pointer relative overflow-hidden
          transition-all duration-300
          hover:border-accent hover:-translate-y-1 hover:shadow-2xl
          group
        "
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-accent') }}
        onDragLeave={(e) => e.currentTarget.classList.remove('border-accent')}
        onDrop={(e) => {
          e.preventDefault()
          e.currentTarget.classList.remove('border-accent')
          handleFile(e.dataTransfer.files[0])
        }}
      >
        {/* Glow on hover */}
        <div className="absolute inset-0 bg-gradient-radial from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <span className="text-5xl opacity-40">📖</span>
        <p className="font-serif text-xl text-stone-500 dark:text-stone-400">Arraste seu PDF aqui</p>
        <p className="text-sm text-stone-400">ou</p>

        <button
          className="
            mt-1 px-6 py-2.5 rounded-full
            bg-accent text-white font-medium text-sm tracking-wide
            shadow-[0_8px_24px_rgba(196,113,58,0.3)]
            hover:bg-[#b5622c] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(196,113,58,0.4)]
            transition-all duration-200
          "
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
        >
          Escolher arquivo
        </button>

        <p className="text-xs text-stone-400 opacity-70">Somente arquivos .pdf</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Features */}
      <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl w-full">
        {[
          { icon: '📖', label: 'Dupla página' },
          { icon: '🔖', label: 'Favoritos' },
          { icon: '🌙', label: 'Modo escuro' },
          { icon: '☕', label: 'Filtro sépia' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-paper-light/60 dark:bg-paper-dark/60 text-stone-500 dark:text-stone-400"
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
