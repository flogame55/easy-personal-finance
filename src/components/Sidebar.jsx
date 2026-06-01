import { S } from '../styles'

const NAV = [
  { id: 'overview',     label: 'Overview',      icon: '▦' },
  { id: 'transactions', label: 'Transactions',   icon: '≡' },
  { id: 'budgets',      label: 'Budgets',        icon: '◎' },
  { id: 'settings',     label: 'Settings',       icon: '⚙' },
]

export default function Sidebar({ page, setPage }) {
  return (
    <aside style={S.sidebar}>
      <div style={S.logo}>
        <span style={S.logoMark}>M</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>Moneta</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>personal finance</div>
        </div>
      </div>
      <nav style={{ marginTop: 8 }}>
        {NAV.map((it) => (
          <button
            key={it.id}
            onClick={() => setPage(it.id)}
            style={{ ...S.navItem, ...(page === it.id ? S.navActive : {}) }}
          >
            <span style={{ fontSize: 16 }}>{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
