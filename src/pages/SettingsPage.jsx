import { useState, useRef } from 'react'
import { CATS, fmt } from '../constants'
import BudgetBar from '../components/BudgetBar'
import { S } from '../styles'

export default function SettingsPage({ txns, setTxns, salary, onSaveSalary, budgets, setBudgets, onUpdateLimit }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(salary)
  const fileRef = useRef()

  const save = () => {
    const v = parseFloat(draft)
    if (v > 0) { onSaveSalary(v); setEditing(false) }
  }

  const exportData = () => {
    const dataStr = JSON.stringify({ salary, budgets, txns }, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `moneta_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (data.salary) onSaveSalary(data.salary)
        if (data.budgets) setBudgets(data.budgets)
        if (data.txns) setTxns(data.txns)
        alert('Data imported successfully!')
      } catch (err) {
        alert('Invalid backup file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={S.pageTitle}>Settings</h1>

      {/* salary card */}
      <div style={S.panel}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 14 }}>Monthly salary</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(salary)}
            </div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
              Fixed income — shown as income on the 1st of each month
            </div>
          </div>
          {!editing && (
            <button onClick={() => { setDraft(salary); setEditing(true) }} style={S.btnGhost}>
              ✏ Edit
            </button>
          )}
        </div>
        {editing && (
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <input
              type="number"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              style={{ ...S.input, flex: 1 }}
              placeholder="Enter new salary"
              autoFocus
            />
            <button onClick={save} style={{ ...S.btnPrimary, width: 'auto' }}>Save</button>
            <button onClick={() => setEditing(false)} style={S.btnGhost}>Cancel</button>
          </div>
        )}
      </div>

      {/* budget limits */}
      <div style={S.panel}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>Budget limits per category</div>
        <div style={{ fontSize: 11, color: '#475569', marginBottom: 16 }}>
          Set a monthly spending ceiling for each category.
        </div>
        {CATS.map((cat) => (
          <BudgetBar key={cat} cat={cat} spent={0} limit={budgets[cat]} onUpdateLimit={onUpdateLimit} />
        ))}
      </div>

      {/* data note */}
      <div style={S.panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Data & Privacy</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importData} />
            <button onClick={() => fileRef.current.click()} style={{ ...S.btnSmall, background: '#1e2537', color: '#e2e8f0', border: 'none' }}>
              📂 Import
            </button>
            <button onClick={exportData} style={{ ...S.btnSmall, background: '#1e2537', color: '#e2e8f0', border: 'none' }}>
              💾 Export
            </button>
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
          All data is stored locally in your browser via <code style={{ color: '#94a3b8' }}>localStorage</code>. Nothing is sent to any server.
          Receipt images are processed entirely on-device using Tesseract.js.
          <strong> Make sure to export your data regularly to prevent data loss.</strong>
        </div>
      </div>
    </div>
  )
}
