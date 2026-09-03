/**
 * CreateCatalogueModal - Create new pricing catalogue
 */
import { useState } from 'react';
import { usePricingStore } from '../../../pricingStore';
import { useModal } from '../../../context/ModalContext';
import Button from '../../../components/ui/Button';
import FormField from '../../../components/ui/FormField';

const CATALOGUE_TYPES = ['Migration', 'App Development', 'Data Architecture', 'Security', 'Consulting'];

export default function CreateCatalogueModal() {
  const modals = useModal().modals;
  const closeModal = useModal().closeModal;
  const createCatalogue = usePricingStore(state => state.createCatalogue);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isOpen = modals.some(m => m.type === 'createCatalogue');
  const modalId = modals.find(m => m.type === 'createCatalogue')?.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.type) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const newCatalogue = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        tier: 0,
        parameters: {
          p1: 25000,
          p2: 90,
          p3: 5,
          p4: 1000,
          p5: 'medium',
          p6: 1.0,
          p7: 10000,
        },
      };

      await createCatalogue(newCatalogue);
      setFormData({ name: '', type: '', description: '' });
      if (modalId) closeModal(modalId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--bd)',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '600' }}>
          ➕ Create New Catalogue
        </h2>

        <FormField
          label="Catalogue Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Cloud Migration - Tier 2"
          error={error && !formData.name ? 'Name is required' : ''}
        />

        <FormField
          label="Type"
          name="type"
          type="select"
          value={formData.type}
          onChange={handleChange}
          options={CATALOGUE_TYPES.map(type => ({ value: type, label: type }))}
          error={error && !formData.type ? 'Type is required' : ''}
        />

        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe this pricing catalogue..."
          rows={3}
        />

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(231,76,60,0.1)',
            color: 'var(--red)',
            borderRadius: '6px',
            fontSize: '12px',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            onClick={() => modalId && closeModal(modalId)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Catalogue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
