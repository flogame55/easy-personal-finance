import { useState } from 'react'
import { CAT_ICONS } from '../constants'
import { fmt } from '../constants'

export default function TxnRow({ txn, onDelete }) {
  const [hover, setHover] = useState(false)
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
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: txn.type === 'income' ? '#4ade80' : '#f87171', fontVariantNumeric: 'tabular-nums' }}>
          {txn.type === 'income' ? '+' : '−'}{fmt(txn.amt)}
        </div>
        {hover && (
          <button
            onClick={() => onDelete(txn.id)}
            style={{ fontSize: 10, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', marginTop: 2 }}
          >
            remove
          </button>
        )}
      </div>
    </div>
  )
}
