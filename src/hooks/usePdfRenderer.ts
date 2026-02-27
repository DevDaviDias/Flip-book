// src/hooks/usePdfRenderer.ts
'use client' 

import { useEffect, useRef, useState, useCallback } from 'react'

type PDFDocumentProxy = import('pdfjs-dist/types/src/display/api').PDFDocumentProxy

export function usePdfRenderer() {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)
  const [loading, setLoading] = useState(false)
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null)

  const loadDocument = useCallback(async (file: File) => {
    setLoading(true)
    const pdfjsLib = (await import('pdfjs-dist')) as typeof import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
    const arrayBuffer = await file.arrayBuffer()
    const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    setPdfDoc(doc as unknown as PDFDocumentProxy)
    setLoading(false)
  }, [])

  const renderPageToCanvas = useCallback(
    async (
      pageNum: number,
      canvas: HTMLCanvasElement,
      maxW: number,
      maxH: number
    ) => {
      if (!pdfDoc) return
      renderTaskRef.current?.cancel()
      const page = await (pdfDoc as any).getPage(pageNum)
      const vp0 = page.getViewport({ scale: 1 })
      const scale = Math.min((maxW - 32) / vp0.width, (maxH - 32) / vp0.height, 2.5)
      const vp = page.getViewport({ scale })
      canvas.width = vp.width
      canvas.height = vp.height
      const ctx = canvas.getContext('2d')!
      const task = page.render({ canvasContext: ctx, viewport: vp })
      renderTaskRef.current = task
      try {
        await task.promise
      } catch (e: any) {
        if (e?.name !== 'RenderingCancelledException') throw e
      }
    },
    [pdfDoc]
  )

  return { pdfDoc, loading, loadDocument, renderPageToCanvas }
}
