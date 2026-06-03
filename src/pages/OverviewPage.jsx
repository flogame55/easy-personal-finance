import { useState } from 'react'
import { monthLabel, fmt, pct } from '../constants'
import StatCard from '../components/StatCard'
import AddPanel from '../components/AddPanel'
import DonutPanel from '../components/DonutPanel'
import TxnRow from '../components/TxnRow'
import ConfirmModal from '../components/ConfirmModal'
import MonthPicker from '../components/MonthPicker'
import { S } from '../styles'

export default function OverviewPage({ txns, salary, onAdd, onDelete, onUpdate, setPage, selectedMonth, setSelectedMonth, onResetData }) {
  const [showReset, setShowReset] = useState(false)
  
  const month = selectedMonth
  const monthTxns = txns.filter((t) => t.date.startsWith(month))
  const totalSpent  = monthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amt, 0)
  const balance     = monthTxns.reduce((s, t) => t.type === 'income' ? s + t.amt : s - t.amt, 0)
  const allTimeBalance = txns.reduce((s, t) => t.type === 'income' ? s + t.amt : s - t.amt, 0)
  
  // Filter recent by monthTxns instead of all txns
  const recent      = [...monthTxns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
  
  const [balanceView, setBalanceView] = useState('monthly')

  const handleReset = () => {
    onResetData()
    setShowReset(false)
  }

  const isMonthly = balanceView === 'monthly'
  const balanceAction = (
    <div 
      onClick={() => setBalanceView(isMonthly ? 'total' : 'monthly')}
      style={{ 
        display: 'flex', alignItems: 'center', background: '#090d14', 
        borderRadius: 99, padding: 2, cursor: 'pointer', border: '1px solid #1e2537'
      }}
    >
      <div style={{
        padding: '3px 8px', fontSize: 10, fontWeight: 600, borderRadius: 99, transition: 'all 0.2s',
        background: isMonthly ? '#3b82f6' : 'transparent',
        color: isMonthly ? '#fff' : '#64748b'
      }}>
        Month
      </div>
      <div style={{
        padding: '3px 8px', fontSize: 10, fontWeight: 600, borderRadius: 99, transition: 'all 0.2s',
        background: !isMonthly ? '#a855f7' : 'transparent',
        color: !isMonthly ? '#fff' : '#64748b'
      }}>
        Total
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={S.pageTitle}>Overview</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button 
            onClick={() => setShowReset(true)}
            style={{ ...S.btnSmall, background: '#2a0f0f', color: '#f87171', borderColor: '#4a1a1a' }}
          >
            Reset
          </button>
          <MonthPicker value={month} onChange={setSelectedMonth} />
        </div>
      </div>

      {/* stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        <StatCard 
          label={balanceView === 'monthly' ? "Monthly Balance" : "Total Balance"}
          value={fmt(balanceView === 'monthly' ? balance : allTimeBalance)}
          sub={balanceView === 'monthly' ? "This month" : "All time"}
          accent={balanceView === 'monthly' ? "blue" : "purple"}
          action={balanceAction}
        />
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
        {recent.map((t) => <TxnRow key={t.id} txn={t} onDelete={onDelete} onUpdate={onUpdate} />)}
      </div>

      {showReset && (
        <ConfirmModal
          title="Reset Data"
          message="Are you sure you want to delete all transactions? This action cannot be undone."
          onConfirm={handleReset}
          onCancel={() => setShowReset(false)}
        />
      )}
    </div>
  )
}
