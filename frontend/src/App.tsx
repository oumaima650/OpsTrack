import React, { useState, useEffect, useCallback } from 'react';
import { Incident, IncidentFilters as FilterType, CreateIncidentPayload, IncidentStatus } from './types/incident';
import { getIncidents, createIncident, updateIncident, deleteIncident, checkHealth } from './services/api';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { IncidentFilters } from './components/IncidentFilters';
import { IncidentList } from './components/IncidentList';
import { CreateIncidentModal } from './components/CreateIncidentModal';
import { NotificationBanner } from './components/NotificationBanner';

export const App: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [filters, setFilters] = useState<FilterType>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [banner, setBanner] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const fetchHealthStatus = useCallback(async () => {
    const healthy = await checkHealth();
    setIsHealthy(healthy);
  }, []);

  const fetchIncidents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getIncidents(filters);
      setIncidents(data);
    } catch (err: any) {
      setBanner({
        message: 'Failed to fetch incidents from API Gateway. Ensure backend services are running.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHealthStatus();
    fetchIncidents();
  }, [fetchHealthStatus, fetchIncidents]);

  const handleCreateIncident = async (payload: CreateIncidentPayload) => {
    try {
      const newIncident = await createIncident(payload);
      setIncidents((prev) => [newIncident, ...prev]);
      setBanner({
        message: `Incident "${newIncident.title}" created successfully and notification logged!`,
        type: 'success',
      });
      fetchHealthStatus();
    } catch (err: any) {
      setBanner({
        message: err.response?.data?.message || 'Failed to create incident.',
        type: 'error',
      });
      throw err;
    }
  };

  const handleStatusChange = async (id: string, newStatus: IncidentStatus) => {
    try {
      const updated = await updateIncident(id, { status: newStatus });
      setIncidents((prev) => prev.map((inc) => (inc.id === id ? updated : inc)));
      setBanner({
        message: `Incident status updated to ${newStatus}. Notification dispatched.`,
        type: 'success',
      });
    } catch (err: any) {
      setBanner({
        message: 'Failed to update incident status.',
        type: 'error',
      });
    }
  };

  const handleDeleteIncident = async (id: string) => {
    try {
      await deleteIncident(id);
      setIncidents((prev) => prev.filter((inc) => inc.id !== id));
      setBanner({
        message: 'Incident deleted successfully.',
        type: 'success',
      });
    } catch (err: any) {
      setBanner({
        message: 'Failed to delete incident.',
        type: 'error',
      });
    }
  };

  return (
    <div className="app-container">
      <Navbar isHealthy={isHealthy} onRefresh={fetchIncidents} />

      <NotificationBanner
        message={banner?.message || null}
        type={banner?.type || 'error'}
        onDismiss={() => setBanner(null)}
      />

      <StatsOverview incidents={incidents} />

      <IncidentFilters
        filters={filters}
        onFilterChange={setFilters}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <IncidentList
        incidents={incidents}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteIncident}
      />

      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateIncident}
      />
    </div>
  );
};
