import React from 'react';
import { Incident } from '../types/incident';
import { AlertCircle, Clock, CheckCircle2, Flame } from 'lucide-react';

interface StatsOverviewProps {
  incidents: Incident[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ incidents }) => {
  const total = incidents.length;
  const openCount = incidents.filter((i) => i.status === 'OPEN').length;
  const inProgressCount = incidents.filter((i) => i.status === 'IN_PROGRESS').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;
  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL' && i.status !== 'CLOSED').length;

  return (
    <div className="stats-grid">
      <div className="stat-card glass-panel">
        <div>
          <div className="stat-label">Total Incidents</div>
          <div className="stat-value">{total}</div>
        </div>
        <AlertCircle size={28} color="#9ca3af" />
      </div>

      <div className="stat-card glass-panel">
        <div>
          <div className="stat-label">Open</div>
          <div className="stat-value" style={{ color: '#60a5fa' }}>{openCount}</div>
        </div>
        <AlertCircle size={28} color="#60a5fa" />
      </div>

      <div className="stat-card glass-panel">
        <div>
          <div className="stat-label">In Progress</div>
          <div className="stat-value" style={{ color: '#fbbf24' }}>{inProgressCount}</div>
        </div>
        <Clock size={28} color="#fbbf24" />
      </div>

      <div className="stat-card glass-panel">
        <div>
          <div className="stat-label">Resolved</div>
          <div className="stat-value" style={{ color: '#34d399' }}>{resolvedCount}</div>
        </div>
        <CheckCircle2 size={28} color="#34d399" />
      </div>

      <div className="stat-card glass-panel">
        <div>
          <div className="stat-label">Active Critical</div>
          <div className="stat-value" style={{ color: '#f87171' }}>{criticalCount}</div>
        </div>
        <Flame size={28} color="#f87171" />
      </div>
    </div>
  );
};
