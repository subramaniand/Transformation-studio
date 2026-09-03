/**
 * EstimateView - View and create cost estimates
 */
import { useState } from 'react';
import { usePricingStore } from '../../../pricingStore';
import { useAuthStore } from '../../../authStore';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import FormField from '../../../components/ui/FormField';
import EmptyState from '../../../components/ui/EmptyState';

export default function EstimateView() {
  const currentCatalogue = usePricingStore(state => state.currentCatalogue);
  const calculateEstimate = usePricingStore(state => state.calculateEstimate);
  const addEstimate = usePricingStore(state => state.addEstimate);
  const updateEstimate = usePricingStore(state => state.updateEstimate);
  const deleteEstimate = usePricingStore(state => state.deleteEstimate);
  const hasPermission = useAuthStore(state => state.hasPermission);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    scenarioName: '',
    notes: '',
  });

  if (!currentCatalogue) {
    return <div>No catalogue selected</div>;
  }

  const handleAddEstimate = () => {
    if (!formData.scenarioName) return;

    const estimate = calculateEstimate(currentCatalogue);
    addEstimate(currentCatalogue.id, {
      scenarioName: formData.scenarioName,
      adjustments: {},
      totalCost: estimate.totalCost,
      notes: formData.notes,
    });

    setFormData({ scenarioName: '', notes: '' });
    setShowForm(false);
  };

  const baseEstimate = calculateEstimate(currentCatalogue);

  return (
    <div style={{ padding: '20px' }}>
      {/* Base Estimate Card */}
      <Card title="📊 Base Estimate" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Base Cost</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gold)' }}>
              ${baseEstimate.baseCost.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Labor Cost</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ac)' }}>
              ${baseEstimate.laborCost.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Infrastructure</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--grn)' }}>
              ${baseEstimate.infraCost.toLocaleString()}
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--bd)', paddingTop: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Total Estimate</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--amb)' }}>
              ${baseEstimate.totalCost.toLocaleString()}
            </div>
          </div>
        </div>
      </Card>

      {/* Scenarios */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ margin: '0', fontSize: '14px', fontWeight: '600' }}>📝 Estimate Scenarios</h3>
          {hasPermission('create') && (
            <Button size="small" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '➕ New'}
            </Button>
          )}
        </div>

        {showForm && hasPermission('create') && (
          <Card style={{ marginBottom: '16px' }}>
            <FormField
              label="Scenario Name"
              name="scenarioName"
              value={formData.scenarioName}
              onChange={(e) => setFormData({ ...formData, scenarioName: e.target.value })}
              placeholder="e.g., Accelerated Timeline"
            />
            <FormField
              label="Notes"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this estimate..."
              rows={3}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <Button size="small" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button size="small" variant="primary" onClick={handleAddEstimate}>
                Create Estimate
              </Button>
            </div>
          </Card>
        )}

        {currentCatalogue.estimates && currentCatalogue.estimates.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {currentCatalogue.estimates.map((estimate) => (
              <Card key={estimate.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600' }}>
                      {estimate.scenarioName}
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: 'var(--tx3)' }}>
                      {estimate.notes}
                    </p>
                  </div>
                  <Badge variant="warning">${estimate.totalCost.toLocaleString()}</Badge>
                </div>
                {hasPermission('edit') && (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button size="small" variant="secondary">
                      ✏️ Edit
                    </Button>
                    <Button size="small" variant="danger" onClick={() => deleteEstimate(currentCatalogue.id, estimate.id)}>
                      🗑️
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📋"
            title="No Estimates"
            description="Create your first estimate to see scenarios"
          />
        )}
      </div>
    </div>
  );
}
