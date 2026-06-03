# 💰 Moneta: Personal Finance Dashboard

Moneta is a clean, premium dark-themed personal finance dashboard built with **React** and **Vite**. Designed for speed, privacy, and ease of use, it runs entirely in your browser with zero server dependencies.

## ✨ Core Features

*   📷 **Receipt OCR (Thai & English)** — Drag & drop a receipt photo or Thai banking slip. Tesseract.js reads it locally on your device. Automatically parses Thai dates (Buddhist year conversion) and filters out banking headers.
*   ✏️ **Inline Editing & Manual Entry** — Log expenses or income in seconds. Hover over any transaction to instantly edit it inline!
*   📅 **Custom Date & Month Pickers** — Navigate your history with custom-built, dark-mode native pickers.
*   🎯 **Budget Limits** — Set per-category monthly ceilings with live progress bars and warnings.
*   🍩 **Dynamic Donut Charts** — Visual breakdown of your spending by category (powered by Recharts).
*   📱 **Fully Responsive** — Works beautifully on desktop and mobile screens.
*   💾 **100% Private (localStorage)** — All data persists securely in your browser. Nothing is ever sent to a server.
*   📂 **Data Backup (Export/Import)** — Safely export your data to a `.json` file and import it anytime.

## 🚀 Getting Started

1.  **Clone the repository & Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```
3.  **Open in your browser:**
    Go to `http://localhost:5173`

## 🛠️ Tech Stack
*   **Framework:** React 18 + Vite 5
*   **Charts:** Recharts
*   **AI/OCR:** Tesseract.js (On-device)
*   **Styling:** Vanilla CSS (CSS-in-JS + standard stylesheets)

## 📁 Folder Structure
*   `src/components/` - Reusable UI elements (Sidebar, StatCards, DatePicker, AddPanel)
*   `src/pages/` - Main dashboard views (Overview, Transactions, Budgets, Settings)
*   `src/utils/` - Logic helpers (`ocr.js` for Tesseract integration)
*   `src/styles.js` - Centralized design system tokens
*   `src/constants.js` - Shared configurations (Categories, Icons, formatting functions)
