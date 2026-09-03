/**
 * Table Component - Generic data table with headers and rows
 */
export default function Table({
  headers = [],
  rows = [],
  onRowClick,
  className = '',
  emptyMessage = 'No data available',
}) {
  if (rows.length === 0) {
    return (
      <div style={{
        padding: '32px 20px',
        textAlign: 'center',
        color: 'var(--tx3)',
        fontSize: '13px',
      }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--bd)' }}>
            {headers.map((header) => (
              <th
                key={header.key || header}
                style={{
                  padding: '12px 16px',
                  textAlign: typeof header === 'string' ? 'left' : header.align || 'left',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--tx3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {typeof header === 'string' ? header : header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              onClick={() => onRowClick?.(row)}
              style={{
                borderBottom: '1px solid var(--bd)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: '0.1s',
              }}
              onMouseEnter={onRowClick ? (e) => {
                e.currentTarget.style.background = 'rgba(0,75,135,0.05)';
              } : undefined}
              onMouseLeave={onRowClick ? (e) => {
                e.currentTarget.style.background = 'transparent';
              } : undefined}
            >
              {headers.map((header) => {
                const key = typeof header === 'string' ? header : header.key;
                const align = typeof header === 'string' ? 'left' : header.align || 'left';
                const value = row[key];

                return (
                  <td
                    key={key}
                    style={{
                      padding: '12px 16px',
                      fontSize: '13px',
                      color: 'var(--tx2)',
                      textAlign: align,
                    }}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
