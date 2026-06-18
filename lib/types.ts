export interface Project {
  id: string;
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  description: string;
  type?: 'identite' | 'site' | 'partenaire' | 'support' | 'custom' | 'maintenance';
  status: 'discovery' | 'in_progress' | 'waiting_client' | 'review' | 'delivered' | 'archived';
  startDate: string;
  deadline?: string;
  deadlineExtended?: boolean;
  steps: Step[];
  tasks?: Task[];
  tickets?: MaintenanceTicket[];
  monthlyHours?: number;
  forfaitOverrides?: Record<string, number>;
  notes?: string;
  resources?: { title?: string; url: string }[];
  practicalInfo: PracticalInfo;
  meetingLink?: string;
  bannerUrl?: string;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  author: 'cindy' | 'client';
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  content?: string;
  urgency: 'basse' | 'moyenne' | 'haute' | 'tranquille' | 'normal' | 'urgent' | 'critique';
  dueDate?: string;
  startDate?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  pole?: string;
  properties?: Record<string, any>;
  livrableUrl?: string;
  deliverableFileKey?: string;
  comments: TaskComment[];
  pinned?: boolean;
  archived?: boolean;
  timeSpentMinutes?: number;
  completedAt?: string | null;
  createdAt: string;
}

export interface TicketAttachment {
  key: string;
  name: string;
  type?: string;
}

export interface MaintenanceTicket {
  id: string;
  title: string;
  description?: string;
  priority?: 'basse' | 'moyenne' | 'haute';
  category?: string;
  status: 'open' | 'in_progress' | 'done' | 'closed';
  attachments?: TicketAttachment[];
  timeSpentMinutes?: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'upcoming' | 'in_progress' | 'waiting_client' | 'done';
  dueDate?: string;
  clientAction?: string;
  completedAt?: string;
  order: number;
}

export interface PracticalInfo {
  sections: {
    id: string;
    title: string;
    content: string;
  }[];
}

export interface Message {
  id: string;
  projectId: string;
  author: 'cindy' | 'client';
  content: string;
  attachments?: FileAttachment[];
  createdAt: string;
  readByClient: boolean;
  readByAdmin: boolean;
}

export interface FileAttachment {
  key: string;
  name: string;
  size: number;
  type: string;
}

export interface ProjectFile {
  key: string;
  name: string;
  size: number;
  type: string;
  category: 'document' | 'deliverable' | 'reference';
  uploadedAt: string;
  uploadedBy: 'cindy' | 'client';
}

export interface ClientToken {
  token: string;
  projectId?: string;
  clientEmail?: string;
  label?: string;
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
  revoked: boolean;
}

export interface EmailLog {
  id: string;
  projectId: string;
  to: string;
  subject: string;
  template: string;
  sentAt: string;
  status: 'sent' | 'failed';
}

export interface Env {
  BLOOM_KV: KVNamespace;
  BLOOM_R2: R2Bucket;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  ADMIN_EMAIL?: string;
  PORTAL_BASE_URL: string;
  ENVIRONMENT: string;
  INTERNAL_SECRET?: string;
}
