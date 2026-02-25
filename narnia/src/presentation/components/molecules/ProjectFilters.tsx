export function ProjectFilters() {
  return (
    <section className="mb-8 flex flex-col gap-4 md:flex-row">
      <label className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-brand-muted">S</span>
        <input
          aria-label="Buscar proyectos"
          className="ui-control w-full py-3 pl-10 pr-4 text-body"
          placeholder="Buscar por nombre, ID o responsable..."
          type="text"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button className="ui-control px-4 py-3 text-button text-brand-800" type="button">Departamento v</button>
        <button className="ui-control px-4 py-3 text-button text-brand-800" type="button">Tecnologia v</button>
        <button className="ui-button-primary gap-2 px-4 py-3" type="button">
          Filtros
        </button>
      </div>
    </section>
  );
}
