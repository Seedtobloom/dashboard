export interface Project {
  id: string;
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  description: string;
  status: 'discovery' | 'in_progress' | 'waiting_client' | 'review' | 'delivered' | 'archived';
  startDate: string;
  deadline?: string;
  steps: Step[];
  practicalInfo: PracticalInfo;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
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
  projectId: string;
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
  PORTAL_BASE_URL: string;
  ENVIRONMENT: string;
}
