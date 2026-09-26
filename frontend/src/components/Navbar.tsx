import React from 'react';
import { Activity, ShieldAlert, RefreshCw } from 'lucide-react';

interface NavbarProps {
  isHealthy: boolean | null;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isHealthy, onRefresh }) => {
  return (
    <header className="navbar glass-panel">
      <div className="brand">
        <div className="brand-icon">
          <ShieldAlert size={22} />
        </div>
        <div>
          <h1 className="brand-title">OpsTrack</h1>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Incident Management System</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onRefresh}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          title="Refresh Incidents"
        >
          <RefreshCw size={14} /> Refresh
        </button>

        <div className={`health-badge ${isHealthy ? 'up' : isHealthy === false ? 'down' : ''}`}>
          <span className="dot"></span>
          {isHealthy === null ? 'Checking Gateway...' : isHealthy ? 'API Gateway Operational' : 'API Gateway Offline'}
        </div>
      </div>
    </header>
  );
};
