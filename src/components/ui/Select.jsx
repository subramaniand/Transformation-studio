/**
 * Select Component - Styled select wrapper
 */
export default function Select({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  multiple = false,
  ...props
}) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        multiple={multiple}
        style={{
          width: '100%',
          padding: '8px 12px',
          paddingRight: multiple ? '12px' : '32px',
          background: 'var(--bg3)',
          border: error ? '1px solid var(--red)' : '1px solid var(--bd)',
          borderRadius: '6px',
          color: 'var(--tx)',
          fontSize: '13px',
          cursor: 'pointer',
          appearance: multiple ? 'auto' : 'none',
          transition: '0.2s',
        }}
        {...props}
        onFocus={(e) => {
          e.target.style.borderColor = error ? 'var(--red)' : 'var(--ac)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--red)' : 'var(--bd)';
        }}
      >
        {!multiple && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {!multiple && (
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: 'var(--tx3)',
          fontSize: '12px',
        }}>
          ▼
        </div>
      )}
    </div>
  );
}
