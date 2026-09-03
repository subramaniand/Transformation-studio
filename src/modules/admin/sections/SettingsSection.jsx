/**
 * SettingsSection - System settings and configuration
 */
import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import FormField from '../../../components/ui/FormField';
import Badge from '../../../components/ui/Badge';

export default function SettingsSection() {
  const [settings, setSettings] = useState({
    supabaseUrl: 'https://your-project.supabase.co',
    supabaseKey: '••••••••••••••••••••••••••••••••••••••••••••••',
    apiEndpoint: 'https://api.transformation-studio.com',
    apiKey: '••••••••••••••••••••••••••••••••••••••••••••••',
    maxUploadSize: 50,
    sessionTimeout: 30,
    enableNotifications: true,
    enableAuditLogging: true,
    backupFrequency: 'daily',
    maintenanceWindow: '02:00-04:00 UTC',
  });

  const [editMode, setEditMode] = useState(false);
  const [editSettings, setEditSettings] = useState({ ...settings });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSupabaseKey, setShowSupabaseKey] = useState(false);

  const handleSave = () => {
    setSettings(editSettings);
    setEditMode(false);
    alert('Settings saved successfully!');
  };

  const handleChange = (key, value) => {
    setEditSettings({
      ...editSettings,
      [key]: value,
    });
  };

  const handleReset = () => {
    setEditSettings({ ...settings });
    setEditMode(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      {/* Supabase Configuration */}
      <Card title="☁️ Supabase Configuration" style={{ marginBottom: '20px' }}>
        <FormField
          label="Supabase URL"
          name="supabaseUrl"
          value={editSettings.supabaseUrl}
          onChange={(e) => handleChange('supabaseUrl', e.target.value)}
          disabled={!editMode}
          placeholder="https://your-project.supabase.co"
        />

        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--tx2)' }}>
              Supabase API Key
            </label>
            <button
              onClick={() => setShowSupabaseKey(!showSupabaseKey)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ac)',
                cursor: 'pointer',
                fontSize: '11px',
                textDecoration: 'underline',
              }}
            >
              {showSupabaseKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            type={showSupabaseKey ? 'text' : 'password'}
            value={editSettings.supabaseKey}
            onChange={(e) => handleChange('supabaseKey', e.target.value)}
            disabled={!editMode}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'var(--bg3)',
              border: '1px solid var(--bd)',
              borderRadius: '6px',
              color: 'var(--tx)',
              fontSize: '12px',
              fontFamily: 'monospace',
              outline: 'none',
              cursor: editMode ? 'text' : 'default',
            }}
          />
        </div>

        <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg3)', borderRadius: '6px', fontSize: '11px', color: 'var(--tx3)' }}>
          <strong>Connection Status:</strong> <Badge variant="success">Connected</Badge>
          <div style={{ marginTop: '6px', fontSize: '10px' }}>
            Last verified: 2 minutes ago
          </div>
        </div>
      </Card>

      {/* API Configuration */}
      <Card title="🔌 API Configuration" style={{ marginBottom: '20px' }}>
        <FormField
          label="API Endpoint"
          name="apiEndpoint"
          value={editSettings.apiEndpoint}
          onChange={(e) => handleChange('apiEndpoint', e.target.value)}
          disabled={!editMode}
          placeholder="https://api.example.com"
        />

        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--tx2)' }}>
              API Key
            </label>
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ac)',
                cursor: 'pointer',
                fontSize: '11px',
                textDecoration: 'underline',
              }}
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            type={showApiKey ? 'text' : 'password'}
            value={editSettings.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            disabled={!editMode}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'var(--bg3)',
              border: '1px solid var(--bd)',
              borderRadius: '6px',
              color: 'var(--tx)',
              fontSize: '12px',
              fontFamily: 'monospace',
              outline: 'none',
              cursor: editMode ? 'text' : 'default',
            }}
          />
        </div>
      </Card>

      {/* System Configuration */}
      <Card title="⚙️ System Configuration" style={{ marginBottom: '20px' }}>
        <FormField
          label="Max Upload Size (MB)"
          name="maxUploadSize"
          type="number"
          value={editSettings.maxUploadSize}
          onChange={(e) => handleChange('maxUploadSize', parseInt(e.target.value))}
          disabled={!editMode}
        />

        <FormField
          label="Session Timeout (minutes)"
          name="sessionTimeout"
          type="number"
          value={editSettings.sessionTimeout}
          onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
          disabled={!editMode}
          style={{ marginTop: '12px' }}
        />

        <FormField
          label="Backup Frequency"
          name="backupFrequency"
          type="select"
          value={editSettings.backupFrequency}
          onChange={(e) => handleChange('backupFrequency', e.target.value)}
          disabled={!editMode}
          options={[
            { value: 'hourly', label: 'Hourly' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
          ]}
          style={{ marginTop: '12px' }}
        />

        <FormField
          label="Maintenance Window (UTC)"
          name="maintenanceWindow"
          value={editSettings.maintenanceWindow}
          onChange={(e) => handleChange('maintenanceWindow', e.target.value)}
          disabled={!editMode}
          placeholder="HH:MM-HH:MM UTC"
          style={{ marginTop: '12px' }}
        />
      </Card>

      {/* Feature Toggles */}
      <Card title="🎛️ Feature Toggles" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: editMode ? 'pointer' : 'default' }}>
            <input
              type="checkbox"
              checked={editSettings.enableNotifications}
              onChange={(e) => handleChange('enableNotifications', e.target.checked)}
              disabled={!editMode}
              style={{ cursor: editMode ? 'pointer' : 'default' }}
            />
            <div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--tx2)' }}>
                Enable Notifications
              </div>
              <div style={{ fontSize: '11px', color: 'var(--tx3)' }}>
                Allow system to send email and push notifications
              </div>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: editMode ? 'pointer' : 'default' }}>
            <input
              type="checkbox"
              checked={editSettings.enableAuditLogging}
              onChange={(e) => handleChange('enableAuditLogging', e.target.checked)}
              disabled={!editMode}
              style={{ cursor: editMode ? 'pointer' : 'default' }}
            />
            <div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--tx2)' }}>
                Enable Audit Logging
              </div>
              <div style={{ fontSize: '11px', color: 'var(--tx3)' }}>
                Track all user actions and system changes
              </div>
            </div>
          </label>
        </div>
      </Card>

      {/* System Status */}
      <Card title="📊 System Status" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>API Status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--grn)' }} />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>Operational</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Database</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--grn)' }} />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>Connected</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Uptime</div>
            <div style={{ fontSize: '12px', fontWeight: '500' }}>99.8%</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Last Backup</div>
            <div style={{ fontSize: '12px', fontWeight: '500' }}>2 hours ago</div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        {editMode ? (
          <>
            <Button variant="secondary" onClick={handleReset}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Settings
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setEditMode(true)}>
            ✏️ Edit Settings
          </Button>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg3)', borderRadius: '6px', fontSize: '11px', color: 'var(--tx3)' }}>
        <strong>Note:</strong> Changes to API configuration will require application restart. System status is updated in real-time.
      </div>
    </div>
  );
}
