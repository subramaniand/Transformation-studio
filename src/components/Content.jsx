import { usePricingStore } from '../pricingStore';

export default function Content({ module }) {
  const currentCatalogue = usePricingStore(state => state.currentCatalogue);

  if (module === 'pricing') {
    return (
      <div className="content">
        {!currentCatalogue ? (
          <div className="empty">
            <div style={{ fontSize: '38px' }}>🗂</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>
              Pick a catalogue to begin
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: '16px' }}>{currentCatalogue.name}</h2>
            <p style={{ color: 'var(--tx3)' }}>{currentCatalogue.type}</p>
            <p style={{ marginTop: '8px', color: 'var(--tx)' }}>
              {currentCatalogue.description || 'No description'}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (module === 'planner') {
    return (
      <div className="content">
        <div className="empty">
          <div style={{ fontSize: '38px' }}>📅</div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>
            Delivery Planner coming soon
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="empty">
        <div style={{ fontSize: '38px' }}>❓</div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>
          Unknown module
        </div>
      </div>
    </div>
  );
}
