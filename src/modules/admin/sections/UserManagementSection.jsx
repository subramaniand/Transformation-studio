/**
 * UserManagementSection - User management interface
 */
import { useEffect } from 'react';
import { useAuthStore } from '../../../authStore';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Avatar from '../../../components/ui/Avatar';

export default function UserManagementSection() {
  const users = useAuthStore(state => state.users);
  const fetchUsers = useAuthStore(state => state.fetchUsers);

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
        <Button size="small" variant="secondary">✏️</Button>
        <Button size="small" variant="danger">🗑️</Button>
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
        <Button variant="primary">➕ Add User</Button>
      </div>

      <Card>
        <Table headers={headers} rows={rows} />
      </Card>
    </div>
  );
}
