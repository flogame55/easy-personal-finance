import { useState } from 'react'
import { CATS, CAT_ICONS, fmt } from '../constants'
import DatePicker from './DatePicker'
import { S } from '../styles'

export default function TxnRow({ txn, onDelete, onUpdate }) {
  const [hover, setHover] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // edit states
  const [editAmt, setEditAmt] = useState(txn.amt)
  const [editDate, setEditDate] = useState(txn.date)
  const [editDesc, setEditDesc] = useState(txn.desc)
  const [editCat, setEditCat] = useState(txn.cat)

  const handleSave = () => {
    const a = parseFloat(editAmt)
    if (!a || a <= 0) return
    onUpdate && onUpdate(txn.id, { amt: a, date: editDate, desc: editDesc || 'Transaction', cat: editCat })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div style={{ padding: '14px', marginBottom: 4, background: '#0f1a2e', border: '1px solid #1d4ed8', borderRadius: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div style={S.fg}>
            <label style={S.lbl}>Amount (฿)</label>
            <input type="number" value={editAmt} onChange={e => setEditAmt(e.target.value)} style={S.input} />
          </div>
          <div style={S.fg}>
            <label style={S.lbl}>Date</label>
            <DatePicker value={editDate} onChange={setEditDate} />
          </div>
        </div>
        <div style={S.fg}>
          <label style={S.lbl}>Description</label>
          <input value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ ...S.input, marginBottom: 8 }} />
        </div>
        <div style={S.fg}>
          <label style={S.lbl}>Category</label>
          <select value={editCat} onChange={e => setEditCat(e.target.value)} style={{ ...S.input, marginBottom: 12 }}>
            {txn.type === 'expense' && CATS.map(c => <option key={c} value={c}>{c}</option>)}
            {txn.type === 'income' && <option value="Income">Income</option>}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setIsEditing(false)} style={S.btnGhost}>Cancel</button>
          <button onClick={handleSave} style={{ ...S.btnPrimary, width: 'auto' }}>Save</button>
        </div>
      </div>
    )
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 10px', borderRadius: 10,
        background: hover ? '#151b27' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: txn.type === 'income' ? '#0f2a1a' : '#131c2e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17, flexShrink: 0,
      }}>
        {CAT_ICONS[txn.cat]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {txn.desc}
        </div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
          {txn.cat} · {txn.date}
        </div>
      </div>
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: txn.type === 'income' ? '#4ade80' : '#f87171', fontVariantNumeric: 'tabular-nums' }}>
          {txn.type === 'income' ? '+' : '−'}{fmt(txn.amt)}
        </div>
        {hover ? (
          <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
            <button onClick={() => setIsEditing(true)} style={{ fontSize: 10, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}>✏️ Edit</button>
            <button onClick={() => onDelete(txn.id)} style={{ fontSize: 10, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>🗑️ Delete</button>
          </div>
        ) : (
          <div style={{ height: 15 }} />
        )}
      </div>
    </div>
  )
}
