/**
 * PricingTypesSection - Manage pricing types
 */
import { useEffect, useState } from 'react';
import { useAdminStore } from '../../../adminStore';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import FormField from '../../../components/ui/FormField';

export default function PricingTypesSection() {
  const pricingTypes = useAdminStore(state => state.pricingTypes);
  const fetchPricingTypes = useAdminStore(state => state.fetchPricingTypes);
  const createPricingType = useAdminStore(state => state.createPricingType);
  const deletePricingType = useAdminStore(state => state.deletePricingType);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    fetchPricingTypes();
  }, [fetchPricingTypes]);

  const handleAddType = async () => {
    if (!formData.name || !formData.category) return;

    try {
      await createPricingType({
        ...formData,
        icon: '💰',
        active: true,
      });
      setFormData({ name: '', description: '', category: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating pricing type:', err);
    }
  };

  const headers = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status', align: 'center' },
    { key: 'actions', label: 'Actions', align: 'center' },
  ];

  const rows = pricingTypes.map(type => ({
    id: type.id,
    name: type.name,
    description: type.description || 'N/A',
    category: type.category,
    status: type.active ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge>,
    actions: (
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
        <Button size="small" variant="secondary">✏️</Button>
        <Button size="small" variant="danger" onClick={() => deletePricingType(type.id)}>🗑️</Button>
      </div>
    ),
  }));

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600' }}>
            💰 Pricing Types ({pricingTypes.length})
          </h3>
          <p style={{ margin: '0', fontSize: '12px', color: 'var(--tx3)' }}>
            Manage pricing service categories
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '➕ Add Type'}
        </Button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: '16px' }}>
          <FormField
            label="Type Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Cloud Migration"
          />
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe this pricing type..."
            rows={2}
          />
          <FormField
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'Infrastructure', label: 'Infrastructure' },
              { value: 'Development', label: 'Development' },
              { value: 'Data', label: 'Data' },
              { value: 'Security', label: 'Security' },
              { value: 'Consulting', label: 'Consulting' },
            ]}
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <Button size="small" variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button size="small" variant="primary" onClick={handleAddType}>
              Create Type
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <Table headers={headers} rows={rows} />
      </Card>
    </div>
  );
}
