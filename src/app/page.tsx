// src/app/page.tsx
'use client'
import { useReaderStore } from '@/lib/store'
import Library from '@/components/Library'
import Reader from '@/components/Reader'

export default function Home() {
  const pdfFile = useReaderStore((s) => s.pdfFile)
  return pdfFile ? <Reader /> : <Library />
}
