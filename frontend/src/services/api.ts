import axios from 'axios';
import { Incident, CreateIncidentPayload, UpdateIncidentPayload, IncidentFilters } from '../types/incident';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getIncidents = async (filters?: IncidentFilters): Promise<Incident[]> => {
  const params: Record<string, string> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.severity) params.severity = filters.severity;
  if (filters?.search) params.search = filters.search;

  const response = await api.get<Incident[]>('/incidents', { params });
  return response.data;
};

export const createIncident = async (payload: CreateIncidentPayload): Promise<Incident> => {
  const response = await api.post<Incident>('/incidents', payload);
  return response.data;
};

export const updateIncident = async (id: string, payload: UpdateIncidentPayload): Promise<Incident> => {
  const response = await api.patch<Incident>(`/incidents/${id}`, payload);
  return response.data;
};

export const deleteIncident = async (id: string): Promise<void> => {
  await api.delete(`/incidents/${id}`);
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    const res = await api.get('/health');
    return res.status === 200;
  } catch (error) {
    return false;
  }
};
