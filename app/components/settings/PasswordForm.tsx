"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Pencil, TriangleAlert } from "lucide-react";
import { CloseIcon } from "@/constants/icons";

type PasswordFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
};

const hasMinLength = (value: string) => value.length >= 8;
const hasUppercase = (value: string) => /[A-Z]/.test(value);
const hasNumberOrSymbol = (value: string) => /[\d\W_]/.test(value);

function PasswordForm({ isOpen, onClose, onSave }: PasswordFormProps) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCurrent("");
    setNext("");
    setConfirm("");
    setShowCurrent(false);
    setShowNext(false);
    setShowConfirm(false);
  }, [isOpen]);

  const rules = [
    { label: "Mínimo de 8 caracteres", met: hasMinLength(next) },
    { label: "Pelo menos uma letra maiúscula", met: hasUppercase(next) },
    { label: "Pelo menos um número ou símbolo", met: hasNumberOrSymbol(next) },
  ];
  const nextInvalid = next.length > 0 && rules.some((rule) => !rule.met);
  const canSave =
    current.length > 0 &&
    next.length > 0 &&
    !nextInvalid &&
    confirm === next;

  const fieldLabel =
    "font-manrope text-sm font-semibold leading-5 text-(--text-description)";
  const fieldBox =
    "rounded-lg border bg-(--settings-bg-config) focus:outline-none";

  const passwordField = (
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    show: boolean,
    onToggleShow: () => void,
    placeholder?: string,
    invalid?: boolean,
  ) => (
    <div className="flex flex-col items-start justify-start gap-2 self-stretch">
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <div
        className={`flex items-center justify-between self-stretch px-4 py-3 ${fieldBox} ${
          invalid
            ? "border-[1.5px] border-danger-300"
            : "border border-(--border-hover)"
        } focus-within:border-(--border)`
      }
      >
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          className={`min-w-0 flex-1 bg-transparent font-manrope text-base font-normal outline-none placeholder:text-(--text-description-60) focus:outline-none ${
            value ? "text-(--text-title)" : "text-(--text-description-60)"
          }`}
        />
        <button
          type="button"
          onClick={onToggleShow}
          aria-label={show ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
          aria-pressed={show}
          className="shrink-0 rounded p-0.5 transition-all hover:bg-neutrals-300/10 active:scale-90"
        >
          {show ? (
            <EyeOff
              width={16}
              height={16}
              className={invalid ? "text-danger-300" : "text-(--icon)"}
            />
          ) : (
            <Eye
              width={16}
              height={16}
              className={invalid ? "text-danger-300" : "text-(--icon)"}
            />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-[60] bg-sky-950/40 backdrop-blur transition-opacity duration-300 lg:bg-transparent ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <aside
        className={`fixed inset-x-0 bottom-0 top-auto z-50 max-h-[calc(100dvh-3rem)] flex w-full max-w-full flex-col items-start justify-between rounded-t-3xl border-t border-(--card-barras) bg-(--background) transition-transform duration-300 ease-out lg:inset-x-auto lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 lg:h-screen lg:max-h-dvh lg:w-125 lg:rounded-none lg:border-l lg:border-t-0 ${isOpen ? "translate-x-0 translate-y-0 lg:translate-x-0" : "translate-x-0 translate-y-full lg:translate-x-full lg:translate-y-0"}}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-xs bg-zinc-300 lg:hidden"
        />
        <div className="flex min-h-0 flex-1 flex-col items-start justify-start self-stretch">
          <header className="flex h-24 shrink-0 items-center justify-between self-stretch border-b border-(--card-barras) p-6">
            <div className="flex items-center justify-start gap-2">
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-xl bg-primary-300/10"
              >
                <Pencil width={20} height={20} className="text-(--icon-hover)" />
              </span>
              <h2 className="font-manrope text-lg font-bold leading-7 text-(--text)">
                Definir nova palavra-passe
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

          <div className="flex min-h-0 flex-1 flex-col items-start justify-start gap-10 self-stretch overflow-y-auto px-6 py-6">
            <p className="flex items-start justify-start gap-3 self-stretch rounded-xl bg-(--bg-list) p-4">
              <TriangleAlert
                width={20}
                height={20}
                aria-hidden="true"
                className="shrink-0 text-danger-300"
              />
              <span className="flex-1 font-manrope text-sm font-medium leading-5 text-(--text-description-60)">
                Por favor, escolha uma palavra-passe forte que ainda não tenha
                utilizado noutras contas.
              </span>
            </p>

            <div className="flex flex-col items-start justify-start gap-5 self-stretch">
              {passwordField(
                "password-current",
                "Palavra-passe actual",
                current,
                setCurrent,
                showCurrent,
                () => setShowCurrent((value) => !value),
                "••••••••••••••••",
              )}
              {passwordField(
                "password-next",
                "Nova palavra-passe",
                next,
                setNext,
                showNext,
                () => setShowNext((value) => !value),
                undefined,
                nextInvalid,
              )}
              {passwordField(
                "password-confirm",
                "Confirmar nova palavra-passe",
                confirm,
                setConfirm,
                showConfirm,
                () => setShowConfirm((value) => !value),
                "Confirmar palavra-passe",
              )}
            </div>

            <div className="flex flex-col items-start justify-start gap-3 self-stretch">
              <p className="font-manrope text-sm font-bold leading-5 text-(--text-description-60)">
                A palavra-passe deve conter pelo menos:
              </p>
              <ul className="flex flex-col items-start justify-start gap-2 self-stretch">
                {rules.map((rule) => (
                  <li
                    key={rule.label}
                    className="flex items-center justify-start gap-2"
                  >
                    <span
                      aria-hidden="true"
                      className={`size-3.5 rounded-full ${rule.met ? "bg-success" : "bg-neutrals-300"}`}
                    />
                    <span
                      className={`font-manrope text-sm font-normal leading-5 ${
                        rule.met ? "text-success" : "text-(--text-description)"
                      }`}
                    >
                      {rule.label}
                    </span>
                  </li>
                ))}
              </ul>
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
              Cancelar
            </span>
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              onSave?.();
              onClose();
            }}
            className="flex w-56 items-center justify-center gap-2.5 rounded-2xl bg-primary-300 p-3.5 text-base-white shadow-[0px_4px_12px_0px_rgba(5,61,196,0.15)] transition-all hover:opacity-90 active:scale-[0.98] active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-center font-manrope text-base font-bold leading-normal">
              Salvar alterações
            </span>
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default PasswordForm;
