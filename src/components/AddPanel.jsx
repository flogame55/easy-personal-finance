import { useState, useRef } from 'react'
import { CATS, CAT_ICONS, todayStr } from '../constants'
import { parseReceipt } from '../utils/ocr'
import { S } from '../styles'

function CatGrid({ gridId, selected, onSelect }) {
  return (
    <div style={S.catGrid}>
      {CATS.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          style={{ ...S.catBtn, ...(selected === c ? S.catBtnActive : {}) }}
        >
          <span style={{ fontSize: 16 }}>{CAT_ICONS[c]}</span>
          <span>{c}</span>
        </button>
      ))}
    </div>
  )
}

export default function AddPanel({ onAdd }) {
  const [tab, setTab] = useState('scan')

  // — scan states —
  const [scanStep, setScanStep] = useState('idle') // idle | scanning | review
  const [scanProgress, setScanProgress] = useState(0)
  const [scanError, setScanError] = useState('')
  const [scanAmt, setScanAmt]   = useState('')
  const [scanDesc, setScanDesc] = useState('')
  const [scanDate, setScanDate] = useState(todayStr())
  const [scanCat, setScanCat]   = useState('Food')
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileRef = useRef()

  // — manual states —
  const [type, setType]   = useState('expense')
  const [amt, setAmt]     = useState('')
  const [desc, setDesc]   = useState('')
  const [date, setDate]   = useState(todayStr())
  const [cat, setCat]     = useState('Food')

  // ── scan handlers ──────────────────────────────────────────────────────────
  const handleFile = async (file) => {
    if (!file) return
    setScanError('')
    setPreviewUrl(URL.createObjectURL(file))
    setScanStep('scanning')
    setScanProgress(0)
    try {
      const result = await parseReceipt(file, setScanProgress)
      setScanAmt(result.amt)
      setScanDesc(result.desc)
      setScanDate(result.date || todayStr())
      setScanCat('Food')
      setScanStep('review')
    } catch (e) {
      setScanError('Could not read the image. Please fill in manually.')
      setScanStep('review')
      setScanAmt('')
      setScanDesc('')
      setScanDate(todayStr())
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const confirmScan = () => {
    const a = parseFloat(scanAmt)
    if (!a || a <= 0) return
    onAdd({ desc: scanDesc || 'Receipt', cat: scanCat, type: 'expense', amt: a, date: scanDate })
    setScanStep('idle')
    setPreviewUrl(null)
    setScanAmt(''); setScanDesc(''); setScanDate(todayStr()); setScanCat('Food')
  }

  const cancelScan = () => {
    setScanStep('idle')
    setPreviewUrl(null)
    setScanError('')
  }

  // ── manual handler ─────────────────────────────────────────────────────────
  const submitManual = () => {
    const a = parseFloat(amt)
    if (!a || a <= 0) { return }
    onAdd({ desc: desc || 'Transaction', cat: type === 'income' ? 'Income' : cat, type, amt: a, date })
    setAmt(''); setDesc(''); setDate(todayStr())
  }

  return (
    <div style={{ ...S.panel, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Add transaction</div>

      {/* Tab switcher */}
      <div style={S.tabs}>
        {[{ id: 'scan', label: '📷  Scan receipt' }, { id: 'manual', label: '✏  Manual entry' }].map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); cancelScan() }}
            style={{ ...S.tab, ...(tab === t.id ? S.tabActive : {}) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── SCAN TAB ── */}
      {tab === 'scan' && (
        <>
          {/* idle: drop zone */}
          {scanStep === 'idle' && (
            <div
              style={S.uploadZone}
              onClick={() => fileRef.current.click()}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
              <div style={{ fontSize: 36 }}>📷</div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Click or drag a receipt image</div>
              <div style={{ fontSize: 11, color: '#475569' }}>JPG, PNG, WEBP — Tesseract reads it locally</div>
            </div>
          )}

          {/* scanning: progress */}
          {scanStep === 'scanning' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '20px 0' }}>
              {previewUrl && (
                <img src={previewUrl} alt="receipt preview" style={{ maxHeight: 100, maxWidth: '100%', borderRadius: 8, objectFit: 'contain', opacity: 0.6 }} />
              )}
              <div style={{ fontSize: 13, color: '#94a3b8' }}>Reading receipt… {scanProgress}%</div>
              <div style={{ width: '100%', height: 6, background: '#1e2537', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${scanProgress}%`, background: '#60a5fa', borderRadius: 99, transition: 'width 0.2s' }} />
              </div>
            </div>
          )}

          {/* review: confirm fields */}
          {scanStep === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {scanError ? (
                <div style={{ background: '#2a1010', border: '1px solid #4a2020', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#f87171' }}>
                  ⚠ {scanError}
                </div>
              ) : (
                <div style={S.successBanner}>✓ Receipt scanned — review & confirm below</div>
              )}
              {previewUrl && (
                <img src={previewUrl} alt="receipt" style={{ maxHeight: 80, borderRadius: 8, objectFit: 'contain', opacity: 0.5 }} />
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={S.fg}>
                  <label style={S.lbl}>Amount (฿)</label>
                  <input type="number" value={scanAmt} onChange={(e) => setScanAmt(e.target.value)} style={S.input} placeholder="0" />
                </div>
                <div style={S.fg}>
                  <label style={S.lbl}>Date</label>
                  <input type="date" value={scanDate} onChange={(e) => setScanDate(e.target.value)} style={S.input} />
                </div>
              </div>
              <div style={S.fg}>
                <label style={S.lbl}>Merchant / Description</label>
                <input value={scanDesc} onChange={(e) => setScanDesc(e.target.value)} style={S.input} placeholder="e.g. Big C Supermarket" />
              </div>
              <div style={S.fg}>
                <label style={S.lbl}>Category</label>
                <CatGrid selected={scanCat} onSelect={setScanCat} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button onClick={cancelScan} style={S.btnGhost}>Cancel</button>
                <button onClick={confirmScan} style={S.btnPrimary}>✓ Confirm</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── MANUAL TAB ── */}
      {tab === 'manual' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={S.typeToggle}>
            <button onClick={() => setType('expense')} style={{ ...S.typeBtn, ...(type === 'expense' ? S.typeBtnExpense : {}) }}>
              − Expense
            </button>
            <button onClick={() => setType('income')} style={{ ...S.typeBtn, ...(type === 'income' ? S.typeBtnIncome : {}) }}>
              + Income
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={S.fg}>
              <label style={S.lbl}>Amount (฿)</label>
              <input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} placeholder="0" style={S.input} />
            </div>
            <div style={S.fg}>
              <label style={S.lbl}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={S.input} />
            </div>
          </div>
          <div style={S.fg}>
            <label style={S.lbl}>Description</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Grab coffee" style={S.input} />
          </div>
          {type === 'expense' && (
            <div style={S.fg}>
              <label style={S.lbl}>Category</label>
              <CatGrid selected={cat} onSelect={setCat} />
            </div>
          )}
          <button onClick={submitManual} style={S.btnPrimary}>+ Add transaction</button>
        </div>
      )}
    </div>
  )
}
