import { EventItem, SiteSettings, Registration, DashboardStats, AdminUser } from '../types';

const API_BASE = '/api';

export function getAdminToken(): string | null {
  return localStorage.getItem('mechvortex_admin_token');
}

export function setAdminToken(token: string) {
  localStorage.setItem('mechvortex_admin_token', token);
}

export function removeAdminToken() {
  localStorage.removeItem('mechvortex_admin_token');
  localStorage.removeItem('mechvortex_admin_user');
}

export function getStoredAdminUser(): AdminUser | null {
  const raw = localStorage.getItem('mechvortex_admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAdminUser(user: AdminUser) {
  localStorage.setItem('mechvortex_admin_user', JSON.stringify(user));
}

function getAuthHeaders() {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to fetch site settings');
  return res.json();
}

export async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch(`${API_BASE}/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function fetchEventBySlug(slug: string): Promise<EventItem> {
  const res = await fetch(`${API_BASE}/events/${slug}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Event not found');
  }
  return res.json();
}

export async function submitRegistration(formData: FormData): Promise<{ success: boolean; message: string; registration: any }> {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  return data;
}

export async function fetchRegistrationReceipt(registrationId: string): Promise<Registration> {
  const res = await fetch(`${API_BASE}/registrations/${registrationId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Receipt not found');
  }
  return res.json();
}

export async function loginAdmin(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }
  setAdminToken(data.token);
  setStoredAdminUser(data.user);
  return data;
}

export async function setupAdmin(name: string, email: string, password: string, setup_code?: string): Promise<{ token: string; user: AdminUser }> {
  const res = await fetch(`${API_BASE}/auth/setup-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, setup_code })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Setup admin failed');
  }
  setAdminToken(data.token);
  setStoredAdminUser(data.user);
  return data;
}

export async function requestAdminAccess(data: { name: string; email: string; password: string; department?: string; role?: string }): Promise<{ success: boolean; message: string; pending_approval: boolean }> {
  const res = await fetch(`${API_BASE}/auth/request-access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.error || 'Request failed');
  }
  return resData;
}

export async function fetchAdminUsers(): Promise<{ isSuperAdmin: boolean; pendingCount: number; users: AdminUser[] }> {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch admin users');
  return res.json();
}

export async function approveAdminUser(id: string): Promise<AdminUser> {
  const res = await fetch(`${API_BASE}/admin/users/${id}/approve`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to approve admin');
  return data.user;
}

export async function rejectAdminUser(id: string): Promise<AdminUser> {
  const res = await fetch(`${API_BASE}/admin/users/${id}/reject`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reject admin');
  return data.user;
}

export async function deleteAdminUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete admin');
  }
}

export async function checkAdminSession(): Promise<AdminUser | null> {

  const token = getAdminToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      removeAdminToken();
      return null;
    }
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function fetchAdminDashboard(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to load dashboard data');
  return res.json();
}

export async function fetchAdminRegistrations(filters?: { event_id?: string; status?: string; search?: string; date?: string }): Promise<{ total: number; registrations: Registration[] }> {
  const params = new URLSearchParams();
  if (filters?.event_id) params.set('event_id', filters.event_id);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.date) params.set('date', filters.date);

  const res = await fetch(`${API_BASE}/admin/registrations?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch registrations');
  return res.json();
}

export async function fetchAdminRegistrationDetail(id: string): Promise<Registration> {
  const res = await fetch(`${API_BASE}/admin/registrations/${id}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Registration not found');
  return res.json();
}

export async function verifyPayment(id: string): Promise<Registration> {
  const res = await fetch(`${API_BASE}/admin/registrations/${id}/verify`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to verify payment');
  return data.registration;
}

export async function rejectPayment(id: string, reason: string): Promise<Registration> {
  const res = await fetch(`${API_BASE}/admin/registrations/${id}/reject`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reject payment');
  return data.registration;
}

export async function deleteAdminRegistration(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/registrations/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete registration record');
}


export async function updateAdminEvent(id: string, eventData: Partial<EventItem>): Promise<EventItem> {
  const res = await fetch(`${API_BASE}/admin/events/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(eventData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update event');
  return data.event;
}

export async function createAdminEvent(eventData: Partial<EventItem>): Promise<EventItem> {
  const res = await fetch(`${API_BASE}/admin/events`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(eventData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create event');
  return data.event;
}

export async function updateAdminSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update settings');
  return data.settings;
}

export async function updatePaymentSettings(formData: FormData): Promise<SiteSettings> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/settings/payment`, {
    method: 'PUT',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update payment settings');
  return data.settings;
}

export function getPaymentProofUrl(filename: string): string {
  return `${API_BASE}/admin/payment-proof/${encodeURIComponent(filename)}`;
}

export async function fetchAdminAuditLogs(): Promise<{ total: number; logs: import('../types').AuditLogItem[] }> {
  const res = await fetch(`${API_BASE}/admin/logs`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function fetchSystemStatus() {
  const res = await fetch(`${API_BASE}/system/status`);
  return res.json();
}
