'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    try {
      const result = await login(
        String(formData.get('email')),
        String(formData.get('password')),
        String(formData.get('tenantId'))
      );
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      localStorage.setItem('tenantId', String(formData.get('tenantId')));
      router.push('/dashboard');
    } catch {
      setError('Invalid credentials or tenant context.');
    }
  }

  return (
    <main className="mx-auto mt-24 max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
      <h1 className="mb-6 text-2xl font-semibold">ProcureAI Access</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="tenantId" className="w-full rounded bg-slate-800 px-3 py-2" placeholder="Tenant ID" required />
        <input name="email" type="email" className="w-full rounded bg-slate-800 px-3 py-2" placeholder="Work email" required />
        <input name="password" type="password" className="w-full rounded bg-slate-800 px-3 py-2" placeholder="Password" required />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button className="w-full rounded bg-indigo-600 py-2 font-medium hover:bg-indigo-500" type="submit">Sign in securely</button>
      </form>
    </main>
  );
}
