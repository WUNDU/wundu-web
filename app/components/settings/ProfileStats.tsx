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
      className="flex self-stretch flex-col gap-4 rounded-2xl border border-(--card-barras) bg-(--background) p-7 md:flex-row md:items-center"
    >
      {stats.map((stat, index) => (
        <div key={stat.title} className="flex flex-1 items-center gap-4 self-stretch">
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-1 px-6 py-4">
            <p className="font-manrope text-lg font-bold leading-7 text-(--text-title)">
              {stat.title}
            </p>
            <p className="font-manrope text-sm font-medium leading-5 text-(--text-description-60)">
              {stat.description}
            </p>
          </div>
          <p className="shrink-0 text-right font-inter text-xl font-extrabold leading-8 text-(--text-title)">
            {stat.value}
          </p>
          {index < stats.length - 1 ? (
            <span
              aria-hidden="true"
              className="hidden h-16 w-px shrink-0 bg-(--card-barras) md:block"
            />
          ) : null}
        </div>
      ))}
    </section>
  );
}

export default ProfileStats;
