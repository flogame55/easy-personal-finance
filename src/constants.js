export const CATS = ['Food', 'Transport', 'Shopping', 'Health', 'Bills', 'Other']

export const CAT_ICONS = {
  Food: '🥗',
  Transport: '🚌',
  Shopping: '🛍️',
  Health: '❤️',
  Bills: '🧾',
  Other: '⋯',
  Income: '💰',
}

export const CAT_COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#94a3b8']

export const DEFAULT_BUDGETS = {
  Food: 8000,
  Transport: 4000,
  Shopping: 4000,
  Health: 3000,
  Bills: 2000,
  Other: 2000,
}

export const currentMonth = () => new Date().toISOString().slice(0, 7)

export const todayStr = () => new Date().toISOString().split('T')[0]

export const fmt = (n) =>
  '฿' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export const pct = (a, b) => (b > 0 ? Math.min(Math.round((a / b) * 100), 100) : 0)

export const monthLabel = (d) => {
  const [y, m] = d.split('-')
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return names[parseInt(m) - 1] + ' ' + y
}

export const DEMO_TXNS = [
  { id: 'd1', date: currentMonth() + '-01', desc: 'Monthly salary',    cat: 'Income',    type: 'income',  amt: 42000 },
  { id: 'd2', date: currentMonth() + '-01', desc: 'Central Festival',  cat: 'Shopping',  type: 'expense', amt: 1240  },
  { id: 'd3', date: currentMonth() + '-02', desc: 'Grab ride',         cat: 'Transport', type: 'expense', amt: 95    },
  { id: 'd4', date: currentMonth() + '-03', desc: 'Big C Supermarket', cat: 'Food',      type: 'expense', amt: 340   },
  { id: 'd5', date: currentMonth() + '-04', desc: 'Internet bill',     cat: 'Bills',     type: 'expense', amt: 590   },
  { id: 'd6', date: currentMonth() + '-05', desc: 'Tops Market',       cat: 'Food',      type: 'expense', amt: 185   },
  { id: 'd7', date: currentMonth() + '-06', desc: 'Clinic visit',      cat: 'Health',    type: 'expense', amt: 450   },
]
