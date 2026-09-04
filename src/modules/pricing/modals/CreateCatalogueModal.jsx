/**
 * CreateCatalogueModal - Create and edit pricing catalogues
 */
import { useEffect, useState } from 'react';
import { usePricingStore } from '../../../pricingStore';
import { useModal } from '../../../context/ModalContext';
import Button from '../../../components/ui/Button';
import FormField from '../../../components/ui/FormField';

const CATALOGUE_TYPES = [
  'DC Exit', 'App Development', 'Landing Zone', 'Data Architecture',
  'Integration', 'Strategy & APR', 'Migration', 'Custom',
];

export default function CreateCatalogueModal() {
  const { modals, closeModal } = useModal();
  const createCatalogue = usePricingStore(state => state.createCatalogue);
  const updateCatalogue = usePricingStore(state => state.updateCatalogue);
  const [formData, setFormData] = useState({ name: '', type: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const modal = modals.find(item => item.type === 'createCatalogue' || item.type === 'editCatalogue');
  const isEdit = modal?.type === 'editCatalogue';

  useEffect(() => {
    const catalogue = modal?.props?.catalogue;
    setFormData(isEdit && catalogue
      ? { name: catalogue.name || '', type: catalogue.type || '', description: catalogue.description || '' }
      : { name: '', type: '', description: '' });
    setError('');
  }, [isEdit, modal?.id]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.type) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await updateCatalogue(modal.props.catalogue.id, formData);
      } else {
        await createCatalogue({ ...formData, tier: 0, parameters: {} });
      }
      closeModal(modal.id);
      setFormData({ name: '', type: '', description: '' });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  if (!modal) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '90%', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '600' }}>
          {isEdit ? 'Edit Catalogue' : 'Create New Catalogue'}
        </h2>
        <FormField label="Catalogue Name" name="name" value={formData.name} onChange={event => setFormData({ ...formData, name: event.target.value })} placeholder="e.g., Cloud Migration - Tier 2" error={error && !formData.name ? 'Name is required' : ''} />
        <FormField label="Type" name="type" type="select" value={formData.type} onChange={event => setFormData({ ...formData, type: event.target.value })} options={CATALOGUE_TYPES.map(type => ({ value: type, label: type }))} error={error && !formData.type ? 'Type is required' : ''} />
        <FormField label="Description" name="description" type="textarea" value={formData.description} onChange={event => setFormData({ ...formData, description: event.target.value })} placeholder="Describe this pricing catalogue..." rows={3} />
        {error && <div style={{ padding: '12px', color: 'var(--red)', fontSize: '12px' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => closeModal(modal.id)} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Catalogue')}
          </Button>
        </div>
      </div>
    </div>
  );
}
