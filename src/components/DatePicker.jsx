import { useState } from 'react'
import { S } from '../styles'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  
  const baseDate = new Date(value || new Date())
  if (isNaN(baseDate.getTime())) {
    baseDate.setTime(new Date().getTime())
  }
  
  const [viewMonth, setViewMonth] = useState(baseDate.getMonth())
  const [viewYear, setViewYear] = useState(baseDate.getFullYear())

  const handleOpen = () => {
    const curr = new Date(value || new Date())
    if (!isNaN(curr.getTime())) {
      setViewMonth(curr.getMonth())
      setViewYear(curr.getFullYear())
    }
    setOpen(true)
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const startDay = new Date(viewYear, viewMonth, 1).getDay()
  
  const handlePrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else { setViewMonth(m => m - 1); }
  }
  const handleNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else { setViewMonth(m => m + 1); }
  }

  const selectDate = (day) => {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    onChange(`${viewYear}-${mm}-${dd}`)
    setOpen(false)
  }

  const grid = []
  for (let i = 0; i < startDay; i++) grid.push(null)
  for (let i = 1; i <= daysInMonth; i++) grid.push(i)

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={handleOpen}
        style={{ ...S.input, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}
      >
        <span>{value || 'Select date'}</span>
        <span style={{ fontSize: 10, color: '#64748b' }}>▼</span>
      </div>

      {open && (
        <>
          <div 
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 90 }}
          />
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: 8,
            width: 250, background: '#0d1520', border: '1px solid #1e2537',
            borderRadius: 14, padding: '16px', zIndex: 100,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button onClick={handlePrev} style={{ ...S.btnGhost, padding: '4px 8px' }}>&lt;</button>
              <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 14 }}>
                {MONTHS[viewMonth]} {viewYear}
              </div>
              <button onClick={handleNext} style={{ ...S.btnGhost, padding: '4px 8px' }}>&gt;</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, color: '#64748b', fontWeight: 600 }}>{d}</div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {grid.map((day, i) => {
                if (!day) return <div key={i} />
                const isSelected = value === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const isToday = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                
                let bg = 'transparent'
                let color = '#94a3b8'
                let border = '1px solid transparent'
                
                if (isSelected) {
                  bg = '#1d4ed8'
                  color = '#fff'
                } else if (isToday) {
                  color = '#38bdf8'
                  border = '1px solid #38bdf8'
                  bg = '#0f172a'
                }

                return (
                  <button
                    key={i}
                    onClick={() => selectDate(day)}
                    style={{
                      width: '100%', aspectRatio: '1/1',
                      borderRadius: 6, border, background: bg, color,
                      fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: isSelected || isToday ? 600 : 400
                    }}
                  >
                    {day}
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
