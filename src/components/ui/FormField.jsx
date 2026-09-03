/**
 * FormField Component - Label + Input/Select/Textarea wrapper
 */
export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  options = [],
  rows = 4,
  children,
}) {
  const fieldId = `field-${name}`;

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label htmlFor={fieldId} style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '500',
          color: 'var(--tx2)',
          marginBottom: '6px',
        }}>
          {label}
          {required && <span style={{ color: 'var(--red)' }}> *</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'var(--bg3)',
            border: error ? '1px solid var(--red)' : '1px solid var(--bd)',
            borderRadius: '6px',
            color: 'var(--tx)',
            fontSize: '13px',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
      ) : type === 'select' ? (
        <select
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'var(--bg3)',
            border: error ? '1px solid var(--red)' : '1px solid var(--bd)',
            borderRadius: '6px',
            color: 'var(--tx)',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={fieldId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'var(--bg3)',
            border: error ? '1px solid var(--red)' : '1px solid var(--bd)',
            borderRadius: '6px',
            color: 'var(--tx)',
            fontSize: '13px',
          }}
        />
      )}

      {error && (
        <div style={{
          fontSize: '11px',
          color: 'var(--red)',
          marginTop: '4px',
        }}>
          {error}
        </div>
      )}

      {helperText && !error && (
        <div style={{
          fontSize: '11px',
          color: 'var(--tx3)',
          marginTop: '4px',
        }}>
          {helperText}
        </div>
      )}

      {children}
    </div>
  );
}
