// src/lib/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { savePdf, deletePdf } from './pdfStorage'

export interface ReaderSettings {
  theme: 'light' | 'dark'
  sepia: number // 0–100
  zoom: number  // 100–200 (%)
}

export interface SavedBook {
  id: string
  name: string
  totalPages: number
  lastPage: number
  bookmarks: number[]
  addedAt: number // timestamp
}

export interface BookProgress {
  [bookId: string]: {
    page: number
    bookmarks: number[]
  }
}

interface ReaderStore {
  // Biblioteca
  library: SavedBook[]
  addToLibrary: (book: Omit<SavedBook, 'addedAt'>) => void
  removeFromLibrary: (id: string) => void
  updateLibraryBook: (id: string, partial: Partial<SavedBook>) => void

  // Livro aberto (File não é persistido)
  pdfFile: File | null
  bookId: string
  bookName: string
  totalPages: number
  currentPage: number

  // Settings
  settings: ReaderSettings

  // Progress
  progress: BookProgress

  // Actions
  loadBook: (file: File) => void
  unloadBook: () => void
  setPage: (page: number) => void
  toggleBookmark: (page?: number) => void
  removeBookmark: (page: number) => void
  updateSettings: (partial: Partial<ReaderSettings>) => void
  setTotalPages: (n: number) => void
}

export function bookIdFromFile(file: File): string {
  return btoa(file.name + file.size)
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 24)
}

export const useReaderStore = create<ReaderStore>()(
  persist(
    (set, get) => ({
      library: [],

      addToLibrary: (book) => {
        const { library } = get()
        const exists = library.find((b) => b.id === book.id)
        if (exists) return
        set({ library: [{ ...book, addedAt: Date.now() }, ...library] })
      },

      removeFromLibrary: (id) => {
        deletePdf(id).catch(console.error)
        set((s) => ({ library: s.library.filter((b) => b.id !== id) }))
      },

      updateLibraryBook: (id, partial) =>
        set((s) => ({
          library: s.library.map((b) => (b.id === id ? { ...b, ...partial } : b)),
        })),

      pdfFile: null,
      bookId: '',
      bookName: '',
      totalPages: 0,
      currentPage: 1,

      settings: {
        theme: 'light',
        sepia: 0,
        zoom: 100,
      },

      progress: {},

      loadBook: (file) => {
        const bookId = bookIdFromFile(file)
        const saved = get().progress[bookId]
        // Salva o PDF no IndexedDB para recuperar depois sem re-upload
        savePdf(bookId, file).catch(console.error)
        set({
          pdfFile: file,
          bookId,
          bookName: file.name.replace(/\.pdf$/i, ''),
          currentPage: saved?.page ?? 1,
          totalPages: 0,
        })
      },

      unloadBook: () =>
        set({ pdfFile: null, bookId: '', bookName: '', currentPage: 1, totalPages: 0 }),

      setTotalPages: (n) => {
        set({ totalPages: n })
        // Atualiza biblioteca
        const { bookId, bookName, progress, library } = get()
        if (!bookId) return
        const bookmarks = progress[bookId]?.bookmarks ?? []
        const lastPage = progress[bookId]?.page ?? 1
        const exists = library.find((b) => b.id === bookId)
        if (!exists) {
          get().addToLibrary({ id: bookId, name: bookName, totalPages: n, lastPage, bookmarks })
        } else {
          get().updateLibraryBook(bookId, { totalPages: n })
        }
      },

      setPage: (page) => {
        const { bookId, totalPages, progress } = get()
        const p = Math.max(1, Math.min(page, totalPages || page))
        const updated = {
          ...progress,
          [bookId]: {
            bookmarks: progress[bookId]?.bookmarks ?? [],
            page: p,
          },
        }
        set({ currentPage: p, progress: updated })
        get().updateLibraryBook(bookId, { lastPage: p })
      },

      toggleBookmark: (page) => {
        const { bookId, currentPage, progress } = get()
        const p = page ?? currentPage
        const existing = progress[bookId]?.bookmarks ?? []
        const bookmarks = existing.includes(p)
          ? existing.filter((b) => b !== p)
          : [...existing, p].sort((a, b) => a - b)
        set({
          progress: {
            ...progress,
            [bookId]: { page: progress[bookId]?.page ?? p, bookmarks },
          },
        })
        get().updateLibraryBook(bookId, { bookmarks })
      },

      removeBookmark: (page) => {
        const { bookId, progress } = get()
        const bookmarks = (progress[bookId]?.bookmarks ?? []).filter((b) => b !== page)
        set({ progress: { ...progress, [bookId]: { ...progress[bookId], bookmarks } } })
        get().updateLibraryBook(bookId, { bookmarks })
      },

      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),
    }),
    {
      name: 'folio-reader',
      partialize: (s) => ({
        settings: s.settings,
        progress: s.progress,
        library: s.library,
      }),
    }
  )
)
