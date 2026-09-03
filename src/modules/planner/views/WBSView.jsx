/**
 * WBSView - Work Breakdown Structure tree view
 */
import { useState } from 'react';
import { usePlannerStore } from '../../../plannerStore';
import { useAuthStore } from '../../../authStore';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import FormField from '../../../components/ui/FormField';

export default function WBSView() {
  const activeProject = usePlannerStore(state => state.activeProject);
  const toggleWBSNode = usePlannerStore(state => state.toggleWBSNode);
  const expandedWBSNodes = usePlannerStore(state => state.expandedWBSNodes);
  const deleteWBSItem = usePlannerStore(state => state.deleteWBSItem);
  const addWBSItem = usePlannerStore(state => state.addWBSItem);
  const updateWBSItem = usePlannerStore(state => state.updateWBSItem);
  const hasPermission = useAuthStore(state => state.hasPermission);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    estimatedDays: 0,
    owner: '',
    status: 'not-started',
  });

  if (!activeProject) return null;

  const handleOpenAddWBS = () => {
    setEditingItem(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      name: '',
      description: '',
      startDate: today,
      endDate: today,
      estimatedDays: 0,
      owner: '',
      status: 'not-started',
    });
    setIsModalOpen(true);
  };

  const handleEditWBS = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      startDate: item.startDate,
      endDate: item.endDate,
      estimatedDays: item.estimatedDays,
      owner: item.owner,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedDays' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSaveWBS = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingItem) {
      updateWBSItem(editingItem.id, formData);
    } else {
      const newItem = {
        id: `w${Date.now()}`,
        parentId: null,
        order: (activeProject.wbs?.length || 0) + 1,
        ...formData,
      };
      addWBSItem(newItem);
    }
    setIsModalOpen(false);
  };

  const statusColors = {
    'not-started': 'info',
    'in-progress': 'warning',
    'completed': 'success',
  };

  return (
    <div style={{ padding: '20px' }}>
      {activeProject.wbs && activeProject.wbs.length > 0 ? (
        <div>
          {activeProject.wbs.map((item) => (
            <Card
              key={item.id}
              style={{
                marginBottom: '12px',
                borderLeft: `4px solid ${
                  statusColors[item.status] === 'success' ? 'var(--grn)' :
                  statusColors[item.status] === 'warning' ? 'var(--amb)' :
                  'var(--tx3)'
                }`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <h4 style={{ margin: '0', fontSize: '14px', fontWeight: '600' }}>
                      {item.name}
                    </h4>
                    <Badge variant={statusColors[item.status]}>
                      {item.status}
                    </Badge>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--tx3)' }}>
                    {item.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '2px' }}>Start Date</div>
                      <div style={{ fontSize: '12px', fontWeight: '500' }}>{item.startDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '2px' }}>End Date</div>
                      <div style={{ fontSize: '12px', fontWeight: '500' }}>{item.endDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '2px' }}>Duration</div>
                      <div style={{ fontSize: '12px', fontWeight: '500' }}>{item.estimatedDays} days</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '2px' }}>Owner</div>
                      <div style={{ fontSize: '12px', fontWeight: '500' }}>{item.owner}</div>
                    </div>
                  </div>
                </div>

                {hasPermission('edit') && (
                  <div style={{ display: 'flex', gap: '6px', whiteSpace: 'nowrap' }}>
                    <Button size="small" variant="secondary" onClick={() => handleEditWBS(item)}>✏️</Button>
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this WBS item?')) {
                          deleteWBSItem(item.id);
                        }
                      }}
                    >
                      🗑️
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {hasPermission('create') && (
            <Button variant="primary" style={{ marginTop: '16px' }} onClick={handleOpenAddWBS}>
              ➕ Add WBS Item
            </Button>
          )}
        </div>
      ) : (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--tx3)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🗂</div>
          <div>No WBS items defined yet</div>
          {hasPermission('create') && (
            <Button variant="primary" style={{ marginTop: '16px' }} onClick={handleOpenAddWBS}>
              ➕ Create First WBS Item
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit WBS Item Modal */}
      {isModalOpen && (
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
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600' }}>
              {editingItem ? '✏️ Edit WBS Item' : '➕ Add WBS Item'}
            </h2>

            <FormField
              label="Title"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="e.g., Phase 1: Discovery"
              required
            />

            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Detailed description of this WBS item"
              rows={3}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormField
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleFormChange}
                required
              />

              <FormField
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleFormChange}
                required
              />
            </div>

            <FormField
              label="Estimated Duration (days)"
              name="estimatedDays"
              type="number"
              value={formData.estimatedDays}
              onChange={handleFormChange}
              min="0"
            />

            <FormField
              label="Owner"
              name="owner"
              value={formData.owner}
              onChange={handleFormChange}
              placeholder="e.g., u1 or project member ID"
            />

            <FormField
              label="Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={handleFormChange}
              options={[
                { value: 'not-started', label: 'Not Started' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
            />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveWBS}>
                {editingItem ? 'Update WBS Item' : 'Create WBS Item'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
