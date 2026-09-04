/**
 * TeamView - Team roster, allocation, skills, and management
 */
import { useState } from 'react';
import { usePlannerStore } from '../../../plannerStore';
import { useAuthStore } from '../../../authStore';
import { useModal } from '../../../context/ModalContext';
import Card from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import FormField from '../../../components/ui/FormField';

const AVAILABLE_SKILLS = ['Cloud Architecture', 'AWS', 'Azure', 'Python', 'Java', 'React', 'DevOps', 'Data Engineering', 'UI/UX', 'Project Management', 'Agile', 'Testing'];

export default function TeamView() {
  const activeProject = usePlannerStore(state => state.activeProject);
  const addTeamMember = usePlannerStore(state => state.addTeamMember);
  const updateTeamMember = usePlannerStore(state => state.updateTeamMember);
  const removeTeamMember = usePlannerStore(state => state.removeTeamMember);
  const hasPermission = useAuthStore(state => state.hasPermission);
  const openModal = useModal().openModal;
  const closeModal = useModal().closeModal;
  const modals = useModal().modals;

  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    availability: 'full-time',
    skills: [],
    email: '',
    allocationPercent: 100,
  });
  const [skillInput, setSkillInput] = useState('');

  if (!activeProject) return null;

  const isEditModalOpen = modals.some(m => m.type === 'editTeamMember');
  const editModalId = modals.find(m => m.type === 'editTeamMember')?.id;

  const handleOpenAddMember = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      availability: 'full-time',
      skills: [],
      email: '',
      allocationPercent: 100,
    });
    openModal('editTeamMember');
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      availability: member.availability || 'full-time',
      skills: member.skills || [],
      email: member.email || '',
      allocationPercent: member.allocationPercent || 100,
    });
    openModal('editTeamMember');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.role) {
      alert('Please fill in name and role');
      return;
    }

    if (editingMember) {
      await updateTeamMember(editingMember.id, {
        name: formData.name,
        role: formData.role,
        availability: formData.availability,
        skills: formData.skills,
        email: formData.email,
        allocationPercent: parseInt(formData.allocationPercent),
      });
    } else {
      const newMember = {
        id: `t${Date.now()}`,
        userId: `u${Date.now()}`,
        name: formData.name,
        role: formData.role,
        availability: formData.availability,
        skills: formData.skills,
        email: formData.email,
        startDate: new Date().toISOString().split('T')[0],
        endDate: null,
        allocationPercent: parseInt(formData.allocationPercent),
      };
      await addTeamMember(newMember);
    }

    if (editModalId) closeModal(editModalId);
  };

  const handleDelete = (memberId) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      removeTeamMember(memberId);
    }
  };

  // Calculate team statistics
  const totalMembers = activeProject.team?.length || 0;
  const avgAllocation = totalMembers > 0
    ? Math.round(activeProject.team.reduce((sum, m) => sum + (m.allocationPercent || 100), 0) / totalMembers)
    : 0;
  const fullTimeCount = activeProject.team?.filter(m => m.availability === 'full-time').length || 0;
  const partTimeCount = activeProject.team?.filter(m => m.availability === 'part-time').length || 0;

  // Build skills matrix
  const allSkills = [...new Set(activeProject.team?.flatMap(m => m.skills || []) || [])].sort();
  const skillsMatrix = activeProject.team?.map(member => ({
    member,
    skills: allSkills.map(skill => member.skills?.includes(skill) || false),
  })) || [];

  // Table data
  const headers = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'availability', label: 'Availability' },
    { key: 'allocation', label: 'Allocation' },
    { key: 'skills', label: 'Skills' },
    { key: 'actions', label: 'Actions' },
  ];

  const rows = (activeProject.team || []).map(member => ({
    id: member.id,
    name: member.name,
    role: member.role,
    availability: member.availability === 'full-time' ? '🔵 Full-Time' : '🟠 Part-Time',
    allocation: `${member.allocationPercent || 100}%`,
    skills: (
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {(member.skills || []).slice(0, 3).map((skill, idx) => (
          <Badge key={idx} text={skill} variant="secondary" />
        ))}
        {(member.skills || []).length > 3 && (
          <Badge text={`+${member.skills.length - 3}`} variant="secondary" />
        )}
      </div>
    ),
    actions: (
      <div style={{ display: 'flex', gap: '6px' }}>
        <Button
          size="small"
          variant="secondary"
          onClick={() => handleEditMember(member)}
        >
          ✏️
        </Button>
        {hasPermission('edit') && (
          <Button
            size="small"
            variant="danger"
            onClick={() => handleDelete(member.id)}
          >
            🗑️
          </Button>
        )}
      </div>
    ),
  }));

  return (
    <div style={{ padding: '20px' }}>
      {/* Team Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <Card style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '4px' }}>Total Members</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ac)' }}>
            {totalMembers}
          </div>
        </Card>
        <Card style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '4px' }}>Avg Allocation</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--grn)' }}>
            {avgAllocation}%
          </div>
        </Card>
        <Card style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '4px' }}>Full-Time</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--amb)' }}>
            {fullTimeCount}
          </div>
        </Card>
        <Card style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '4px' }}>Part-Time</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gold)' }}>
            {partTimeCount}
          </div>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card title="👥 Team Members" style={{ marginBottom: '24px' }}>
        <Table headers={headers} rows={rows} />
        {rows.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--tx3)' }}>
            No team members added yet
          </div>
        )}
      </Card>

      {/* Skills Matrix */}
      {allSkills.length > 0 && (
        <Card title="🎯 Skills Matrix" style={{ marginBottom: '24px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bd)' }}>
                  <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: 'var(--tx2)' }}>Member</th>
                  {allSkills.map(skill => (
                    <th key={skill} style={{ padding: '8px', textAlign: 'center', fontWeight: '600', color: 'var(--tx2)', minWidth: '100px' }}>
                      {skill}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {skillsMatrix.map((row, idx) => (
                  <tr key={row.member.id} style={{ borderBottom: idx < skillsMatrix.length - 1 ? '1px solid var(--bd)' : 'none' }}>
                    <td style={{ padding: '8px', fontWeight: '500', color: 'var(--tx)' }}>
                      {row.member.name}
                    </td>
                    {row.skills.map((hasSkill, sIdx) => (
                      <td key={`${row.member.id}-${sIdx}`} style={{ padding: '8px', textAlign: 'center' }}>
                        {hasSkill ? (
                          <span style={{ fontSize: '16px' }}>✅</span>
                        ) : (
                          <span style={{ color: 'var(--tx3)' }}>-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Member Button */}
      {hasPermission('create') && (
        <Button
          variant="primary"
          onClick={handleOpenAddMember}
          style={{ marginBottom: '24px' }}
        >
          ➕ Add Team Member
        </Button>
      )}

      {/* Edit/Add Member Modal */}
      {isEditModalOpen && (
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
            <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '600' }}>
              {editingMember ? '✏️ Edit Team Member' : '➕ Add Team Member'}
            </h2>

            <FormField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="e.g., John Smith"
            />

            <FormField
              label="Role"
              name="role"
              type="select"
              value={formData.role}
              onChange={handleFormChange}
              options={(activeProject.roles || []).map(role => ({ value: role.name || role, label: role.name || role }))}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="john@company.com"
            />

            <FormField
              label="Availability"
              name="availability"
              type="select"
              value={formData.availability}
              onChange={handleFormChange}
              options={[
                { value: 'full-time', label: 'Full-Time' },
                { value: 'part-time', label: 'Part-Time' },
              ]}
            />

            <FormField
              label="Allocation (%)"
              name="allocationPercent"
              type="number"
              value={formData.allocationPercent}
              onChange={handleFormChange}
              helperText="0-100%"
            />

            <div style={{ marginBottom: '11px' }}>
              <label style={{
                display: 'block',
                fontSize: '11.5px',
                color: 'var(--tx2)',
                marginBottom: '4px',
                fontWeight: '500',
              }}>
                Skills
              </label>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <select
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  style={{
                    flex: 1,
                    border: '1px solid var(--bd2)',
                    borderRadius: '6px',
                    padding: '0 8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--tx)',
                    fontSize: '12px',
                    height: '32px',
                    outline: 'none',
                  }}
                >
                  <option value="">Select a skill...</option>
                  {AVAILABLE_SKILLS.map(skill => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <Button
                  variant="secondary"
                  onClick={handleAddSkill}
                  style={{ padding: '6px 12px' }}
                >
                  Add
                </Button>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {formData.skills.map(skill => (
                  <div
                    key={skill}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      background: 'var(--bg3)',
                      borderRadius: '20px',
                      fontSize: '12px',
                      color: 'var(--tx)',
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--tx3)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '0',
                        lineHeight: '1',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button
                variant="secondary"
                onClick={() => editModalId && closeModal(editModalId)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
              >
                {editingMember ? 'Update Member' : 'Add Member'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
