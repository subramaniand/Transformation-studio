/**
 * JSONExportView - JSON export and import
 */
import { useState } from 'react';
import { usePricingStore } from '../../../pricingStore';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function JSONExportView() {
  const catalogues = usePricingStore(state => state.catalogues);
  const currentCatalogue = usePricingStore(state => state.currentCatalogue);
  const exportJSON = usePricingStore(state => state.exportJSON);
  const exportCSV = usePricingStore(state => state.exportCSV);
  const [exportFormat, setExportFormat] = useState('json');

  const handleExport = () => {
    let content = '';
    let filename = '';
    let type = '';

    if (currentCatalogue) {
      if (exportFormat === 'json') {
        content = exportJSON(currentCatalogue);
        filename = `${currentCatalogue.name.replace(/\s+/g, '_')}.json`;
        type = 'application/json';
      } else {
        content = exportJSON(currentCatalogue);
        filename = `${currentCatalogue.name.replace(/\s+/g, '_')}.json`;
        type = 'application/json';
      }
    } else {
      if (exportFormat === 'csv') {
        content = exportCSV(catalogues);
        filename = 'catalogues.csv';
        type = 'text/csv';
      } else {
        content = JSON.stringify(catalogues, null, 2);
        filename = 'catalogues.json';
        type = 'application/json';
      }
    }

    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const jsonContent = currentCatalogue
    ? exportJSON(currentCatalogue)
    : JSON.stringify(catalogues, null, 2);

  return (
    <div style={{ padding: '20px' }}>
      <Card title="📤 Export Data" style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: 'var(--tx2)' }}>
            Export Format
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="format"
                value="json"
                checked={exportFormat === 'json'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <span style={{ fontSize: '13px' }}>JSON</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="format"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <span style={{ fontSize: '13px' }}>CSV</span>
            </label>
          </div>
        </div>

        <Button variant="primary" onClick={handleExport} fullWidth>
          ⬇️ Download
        </Button>
      </Card>

      <Card title="👀 Preview">
        <pre style={{
          background: 'var(--bg3)',
          border: '1px solid var(--bd)',
          borderRadius: '6px',
          padding: '12px',
          overflow: 'auto',
          maxHeight: '400px',
          fontSize: '11px',
          color: 'var(--gold)',
          fontFamily: 'monospace',
          margin: '0',
        }}>
          {exportFormat === 'csv' && !currentCatalogue
            ? exportCSV(catalogues)
            : jsonContent
          }
        </pre>
      </Card>
    </div>
  );
}
