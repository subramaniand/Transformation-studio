/**
 * EmptyState Component - Empty state display
 */
export default function EmptyState({
  icon = '📋',
  title = 'No data',
  description = 'Nothing to display',
  action,
  actionLabel = 'Create',
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: 'var(--tx)',
        marginBottom: '8px',
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '13px',
        color: 'var(--tx3)',
        marginBottom: action ? '20px' : '0',
      }}>
        {description}
      </p>
      {action && (
        <button
          onClick={action}
          style={{
            padding: '8px 16px',
            background: 'var(--ac)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: '0.2s',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
