import { monthLabel, CATS } from '../constants'
import BudgetBar from '../components/BudgetBar'
import MonthPicker from '../components/MonthPicker'
import { S } from '../styles'

export default function BudgetsPage({ txns, budgets, onUpdateLimit, selectedMonth, setSelectedMonth }) {
  const month = selectedMonth

  const spentFor = (cat) =>
    txns
      .filter((t) => t.cat === cat && t.type === 'expense' && t.date.startsWith(month))
      .reduce((s, t) => s + t.amt, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={S.pageTitle}>Budgets</h1>
        <MonthPicker value={month} onChange={setSelectedMonth} />
      </div>

      <div style={S.panel}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>Monthly limits</div>
        <div style={{ fontSize: 11, color: '#475569', marginBottom: 16 }}>
          Click "Adjust limit" under any category to change it.
        </div>
        {CATS.map((cat) => (
          <BudgetBar
            key={cat}
            cat={cat}
            spent={spentFor(cat)}
            limit={budgets[cat]}
            onUpdateLimit={onUpdateLimit}
          />
        ))}
      </div>
    </div>
  )
}
