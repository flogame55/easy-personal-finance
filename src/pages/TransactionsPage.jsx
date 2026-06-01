import { useState } from 'react'
import { CATS } from '../constants'
import TxnRow from '../components/TxnRow'
import { S } from '../styles'

const FILTERS = ['All', 'Income', ...CATS]

export default function TransactionsPage({ txns, onDelete }) {
  const [filter, setFilter] = useState('All')

  const sorted   = [...txns].sort((a, b) => b.date.localeCompare(a.date))
  const filtered = filter === 'All' ? sorted : sorted.filter((t) => t.cat === filter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={S.pageTitle}>Transactions</h1>

      {/* filter pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontSize: 11, padding: '5px 12px', borderRadius: 99,
              border: '1px solid', cursor: 'pointer', transition: 'all 0.15s',
              borderColor: filter === f ? '#60a5fa' : '#1e2537',
              background:  filter === f ? '#0f1a2a' : '#151b27',
              color:       filter === f ? '#60a5fa' : '#64748b',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={S.panel}>
        {filtered.length === 0 && (
          <div style={{ color: '#475569', fontSize: 13, textAlign: 'center', padding: '28px 0' }}>
            No transactions found.
          </div>
        )}
        {filtered.map((t) => <TxnRow key={t.id} txn={t} onDelete={onDelete} />)}
      </div>
    </div>
  )
}
