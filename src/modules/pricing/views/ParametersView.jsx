/**
 * ParametersView - Edit pricing parameters
 */
import { useState } from 'react';
import { usePricingStore } from '../../../pricingStore';
import { useAuthStore } from '../../../authStore';
import Card from '../../../components/ui/Card';
import FormField from '../../../components/ui/FormField';
import Button from '../../../components/ui/Button';

export default function ParametersView() {
  const currentCatalogue = usePricingStore(state => state.currentCatalogue);
  const parameterGroups = usePricingStore(state => state.parameterGroups);
  const parameters = usePricingStore(state => state.parameters);
  const updateCatalogueParameters = usePricingStore(state => state.updateCatalogueParameters);
  const updateCatalogueTier = usePricingStore(state => state.updateCatalogueTier);
  const hasPermission = useAuthStore(state => state.hasPermission);
  const [activeGroupId, setActiveGroupId] = useState(parameterGroups[0]?.id);

  if (!currentCatalogue) {
    return <div>No catalogue selected</div>;
  }

  const tiers = currentCatalogue.tiers?.length ? currentCatalogue.tiers : [];
  const selectedTier = tiers[currentCatalogue.tier] || tiers[0];
  const activeGroup = parameterGroups.find(group => group.id === activeGroupId) || parameterGroups[0];
  const groupParams = parameters.filter(parameter => parameter.groupId === activeGroup?.id);

  const handleParameterChange = (parameterId, value) => {
    const updatedParams = {
      ...currentCatalogue.parameters,
      [parameterId]: value,
    };
    updateCatalogueParameters(currentCatalogue.id, updatedParams);
  };

  const handleSaveParameters = () => {
    alert('Parameters updated successfully!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="pricing-score-header">
        <div className="pricing-score-ring">{(currentCatalogue.tier || 0) + 1}</div>
        <div className="pricing-score-title">
          <div className="pricing-score-tier">{selectedTier?.name || 'Complexity'}</div>
          <div className="pricing-score-meta">{Object.keys(currentCatalogue.parameters || {}).length} params · updated from catalogue</div>
        </div>
        <div className="pricing-score-metrics">
          <div><span>Cost range</span><strong>${(selectedTier?.costLo || 0).toLocaleString()} - ${(selectedTier?.costHi || 0).toLocaleString()}</strong></div>
          <div><span>Timeline</span><strong>{selectedTier?.timeline || 'Not set'}</strong></div>
          <div><span>Team</span><strong>{selectedTier?.team || 'Not set'} people</strong></div>
        </div>
      </div>

      {tiers.length > 0 && (
        <div className="complexity-tabs" aria-label="Complexity tiers">
          {tiers.map((tier, index) => (
            <button
              key={tier.id || tier.name}
              className={`${currentCatalogue.tier === index ? 'active' : ''} ${!hasPermission('edit') ? 'read-only' : ''}`}
              onClick={() => {
                if (hasPermission('edit')) {
                  updateCatalogueTier(currentCatalogue.id, index);
                } else {
                  alert('You need edit permission to change complexity tier. Please contact an administrator.');
                }
              }}
              title={!hasPermission('edit') ? 'You do not have edit permission' : `Select ${tier.name}`}
              style={{ '--tier-color': tier.color || 'var(--ac)' }}
            >
              <span className="complexity-dot" />
              {tier.name}
              <small>${(tier.costLo || 0).toLocaleString()} - ${(tier.costHi || 0).toLocaleString()}</small>
            </button>
          ))}
        </div>
      )}

      <div className="param-layout">
        <div className="grp-nav">
          {parameterGroups.map(group => (
            <button
              key={group.id}
              className={`grp-btn ${activeGroup?.id === group.id ? 'on' : ''}`}
              onClick={() => setActiveGroupId(group.id)}
            >
              <span className="grp-ico">{group.icon}</span>
              <span className="grp-lbl">{group.name}</span>
              <span className="grp-cnt">{parameters.filter(parameter => parameter.groupId === group.id && currentCatalogue.parameters?.[parameter.id] !== undefined).length || ''}</span>
            </button>
          ))}
        </div>

        <Card title={`${activeGroup?.icon || '📊'} ${activeGroup?.name || 'Parameters'}`}>
          {groupParams.map((param) => {
                const currentValue = currentCatalogue.parameters?.[param.id] ?? param.defaultValue;

                return (
                  <FormField
                    key={param.id}
                    label={param.name}
                    name={param.id}
                    type={param.type === 'currency' ? 'number' : param.type === 'select' ? 'select' : 'number'}
                    value={currentValue}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (param.type === 'number') {
                        value = parseFloat(value) || 0;
                      } else if (param.type === 'currency') {
                        value = parseInt(value) || 0;
                      }
                      handleParameterChange(param.id, value);
                    }}
                    disabled={!hasPermission('edit')}
                    options={param.type === 'select' ? param.options?.map(opt => ({ value: opt, label: opt })) : []}
                    helperText={param.type === 'currency' ? 'USD' : param.type === 'number' ? `Min: ${param.min}, Max: ${param.max}` : ''}
                  />
                );
          })}
          {groupParams.length === 0 && <div style={{ color: 'var(--tx3)', fontSize: '12px' }}>No parameters in this group.</div>}
        </Card>
      </div>

      {hasPermission('edit') && (
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => window.location.reload()}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveParameters}>Save Changes</Button>
        </div>
      )}
    </div>
  );
}
