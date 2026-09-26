export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncidentPayload {
  title: string;
  description: string;
  severity: IncidentSeverity;
  status?: IncidentStatus;
}

export interface UpdateIncidentPayload {
  title?: string;
  description?: string;
  status?: IncidentStatus;
  severity?: IncidentSeverity;
}

export interface IncidentFilters {
  status?: IncidentStatus | '';
  severity?: IncidentSeverity | '';
  search?: string;
}
