export function generateId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, status);
}

export function htmlResponse(html: string, status = 200, extraHeaders?: Record<string, string>): Response {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...extraHeaders,
    },
  });
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    discovery: 'Découverte',
    in_progress: 'En cours',
    waiting_client: 'En attente de vous',
    review: 'En révision',
    delivered: 'Livré',
    archived: 'Archivé',
  };
  return labels[status] ?? status;
}

export function stepStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    upcoming: 'À venir',
    in_progress: 'En cours',
    waiting_client: 'Votre action requise',
    done: 'Terminé',
  };
  return labels[status] ?? status;
}

export function parseBody(request: Request): Promise<Record<string, unknown>> {
  return request.json();
}

export function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}
