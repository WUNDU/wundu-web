import { CloseIcon } from "@/constants/icons";
import { ArrowLeft, ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AccountCardMark from "./AccountCardMark";
import { ACCOUNT_COLORS, type AccountColor } from "./account-colors";
import type { AccountDTO } from "../mock/account";

export type AccountFormMode = "create" | "edit";

type AccountFormProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Conta a editar (também ativa o modo "edit" por omissão). */
  account?: AccountDTO | null;
  /** Por omissão: "edit" se existir conta, senão "create". */
  mode?: AccountFormMode;
  onSave?: (account: AccountDTO) => void;
  onDelete?: (account: AccountDTO) => void;
  /** Abre directamente no ecrã de confirmação de eliminação. */
  startInDelete?: boolean;
  /** Chamado pelo botão "Voltar". Por omissão usa onClose. */
  onBack?: () => void;
};

const ACCOUNT_TYPES = ["Banco", "Carteira", "Dinheiro"];

const CURRENCIES = ["Kwanza (Kz)", "Dólar (USD)", "Euro (EUR)"];

const parseBalance = (raw: string): number => {
  const normalized = raw.trim().replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
};

const colorForAccount = (account: AccountDTO | null | undefined): AccountColor =>
  ACCOUNT_COLORS.find((color) => color.dot === account?.dotClassName) ?? ACCOUNT_COLORS[0];

function AccountForm({
  isOpen,
  onClose,
  account,
  mode,
  onSave,
  onDelete,
  startInDelete = false,
  onBack,
}: AccountFormProps) {
  const resolvedMode: AccountFormMode = mode ?? (account ? "edit" : "create");
  const isEdit = resolvedMode === "edit";

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [kind, setKind] = useState(ACCOUNT_TYPES[0]);
  const [typeOpen, setTypeOpen] = useState(false);
  const [colorId, setColorId] = useState(ACCOUNT_COLORS[0].id);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [initialBalance, setInitialBalance] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setConfirmDelete(startInDelete && Boolean(account) && isEdit);
    setTypeOpen(false);
    setCurrencyOpen(false);
    if (account) {
      setName(account.name);
      setShortName(account.shortName ?? "");
      setKind(account.kind ?? ACCOUNT_TYPES[0]);
      setColorId(colorForAccount(account).id);
      setCurrency(account.currency ?? CURRENCIES[0]);
    } else {
      setName("");
      setShortName("");
      setKind(ACCOUNT_TYPES[0]);
      setColorId(ACCOUNT_COLORS[0].id);
      setCurrency(CURRENCIES[0]);
    }
    setInitialBalance("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, account, mode, startInDelete]);

  const color = ACCOUNT_COLORS.find((item) => item.id === colorId) ?? ACCOUNT_COLORS[0];
  const previewSigla = shortName.trim() ? shortName.trim().toUpperCase() : "SIGLA";

  const headerTitle = isEdit ? "Editar conta" : "Adicionar conta";
  const primaryLabel = isEdit ? "Actualizar" : "Salvar";

  const fieldLabel =
    "font-manrope text-sm font-bold leading-5 text-(--text-description)";
  const fieldBox =
    "rounded-xl border border-(--border-button) focus:border-(--border) focus:outline-none";

  const handleSave = () => {
    const trimmedName = name.trim() || "Nova conta";
    onSave?.({
      id: account?.id ?? `acc-${Date.now()}`,
      name: trimmedName,
      shortName: shortName.trim() ? shortName.trim().toUpperCase() : trimmedName,
      kind,
      currency,
      balance: account?.balance ?? parseBalance(initialBalance),
      color: color.text,
      background: color.soft,
      colorVar: color.cssVar,
      dotClassName: color.dot,
    });
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-base-black/40 backdrop-blur transition-opacity duration-300 lg:bg-transparent ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <aside
        className={`fixed inset-x-0 bottom-0 top-auto z-50 max-h-dvh flex w-full max-w-full flex-col items-start justify-between rounded-t-3xl border-t border-(--card-barras) bg-(--background) transition-transform duration-300 ease-out lg:inset-x-auto lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 lg:h-screen lg:max-h-dvh lg:w-128 lg:rounded-none lg:border-l lg:border-t-0 ${isOpen ? "translate-x-0 translate-y-0 lg:translate-x-0" : "translate-x-0 translate-y-full lg:translate-x-full lg:translate-y-0"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-xs bg-(--card-barras) lg:hidden"
        />
        {confirmDelete && account ? (
          <>
            <div className="flex flex-col items-start self-stretch">
              <header className="flex items-center justify-between self-stretch border-b border-(--card-barras) p-6">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    aria-label="Voltar"
                    className="rounded-lg p-1 transition-all hover:bg-neutrals-300/10 active:scale-90"
                  >
                    <ArrowLeft width={16} height={16} className="text-(--icon)" />
                  </button>
                  <h2 className="font-manrope text-lg font-bold leading-7 text-(--text-title)">
                    Eliminar conta
                  </h2>
                </div>
              </header>
              <section className="flex flex-col items-center justify-center gap-5 self-stretch px-6 py-10">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-danger-300/10">
                  <Trash2 width={24} height={24} className="text-danger-300" />
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 self-stretch">
                  <p className="text-center font-manrope text-base font-bold leading-6 text-(--text)">
                    Tem certeza que deseja eliminar esta conta?
                  </p>
                  <p className="w-96 text-center font-manrope text-sm font-medium leading-5 text-(--text-description)">
                    Esta acção irá remover permanentemente a conta &quot;
                    <span className="font-bold">{account.name}</span>&quot; e
                    todo o progresso associado. Esta operação não pode ser
                    desfeita.
                  </p>
                </div>
              </section>
            </div>
            <footer className="flex shrink-0 flex-col items-start justify-end gap-2.5 self-stretch border-t border-(--card-barras) p-6">
              <div className="flex items-start gap-4 self-stretch">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex w-56 items-center justify-center gap-2.5 rounded-xl border border-(--border-button) px-4 py-3 text-(--text-title) transition-colors hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-95"
                >
                  <span className="font-manrope text-base font-bold leading-6">
                    Não
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete?.(account);
                    onClose();
                  }}
                  className="flex w-56 items-center justify-center gap-2.5 rounded-xl bg-danger-300 px-4 py-3 text-base-white transition-opacity hover:opacity-90 active:opacity-80 active:scale-95"
                >
                  <span className="text-center font-manrope text-base font-bold leading-6">
                    Sim, Eliminar
                  </span>
                </button>
              </div>
            </footer>
          </>
        ) : (
          <>
            <div className="flex min-h-0 flex-1 flex-col items-start self-stretch">
              <header className="flex h-24 shrink-0 items-center justify-between self-stretch border-b border-(--card-barras) p-6">
                <h2 className="font-manrope text-lg font-bold leading-7 text-(--text-title)">
                  {headerTitle}
                </h2>
                <div className="flex items-center justify-start gap-2.5">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setTypeOpen((value) => !value)}
                      aria-expanded={typeOpen}
                      aria-label="Tipo de conta"
                      className={`flex w-32 items-center justify-center gap-2 rounded-xl border border-(--border-button) bg-(--background) px-3 py-2 transition-colors hover:bg-neutrals-300/10 active:scale-95`}
                    >
                      <span className="flex-1 text-left font-manrope text-sm font-semibold leading-5 text-(--text-title)">
                        {kind}
                      </span>
                      <ChevronDown
                        width={14}
                        height={14}
                        className={`shrink-0 transition-transform duration-200 ${typeOpen ? "rotate-180 text-(--icon-hover)" : "text-(--icon)"}`}
                      />
                    </button>
                    {typeOpen ? (
                      <ul className="absolute top-full right-0 z-30 mt-2 w-32 rounded-xl border border-(--card-barras) bg-(--background) p-1.5">
                        {ACCOUNT_TYPES.map((option) => (
                          <li key={option}>
                            <button
                              type="button"
                              onClick={() => {
                                setKind(option);
                                setTypeOpen(false);
                              }}
                              aria-pressed={option === kind}
                              className={`w-full rounded-lg px-3 py-2 text-left font-manrope text-sm transition-colors hover:bg-neutrals-300/10 ${
                                option === kind
                                  ? "font-semibold text-(--text-title)"
                                  : "font-medium text-(--text-description)"
                              }`}
                            >
                              {option}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  {isEdit ? (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      aria-label="Eliminar conta"
                      title="Eliminar conta"
                      className="rounded-lg p-1 text-danger-300 transition-all hover:bg-danger-300/10 active:scale-90"
                    >
                      <Trash2 width={20} height={20} />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={onBack ?? onClose}
                    aria-label="Fechar"
                    className="rounded-lg p-1 transition-all hover:bg-neutrals-300/10 active:scale-90"
                  >
                    <CloseIcon width={24} className="text-primary-900/50" />
                  </button>
                </div>
              </header>

              <div
                onScroll={() => setCurrencyOpen(false)}
                className="flex min-h-0 flex-1 flex-col items-center justify-start gap-6 self-stretch overflow-y-auto p-6"
              >
                <div
                  role="img"
                  aria-label={`Pré-visualização da conta ${name || "nova conta"}`}
                  className={`relative flex h-52 w-80 flex-col items-start justify-start gap-2 overflow-hidden rounded-xl p-6 ${color.dot}`}
                >
                  <AccountCardMark className="pointer-events-none absolute -right-2 -bottom-2 w-37 text-base-white/50" />
                  <div className="relative flex flex-1 flex-col items-start justify-between self-stretch">
                    <span className="flex h-6 items-center justify-center gap-2.5 rounded-md bg-base-white/10 px-2 py-0.5">
                      <span className="font-manrope text-sm font-bold leading-5 text-base-white">
                        {previewSigla}
                      </span>
                    </span>
                    <span className="flex items-center justify-center gap-2.5 rounded-md bg-base-white/10 px-2 py-0.5">
                      <span className="font-manrope text-sm font-bold leading-5 text-base-white">
                        {kind.toUpperCase()}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <label htmlFor="account-name" className={fieldLabel}>
                    NOME
                  </label>
                  <input
                    id="account-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ex: Banco Angolano de Investimentos, Unitel Money"
                    className={`w-full px-4 py-3 font-manrope text-base leading-normal ${fieldBox} ${
                      name
                        ? "bg-(--bg-filter) font-medium text-(--text)"
                        : "bg-(--background) font-medium text-(--text-description-60) placeholder:text-(--text-description-60)"
                    }`}
                  />
                </div>

                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <label htmlFor="account-short-name" className={fieldLabel}>
                    SIGLA
                  </label>
                  <input
                    id="account-short-name"
                    type="text"
                    value={shortName}
                    onChange={(event) => setShortName(event.target.value)}
                    placeholder="Ex: BAI, BFA, BIC"
                    className={`w-full px-4 py-3 font-manrope text-base leading-normal ${fieldBox} ${
                      shortName
                        ? "bg-(--bg-filter) font-medium text-(--text)"
                        : "bg-(--background) font-medium text-(--text-description-60) placeholder:text-(--text-description-60)"
                    }`}
                  />
                </div>

                <fieldset className="flex flex-col items-start justify-start gap-3 self-stretch">
                  <legend className={fieldLabel}>COR</legend>
                  <div className="flex h-11 items-center justify-start gap-2 self-stretch">
                    {ACCOUNT_COLORS.map((option) => {
                      const isActive = option.id === colorId;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setColorId(option.id)}
                          aria-pressed={isActive}
                          aria-label={`Cor ${option.id}`}
                          title={option.id}
                          className={`flex size-10 items-center justify-center rounded-full border bg-(--background) transition-all hover:scale-105 active:scale-95 ${
                            isActive
                              ? "border-(--border-hover)"
                              : "border-(--border-button)"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`size-7 rounded-full ${option.dot}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <hr className="w-full border-0 border-t border-(--card-barras)" />

                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <span id="account-currency-label" className={fieldLabel}>
                    MOEDA
                  </span>
                  <div className="relative self-stretch">
                    <button
                      type="button"
                      onClick={() => setCurrencyOpen((value) => !value)}
                      aria-expanded={currencyOpen}
                      aria-labelledby="account-currency-label"
                      className={`flex w-full items-center justify-between bg-(--background) px-4 py-3 transition-colors hover:bg-neutrals-300/10 active:scale-95 ${fieldBox}`}
                    >
                      <span
                        className={`font-manrope text-base font-medium ${
                          isEdit ? "text-(--text)" : "text-(--text-description-60)"
                        }`}
                      >
                        {isEdit ? currency : "Seleccione a moeda"}
                      </span>
                      <ChevronDown
                        width={16}
                        height={16}
                        className={`shrink-0 text-(--icon) transition-transform duration-200 ${currencyOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {currencyOpen ? (
                      <ul className="absolute right-0 bottom-full left-0 z-30 mb-2 rounded-xl border border-(--card-barras) bg-(--background) p-1.5">
                        {CURRENCIES.map((option) => (
                          <li key={option}>
                            <button
                              type="button"
                              onClick={() => {
                                setCurrency(option);
                                setCurrencyOpen(false);
                              }}
                              aria-pressed={option === currency}
                              className={`w-full rounded-lg px-3 py-2 text-left font-manrope text-sm transition-colors hover:bg-neutrals-300/10 ${
                                option === currency
                                  ? "font-semibold text-(--text-title)"
                                  : "font-medium text-(--text-description)"
                              }`}
                            >
                              {option}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>

                {isEdit ? (
                  <aside className="flex items-center justify-start gap-3 self-stretch rounded-xl border border-(--border-button) bg-(--bg-body) px-4 py-3">
                    <p className="text-justify font-manrope text-sm font-medium leading-5 text-(--text-description-60)">
                      O saldo inicial já foi definido. A partir daqui, o saldo
                      desta conta só muda através das movimentações (entradas e
                      saída).
                    </p>
                  </aside>
                ) : (
                  <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                    <label htmlFor="account-balance" className={fieldLabel}>
                      SALDO INICIAL (Kz)
                    </label>
                    <input
                      id="account-balance"
                      type="text"
                      inputMode="decimal"
                      value={initialBalance}
                      onChange={(event) => setInitialBalance(event.target.value)}
                      placeholder="0,00"
                      className={`w-full bg-(--background) px-4 py-3 font-manrope text-base font-medium text-(--text-description-60) placeholder:text-(--text-description-60) ${fieldBox}`}
                    />
                  </div>
                )}
              </div>
            </div>

            <footer className="flex shrink-0 items-start justify-start gap-4 self-stretch border-t border-(--card-barras) p-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-56 items-center justify-center gap-2.5 rounded-xl border border-(--border-button) px-4 py-3 text-(--text-title) transition-colors hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-95"
                >
                  <span className="font-manrope text-base font-bold leading-6">
                    Cancelar
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex w-56 items-center justify-center gap-2.5 rounded-xl bg-primary-300 px-4 py-3 text-base-white transition-opacity hover:opacity-90 active:opacity-80 active:scale-95"
                >
                  <span className="text-center font-manrope text-base font-bold leading-6">
                    {primaryLabel}
                  </span>
                </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

export default AccountForm;
