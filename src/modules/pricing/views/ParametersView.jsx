/**
 * ParametersView - Edit pricing parameters
 */
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
  const hasPermission = useAuthStore(state => state.hasPermission);

  if (!currentCatalogue) {
    return <div>No catalogue selected</div>;
  }

  const handleParameterChange = (parameterId, value) => {
    const updatedParams = {
      ...currentCatalogue.parameters,
      [parameterId]: value,
    };
    updateCatalogueParameters(currentCatalogue.id, updatedParams);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {parameterGroups.map((group) => {
          const groupParams = parameters.filter(p => p.groupId === group.id);
          if (groupParams.length === 0) return null;

          return (
            <Card key={group.id} title={`📊 ${group.name}`}>
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
            </Card>
          );
        })}
      </div>

      {hasPermission('edit') && (
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save Changes</Button>
        </div>
      )}
    </div>
  );
}
