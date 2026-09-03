/**
 * AdminModule - System administration and management
 */
import { useState } from 'react';
import { useAdminStore } from '../../adminStore';
import { useAuthStore } from '../../authStore';
import Tabs from '../../components/ui/Tabs';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import UserManagementSection from './sections/UserManagementSection';
import PricingTypesSection from './sections/PricingTypesSection';
import AuditLogSection from './sections/AuditLogSection';
import SystemStatusSection from './sections/SystemStatusSection';

export default function AdminModule() {
  const user = useAuthStore(state => state.user);
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="content">
        <Card title="Access Denied">
          <p>You do not have permission to access the admin panel.</p>
          <p style={{ color: 'var(--tx3)', fontSize: '12px' }}>
            Only administrators can manage system settings and users.
          </p>
        </Card>
      </div>
    );
  }

  const tabs = [
    {
      id: 'users',
      label: '👥 Users',
      content: <UserManagementSection />,
    },
    {
      id: 'pricing',
      label: '💰 Pricing Types',
      content: <PricingTypesSection />,
    },
    {
      id: 'audit',
      label: '📋 Audit Logs',
      content: <AuditLogSection />,
    },
    {
      id: 'status',
      label: '⚙️ System Status',
      content: <SystemStatusSection />,
    },
  ];

  return (
    <div className="content">
      <div style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '600' }}>
            ⚙️ Admin Panel
          </h1>
          <p style={{ margin: '0', color: 'var(--tx3)', fontSize: '13px' }}>
            Manage users, system settings, and monitor activity
          </p>
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
            variant="line"
          />
        </div>
      </div>
    </div>
  );
}
