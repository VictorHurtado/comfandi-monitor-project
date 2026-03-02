import { Building2, Search, SlidersHorizontal } from "lucide-react";

export function ProjectFilters() {
  return (
    <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
      <label className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <Search aria-hidden className="text-slate-400" size={16} strokeWidth={2.25} />
        </span>
        <input
          aria-label="Buscar proyectos"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-body text-white placeholder:text-slate-500 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#137fec]"
          placeholder="Buscar por nombre, ID o responsable de proyecto..."
          type="text"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-button text-slate-200 transition-colors hover:bg-slate-700"
          type="button"
        >
          <SlidersHorizontal aria-hidden size={16} strokeWidth={2.25} />
          Estado
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-button text-slate-200 transition-colors hover:bg-slate-700"
          type="button"
        >
          <Building2 aria-hidden size={16} strokeWidth={2.25} />
          Unidad de negocio
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-[#137fec] px-4 py-3 text-button text-white shadow-lg shadow-[#137fec]/30 transition-colors hover:bg-[#106fce]"
          type="button"
        >
          <SlidersHorizontal aria-hidden size={16} strokeWidth={2.25} />
          Filtros
        </button>
      </div>
    </section>
  );
}
