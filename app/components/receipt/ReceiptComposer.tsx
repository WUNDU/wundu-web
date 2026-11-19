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
      <div className="flex min-h-0 flex-1 flex-col items-start gap-3 self-stretch overflow-y-auto px-6 pb-5 lg:gap-4">
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
          className={`hidden w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-5 text-center transition-colors lg:flex lg:py-6 ${
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
          <div className="flex w-full flex-col items-stretch gap-2">
            <div className="flex w-full items-center justify-between gap-3">
              <span className="font-manrope text-[11px] font-semibold uppercase leading-4 text-(--text-description)">
                {files.length} de {MAX_RECEIPT_FILES} ficheiros
              </span>
              <button
                type="button"
                onClick={() => setFiles([])}
                className="rounded-lg px-2 py-1 font-manrope text-[11px] font-semibold leading-4 text-danger-300 transition-colors hover:bg-danger-300/10 active:scale-95"
              >
                Limpar
              </button>
            </div>
            <ul className="flex w-full flex-col items-stretch overflow-hidden rounded-xl border border-(--card-barras) bg-(--bg-body)">
              {files.map((file) => (
                <li
                  key={fileKey(file)}
                  className="flex w-full items-center gap-2.5 border-b border-(--card-barras) px-3 py-2.5 last:border-0 lg:gap-3 lg:px-4 lg:py-3"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-(--background) text-(--icon) lg:size-9 lg:rounded-xl">
                    <FileText size={17} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col items-start">
                    <strong className="w-full truncate font-manrope text-[13px] font-medium leading-5 text-(--text-title) lg:text-sm">
                      {file.name}
                    </strong>
                    <small className="w-full truncate font-manrope text-[11px] font-medium leading-4 text-(--text-description) lg:text-xs lg:leading-5">
                      {file.name.includes(".")
                        ? `${file.name.split(".").pop()?.toUpperCase()} · `
                        : ""}
                      {sizeLabel(file.size)}
                    </small>
                  </span>
                  <button
                    type="button"
                    aria-label={`Retirar ${file.name}`}
                    onClick={() =>
                      setFiles((items) => items.filter((item) => item !== file))
                    }
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-(--icon) transition-colors hover:bg-neutrals-300/10 active:scale-90"
                  >
                    <X size={17} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="flex w-full items-start gap-2 font-manrope text-[11px] font-medium leading-4 text-(--text-description) lg:gap-2.5 lg:text-xs lg:leading-5">
          <Sparkles width={14} className="mt-0.5 shrink-0 text-primary-300" />
          <span>
            A Wundu lê fornecedor, valor e data. Podes fechar esta janela — a
            leitura continua e revês tudo antes de guardar.
          </span>
        </p>

        {error || receipt.error ? (
          <p role="alert" className="font-manrope text-xs font-semibold text-danger-300">
            {error || receipt.error}
          </p>
        ) : null}
      </div>

      <footer className="flex shrink-0 items-start gap-4 self-stretch border-t border-(--card-barras) p-5 lg:p-6">
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
