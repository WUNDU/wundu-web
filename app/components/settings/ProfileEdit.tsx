"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { CloseIcon, ImageUploadIcon } from "@/constants/icons";
import { avatar } from "@/constants/images";
import DropmenuData from "../transaction/DropmenuData";
import FloatingMenu from "../ui/FloatingMenu";
import SearchableMenu from "../ui/SearchableMenu";
import { formatPhoneInput } from "../../utils/phone-mask";
import { useAngolaLocation } from "@/hooks/use-angola-location";
import { angolaLocationService } from "@/services/angola-location.service";
import {
  provinceEnumToSlug,
  provinceSlugToEnum,
} from "@/types/dtos/angola-location.dto";
import type { ProfileDTO } from "../mock/profile";

export type ProfileEditValues = {
  name: string;
  phone: string;
  /** Data de nascimento em YYYY-MM-DD. */
  birthDate: string;
  /** Enum do backend (ex. "BENGO"); vazio = sem alteração. */
  province: string;
  /** Nome do município em texto. */
  municipality: string;
  /** Ficheiro novo para carregar (aplicado ao guardar). */
  photoFile: File | null;
  /** Remover a foto atual (aplicado ao guardar). */
  photoRemoved: boolean;
};

type ProfileEditProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileDTO;
  onSave?: (values: ProfileEditValues) => Promise<boolean>;
};

const MAX_PHOTO_BYTES = 20 * 1024 * 1024;

const parseDMY = (raw: string): Date => {
  const match = raw.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return new Date();
  const date = new Date(
    Number(match[3]),
    Number(match[2]) - 1,
    Number(match[1]),
  );
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const formatDMY = (date: Date): string =>
  date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ProfileEdit({ isOpen, onClose, profile, onSave }: ProfileEditProps) {
  const [name, setName] = useState(profile.name);
  const [birth, setBirth] = useState<Date>(() => parseDMY(profile.birthDate));
  const [birthOpen, setBirthOpen] = useState(false);
  const [phone, setPhone] = useState(profile.phone);
  const [provinceSlug, setProvinceSlug] = useState("");
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [municipality, setMunicipality] = useState(profile.municipality ?? "");
  const [municipalityOpen, setMunicipalityOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(profile.photo ?? null);
  const [initialPhoto, setInitialPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const birthAnchorRef = useRef<HTMLButtonElement>(null);
  const provinceAnchorRef = useRef<HTMLButtonElement>(null);
  const municipalityAnchorRef = useRef<HTMLButtonElement>(null);
  const { provinces, isLoading: isLocationLoading } = useAngolaLocation();
  const municipalities = angolaLocationService.getMunicipalities(
    provinces,
    provinceSlug,
  );
  const allMunicipalities = useMemo(
    () =>
      provinces.flatMap((province) =>
        angolaLocationService
          .getMunicipalities(provinces, province.slug)
          .map((municipality) => ({
            ...municipality,
            provinceSlug: province.slug,
            provinceName: province.nome,
          })),
      ),
    [provinces],
  );
  /** Com província: só os dela. Sem província: todos (escolher define-a). */
  const municipalityOptions = useMemo(
    () =>
      provinceSlug
        ? municipalities.map((item) => ({
            id: item.slug,
            label: item.nome,
            provinceSlug,
            nome: item.nome,
          }))
        : allMunicipalities.map((item) => ({
            id: `${item.provinceSlug}:${item.slug}`,
            label: `${item.nome} · ${item.provinceName}`,
            provinceSlug: item.provinceSlug,
            nome: item.nome,
          })),
    [provinceSlug, municipalities, allMunicipalities],
  );
  const hasMunicipalityData =
    allMunicipalities.length > 0 || isLocationLoading;
  const selectedMunicipalityId =
    municipalityOptions.find((item) => item.nome === municipality)?.id ?? "";
  const provinceName =
    provinces.find((item) => item.slug === provinceSlug)?.nome ?? "";

  useEffect(() => {
    if (!isOpen) return;
    setName(profile.name);
    setBirth(parseDMY(profile.birthDate));
    setBirthOpen(false);
    setPhone(profile.phone);
    setProvinceSlug(
      profile.province ? provinceEnumToSlug(profile.province) : "",
    );
    setProvinceOpen(false);
    setMunicipality(profile.municipality ?? "");
    setMunicipalityOpen(false);
    setPhoto(profile.photo ?? null);
    setInitialPhoto(profile.photo ?? null);
    setPhotoFile(null);
    setSaving(false);
    setFormError(null);
  }, [isOpen, profile]);

  const fieldLabel =
    "font-manrope text-sm font-medium leading-5 text-(--text-description)";
  const fieldBox =
    "rounded-lg border border-(--card-barras) bg-(--background) focus:border-(--border) focus:outline-none";

  function handlePickPhoto(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(jpeg|png)$/.test(file.type)) {
      setFormError("A foto tem de ser JPEG ou PNG.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setFormError("A foto não pode exceder 20 MB.");
      return;
    }
    setFormError(null);
    setPhoto((previous) => {
      if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
    setPhotoFile(file);
  }

  function handleRemovePhoto() {
    setPhoto((previous) => {
      if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
      return null;
    });
    setPhotoFile(null);
  }

  async function handleSave() {
    if (saving) return;
    if (name.trim().length < 2) {
      setFormError("Indique o nome completo.");
      return;
    }
    setSaving(true);
    setFormError(null);
    const ok = await onSave?.({
      name: name.trim(),
      phone: phone.trim(),
      birthDate: toDateKey(birth),
      province: provinceSlug ? provinceSlugToEnum(provinceSlug) : "",
      municipality: municipality.trim(),
      photoFile,
      photoRemoved: Boolean(initialPhoto) && !photoFile && photo === null,
    });
    setSaving(false);
    if (ok) onClose();
    else setFormError("Não foi possível guardar. Tente novamente.");
  }

  return (
    <div
      className={`fixed inset-0 z-[60] bg-sky-950/40 backdrop-blur transition-opacity duration-300 lg:bg-transparent ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <aside
        aria-label="Editar perfil"
        onClick={(event) => event.stopPropagation()}
        className={`fixed inset-x-0 bottom-0 top-auto z-50 max-h-[calc(100dvh-3rem)] flex w-full max-w-full flex-col items-start justify-between rounded-t-3xl border-t border-(--card-barras) bg-(--background) transition-transform duration-300 ease-out lg:inset-x-auto lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 lg:h-screen lg:max-h-dvh lg:w-[860px] lg:rounded-none lg:border-l lg:border-t-0 ${isOpen ? "translate-x-0 translate-y-0 lg:translate-x-0" : "translate-x-0 translate-y-full lg:translate-x-full lg:translate-y-0"}}`}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-xs bg-zinc-300 lg:hidden"
        />
        <header className="flex h-24 shrink-0 items-center justify-between self-stretch border-b border-(--card-barras) p-6">
          <div className="flex items-center justify-start gap-2">
            <span
              aria-hidden="true"
              className="flex size-10 items-center justify-center rounded-xl bg-primary-300/10"
            >
              <Pencil width={20} height={20} className="text-(--icon-hover)" />
            </span>
            <h2 className="font-manrope text-lg font-bold leading-7 text-(--text)">
              Editar Perfil
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

        <div className="flex min-h-0 flex-1 flex-col items-start justify-start self-stretch overflow-y-auto py-6">
          <div className="flex flex-col items-start justify-start gap-6 self-stretch px-6 pt-6 pb-3">
            <div className="flex flex-col items-start justify-start gap-10 self-stretch rounded-2xl border border-(--card-barras) bg-(--background) p-6">
              <div className="flex flex-col items-start justify-start gap-4 self-stretch sm:flex-row sm:items-center sm:gap-6">
                <Image
                  src={photo ?? avatar}
                  alt="Foto de perfil"
                  width={180}
                  height={180}
                  className="size-44 shrink-0 rounded-3xl object-cover outline-[2.5px] outline-offset-[-2.5px] outline-(--border-blue)"
                />
                <div className="flex w-40 flex-col items-start justify-start gap-2.5">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    aria-label="Carregar foto"
                    className="sr-only"
                    onChange={(event) => {
                      handlePickPhoto(event.target.files?.[0]);
                      event.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-10 items-center justify-center gap-2 self-stretch rounded-xl border-[1.5px] border-(--border-hover) bg-transparent px-3 transition-all hover:bg-neutrals-300/10 active:scale-[0.98]"
                  >
                    <ImageUploadIcon
                      width={24}
                      height={24}
                      aria-hidden="true"
                      className="size-6 shrink-0 text-(--text-description-button)"
                    />
                    <span className="shrink-0 whitespace-nowrap text-center font-manrope text-xs font-bold text-(--text-description-button)">
                      Carregar Foto
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="flex h-10 items-center justify-center gap-2 self-stretch rounded-xl bg-(--button-bg-danger) px-3 transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    <Trash2
                      width={20}
                      height={20}
                      aria-hidden="true"
                      className="size-5 shrink-0 text-base-white"
                    />
                    <span className="shrink-0 whitespace-nowrap text-center font-manrope text-xs font-bold text-base-white">
                      Eliminar foto
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-start justify-start gap-6 self-stretch">
                <div className="flex flex-col items-start justify-start gap-4 self-stretch md:flex-row">
                  <div className="flex flex-1 flex-col items-start justify-start gap-2">
                    <label htmlFor="profile-name" className={fieldLabel}>
                      Nome completo
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className={`w-full px-4 py-3 font-manrope text-base font-normal text-(--text-title) ${fieldBox}`}
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-start justify-start gap-2">
                    <label htmlFor="profile-email" className={fieldLabel}>
                      Email
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={profile.email}
                      readOnly
                      aria-readonly="true"
                      className={`w-full bg-(--bg-notify-card-hover) px-4 py-3 font-manrope text-base font-normal text-(--text-description-60) ${fieldBox}`}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-4 self-stretch md:flex-row">
                  <div className="flex flex-1 flex-col items-start justify-start gap-2">
                    <span id="profile-birth-label" className={fieldLabel}>
                      Data de Nascimento
                    </span>
                    <div className="relative self-stretch">
                      <button
                        type="button"
                        ref={birthAnchorRef}
                        onClick={() => setBirthOpen((value) => !value)}
                        aria-expanded={birthOpen}
                        aria-labelledby="profile-birth-label"
                        className={`flex w-full items-center justify-start gap-2.5 px-4 py-3 transition-all hover:bg-neutrals-300/10 active:scale-[0.99] ${fieldBox}`}
                      >
                        <Calendar
                          width={16}
                          height={16}
                          aria-hidden="true"
                          className="shrink-0 text-primary-300"
                        />
                        <span className="font-manrope text-base font-normal text-(--text-title)">
                          {formatDMY(birth)}
                        </span>
                      </button>
                      <FloatingMenu
                        isOpen={birthOpen}
                        anchorRef={birthAnchorRef}
                        onClose={() => setBirthOpen(false)}
                      >
                        <DropmenuData
                          isOpen={birthOpen}
                          selected={birth}
                          onSelect={(date) => {
                            setBirth(date);
                            setBirthOpen(false);
                          }}
                        />
                      </FloatingMenu>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col items-start justify-start gap-2">
                    <label htmlFor="profile-phone" className={fieldLabel}>
                      Telefone
                    </label>
                    <input
                      id="profile-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(formatPhoneInput(event.target.value))
                      }
                      placeholder="914 939 238"
                      className={`w-full px-4 py-3 font-manrope text-base font-normal text-(--text-title) ${fieldBox}`}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-4 self-stretch md:flex-row">
                  <div className="flex flex-1 flex-col items-start justify-start gap-2">
                    <span id="profile-province-label" className={fieldLabel}>
                      Província
                    </span>
                    <div className="relative self-stretch">
                      <button
                        type="button"
                        ref={provinceAnchorRef}
                        onClick={() => setProvinceOpen((value) => !value)}
                        aria-expanded={provinceOpen}
                        aria-labelledby="profile-province-label"
                        className={`flex w-full items-center justify-between gap-2 px-4 py-3 transition-all hover:bg-neutrals-300/10 active:scale-[0.99] ${fieldBox}`}
                      >
                        <span
                          className={`min-w-0 flex-1 truncate text-left font-manrope text-base font-normal ${
                            provinceName
                              ? "text-(--text-title)"
                              : "text-(--text-description-60)"
                          }`}
                        >
                          {provinceName || "Selecionar província"}
                        </span>
                        <ChevronDown
                          width={14}
                          height={14}
                          aria-hidden="true"
                          className={`shrink-0 text-(--icon-hover) transition-transform duration-200 ${provinceOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <FloatingMenu
                        isOpen={provinceOpen}
                        anchorRef={provinceAnchorRef}
                        onClose={() => setProvinceOpen(false)}
                      >
                        <SearchableMenu
                          isOpen={provinceOpen}
                          options={provinces.map((item) => ({
                            id: item.slug,
                            label: item.nome,
                          }))}
                          value={provinceSlug}
                          placeholder="Pesquisar província"
                          emptyText="Sem províncias."
                          onSelect={(slug) => {
                            setProvinceSlug(slug);
                            setMunicipality("");
                            setProvinceOpen(false);
                          }}
                        />
                      </FloatingMenu>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col items-start justify-start gap-2">
                    <span id="profile-municipality-label" className={fieldLabel}>
                      Município
                    </span>
                    {hasMunicipalityData ? (
                      <div className="relative self-stretch">
                        <button
                          type="button"
                          ref={municipalityAnchorRef}
                          onClick={() => setMunicipalityOpen((value) => !value)}
                          aria-expanded={municipalityOpen}
                          aria-labelledby="profile-municipality-label"
                          className={`flex w-full items-center justify-between gap-2 px-4 py-3 transition-all hover:bg-neutrals-300/10 active:scale-[0.99] ${fieldBox}`}
                        >
                          <span
                            className={`min-w-0 flex-1 truncate text-left font-manrope text-base font-normal ${
                              municipality
                                ? "text-(--text-title)"
                                : "text-(--text-description-60)"
                            }`}
                          >
                            {municipality || "Selecionar município"}
                          </span>
                          <ChevronDown
                            width={14}
                            height={14}
                            aria-hidden="true"
                            className={`shrink-0 text-(--icon-hover) transition-transform duration-200 ${municipalityOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        <FloatingMenu
                          isOpen={municipalityOpen}
                          anchorRef={municipalityAnchorRef}
                          onClose={() => setMunicipalityOpen(false)}
                        >
                          <SearchableMenu
                            isOpen={municipalityOpen}
                            options={municipalityOptions}
                            value={selectedMunicipalityId}
                            placeholder="Pesquisar município"
                            emptyText={
                              isLocationLoading
                                ? "A carregar…"
                                : "Sem municípios."
                            }
                            onSelect={(id) => {
                              const option = municipalityOptions.find(
                                (item) => item.id === id,
                              );
                              if (option) {
                                setProvinceSlug(option.provinceSlug);
                                setMunicipality(option.nome);
                              }
                              setMunicipalityOpen(false);
                            }}
                          />
                        </FloatingMenu>
                      </div>
                    ) : (
                      <input
                        id="profile-municipality"
                        type="text"
                        value={municipality}
                        onChange={(event) =>
                          setMunicipality(event.target.value)
                        }
                        placeholder="Ex: Viana"
                        aria-labelledby="profile-municipality-label"
                        className={`w-full px-4 py-3 font-manrope text-base font-normal text-(--text-title) ${fieldBox}`}
                      />
                    )}
                  </div>
                </div>

                {formError ? (
                  <p role="alert" className="font-manrope text-[13px] font-semibold text-danger-300">
                    {formError}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-6 self-stretch border-t border-(--card-barras) p-6">
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-(--border-button) p-3.5 text-(--text-title) transition-all hover:bg-neutrals-300/10 active:scale-[0.98] active:bg-neutrals-300/20 lg:w-56 lg:flex-none"
          >
            <span className="font-manrope text-base font-bold leading-normal">
              Cancelar
            </span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex w-56 items-center justify-center gap-2.5 rounded-2xl bg-primary-300 p-3.5 text-base-white shadow-[0px_4px_12px_0px_rgba(5,61,196,0.15)] transition-all hover:opacity-90 active:scale-[0.98] active:opacity-80 disabled:cursor-wait disabled:opacity-60"
          >
            <span className="text-center font-manrope text-base font-bold leading-normal">
              {saving ? "A guardar…" : "Salvar alterações"}
            </span>
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default ProfileEdit;
