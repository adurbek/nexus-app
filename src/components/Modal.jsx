export default function Modal({ open, onClose, title, children, width = 400 }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width, maxWidth: '94vw' }}>
        {title && <div className="modal-title">{title}</div>}
        {children}
      </div>
    </div>
  )
}
