/**
 * CatalogueListView - List of pricing catalogues
 */
import { usePricingStore } from '../../../pricingStore';
import { useAuthStore } from '../../../authStore';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

export default function CatalogueListView({ catalogues }) {
  const selectCatalogue = usePricingStore(state => state.selectCatalogue);
  const deleteCatalogue = usePricingStore(state => state.deleteCatalogue);
  const currentCatalogue = usePricingStore(state => state.currentCatalogue);
  const hasPermission = useAuthStore(state => state.hasPermission);

  const handleDeleteCatalogue = (catalogue) => {
    if (confirm(`Are you sure you want to delete "${catalogue.name}"?`)) {
      deleteCatalogue(catalogue.id);
    }
  };

  if (catalogues.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--tx3)' }}>
        No catalogues found
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {catalogues.map((catalogue) => (
          <Card
            key={catalogue.id}
            hoverable
            onClick={() => selectCatalogue(catalogue)}
            style={{
              borderColor: currentCatalogue?.id === catalogue.id ? 'var(--ac)' : 'var(--bd)',
              background: currentCatalogue?.id === catalogue.id ? 'rgba(0,75,135,0.1)' : 'var(--bg2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600' }}>
                  {catalogue.name}
                </h4>
                <p style={{ margin: '0', fontSize: '12px', color: 'var(--tx3)' }}>
                  {catalogue.description}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <Badge variant="info">{catalogue.type}</Badge>
              <Badge variant="primary">Tier {catalogue.tier + 1}</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderTop: '1px solid var(--bd)' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '2px' }}>Base Cost</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--gold)' }}>
                  ${catalogue.parameters?.p1?.toLocaleString() || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '2px' }}>Team Size</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ac)' }}>
                  {catalogue.parameters?.p3 || 'N/A'} people
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '2px' }}>Duration</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--grn)' }}>
                  {catalogue.parameters?.p2 || 'N/A'} days
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '2px' }}>Estimates</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--amb)' }}>
                  {catalogue.estimates?.length || 0}
                </div>
              </div>
            </div>

            {hasPermission('edit') && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  size="small"
                  variant="secondary"
                  fullWidth
                  onClick={() => selectCatalogue(catalogue)}
                >
                  ✏️ Edit
                </Button>
                <Button
                  size="small"
                  variant="danger"
                  fullWidth
                  onClick={() => handleDeleteCatalogue(catalogue)}
                >
                  🗑️ Delete
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
