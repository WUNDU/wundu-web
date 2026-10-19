"use client";

import {
  Camera,
  FileText,
  FolderOpen,
  ImageIcon,
  ScanLine,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useReceipt } from "app/components/layout/ReceiptProvider";
import { MAX_RECEIPT_FILES } from "@/hooks/use-receipt-attachment";

type ReceiptComposerProps = {
  /** Fecha o formulário (a leitura continua em segundo plano). */
  onClose: () => void;
};

const ACCEPT = "application/pdf,image/jpeg,image/png";
const MAX_SIZE = 10 * 1024 * 1024;

const sizeLabel = (size: number) =>
  size >= 1024 * 1024
    ? `${(size / 1024 / 1024).toLocaleString("pt-AO", { maximumFractionDigits: 1 })} MB`
    : `${Math.ceil(size / 1024)} KB`;

const fileKey = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

/**
 * Compositor de comprovativos — portado do protótipo `wundu`
 * (`ReceiptComposer`): arrastar ou escolher ficheiros, câmara, PDF, galeria,
 * até 10 ficheiros de 10 MB.
 */
export default function ReceiptComposer({ onClose }: ReceiptComposerProps) {
  const receipt = useReceipt();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const all = useRef<HTMLInputElement>(null);
  const pdf = useRef<HTMLInputElement>(null);
  const gallery = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);

  function add(incoming: File[]) {
    setError("");
    if (incoming.some((file) => file.size > MAX_SIZE)) {
      setError("Cada ficheiro pode ter até 10 MB.");
      return;
    }
    if (incoming.some((file) => !/\.(pdf|jpe?g|png)$/i.test(file.name))) {
      setError("Escolhe ficheiros PDF, JPG ou PNG.");
      return;
    }
    setFiles((previous) => {
      const next = [...previous];
      for (const file of incoming) {
        if (!next.some((item) => fileKey(item) === fileKey(file))) next.push(file);
      }
      if (next.length > MAX_RECEIPT_FILES) {
        setError("Podes ler até 10 ficheiros de cada vez.");
        return previous;
      }
      return next;
    });
  }

  function submit() {
    if (!files.length) return;
    // A leitura continua em segundo plano depois de fechar o formulário
    // (como no protótipo): a barra de progresso acompanha o processo.
    receipt.stage(files);
    void receipt.read();
    onClose();
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col items-start gap-4 self-stretch overflow-y-auto px-6 pb-5">
        <input
          ref={all}
          hidden
          type="file"
          multiple
          accept={ACCEPT}
          aria-label="Ficheiros de comprovativos"
          onChange={(event) => {
            add(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <input
          ref={pdf}
          hidden
          type="file"
          multiple
          accept="application/pdf"
          aria-label="Comprovativos PDF"
          onChange={(event) => {
            add(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <input
          ref={gallery}
          hidden
          type="file"
          multiple
          accept="image/jpeg,image/png"
          aria-label="Comprovativos da galeria"
          onChange={(event) => {
            add(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <input
          ref={camera}
          hidden
          type="file"
          accept="image/*"
          capture="environment"
          aria-label="Fotografar comprovativo"
          onChange={(event) => {
            add(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            add(Array.from(event.dataTransfer.files));
          }}
          className={`hidden w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition-colors lg:flex ${
            dragging
              ? "border-primary-300 bg-primary-300/10"
              : "border-(--border-button) bg-(--bg-body)"
          }`}
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-300/10">
            <Upload width={20} className="text-primary-300" />
          </span>
          <h3 className="font-manrope text-base font-medium leading-6 text-(--text-title)">
            Arrasta facturas ou comprovativos
          </h3>
          <p className="font-manrope text-sm font-medium leading-5 text-(--text-description)">
            PDF, JPG ou PNG · até {MAX_RECEIPT_FILES} ficheiros de 10 MB cada
          </p>
          <button
            type="button"
            onClick={() => all.current?.click()}
            className="mt-1 flex items-center gap-2 rounded-xl border border-primary-300 px-4 py-2 text-primary-300 transition-colors hover:bg-primary-300/10 active:scale-95"
          >
            <FolderOpen width={18} />
            <span className="font-manrope text-sm font-medium leading-5">
              Escolher ficheiros
            </span>
          </button>
        </div>

        <div className="grid w-full grid-cols-3 gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => camera.current?.click()}
            className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-(--border-button) transition-colors hover:bg-neutrals-300/10 active:scale-95"
          >
            <Camera width={21} className="text-primary-300" />
            <span className="font-manrope text-xs font-medium leading-5 text-(--text-description)">
              Câmara
            </span>
          </button>
          <button
            type="button"
            onClick={() => pdf.current?.click()}
            className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-(--border-button) transition-colors hover:bg-neutrals-300/10 active:scale-95"
          >
            <FileText width={21} className="text-primary-300" />
            <span className="font-manrope text-xs font-medium leading-5 text-(--text-description)">
              PDF
            </span>
          </button>
          <button
            type="button"
            onClick={() => gallery.current?.click()}
            className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-(--border-button) transition-colors hover:bg-neutrals-300/10 active:scale-95"
          >
            <ImageIcon width={21} className="text-primary-300" />
            <span className="font-manrope text-xs font-medium leading-5 text-(--text-description)">
              Galeria
            </span>
          </button>
        </div>

        {files.length ? (
          <ul className="flex w-full flex-col items-start overflow-hidden rounded-xl border border-(--card-barras)">
            {files.map((file) => (
              <li
                key={fileKey(file)}
                className="flex w-full items-center gap-3 border-b border-(--card-barras) px-4 py-3 last:border-0"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-(--bg-body) text-(--icon)">
                  <FileText size={19} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col items-start">
                  <strong className="w-full truncate font-manrope text-sm font-medium leading-5 text-(--text-title)">
                    {file.name}
                  </strong>
                  <small className="font-manrope text-xs font-medium leading-5 text-(--text-description)">
                    {file.name.split(".").pop()?.toUpperCase()} ·{" "}
                    {sizeLabel(file.size)}
                  </small>
                </div>
                <button
                  type="button"
                  aria-label={`Retirar ${file.name}`}
                  onClick={() =>
                    setFiles((items) => items.filter((item) => item !== file))
                  }
                  className="rounded-lg p-1 text-(--icon) transition-colors hover:bg-neutrals-300/10 active:scale-90"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="flex items-start gap-2.5 font-manrope text-xs font-medium leading-5 text-(--text-description)">
          <Sparkles width={18} className="mt-0.5 shrink-0 text-primary-300" />
          <span>
            A Wundu extrai fornecedor, valor e data, e sugere conta e categoria
            quando identificadas. A leitura continua se fechares esta janela.
            Revês cada transação antes de ser salva.
          </span>
        </p>

        {error || receipt.error ? (
          <p role="alert" className="font-manrope text-xs font-semibold text-danger-300">
            {error || receipt.error}
          </p>
        ) : null}
      </div>

      <footer className="flex shrink-0 items-start gap-4 self-stretch border-t border-(--card-barras) p-6">
        <button
          type="button"
          onClick={onClose}
          className="flex flex-1 justify-center rounded-xl border border-(--card-barras) px-4 py-3.5 text-(--text-title) transition-colors hover:bg-neutrals-300/10 active:scale-95 lg:w-56 lg:flex-none"
        >
          <p className="font-manrope text-sm font-bold leading-6 text-(--text-description) lg:text-base">
            Cancelar
          </p>
        </button>
        <button
          type="button"
          disabled={!files.length || receipt.isReading}
          onClick={() => void submit()}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-(--card-barras) bg-primary-300 px-4 py-3.5 text-base-white transition-opacity hover:opacity-90 active:scale-95 disabled:cursor-wait disabled:opacity-60 lg:w-56 lg:flex-none"
        >
          <ScanLine width={18} />
          <p className="font-manrope text-sm font-bold leading-6 lg:text-base">
            {receipt.isReading
              ? "A adicionar…"
              : `Ler ${files.length || ""} ${
                  files.length === 1 ? "ficheiro" : "ficheiros"
                }`}
          </p>
        </button>
      </footer>
    </>
  );
}
