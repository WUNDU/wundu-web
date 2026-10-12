import { TriangleAlert } from "lucide-react";

type DangerZoneProps = {
  onDelete?: () => void;
};

function DangerZone({ onDelete }: DangerZoneProps) {
  return (
    <section
      aria-labelledby="danger-zone-title"
      className="flex flex-col items-start justify-start gap-4 self-stretch rounded-xl border border-transparent bg-danger-300/10 p-4 lg:border-danger-300 lg:bg-(--bg-card) lg:p-6"
    >
      <div className="hidden items-center justify-start gap-3 lg:flex">
        <TriangleAlert
          width={16}
          height={16}
          aria-hidden="true"
          className="text-danger-300"
        />
        <h2
          id="danger-zone-title"
          className="font-manrope text-base font-bold leading-7 text-danger-text lg:text-lg lg:text-(--text)"
        >
          Zona de Perigo
        </h2>
      </div>
      <div className="flex flex-col items-start justify-between gap-4 self-stretch md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-1">
          <p className="font-manrope text-sm font-bold text-(--text) lg:text-base lg:font-semibold">
            Excluir conta
          </p>
          <p className="font-manrope text-xs font-normal leading-5 text-(--text-title) lg:text-sm lg:text-(--text-description)">
            Exclua permanentemente sua conta e todos os dados
          </p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-10 w-full shrink-0 items-center justify-center gap-2.5 rounded-xl bg-danger-300 px-4 text-base-white transition-opacity hover:opacity-90 active:opacity-80 active:scale-95 lg:h-12 lg:w-56"
        >
          <span className="text-center font-manrope text-sm font-bold leading-5 lg:text-base lg:leading-normal">
            Eliminar
          </span>
        </button>
      </div>
    </section>
  );
}

export default DangerZone;
