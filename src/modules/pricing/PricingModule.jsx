/**
 * PricingModule - Main pricing catalogue management module
 */
import { useState } from 'react';
import { usePricingStore } from '../../pricingStore';
import { useModal } from '../../context/ModalContext';
import { useAuthStore } from '../../authStore';
import Tabs from '../../components/ui/Tabs';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import CatalogueListView from './views/CatalogueListView';
import ParametersView from './views/ParametersView';
import EstimateView from './views/EstimateView';
import JSONExportView from './views/JSONExportView';
import CreateCatalogueModal from './modals/CreateCatalogueModal';

export default function PricingModule() {
  const catalogues = usePricingStore(state => state.catalogues);
  const currentCatalogue = usePricingStore(state => state.currentCatalogue);
  const selectCatalogue = usePricingStore(state => state.selectCatalogue);
  const hasPermission = useAuthStore(state => state.hasPermission);
  const openModal = useModal().openModal;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeViewTab, setActiveViewTab] = useState('list');

  const filteredCatalogues = catalogues.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTabChange = (tab) => {
    setActiveViewTab(tab.id);
  };

  const tabs = [
    {
      id: 'list',
      label: '📋 Catalogues',
      render: () => <CatalogueListView catalogues={filteredCatalogues} />,
    },
    {
      id: 'parameters',
      label: '⚙️ Parameters',
      render: () => currentCatalogue ? <ParametersView /> : (
        <div style={{ padding: '20px' }}>
          <Card title="Select Catalogue">
            <p style={{ margin: '0', color: 'var(--tx3)' }}>
              Please select a catalogue from the list to view and edit parameters
            </p>
          </Card>
        </div>
      ),
    },
    {
      id: 'estimate',
      label: '💰 Estimates',
      render: () => currentCatalogue ? <EstimateView /> : (
        <div style={{ padding: '20px' }}>
          <Card title="Select Catalogue">
            <p style={{ margin: '0', color: 'var(--tx3)' }}>
              Please select a catalogue from the list to view and create estimates
            </p>
          </Card>
        </div>
      ),
    },
    {
      id: 'export',
      label: '📤 Export',
      render: () => <JSONExportView />,
    },
  ];

  return (
    <div className="content">
      <div style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: '600' }}>
                💰 Pricing Catalogues
              </h1>
              <p style={{ margin: '0', color: 'var(--tx3)', fontSize: '13px' }}>
                Manage pricing models and cost estimations
              </p>
            </div>
            {hasPermission('create') && (
              <Button
                variant="primary"
                onClick={() => openModal('createCatalogue')}
              >
                ➕ New Catalogue
              </Button>
            )}
          </div>

          {/* Search and Current Selection */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Input
              icon="🔍"
              placeholder="Search catalogues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, maxWidth: '300px' }}
            />
            {currentCatalogue && (
              <div style={{
                padding: '8px 12px',
                background: 'var(--bg3)',
                borderRadius: '6px',
                fontSize: '12px',
                color: 'var(--tx2)',
              }}>
                <strong>Selected:</strong> {currentCatalogue.name}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--bd)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <Tabs
            tabs={tabs}
            defaultActive={0}
            onChange={handleTabChange}
            variant="line"
          />
        </div>
      </div>

      {/* Modals */}
      <CreateCatalogueModal />
    </div>
  );
}
