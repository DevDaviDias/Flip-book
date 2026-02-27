# 📖 Folio — PDF Book Reader

Leitor de PDF elegante com **virada de página física real** via `react-pageflip` (StPageFlip engine).
Inspirado no Apple Books. Funciona no desktop (página dupla) e mobile.

## 🚀 Instalação

```bash
npm install
npm run dev
```

## 📦 Tech Stack

| Biblioteca         | Por quê?                                           |
|--------------------|----------------------------------------------------|
| **Next.js 14**     | App Router, dynamic imports (SSR-safe), performance|
| **Tailwind CSS**   | Utilitários, dark mode, responsividade             |
| **react-pageflip** | Virada de página física realista (StPageFlip)      |
| **PDF.js**         | Renderiza PDF em `<canvas>` no browser             |
| **Zustand**        | Estado global com persistência no localStorage     |

## ✨ Funcionalidades

- **🔄 Virada física** — react-pageflip com animação real de livro (dobra, sombra, perspectiva)
- **📖 Página dupla** — Layout spread no desktop (≥860px), simples no mobile
- **📔 Capa personalizada** — Capa e contracapa estilo livro de luxo
- **🔖 Marcadores** — Ribbon laranja na página, painel de listagem
- **☕ Filtros** — Sépia, brilho, contraste em tempo real
- **🌙 Tema escuro** — (extensível via settings)
- **💾 Progresso salvo** — Retoma da última página lida
- **⌨️ Teclado** — Setas para navegar
- **👆 Swipe** — Gesto de deslize no mobile (nativo do react-pageflip)
- **🫥 Barras autohide** — Somem após 3.5s de inatividade

## 🗂 Estrutura

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Landing.tsx        # Drop zone + import
│   ├── Reader.tsx         # HTMLFlipBook principal
│   ├── BookPage.tsx       # Página com forwardRef (obrigatório para react-pageflip)
│   ├── CoverPage.tsx      # Capa/contracapa escura dourada
│   ├── Toolbar.tsx        # Barra superior
│   ├── BottomBar.tsx      # Nav + slider de progresso
│   ├── SettingsPanel.tsx  # Painel de ajustes
│   ├── BookmarksPanel.tsx # Painel de favoritos
│   └── Toast.tsx
├── hooks/
│   └── usePdfRenderer.ts
└── lib/
    └── store.ts
```

## ⚠️ Importante sobre react-pageflip

Cada filho do `<HTMLFlipBook>` **deve** usar `forwardRef` — como no `BookPage` e `CoverPage`.
O componente é carregado via `dynamic(..., { ssr: false })` pois usa APIs do browser.
