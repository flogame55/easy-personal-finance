import { useState } from 'react'
import { CAT_ICONS, fmt, pct } from '../constants'
import { S } from '../styles'

export default function BudgetBar({ cat, spent, limit, onUpdateLimit }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(limit)

  const p = pct(spent, limit)
  const barColor = p >= 100 ? '#f87171' : p >= 80 ? '#fbbf24' : '#4ade80'

  const save = () => {
    const v = parseFloat(draft)
    if (v > 0) { onUpdateLimit(cat, v); setEditing(false) }
  }

  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid #1e2537' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{CAT_ICONS[cat]}</span>
          <span style={{ fontSize: 14, color: '#e2e8f0' }}>{cat}</span>
          {p >= 100 && (
            <span style={{ fontSize: 10, background: '#2a0f0f', color: '#f87171', border: '1px solid #4a1a1a', borderRadius: 99, padding: '2px 8px' }}>
              Over
            </span>
          )}
          {p >= 80 && p < 100 && (
            <span style={{ fontSize: 10, background: '#2a1f0a', color: '#fbbf24', border: '1px solid #4a3010', borderRadius: 99, padding: '2px 8px' }}>
              Near limit
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>
          <span style={{ color: '#94a3b8' }}>{fmt(spent)}</span> / {fmt(limit)}
        </div>
      </div>

      <div style={{ height: 6, background: '#1e2537', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ height: '100%', width: `${p}%`, background: barColor, borderRadius: 99, transition: 'width 0.4s ease' }} />
      </div>

      {editing ? (
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <input
            type="number"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={{ ...S.input, flex: 1 }}
            placeholder="New limit"
            autoFocus
          />
          <button onClick={save} style={S.btnSmall}>Save</button>
          <button onClick={() => setEditing(false)} style={{ ...S.btnSmall, background: '#1e2537', borderColor: '#1e2537', color: '#94a3b8' }}>
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setDraft(limit); setEditing(true) }}
          style={{ fontSize: 11, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          ✏ Adjust limit
        </button>
      )}
    </div>
  )
}
