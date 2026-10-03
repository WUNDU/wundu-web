import { TriangleAlert } from "lucide-react";

type DangerZoneProps = {
  onDelete?: () => void;
};

function DangerZone({ onDelete }: DangerZoneProps) {
  return (
    <section
      aria-labelledby="danger-zone-title"
      className="flex flex-col items-start justify-start gap-4 self-stretch rounded-2xl border border-danger-300 bg-(--background) p-6"
    >
      <div className="flex items-center justify-start gap-3">
        <TriangleAlert
          width={16}
          height={16}
          aria-hidden="true"
          className="text-danger-300"
        />
        <h2
          id="danger-zone-title"
          className="font-manrope text-lg font-bold leading-7 text-(--text)"
        >
          Zona de Perigo
        </h2>
      </div>
      <div className="flex flex-col items-start justify-between gap-4 self-stretch md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-1">
          <p className="font-manrope text-base font-semibold text-(--text)">
            Excluir conta
          </p>
          <p className="font-manrope text-sm font-normal leading-5 text-(--text-description)">
            Exclua permanentemente sua conta e todos os dados
          </p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="flex w-56 shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-danger-300 p-3.5 text-base-white shadow-[0px_4px_12px_0px_rgba(5,61,196,0.15)] transition-all hover:opacity-90 active:scale-[0.98] active:opacity-80"
        >
          <span className="text-center font-manrope text-base font-bold leading-normal">
            Eliminar
          </span>
        </button>
      </div>
    </section>
  );
}

export default DangerZone;
