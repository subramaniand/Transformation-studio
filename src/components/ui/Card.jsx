/**
 * Card Component - Generic container with optional title
 */
export default function Card({
  title,
  children,
  className = '',
  style = {},
  onClick,
  hoverable = false,
}) {
  return (
    <div
      className={`card ${hoverable ? 'card-hover' : ''} ${className}`}
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--bd)',
        borderRadius: '12px',
        padding: '20px',
        transition: hoverable ? '0.2s' : 'none',
        cursor: hoverable ? 'pointer' : 'default',
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={hoverable ? (e) => {
        e.currentTarget.style.borderColor = 'var(--ac)';
        e.currentTarget.style.background = 'rgba(0,75,135,0.05)';
      } : undefined}
      onMouseLeave={hoverable ? (e) => {
        e.currentTarget.style.borderColor = 'var(--bd)';
        e.currentTarget.style.background = 'var(--bg2)';
      } : undefined}
    >
      {title && (
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--tx)',
        }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
