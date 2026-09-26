import React from 'react';
import { Incident, IncidentStatus } from '../types/incident';
import { Clock, AlertTriangle, Trash2 } from 'lucide-react';

interface IncidentListProps {
  incidents: Incident[];
  isLoading: boolean;
  onStatusChange: (id: string, newStatus: IncidentStatus) => void;
  onDelete: (id: string) => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  isLoading,
  onStatusChange,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
        <p>Loading incidents from API Gateway...</p>
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
        <AlertTriangle size={36} color="#9ca3af" style={{ marginBottom: '1rem' }} />
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No Incidents Found</h3>
        <p>There are currently no incidents matching your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="incidents-list">
      {incidents.map((incident) => {
        const createdDate = new Date(incident.createdAt).toLocaleString();

        return (
          <div key={incident.id} className="incident-card glass-panel">
            <div className="incident-header">
              <div>
                <span className={`badge badge-severity-${incident.severity}`} style={{ marginRight: '0.75rem' }}>
                  {incident.severity}
                </span>
                <span className={`badge badge-status-${incident.status}`}>
                  {incident.status.replace('_', ' ')}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select
                  className="status-select-inline"
                  value={incident.status}
                  onChange={(e) => onStatusChange(incident.id, e.target.value as IncidentStatus)}
                >
                  <option value="OPEN">Mark OPEN</option>
                  <option value="IN_PROGRESS">Mark IN PROGRESS</option>
                  <option value="RESOLVED">Mark RESOLVED</option>
                  <option value="CLOSED">Mark CLOSED</option>
                </select>

                <button
                  onClick={() => onDelete(incident.id)}
                  className="btn-secondary"
                  style={{ padding: '0.35rem', color: '#f87171', border: 'none' }}
                  title="Delete Incident"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="incident-title" style={{ marginTop: '0.5rem' }}>
              {incident.title}
            </h3>

            <p className="incident-description">{incident.description}</p>

            <div className="incident-footer">
              <div className="incident-meta">
                <span>
                  <strong>ID:</strong> <code style={{ color: '#9ca3af' }}>{incident.id}</code>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={14} /> Created: {createdDate}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
