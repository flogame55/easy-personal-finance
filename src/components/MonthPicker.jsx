import { useState } from 'react'
import { monthLabel } from '../constants'
import { S } from '../styles'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function MonthPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const initialYear = value ? parseInt(value.split('-')[0], 10) : new Date().getFullYear()
  const [viewYear, setViewYear] = useState(initialYear)

  const handleOpen = () => {
    setViewYear(value ? parseInt(value.split('-')[0], 10) : new Date().getFullYear())
    setOpen(!open)
  }

  const selectMonth = (mIndex) => {
    const mm = String(mIndex + 1).padStart(2, '0')
    onChange(`${viewYear}-${mm}`)
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={handleOpen}
        style={{ ...S.monthInput, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <span>📅</span> {monthLabel(value + '-01')}
      </button>

      {open && (
        <>
          {/* Overlay — click to close, on mobile has dark bg */}
          <div
            className="month-picker-overlay"
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 90 }}
          />
          <div
            className="month-picker-dropdown"
            style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              width: 230, background: '#0d1520', border: '1px solid #1e2537',
              borderRadius: 14, padding: '16px', zIndex: 100,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button 
                onClick={() => setViewYear(v => v - 1)}
                style={S.btnGhost}
              >
                &lt;
              </button>
              <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 14 }}>{viewYear}</div>
              <button 
                onClick={() => setViewYear(v => v + 1)}
                style={S.btnGhost}
              >
                &gt;
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {MONTHS.map((m, i) => {
                const isSelected = value === `${viewYear}-${String(i + 1).padStart(2, '0')}`
                const isCurrentMonth = new Date().getFullYear() === viewYear && new Date().getMonth() === i

                let border = '1px solid #1e2537'
                let bg = '#151b27'
                let color = '#94a3b8'

                if (isSelected) {
                  border = '1px solid #3b82f6'
                  bg = '#1e3a8a'
                  color = '#93c5fd'
                } else if (isCurrentMonth) {
                  border = '1px solid #38bdf8'
                  bg = '#0f172a'
                  color = '#38bdf8'
                }

                return (
                  <button
                    key={m}
                    onClick={() => selectMonth(i)}
                    style={{
                      padding: '8px 0',
                      borderRadius: 8,
                      border,
                      background: bg,
                      color,
                      fontSize: 12,
                      cursor: 'pointer',
                      fontWeight: isSelected || isCurrentMonth ? 600 : 400
                    }}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
