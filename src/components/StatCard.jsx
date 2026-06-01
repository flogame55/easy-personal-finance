const ACCENTS = {
  green:   { bg: '#0f2a1a', val: '#4ade80', border: '#1a4a2a' },
  red:     { bg: '#2a0f0f', val: '#f87171', border: '#4a1a1a' },
  blue:    { bg: '#0f1a2a', val: '#93c5fd', border: '#1a2a4a' },
  default: { bg: '#151b27', val: '#e2e8f0', border: '#1e2537' },
}

export default function StatCard({ label, value, sub, accent }) {
  const c = ACCENTS[accent] || ACCENTS.default
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: '16px 18px' }}>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: c.val, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}
