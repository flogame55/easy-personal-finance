import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DEFAULT_BUDGETS, DEMO_TXNS } from './constants'
import Sidebar from './components/Sidebar'
import OverviewPage     from './pages/OverviewPage'
import TransactionsPage from './pages/TransactionsPage'
import BudgetsPage      from './pages/BudgetsPage'
import SettingsPage     from './pages/SettingsPage'
import { S } from './styles'

export default function App() {
  const [page, setPage] = useState('overview')
  const [txns,    setTxns]    = useLocalStorage('moneta_txns',    DEMO_TXNS)
  const [salary,  setSalary]  = useLocalStorage('moneta_salary',  42000)
  const [budgets, setBudgets] = useLocalStorage('moneta_budgets', DEFAULT_BUDGETS)

  const addTxn    = (t)        => setTxns((prev) => [{ ...t, id: Date.now().toString() }, ...prev])
  const deleteTxn = (id)       => setTxns((prev) => prev.filter((t) => t.id !== id))
  const updateLimit = (cat, v) => setBudgets((prev) => ({ ...prev, [cat]: v }))

  return (
    <div style={S.app}>
      <div style={S.shell}>
        <Sidebar page={page} setPage={setPage} />
        <main style={S.main}>
          {page === 'overview'      && <OverviewPage     txns={txns} salary={salary} onAdd={addTxn} onDelete={deleteTxn} setPage={setPage} />}
          {page === 'transactions'  && <TransactionsPage txns={txns} onDelete={deleteTxn} />}
          {page === 'budgets'       && <BudgetsPage      txns={txns} budgets={budgets} onUpdateLimit={updateLimit} />}
          {page === 'settings'      && <SettingsPage     salary={salary} onSaveSalary={setSalary} budgets={budgets} onUpdateLimit={updateLimit} />}
        </main>
      </div>
    </div>
  )
}
