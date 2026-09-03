/**
 * StatusIndicator Component - Status display with color and label
 */
export default function StatusIndicator({
  status = 'info',
  label,
  size = 'medium',
}) {
  const statusColors = {
    operational: 'var(--grn)',
    success: 'var(--grn)',
    warning: 'var(--amb)',
    error: 'var(--red)',
    danger: 'var(--red)',
    info: 'var(--ac)',
    degraded: 'var(--amb)',
    down: 'var(--red)',
  };

  const sizeMap = {
    small: '8px',
    medium: '12px',
    large: '16px',
  };

  const dotSize = sizeMap[size] || sizeMap.medium;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <div style={{
        width: dotSize,
        height: dotSize,
        borderRadius: '50%',
        background: statusColors[status] || statusColors.info,
        animation: status === 'degraded' || status === 'warning' ? 'pulse 2s infinite' : 'none',
      }} />
      {label && (
        <span style={{
          fontSize: '12px',
          color: 'var(--tx2)',
        }}>
          {label}
        </span>
      )}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
