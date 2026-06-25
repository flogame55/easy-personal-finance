import { S } from '../styles'

const NAV = [
  { id: 'overview',     label: 'Overview',    icon: '▦' },
  { id: 'transactions', label: 'Txns',        icon: '≡' },
  { id: 'budgets',      label: 'Budgets',     icon: '◎' },
  { id: 'settings',     label: 'Settings',    icon: '⚙' },
]

export default function Sidebar({ page, setPage }) {
  return (
    /* ↓ No inline position/height/flexDirection — CSS class handles it on mobile */
    <aside className="sidebar-nav">
      {/* Logo — hidden on mobile via CSS .sidebar-logo */}
      <div className="sidebar-logo" style={S.logo}>
        <span style={S.logoMark}>M</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>Moneta</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>personal finance</div>
        </div>
      </div>

      {NAV.map((it) => {
        const isActive = page === it.id
        return (
          <button
            key={it.id}
            onClick={() => setPage(it.id)}
            className={`sidebar-nav-btn${isActive ? ' sidebar-nav-btn-active' : ''}`}
          >
            <span className="sidebar-nav-icon">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        )
      })}
    </aside>
  )
}
