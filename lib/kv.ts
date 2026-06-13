import type { Env, Project, Message, ClientToken, EmailLog, ProjectFile } from './types';

// --- Projects ---

export async function getProject(env: Env, id: string): Promise<Project | null> {
  const data = await env.BLOOM_KV.get(`project:${id}`);
  return data ? JSON.parse(data) : null;
}

export async function saveProject(env: Env, project: Project): Promise<void> {
  project.updatedAt = new Date().toISOString();
  await env.BLOOM_KV.put(`project:${project.id}`, JSON.stringify(project));
}

export async function getProjectIds(env: Env): Promise<string[]> {
  const data = await env.BLOOM_KV.get('projects:index');
  return data ? JSON.parse(data) : [];
}

export async function addProjectToIndex(env: Env, id: string): Promise<void> {
  const ids = await getProjectIds(env);
  if (!ids.includes(id)) {
    ids.push(id);
    await env.BLOOM_KV.put('projects:index', JSON.stringify(ids));
  }
}

export async function removeProjectFromIndex(env: Env, id: string): Promise<void> {
  const ids = await getProjectIds(env);
  const filtered = ids.filter((i) => i !== id);
  await env.BLOOM_KV.put('projects:index', JSON.stringify(filtered));
}

export async function getAllProjects(env: Env): Promise<Project[]> {
  const ids = await getProjectIds(env);
  const projects = await Promise.all(ids.map((id) => getProject(env, id)));
  return projects.filter((p): p is Project => p !== null);
}

// --- Messages ---

export async function getMessages(env: Env, projectId: string): Promise<Message[]> {
  const data = await env.BLOOM_KV.get(`messages:${projectId}`);
  return data ? JSON.parse(data) : [];
}

export async function saveMessages(env: Env, projectId: string, messages: Message[]): Promise<void> {
  await env.BLOOM_KV.put(`messages:${projectId}`, JSON.stringify(messages));
}

export async function addMessage(env: Env, message: Message): Promise<void> {
  const messages = await getMessages(env, message.projectId);
  messages.push(message);
  await saveMessages(env, message.projectId, messages);
}

export async function getUnreadAdminCount(env: Env, projectId: string): Promise<number> {
  const messages = await getMessages(env, projectId);
  return messages.filter((m) => m.author === 'client' && !m.readByAdmin).length;
}

// --- Conversation au niveau de l'espace client (clé messages:client:{email}) ---

export interface ClientMessage {
  id: string;
  clientEmail: string;
  author: 'cindy' | 'client';
  content: string;
  createdAt: string;
  readByClient: boolean;
  readByAdmin: boolean;
}

export async function getClientMessages(env: Env, email: string): Promise<ClientMessage[]> {
  const data = await env.BLOOM_KV.get(`messages:client:${email.toLowerCase()}`);
  return data ? JSON.parse(data) : [];
}

export async function saveClientMessages(env: Env, email: string, messages: ClientMessage[]): Promise<void> {
  await env.BLOOM_KV.put(`messages:client:${email.toLowerCase()}`, JSON.stringify(messages));
}

export async function addClientMessage(env: Env, message: ClientMessage): Promise<void> {
  const messages = await getClientMessages(env, message.clientEmail);
  messages.push(message);
  await saveClientMessages(env, message.clientEmail, messages);
}

// --- Tokens ---

export async function getToken(env: Env, token: string): Promise<ClientToken | null> {
  const data = await env.BLOOM_KV.get(`token:${token}`);
  return data ? JSON.parse(data) : null;
}

export async function saveToken(env: Env, clientToken: ClientToken): Promise<void> {
  await env.BLOOM_KV.put(`token:${clientToken.token}`, JSON.stringify(clientToken));
}

export async function getProjectTokens(env: Env, projectId: string): Promise<ClientToken[]> {
  const data = await env.BLOOM_KV.get(`tokens:project:${projectId}`);
  const tokenStrings: string[] = data ? JSON.parse(data) : [];
  const tokens = await Promise.all(tokenStrings.map((t) => getToken(env, t)));
  return tokens.filter((t): t is ClientToken => t !== null);
}

export async function addTokenToProject(env: Env, projectId: string, token: string): Promise<void> {
  const data = await env.BLOOM_KV.get(`tokens:project:${projectId}`);
  const tokens: string[] = data ? JSON.parse(data) : [];
  tokens.push(token);
  await env.BLOOM_KV.put(`tokens:project:${projectId}`, JSON.stringify(tokens));
}

// --- Files ---

export async function getProjectFiles(env: Env, projectId: string): Promise<ProjectFile[]> {
  const data = await env.BLOOM_KV.get(`files:${projectId}`);
  return data ? JSON.parse(data) : [];
}

export async function saveProjectFiles(env: Env, projectId: string, files: ProjectFile[]): Promise<void> {
  await env.BLOOM_KV.put(`files:${projectId}`, JSON.stringify(files));
}

export async function addProjectFile(env: Env, projectId: string, file: ProjectFile): Promise<void> {
  const files = await getProjectFiles(env, projectId);
  files.push(file);
  await saveProjectFiles(env, projectId, files);
}

// --- Email logs ---

export async function getEmailLogs(env: Env, projectId: string): Promise<EmailLog[]> {
  const data = await env.BLOOM_KV.get(`emaillogs:${projectId}`);
  return data ? JSON.parse(data) : [];
}

export async function getProjectsByEmail(env: Env, email: string): Promise<Project[]> {
  const all = await getAllProjects(env);
  return all.filter((p) => p.clientEmail.toLowerCase() === email.toLowerCase());
}

export async function addClientEmailToken(env: Env, email: string, token: string): Promise<void> {
  const key = `tokens:client:${email.toLowerCase()}`;
  const data = await env.BLOOM_KV.get(key);
  const tokens: string[] = data ? JSON.parse(data) : [];
  if (!tokens.includes(token)) {
    tokens.push(token);
    await env.BLOOM_KV.put(key, JSON.stringify(tokens));
  }
}

export async function getClientEmailTokens(env: Env, email: string): Promise<ClientToken[]> {
  const key = `tokens:client:${email.toLowerCase()}`;
  const data = await env.BLOOM_KV.get(key);
  const tokenStrings: string[] = data ? JSON.parse(data) : [];
  const tokens = await Promise.all(tokenStrings.map((t) => getToken(env, t)));
  return tokens.filter((t): t is ClientToken => t !== null);
}

export async function addEmailLog(env: Env, log: EmailLog): Promise<void> {
  const logs = await getEmailLogs(env, log.projectId);
  logs.push(log);
  // Keep only last 50 logs per project
  const trimmed = logs.slice(-50);
  await env.BLOOM_KV.put(`emaillogs:${log.projectId}`, JSON.stringify(trimmed));
}
