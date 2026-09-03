/**
 * LoadingSpinner Component - Loading indicator
 */
export default function LoadingSpinner({ size = 'medium', fullScreen = false }) {
  const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '60px',
  };

  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  return (
    <div style={containerStyle}>
      <div style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: '3px solid var(--bd)',
        borderTop: '3px solid var(--ac)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
