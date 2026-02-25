const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export async function login(email: string, password: string, tenantId: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, tenantId })
  });

  if (!res.ok) {
    throw new Error('Authentication failed');
  }

  return res.json();
}
