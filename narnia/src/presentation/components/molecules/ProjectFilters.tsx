import Image from "next/image";

export function ProjectFilters() {
  return (
    <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
      <label className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <Image alt="" aria-hidden height={16} src="/file.svg" width={16} />
        </span>
        <input
          aria-label="Buscar proyectos"
          className="ui-control w-full py-3 pl-10 pr-4 text-body"
          placeholder="Buscar por nombre, ID o responsable de proyecto..."
          type="text"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button className="ui-control inline-flex items-center gap-2 px-4 py-3 text-button text-brand-800" type="button">
          <Image alt="" aria-hidden height={16} src="/window.svg" width={16} />
          Estado
        </button>
        <button className="ui-control px-4 py-3 text-button text-brand-800" type="button">Unidad de negocio</button>
        <button className="ui-button-primary gap-2 px-4 py-3" type="button">
          Filtros
        </button>
      </div>
    </section>
  );
}
