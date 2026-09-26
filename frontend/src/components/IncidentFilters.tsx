import React from 'react';
import { IncidentFilters as FilterType } from '../types/incident';
import { Plus, Search, Filter } from 'lucide-react';

interface IncidentFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  onOpenCreateModal: () => void;
}

export const IncidentFilters: React.FC<IncidentFiltersProps> = ({
  filters,
  onFilterChange,
  onOpenCreateModal,
}) => {
  return (
    <div className="controls-bar glass-panel">
      <div className="filters-group">
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px' }} />
          <input
            type="text"
            className="search-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search incidents..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="#9ca3af" />
          <select
            className="select-input"
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            className="select-input"
            value={filters.severity || ''}
            onChange={(e) => onFilterChange({ ...filters, severity: e.target.value as any })}
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      <button onClick={onOpenCreateModal} className="btn-primary">
        <Plus size={18} /> New Incident
      </button>
    </div>
  );
};
