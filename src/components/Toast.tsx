// src/components/Toast.tsx
'use client'
import { useEffect, useState } from 'react'

interface Props {
  message: string
  visible: boolean
}

export default function Toast({ message, visible }: Props) {
  return (
    <div
      className={`
        fixed bottom-24 left-1/2 z-[200]
        -translate-x-1/2
        px-5 py-2.5 rounded-full text-sm font-medium
        bg-stone-800 dark:bg-stone-100
        text-stone-100 dark:text-stone-800
        shadow-xl pointer-events-none whitespace-nowrap
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
      `}
      style={{ transform: `translateX(-50%) translateY(${visible ? '0' : '8px'})` }}
    >
      {message}
    </div>
  )
}
