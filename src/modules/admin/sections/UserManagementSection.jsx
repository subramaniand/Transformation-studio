/**
 * UserManagementSection - User management interface
 */
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../authStore';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Avatar from '../../../components/ui/Avatar';
import FormField from '../../../components/ui/FormField';

export default function UserManagementSection() {
  const users = useAuthStore(state => state.users);
  const fetchUsers = useAuthStore(state => state.fetchUsers);
  const addUser = useAuthStore(state => state.addUser);
  const updateUser = useAuthStore(state => state.updateUser);
  const deleteUser = useAuthStore(state => state.deleteUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'viewer',
    function: '',
    active: true,
  });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const headers = [
    { key: 'avatar', label: 'User' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'function', label: 'Function' },
    { key: 'status', label: 'Status' },
    { key: 'created', label: 'Created' },
    { key: 'actions', label: 'Actions', align: 'center' },
  ];

  const getRoleBadgeVariant = (role) => {
    return role === 'admin' ? 'danger' : role === 'analyst' ? 'warning' : 'info';
  };

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      name: '',
      email: '',
      password: '',
      role: 'viewer',
      function: '',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      function: user.function || '',
      active: user.active,
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveUser = async () => {
    if (!formData.username || !formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingUser) {
      // Update existing user
      const updates = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        function: formData.function,
        active: formData.active,
      };
      if (formData.password) {
        updates.password = formData.password;
      }
      await updateUser(editingUser.id, updates);
    } else {
      // Add new user
      if (!formData.password) {
        alert('Password is required for new users');
        return;
      }
      await addUser(formData);
    }
    setIsModalOpen(false);
  };

  const rows = users.map(user => ({
    id: user.id,
    avatar: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Avatar name={user.name} size="small" />
        <div>
          <div style={{ fontSize: '12px', fontWeight: '500' }}>{user.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--tx3)' }}>{user.username}</div>
        </div>
      </div>
    ),
    email: user.email,
    role: <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>,
    function: user.function || 'N/A',
    status: user.active ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge>,
    created: user.created,
    actions: (
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
        <Button size="small" variant="secondary" onClick={() => handleEditUser(user)}>✏️</Button>
        <Button size="small" variant="danger" onClick={() => handleDeleteUser(user.id)}>🗑️</Button>
      </div>
    ),
  }));

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600' }}>
            👥 User Accounts ({users.length})
          </h3>
          <p style={{ margin: '0', fontSize: '12px', color: 'var(--tx3)' }}>
            Manage user accounts and permissions
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAddUser}>➕ Add User</Button>
      </div>

      <Card>
        <Table headers={headers} rows={rows} />
      </Card>

      {/* Add/Edit User Modal */}
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
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600' }}>
              {editingUser ? '✏️ Edit User' : '➕ Add New User'}
            </h2>

            <FormField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              placeholder="e.g., john.smith"
              required
            />

            <FormField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="e.g., John Smith"
              required
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="john@company.com"
              required
            />

            {!editingUser && (
              <FormField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="Enter password"
                required
              />
            )}

            {editingUser && (
              <FormField
                label="Password (leave blank to keep current)"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="Enter new password to change"
              />
            )}

            <FormField
              label="Role"
              name="role"
              type="select"
              value={formData.role}
              onChange={handleFormChange}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'analyst', label: 'Analyst' },
                { value: 'viewer', label: 'Viewer' },
              ]}
            />

            <FormField
              label="Function/Department"
              name="function"
              value={formData.function}
              onChange={handleFormChange}
              placeholder="e.g., Finance, Technology/IT"
            />

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                color: 'var(--tx2)',
              }}>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleFormChange}
                  style={{ cursor: 'pointer' }}
                />
                Active
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveUser}>
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
