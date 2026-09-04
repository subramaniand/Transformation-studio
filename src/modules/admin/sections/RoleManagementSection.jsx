/**
 * RoleManagementSection - Role CRUD and management
 */
import { useEffect, useState } from 'react';
import { useAdminStore } from '../../../adminStore';
import { useAuthStore } from '../../../authStore';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import FormField from '../../../components/ui/FormField';

export default function RoleManagementSection() {
  const roles = useAdminStore(state => state.roles);
  const addRole = useAdminStore(state => state.addRole);
  const updateRole = useAdminStore(state => state.updateRole);
  const deleteRole = useAdminStore(state => state.deleteRole);
  const fetchRoles = useAdminStore(state => state.fetchRoles);
  const users = useAuthStore(state => state.users);

  useEffect(() => {
    fetchRoles().catch(error => alert(`Could not load roles from Supabase: ${error.message}`));
  }, [fetchRoles]);
  const [editingRole, setEditingRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: {
      create: false,
      edit: false,
      delete: false,
      admin: false,
      export: false,
    },
  });

  const handleNewRole = () => {
    setFormData({
      name: '',
      description: '',
      permissions: {
        create: false,
        edit: false,
        delete: false,
        admin: false,
        export: false,
      },
    });
    setEditingRole(null);
    setShowForm(true);
  };

  const handleEditRole = (role) => {
    setFormData({
      name: role.name,
      description: role.description,
      permissions: { ...role.permissions },
    });
    setEditingRole(role);
    setShowForm(true);
  };

  const handleSaveRole = async () => {
    if (!formData.name) {
      alert('Role name is required');
      return;
    }

    if (editingRole) {
      await updateRole(editingRole.id, formData);
    } else {
      await addRole(formData);
    }

    setShowForm(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId) => {
    if (confirm('Are you sure you want to delete this role?')) {
      deleteRole(roleId).catch(error => alert(`Could not delete role: ${error.message}`));
    }
  };

  const handlePermissionChange = (permission) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: !formData.permissions[permission],
      },
    });
  };

  const headers = [
    { key: 'name', label: 'Role Name' },
    { key: 'description', label: 'Description' },
    { key: 'users', label: 'Users' },
    { key: 'permissions', label: 'Permissions' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', align: 'center' },
  ];

  const getPermissionCount = (permissions) => {
    return Object.values(permissions).filter(Boolean).length;
  };

  const rows = roles.map(role => ({
    id: role.id,
    name: role.name,
    description: role.description,
    users: users.filter(user => user.role === role.name.toLowerCase()).length,
    permissions: `${getPermissionCount(role.permissions)}/5`,
    status: <Badge variant={role.active ? 'success' : 'danger'}>
      {role.active ? 'Active' : 'Inactive'}
    </Badge>,
    actions: (
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
        <Button size="small" variant="secondary" onClick={() => handleEditRole(role)}>
          ✏️
        </Button>
        <Button size="small" variant="danger" onClick={() => handleDeleteRole(role.id)}>
          🗑️
        </Button>
      </div>
    ),
  }));

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600' }}>
            🔐 Role Management ({roles.length})
          </h3>
          <p style={{ margin: '0', fontSize: '12px', color: 'var(--tx3)' }}>
            Define roles and manage access permissions
          </p>
        </div>
        <Button variant="primary" onClick={handleNewRole}>
          ➕ New Role
        </Button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600' }}>
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </h4>

            <FormField
              label="Role Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Supervisor"
            />

            <FormField
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description of this role..."
            />

            <div style={{ marginTop: '16px', marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--tx2)', display: 'block', marginBottom: '8px' }}>
                Permissions
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {Object.keys(formData.permissions).map(permission => (
                  <label key={permission} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.permissions[permission]}
                      onChange={() => handlePermissionChange(permission)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--tx2)' }}>
                      {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  setShowForm(false);
                  setEditingRole(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" size="small" onClick={handleSaveRole}>
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <Table headers={headers} rows={rows} />
      </Card>

      <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg3)', borderRadius: '8px', fontSize: '12px', color: 'var(--tx3)' }}>
        <strong>Permission Legend:</strong>
        <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
          <li><strong>Create:</strong> Can create new catalogues and projects</li>
          <li><strong>Edit:</strong> Can modify existing items</li>
          <li><strong>Delete:</strong> Can remove items</li>
          <li><strong>Admin:</strong> Can access admin panel</li>
          <li><strong>Export:</strong> Can export data in various formats</li>
        </ul>
      </div>
    </div>
  );
}
