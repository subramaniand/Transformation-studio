/**
 * Badge Component - Status badges with colors
 * Variants: primary, success, danger, warning, info
 */
export default function Badge({
  children,
  variant = 'primary',
  size = 'medium',
}) {
  const variantStyles = {
    primary: { bg: 'rgba(0,75,135,0.2)', text: 'var(--ac)' },
    success: { bg: 'rgba(39,174,96,0.2)', text: 'var(--grn)' },
    danger: { bg: 'rgba(231,76,60,0.2)', text: 'var(--red)' },
    warning: { bg: 'rgba(243,156,18,0.2)', text: 'var(--amb)' },
    info: { bg: 'rgba(230,126,34,0.2)', text: 'var(--gold)' },
  }[variant] || { bg: 'rgba(0,75,135,0.2)', text: 'var(--ac)' };

  const sizeStyle = size === 'small' ?
    { padding: '2px 6px', fontSize: '10px' } :
    size === 'large' ?
    { padding: '6px 12px', fontSize: '12px' } :
    { padding: '4px 8px', fontSize: '11px' };

  return (
    <span style={{
      display: 'inline-block',
      background: variantStyles.bg,
      color: variantStyles.text,
      borderRadius: '4px',
      fontWeight: '500',
      ...sizeStyle,
    }}>
      {children}
    </span>
  );
}
