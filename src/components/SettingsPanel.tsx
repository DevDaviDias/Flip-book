// src/components/SettingsPanel.tsx
'use client'
import { useEffect } from 'react'
import { useReaderStore } from '@/lib/store'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SettingsPanel({ open, onClose }: Props) {
  const settings = useReaderStore((s) => s.settings)
  const updateSettings = useReaderStore((s) => s.updateSettings)

  // Aplica sépia via CSS var
  useEffect(() => {
    document.documentElement.style.setProperty('--sepia', `${settings.sepia}%`)
  }, [settings.sepia])

  // Aplica dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark')
  }, [settings.theme])

  const isDark = settings.theme === 'dark'

  const panelBg = isDark ? '#1e1a16' : '#fdfaf4'
  const textColor = isDark ? '#e8ddd0' : '#2a1f14'
  const mutedColor = isDark ? '#6a5a4a' : '#8a7a6a'
  const dividerColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.28)' }}
        onClick={onClose}
      />

      <aside
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{
          width: 'min(300px, 88vw)',
          background: panelBg,
          borderRadius: '20px 0 0 20px',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.2)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 shrink-0"
          style={{ borderBottom: `1px solid ${dividerColor}` }}
        >
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.1rem', color: textColor }}>
            Ajustes
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
            style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#f0ebe0', color: mutedColor }}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8">

          {/* Tema */}
          <div>
            <Label text="Tema" color={mutedColor} />
            <div className="flex gap-2 mt-3">
              {([
                { value: 'light', icon: '☀️', label: 'Claro' },
                { value: 'dark', icon: '🌙', label: 'Escuro' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateSettings({ theme: opt.value })}
                  className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm transition-all"
                  style={{
                    border: `1.5px solid ${settings.theme === opt.value ? '#c4713a' : (isDark ? '#3a2e24' : '#e0d8cc')}`,
                    background: settings.theme === opt.value ? 'rgba(196,113,58,0.1)' : 'transparent',
                    color: settings.theme === opt.value ? '#c4713a' : mutedColor,
                    fontFamily: '"DM Sans", sans-serif',
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                  <span style={{ fontSize: '0.8rem' }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Zoom */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label text="Zoom" color={mutedColor} />
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: mutedColor }}>
                {settings.zoom ?? 100}%
              </span>
            </div>

            <div className="flex gap-1.5 mb-4">
              {[
                { label: '100%', value: 100 },
                { label: '125%', value: 125 },
                { label: '150%', value: 150 },
                { label: '200%', value: 200 },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => updateSettings({ zoom: p.value })}
                  className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: (settings.zoom ?? 100) === p.value
                      ? 'rgba(196,113,58,0.15)'
                      : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                    border: `1.5px solid ${(settings.zoom ?? 100) === p.value ? '#c4713a' : 'transparent'}`,
                    color: (settings.zoom ?? 100) === p.value ? '#c4713a' : mutedColor,
                    fontFamily: '"DM Sans", sans-serif',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <input
              type="range"
              min={100}
              max={200}
              step={5}
              value={settings.zoom ?? 100}
              onChange={(e) => updateSettings({ zoom: parseInt(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#c4713a' }}
            />
          </div>

          {/* Sépia */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label text="Tom de página" color={mutedColor} />
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: mutedColor }}>
                {settings.sepia === 0 ? 'Normal' : settings.sepia < 40 ? 'Suave' : settings.sepia < 70 ? 'Sépia' : 'Vintage'}
              </span>
            </div>

            {/* Preset buttons */}
            <div className="flex gap-1.5 mb-4">
              {[
                { label: '📄', value: 0, tip: 'Normal' },
                { label: '📜', value: 30, tip: 'Suave' },
                { label: '📰', value: 60, tip: 'Sépia' },
                { label: '🗞️', value: 90, tip: 'Vintage' },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => updateSettings({ sepia: p.value })}
                  title={p.tip}
                  className="flex-1 py-2 rounded-lg text-base transition-all"
                  style={{
                    background: Math.abs(settings.sepia - p.value) < 15
                      ? 'rgba(196,113,58,0.15)'
                      : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                    border: `1.5px solid ${Math.abs(settings.sepia - p.value) < 15 ? '#c4713a' : 'transparent'}`,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={settings.sepia}
              onChange={(e) => updateSettings({ sepia: parseInt(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#c4713a' }}
            />
          </div>

          {/* Dica */}
          <p
            className="text-center"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.75rem',
              color: isDark ? '#3a2e24' : '#c0b0a0',
              lineHeight: 1.5,
            }}
          >
            Dica: use as setas ← → ou arraste as páginas para navegar
          </p>
        </div>
      </aside>
    </>
  )
}

function Label({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        display: 'block',
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '0.7rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color,
      }}
    >
      {text}
    </span>
  )
}
