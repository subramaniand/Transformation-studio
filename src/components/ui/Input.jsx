/**
 * Input Component - Styled input wrapper
 */
export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  icon,
  iconPosition = 'left',
  ...props
}) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {icon && (
        <div style={{
          position: 'absolute',
          [iconPosition]: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '14px',
          pointerEvents: 'none',
          color: 'var(--tx3)',
        }}>
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: '100%',
          padding: icon ? `8px 12px 8px ${iconPosition === 'left' ? 36 : 12}px` : '8px 12px',
          background: 'var(--bg3)',
          border: error ? '1px solid var(--red)' : '1px solid var(--bd)',
          borderRadius: '6px',
          color: 'var(--tx)',
          fontSize: '13px',
          transition: '0.2s',
          outline: 'none',
        }}
        {...props}
        onFocus={(e) => {
          e.target.style.borderColor = error ? 'var(--red)' : 'var(--ac)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--red)' : 'var(--bd)';
        }}
      />
    </div>
  );
}
