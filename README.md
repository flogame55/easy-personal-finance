# 💰 Easy Personal Finance (Moneta)

A clean, dark-themed personal finance dashboard built with React + Vite.

## Features
- 📷 **Receipt OCR (Thai Support)** — drag & drop a receipt photo or Thai banking slip; Tesseract.js reads it locally (no server). Automatically parses Thai dates (Buddhist year conversion) and filters Thai banking headers.
- ✏ **Manual entry** — log expenses or income with category in seconds
- 🎯 **Budget limits** — set per-category monthly ceilings with live progress bars & warnings
- 💰 **Fixed salary** — set your monthly salary once, edit any time
- 🍩 **Spending donut** — visual breakdown by category
- 💾 **localStorage** — all data persists in your browser, nothing sent anywhere

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

## Build for production

```bash
npm run build
npm run preview
```

## Tech stack
- React 18
- Vite 5
- Recharts (donut chart)
- Tesseract.js 5 (on-device OCR)
- localStorage (persistence)

## Folder structure

```
src/
  components/   # Sidebar, StatCard, TxnRow, BudgetBar, AddPanel, DonutPanel
  pages/        # OverviewPage, TransactionsPage, BudgetsPage, SettingsPage
  hooks/        # useLocalStorage
  utils/        # ocr.js (Tesseract wrapper)
  constants.js  # shared data, helpers
  styles.js     # shared style tokens
```
