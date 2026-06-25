import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DEFAULT_BUDGETS, DEMO_TXNS, currentMonth } from './constants'
import Sidebar from './components/Sidebar'
import OverviewPage     from './pages/OverviewPage'
import TransactionsPage from './pages/TransactionsPage'
import BudgetsPage      from './pages/BudgetsPage'
import SettingsPage     from './pages/SettingsPage'
import { S } from './styles'

export default function App() {
  const [page, setPage] = useState('overview')
  const [selectedMonth, setSelectedMonth] = useState(currentMonth())
  
  const [txns,    setTxns]    = useLocalStorage('moneta_txns',    DEMO_TXNS)
  const [salary,  setSalary]  = useLocalStorage('moneta_salary',  42000)
  const [budgets, setBudgets] = useLocalStorage('moneta_budgets', DEFAULT_BUDGETS)

  const addTxn    = (t)        => setTxns((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev])
  const deleteTxn = (id)       => setTxns((prev) => prev.filter((t) => t.id !== id))
  const updateTxn = (id, newT) => setTxns((prev) => prev.map(t => t.id === id ? { ...t, ...newT } : t))
  const updateLimit = (cat, v) => setBudgets((prev) => ({ ...prev, [cat]: v }))
  const resetData = ()         => setTxns([])

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="shell-layout">
        <Sidebar page={page} setPage={setPage} />
        <main className="shell-main" style={S.main}>
          {page === 'overview'      && <OverviewPage     txns={txns} salary={salary} onAdd={addTxn} onDelete={deleteTxn} onUpdate={updateTxn} setPage={setPage} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} onResetData={resetData} />}
          {page === 'transactions'  && <TransactionsPage txns={txns} onDelete={deleteTxn} onUpdate={updateTxn} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />}
          {page === 'budgets'       && <BudgetsPage      txns={txns} budgets={budgets} onUpdateLimit={updateLimit} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />}
          {page === 'settings'      && <SettingsPage     txns={txns} setTxns={setTxns} salary={salary} onSaveSalary={setSalary} budgets={budgets} setBudgets={setBudgets} onUpdateLimit={updateLimit} />}
        </main>
      </div>
    </div>
  )
}
