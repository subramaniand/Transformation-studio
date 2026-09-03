/**
 * Avatar Component - User avatar with initials
 */
export default function Avatar({
  name,
  size = 'medium',
  src,
  color = 'var(--ac)',
}) {
  const sizeMap = {
    small: { size: '28px', fontSize: '10px' },
    medium: { size: '36px', fontSize: '12px' },
    large: { size: '48px', fontSize: '14px' },
  };

  const { size: sizeValue, fontSize } = sizeMap[size] || sizeMap.medium;

  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      style={{
        width: sizeValue,
        height: sizeValue,
        borderRadius: '50%',
        background: src ? `url(${src})` : color,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: '600',
        color: '#fff',
        flexShrink: 0,
      }}
      title={name}
    >
      {!src && getInitials(name)}
    </div>
  );
}
