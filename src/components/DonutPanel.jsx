import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CATS, CAT_COLORS, CAT_ICONS, currentMonth, fmt } from '../constants'

export default function DonutPanel({ txns, month }) {
  const m = month || currentMonth()
  const data = CATS.map((cat, i) => {
    const total = txns
      .filter((t) => t.cat === cat && t.type === 'expense' && t.date.startsWith(m))
      .reduce((s, t) => s + t.amt, 0)
    return { name: cat, value: total, color: CAT_COLORS[i] }
  }).filter((d) => d.value > 0)

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div style={{
      background: '#0d1520', border: '1px solid #1e2537', borderRadius: 14,
      padding: 18, display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Spending by category</div>

      {total > 0 ? (
        <>
          <div style={{ position: 'relative', height: 150 }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none',
              zIndex: 0
            }}>
              <div style={{ fontSize: 10, color: '#475569' }}>spent</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{fmt(total)}</div>
            </div>
            <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={44} outerRadius={62} dataKey="value" paddingAngle={2}>
                    {data.map((d, i) => <Cell key={i} fill={d.color} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmt(v)}
                    contentStyle={{ background: '#0d1117', border: '1px solid #1e2537', borderRadius: 8, fontSize: 12, color: '#e2e8f0', zIndex: 100 }}
                    itemStyle={{ color: '#e2e8f0' }}
                    labelStyle={{ display: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block', flexShrink: 0 }} />
                  <span>{CAT_ICONS[d.name]}</span> {d.name}
                </div>
                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: '#475569', fontSize: 13, padding: '32px 0' }}>
          No expenses this month yet.
        </div>
      )}
    </div>
  )
}
