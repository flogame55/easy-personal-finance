import { currentMonth, monthLabel, fmt, pct } from '../constants'
import StatCard from '../components/StatCard'
import AddPanel from '../components/AddPanel'
import DonutPanel from '../components/DonutPanel'
import TxnRow from '../components/TxnRow'
import { S } from '../styles'

export default function OverviewPage({ txns, salary, onAdd, onDelete, setPage }) {
  const month = currentMonth()
  const monthTxns = txns.filter((t) => t.date.startsWith(month))
  const totalSpent  = monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amt, 0)
  const balance     = txns.reduce((s, t) => t.type === 'income' ? s + t.amt : s - t.amt, 0)
  const recent      = [...txns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={S.pageTitle}>Overview</h1>
        <div style={{ fontSize: 12, color: '#475569', background: '#151b27', border: '1px solid #1e2537', borderRadius: 8, padding: '6px 12px' }}>
          📅 {monthLabel(month + '-01')}
        </div>
      </div>

      {/* stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        <StatCard label="Balance"          value={fmt(balance)}      sub="All time"           accent="blue"  />
        <StatCard label="Salary"           value={fmt(salary)}       sub="Monthly fixed"      accent="green" />
        <StatCard label="Spent this month" value={fmt(totalSpent)}   sub={salary > 0 ? `${pct(totalSpent, salary)}% of salary` : ''} accent="red" />
      </div>

      {/* add panel + donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 14 }}>
        <AddPanel onAdd={onAdd} />
        <DonutPanel txns={txns} month={month} />
      </div>

      {/* recent transactions */}
      <div style={S.panel}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Recent transactions</div>
          <button
            onClick={() => setPage('transactions')}
            style={{ fontSize: 12, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            View all →
          </button>
        </div>
        {recent.length === 0 && (
          <div style={{ color: '#475569', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
            No transactions yet. Add one above!
          </div>
        )}
        {recent.map((t) => <TxnRow key={t.id} txn={t} onDelete={onDelete} />)}
      </div>
    </div>
  )
}
