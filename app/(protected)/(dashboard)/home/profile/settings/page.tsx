"use client";

import { PageHeader } from "app/components/layout";
import Achievements from "app/components/settings/Achievements";
import AppearanceCard from "app/components/settings/AppearanceCard";
import DangerZone from "app/components/settings/DangerZone";
import DeleteAccountDialog from "app/components/settings/DeleteAccountDialog";
import NotificationsCard from "app/components/settings/NotificationsCard";
import PasswordForm from "app/components/settings/PasswordForm";
import PrivacyCard from "app/components/settings/PrivacyCard";
import ProfileCard from "app/components/settings/ProfileCard";
import ProfileEdit, {
  type ProfileEditValues,
} from "app/components/settings/ProfileEdit";
import ProfileStats from "app/components/settings/ProfileStats";
import SecurityCard from "app/components/settings/SecurityCard";
import SessionsCard from "app/components/settings/SessionsCard";
import type { ProfileDTO } from "app/components/mock/profile";
import { useGoal } from "@/hooks/use-goal";
import { notify } from "@/hooks/use-notification";
import { useTransaction } from "@/hooks/use-transaction";
import { useUser } from "@/hooks/use-user";
import { userService } from "@/services/user.service";
import { provinceEnumToLabel } from "@/constants/angola-provinces-fallback";
import { stripPhoneSpaces, formatPhoneInput } from "app/utils/phone-mask";
import { useMemo, useState } from "react";

type SettingsTab =
  | "Perfil"
  | "Segurança"
  | "Privacidade"
  | "Notificações"
  | "Aparência"
  | "Sessões";

const TABS: SettingsTab[] = [
  "Perfil",
  "Segurança",
  "Privacidade",
  "Notificações",
  "Aparência",
  "Sessões",
];

/** YYYY-MM-DD → DD/MM/YYYY (sem desvios de fuso horário). */
function formatDMY(iso: string): string {
  const match = iso.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : "—";
}

function formatLongDate(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function page() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Perfil");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const { user, refreshUser } = useUser();
  const { goals: apiGoals } = useGoal();
  const { totalElements: transactionTotal } = useTransaction();

  const profile = useMemo<ProfileDTO | null>(() => {
    if (!user) return null;
    const provinceLabel = user.province
      ? provinceEnumToLabel(user.province)
      : "";
    const address =
      [user.municipality, provinceLabel].filter(Boolean).join(", ") || "—";
    const phone = formatPhoneInput(user.phoneNumber ?? "") || "—";
    return {
      name: user.name,
      email: user.email,
      birthDate: user.birthDate ? formatDMY(user.birthDate) : "—",
      phone,
      address,
      country: "",
      photo: user.profilePhotoUrl ?? null,
      province: user.province ?? "",
      municipality: user.municipality ?? "",
    };
  }, [user]);

  const activeGoals = useMemo(
    () =>
      apiGoals.filter(
        (goal) => goal.status === "ACTIVE" || goal.status === "AT_RISK",
      ),
    [apiGoals],
  );
  const savedTotal = useMemo(
    () => activeGoals.reduce((sum, goal) => sum + goal.currentAmount, 0),
    [activeGoals],
  );
  const achievements = useMemo(
    () =>
      apiGoals
        .filter((goal) => goal.status === "DONE")
        .map((goal) => ({
          title: goal.title?.trim() || "Meta",
          saved: goal.currentAmount,
        })),
    [apiGoals],
  );

  async function handleSaveProfile(
    values: ProfileEditValues,
  ): Promise<boolean> {
    if (!user?.id) return false;
    const phone = stripPhoneSpaces(values.phone);
    try {
      if (
        values.name !== user.name ||
        phone !== (user.phoneNumber ?? "")
      ) {
        await userService.update(user.id, {
          name: values.name,
          ...(phone ? { phoneNumber: phone } : {}),
        });
      }
      const changed: Record<string, string> = {};
      if (values.birthDate !== (user.birthDate ?? ""))
        changed.birthDate = values.birthDate;
      if (values.province !== (user.province ?? ""))
        changed.province = values.province;
      if (values.municipality !== (user.municipality ?? ""))
        changed.municipality = values.municipality;
      if (Object.keys(changed).length > 0) {
        await userService.updateProfile(changed);
      }
      if (values.photoFile) await userService.uploadPhoto(values.photoFile);
      else if (values.photoRemoved) await userService.deletePhoto();
      await refreshUser();
      notify.success("Perfil atualizado com sucesso!");
      return true;
    } catch {
      notify.error("Não foi possível guardar as alterações.");
      return false;
    }
  }

  return (
    <div className="flex h-full flex-col bg-(--background-variant) lg:bg-transparent">
      <div className="hidden lg:block">
        <PageHeader title={"Definições"} />
      </div>
      <div className="flex items-center justify-between self-stretch bg-(--background) px-6 py-4 lg:hidden">
        <h1 className="font-manrope text-2xl font-bold text-(--text-title)">
          Definições
        </h1>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto px-6 pb-3 pt-3 lg:hidden">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 rounded-2xl px-3.5 py-2 font-manrope text-sm ${
                isActive
                  ? "bg-primary-300 font-bold text-white"
                  : "bg-(--background-variant) font-semibold text-(--text-title)"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
        <section
          aria-label="Navegação das definições"
          className="hidden shrink-0 flex-col items-start justify-center gap-2.5 self-stretch border-b border-(--card-barras) bg-(--bg-card) px-8 py-4 lg:flex"
        >
          <nav aria-label="Secções de definições">
            <ul className="flex items-start justify-start">
              {TABS.map((tab) => {
                const isActive = tab === activeTab;
                return (
                  <li key={tab} className="flex">
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      aria-current={isActive ? "page" : undefined}
                      className="flex flex-col items-center justify-center"
                    >
                      <span
                        className={`flex items-center justify-center gap-2 px-4 pt-4 pb-3.5 text-center font-manrope text-base ${
                          isActive
                            ? "font-bold text-(--text-link)"
                            : "font-medium text-(--text-description-button)"
                        }`}
                      >
                        {tab}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-0.5 self-stretch ${
                          isActive ? "bg-(--border-blue)" : "bg-transparent"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </section>
        <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-(--background-variant) px-6 pb-8 pt-2 lg:gap-8 lg:bg-transparent lg:p-8">
          <h1 className="sr-only">{activeTab}</h1>
          {activeTab === "Perfil" ? (
            <div className="flex flex-col items-start justify-start gap-4 self-stretch lg:gap-8">
              {!profile ? (
                <div
                  aria-label="A carregar perfil"
                  className="flex self-stretch flex-col gap-4"
                >
                  <div
                    aria-hidden="true"
                    className="h-64 animate-pulse rounded-2xl bg-(--bg-filter)"
                  />
                  <div
                    aria-hidden="true"
                    className="h-24 animate-pulse rounded-2xl bg-(--bg-filter)"
                  />
                  <span className="sr-only">A carregar perfil…</span>
                </div>
              ) : (
                <>
                  <ProfileCard
                    profile={profile}
                    createdLabel={formatLongDate(user?.createdAt)}
                    onEdit={() => setIsEditOpen(true)}
                  />
                  <ProfileStats
                    activeGoals={activeGoals.length}
                    transactions={transactionTotal}
                    saved={savedTotal}
                  />
                </>
              )}
              <Achievements achievements={achievements} />
              <DangerZone onDelete={() => setIsDeleteOpen(true)} />
            </div>
          ) : null}
          {activeTab === "Segurança" ? (
            <div className="flex flex-col items-start justify-start gap-4 self-stretch lg:gap-8">
              <SecurityCard
                onChangePassword={() => setIsPasswordOpen(true)}
                onViewSessions={() => setActiveTab("Sessões")}
              />
            </div>
          ) : null}
          {activeTab === "Privacidade" ? (
            <div className="flex flex-col items-start justify-start gap-4 self-stretch lg:gap-8">
              <PrivacyCard />
            </div>
          ) : null}
          {activeTab === "Notificações" ? (
            <div className="flex flex-col items-start justify-start gap-4 self-stretch lg:gap-8">
              <NotificationsCard />
            </div>
          ) : null}
          {activeTab === "Aparência" ? (
            <div className="flex flex-col items-start justify-start gap-4 self-stretch lg:gap-8">
              <AppearanceCard />
            </div>
          ) : null}
          {activeTab === "Sessões" ? (
            <div className="flex flex-col items-start justify-start gap-4 self-stretch lg:gap-8">
              <SessionsCard />
            </div>
          ) : null}
        </main>
        {profile ? (
          <ProfileEdit
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            profile={profile}
            onSave={handleSaveProfile}
          />
        ) : null}
        <DeleteAccountDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          accountName={profile?.name ?? ""}
        />
        <PasswordForm
          isOpen={isPasswordOpen}
          onClose={() => setIsPasswordOpen(false)}
        />
      </div>
  );
}

export default page;
