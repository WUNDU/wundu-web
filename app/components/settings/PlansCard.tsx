"use client";

import Image from "next/image";
import { CheckIcon, CrownIcon } from "@/constants/icons";
import {
  planIllustration,
  planIllustrationPremium,
} from "@/constants/images";

const FREE_FEATURES = [
  "Transações ilimitadas",
  "Categorias ilimitadas",
  "Metas ilimitadas",
  "Suporte da padrão",
];

const PREMIUM_FEATURES = [
  "Abertura de contas",
  "Contas ilimitadas",
  "Recursos avançados",
  "Concursos e Prêmios",
];

function PlanFeature({
  label,
  muted = false,
}: {
  label: string;
  muted?: boolean;
}) {
  return (
    <li className="flex h-6 items-center justify-start gap-3 self-stretch overflow-hidden">
      <CheckIcon
        width={20}
        height={20}
        aria-hidden="true"
        className={`shrink-0 ${
          muted ? "text-(--icon)" : "text-(--icon-hover-2)"
        }`}
      />
      <span
        className={`flex-1 font-manrope text-sm font-normal leading-5 ${
          muted
            ? "text-(--text-description-60)"
            : "text-(--text-description)"
        }`}
      >
        {label}
      </span>
    </li>
  );
}

function ActiveBadge() {
  return (
    <span className="flex h-9 w-36 shrink-0 items-center justify-center gap-2 rounded-3xl bg-primary-300/10 px-3.5">
      <span aria-hidden="true" className="size-3.5 rounded-full bg-(--icon-hover-2)" />
      <span className="font-inter text-base font-medium text-(--icon-hover-2)">
        Plano activo
      </span>
    </span>
  );
}

function PlanArt({ muted = false }: { muted?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-[7.33px] right-0 hidden h-52 w-96 overflow-hidden xl:block"
    >
      <Image
        src={muted ? planIllustrationPremium : planIllustration}
        alt=""
        width={360}
        height={210}
        unoptimized
        draggable={false}
        className="absolute left-0 top-0 h-[210px] w-[360px] max-w-none select-none"
      />
    </div>
  );
}

function PlansCard() {
  return (
    <div className="flex flex-col items-start justify-start gap-4 self-stretch lg:gap-8">
      <section
        aria-labelledby="settings-free-plan-title"
        className="flex flex-col items-start justify-start gap-4 self-stretch rounded-2xl border border-(--card-barras) bg-(--settings-bg-config-card) p-6"
      >
        <div className="flex items-center justify-start gap-6 self-stretch">
          <div className="flex items-center justify-start gap-3">
            <CrownIcon
              aria-hidden="true"
              className="size-6 shrink-0 text-(--icon-hover-2)"
            />
            <h2
              id="settings-free-plan-title"
              className="font-manrope text-lg font-bold leading-7 text-(--text)"
            >
              Plano Gratuito
            </h2>
          </div>
          <ActiveBadge />
        </div>

        <div className="relative flex items-start justify-start gap-2.5 self-stretch">
          <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-4 overflow-hidden xl:max-w-[1450px] xl:pr-[400px]">
            <div className="flex flex-col items-start justify-start self-stretch">
              <h3 className="self-stretch font-manrope text-2xl font-bold leading-9 text-(--text-title)">
                Você está no plano gratuito
              </h3>
              <p className="self-stretch font-manrope text-base font-normal text-(--text)">
                Aproveite as funcionalidades essenciais para começar a gerir o
                seu dinheiro.
              </p>
            </div>
            <ul className="flex flex-col items-start justify-start gap-2 self-stretch overflow-hidden">
              {FREE_FEATURES.map((feature) => (
                <PlanFeature key={feature} label={feature} />
              ))}
            </ul>
          </div>
          <PlanArt />
        </div>
      </section>

      <section
        aria-labelledby="settings-premium-plan-title"
        className="flex flex-col items-start justify-start gap-4 self-stretch rounded-2xl border border-(--card-barras) bg-(--settings-bg-config) p-6"
      >
        <div className="flex items-center justify-start gap-6 self-stretch">
          <div className="flex items-center justify-start gap-3">
            <CrownIcon
              aria-hidden="true"
              className="size-6 shrink-0 text-(--icon)"
            />
            <h2
              id="settings-premium-plan-title"
              className="font-manrope text-lg font-bold leading-7 text-(--text-description-60)"
            >
              Plano Premium
            </h2>
          </div>
        </div>

        <div className="relative flex items-start justify-start gap-2.5 self-stretch">
          <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-4 overflow-hidden xl:max-w-[1450px] xl:pr-[400px]">
            <div className="flex flex-col items-start justify-start self-stretch">
              <h3 className="self-stretch font-manrope text-2xl font-bold leading-9 text-(--text-description-60)">
                Brevemente
              </h3>
              <p className="self-stretch font-manrope text-base font-normal text-(--text-description-60)">
                Recursos avançados para acelerar a sua vida financeira.
              </p>
            </div>
            <ul className="flex flex-col items-start justify-start gap-2 self-stretch overflow-hidden">
              {PREMIUM_FEATURES.map((feature) => (
                <PlanFeature key={feature} label={feature} muted />
              ))}
            </ul>
          </div>
          <PlanArt muted />
        </div>
      </section>
    </div>
  );
}

export default PlansCard;
