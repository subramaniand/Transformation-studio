/**
 * Button Component - Reusable button with variants
 * Variants: primary, secondary, danger, gold
 * Sizes: small, medium, large
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    gold: 'btn-gold',
  }[variant] || 'btn-primary';

  const sizeClass = {
    small: 'btn-small',
    medium: 'btn-medium',
    large: 'btn-large',
  }[size] || 'btn-medium';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${fullWidth ? 'btn-full' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: size === 'small' ? '6px 12px' : size === 'large' ? '12px 24px' : '8px 16px',
        fontSize: size === 'small' ? '11px' : size === 'large' ? '14px' : '13px',
        background: variant === 'primary' ? 'var(--ac)' :
                   variant === 'danger' ? 'var(--red)' :
                   variant === 'gold' ? 'var(--gold)' :
                   'var(--bg3)',
        color: variant === 'secondary' ? 'var(--tx)' : '#fff',
        border: variant === 'secondary' ? '1px solid var(--bd)' : 'none',
        borderRadius: '8px',
        fontWeight: '500',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: '0.2s',
        width: fullWidth ? '100%' : 'auto',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
