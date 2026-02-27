// src/components/PageCanvas.tsx
'use client'
import { useEffect, useRef } from 'react'

interface Props {
  pdfDoc: any
  pageNum: number
  maxW: number
  maxH: number
  filterStyle: string
}

export default function PageCanvas({ pdfDoc, pageNum, maxW, maxH, filterStyle }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const taskRef = useRef<any>(null)

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || pageNum < 1) return
    const canvas = canvasRef.current!
    let cancelled = false

    async function render() {
      taskRef.current?.cancel()
      try {
        const page = await pdfDoc.getPage(pageNum)
        if (cancelled) return
        const vp0 = page.getViewport({ scale: 1 })
        const scale = Math.min((maxW - 32) / vp0.width, (maxH - 32) / vp0.height, 2.5)
        const vp = page.getViewport({ scale })
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
  }, [pdfDoc, pageNum, maxW, maxH])

  return (
    <div className="w-full h-full flex items-center justify-center p-4" style={{ filter: filterStyle, transition: 'filter 0.5s' }}>
      <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
    </div>
  )
}
