import { Fragment } from "react";
import { formatAOA } from "../../utils/format-AOA";

type ProfileStatsProps = {
  activeGoals: number;
  transactions: number;
  saved: number;
};

function ProfileStats({ activeGoals, transactions, saved }: ProfileStatsProps) {
  const stats = [
    { title: "Metas Criadas", description: "Objectivos activos", value: String(activeGoals) },
    { title: "Transações", description: "movimentos registados", value: String(transactions) },
    { title: "Total poupado", description: "nas metas", value: formatAOA(saved) },
  ];
  return (
    <section
      aria-label="Resumo da conta"
      className="flex self-stretch flex-col gap-0 rounded-2xl border border-(--card-barras) bg-(--bg-card) p-4 md:flex-row md:items-center lg:gap-4 lg:p-7"
    >
      {stats.map((stat, index) => (
        <Fragment key={stat.title}>
          <div className="flex flex-1 items-center justify-between gap-4 self-stretch py-3 lg:py-0">
            <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-0.5 lg:justify-center lg:gap-1 lg:px-6 lg:py-4">
              <p className="font-manrope text-sm font-bold leading-7 text-(--text-title) lg:text-lg">
                {stat.title}
              </p>
              <p className="font-manrope text-xs font-medium leading-5 text-(--text-description-60) lg:text-sm">
                {stat.description}
              </p>
            </div>
            <p className="shrink-0 text-right font-manrope text-lg font-extrabold leading-8 text-(--text-title) lg:font-inter lg:text-xl">
              {stat.value}
            </p>
            <span
              aria-hidden="true"
              className="hidden h-16 w-px shrink-0 bg-(--card-barras) md:block"
            />
          </div>
          {index < stats.length - 1 ? (
            <span
              aria-hidden="true"
              className="h-px w-full shrink-0 bg-(--card-barras) md:hidden"
            />
          ) : null}
        </Fragment>
      ))}
    </section>
  );
}

export default ProfileStats;
