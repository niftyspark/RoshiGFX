export default function DashboardPage() {
  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">ProcureAI Dashboard</h1>
        <span className="rounded bg-slate-800 px-3 py-1 text-sm">Phase 1 Foundation</span>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-sm text-slate-400">Tenant Posture</h2>
          <p className="mt-2 text-xl font-semibold">RLS Enforced</p>
        </article>
        <article className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-sm text-slate-400">Auth Layer</h2>
          <p className="mt-2 text-xl font-semibold">JWT + Rotation</p>
        </article>
        <article className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-sm text-slate-400">Audit Trail</h2>
          <p className="mt-2 text-xl font-semibold">Real-time capture</p>
        </article>
      </section>
    </main>
  );
}
