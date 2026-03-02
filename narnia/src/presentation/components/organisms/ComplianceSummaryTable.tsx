export function ComplianceSummaryTable() {
  return (
    <section aria-label="Resumen de cumplimiento" className="space-y-4">
      <h3 className="text-h3 text-slate-100">Resumen de cumplimiento</h3>
      <div className="overflow-hidden rounded-card border border-slate-800 bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-800">
            <tr className="border-b border-slate-700">
              <th className="px-5 py-3 text-caption uppercase text-slate-400">Métrica</th>
              <th className="px-5 py-3 text-caption uppercase text-slate-400">Estado</th>
              <th className="px-5 py-3 text-caption uppercase text-slate-400">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-5 py-6 text-body text-slate-400" colSpan={3}>
                Tabla vacía para integrar métricas de cumplimiento durante el taller.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
