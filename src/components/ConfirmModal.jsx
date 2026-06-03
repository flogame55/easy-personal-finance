import { S } from '../styles'

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
    }}>
      <div style={{
        background: '#0d1520', border: '1px solid #1e2537', borderRadius: 14,
        padding: '24px', width: '100%', maxWidth: '360px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24, lineHeight: 1.5 }}>
          {message}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={S.btnGhost}>Cancel</button>
          <button onClick={onConfirm} style={{ ...S.btnPrimary, width: 'auto', background: '#b91c1c', borderColor: '#991b1b' }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
