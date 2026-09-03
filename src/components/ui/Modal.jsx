export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;

  return (
    <div className="m-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="m-box">
        {title && <h3>{title}</h3>}
        {children}
        {footer && <div className="m-foot">{footer}</div>}
      </div>
    </div>
  );
}
