import { useState } from 'react'
import { CATS, fmt } from '../constants'
import BudgetBar from '../components/BudgetBar'
import { S } from '../styles'

export default function SettingsPage({ salary, onSaveSalary, budgets, onUpdateLimit }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(salary)

  const save = () => {
    const v = parseFloat(draft)
    if (v > 0) { onSaveSalary(v); setEditing(false) }
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
        <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 8 }}>Data & Privacy</div>
        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
          All data is stored locally in your browser via <code style={{ color: '#94a3b8' }}>localStorage</code>. Nothing is sent to any server.
          Receipt images are processed entirely on-device using Tesseract.js.
        </div>
      </div>
    </div>
  )
}
