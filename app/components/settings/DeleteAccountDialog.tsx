import { UserRound } from "lucide-react";
import { Trash2 } from "lucide-react";
import { CloseIcon } from "@/constants/icons";

type DeleteAccountDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  onConfirm?: () => void;
};

function DeleteAccountDialog({
  isOpen,
  onClose,
  accountName,
  onConfirm,
}: DeleteAccountDialogProps) {
  return (
    <div
      className={`fixed inset-0 z-40 backdrop-blur transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <aside
        className={`fixed top-0 right-0 z-50 flex h-screen w-125 flex-col items-start justify-between border-l border-(--card-barras) bg-(--background) transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col items-start justify-start self-stretch">
          <header className="flex h-24 items-center justify-between self-stretch border-b border-(--card-barras) p-6">
            <div className="flex items-center justify-start gap-2">
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-xl bg-primary-300/10"
              >
                <UserRound width={16} height={16} className="text-primary-300" />
              </span>
              <h2 className="font-manrope text-lg font-bold leading-7 text-(--text)">
                Eliminar conta
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="rounded-lg p-1 transition-all hover:bg-neutrals-300/10 active:scale-90"
            >
              <CloseIcon width={24} className="text-primary-900/50" />
            </button>
          </header>

          <div className="flex flex-col items-start justify-start self-stretch py-6">
            <div className="flex flex-col items-start justify-start gap-6 self-stretch px-6 pt-6 pb-3">
              <div className="flex flex-col items-center justify-center gap-5 self-stretch rounded-2xl border border-(--card-barras) bg-(--background) p-6">
                <div className="flex flex-col items-center justify-center gap-5 px-6 py-10 self-stretch">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-danger-300/10">
                    <Trash2 width={24} height={24} className="text-danger-300" />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1.5 self-stretch">
                    <p className="text-center font-manrope text-base font-bold leading-6 text-(--text)">
                      Tem certeza que deseja eliminar esta Conta?
                    </p>
                    <p className="w-96 text-center font-manrope text-sm font-medium leading-5 text-(--text-description)">
                      Esta acção irá remover permanentemente a sua conta &quot;
                      <span className="font-bold">{accountName}</span>&quot; e
                      todo o progresso associado. Esta operação não pode ser
                      desfeita.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-6 self-stretch border-t border-(--card-barras) p-6">
          <button
            type="button"
            onClick={onClose}
            className="flex w-56 items-center justify-center gap-2.5 rounded-2xl border border-(--border-button) p-3.5 text-(--text-title) transition-all hover:bg-neutrals-300/10 active:scale-[0.98] active:bg-neutrals-300/20"
          >
            <span className="font-manrope text-base font-bold leading-normal">
              Não
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className="flex w-56 items-center justify-center gap-2.5 rounded-2xl bg-danger-300 p-3.5 text-base-white shadow-[0px_4px_12px_0px_rgba(5,61,196,0.15)] transition-all hover:opacity-90 active:scale-[0.98] active:opacity-80"
          >
            <span className="text-center font-manrope text-base font-bold leading-normal">
              Sim, Eliminar
            </span>
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default DeleteAccountDialog;
