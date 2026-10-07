export interface EventItem {
  id: string;
  slug: string;
  name: string;
  category: 'Engineering' | 'Sports' | 'Creativity' | 'Gaming' | 'Creativity / Innovation' | string;
  description: string;
  rules: string;
  fee: number;
  registration_type: 'individual' | 'team';
  min_team_size: number;
  max_team_size: number;
  coordinator_name: string;
  coordinator_phone: string;
  registration_open: boolean;
  event_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  email?: string;
  mobile?: string;
  college?: string;
  department?: string;
  year?: string;
}

export type PaymentStatus = 'Pending Verification' | 'Verified' | 'Rejected';

export interface Registration {
  id: string;
  registration_id: string; // e.g., MVX-2026-000001
  event_id: string;
  event_name: string;
  registration_type: 'individual' | 'team';
  team_name?: string;
  leader_name: string;
  leader_email: string;
  leader_mobile: string;
  college: string;
  department: string;
  year: string;
  division?: string;
  amount: number;
  utr: string;
  payment_screenshot_path: string;
  payment_status: PaymentStatus;
  rejection_reason?: string;
  submitted_at: string;
  verified_at?: string;
  verified_by?: string;
  team_members?: TeamMember[];
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  id?: string;
  event_name: string;
  event_tagline: string;
  event_description: string;
  start_date: string;
  end_date: string;
  venue: string;
  upi_id: string;
  qr_code_path: string;
  payment_instructions: string;
  contact_email: string;
  contact_phone: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'coordinator';
  approval_status?: 'approved' | 'pending' | 'rejected';
  department?: string;
  approved_by?: string;
  approved_at?: string;
  created_at?: string;
}


export interface AuditLogItem {
  id: string;
  action: string;
  category: 'auth' | 'verification' | 'events' | 'settings';
  details: string;
  admin_name: string;
  admin_email: string;
  ip?: string;
  timestamp: string;
}

export interface DashboardStats {

  totalRegistrations: number;
  verifiedRegistrations: number;
  pendingRegistrations: number;
  rejectedRegistrations: number;
  totalCollection: number;
  todayRegistrations: number;
  recentRegistrations: Registration[];
  eventBreakdown: {
    eventName: string;
    count: number;
    amount: number;
  }[];
  statusDistribution: {
    status: PaymentStatus;
    count: number;
  }[];
}
