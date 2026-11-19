import { Trophy } from "lucide-react";
import { formatAOA } from "../../utils/format-AOA";

export type Achievement = {
  title: string;
  saved: number;
};

function Achievements({ achievements = [] }: { achievements?: Achievement[] }) {
  const count = achievements.length;
  return (
    <section
      aria-labelledby="achievements-title"
      className="flex flex-col items-start justify-start gap-3 self-stretch rounded-xl border border-(--card-barras) bg-(--bg-card) p-4 lg:gap-4 lg:p-6"
    >
      <div className="flex items-start justify-start gap-2.5">
        <span className="hidden lg:flex" aria-hidden="true">
          <Trophy width={20} height={20} className="text-(--icon-hover)" />
        </span>
        <div className="flex flex-col items-start justify-start gap-1">
          <h2
            id="achievements-title"
            className="font-manrope text-base font-bold leading-7 text-(--text-title) lg:text-lg"
          >
            Minhas Conquistas
          </h2>
          <p className="font-manrope text-xs font-normal leading-5 text-(--text-description-60) lg:text-sm">
            {count === 0
              ? "Ainda sem objectivos alcançados"
              : `${count} objectivo${count === 1 ? "" : "s"} alcançado${count === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      {count === 0 ? (
        <p className="font-manrope text-sm font-normal leading-5 text-(--text-description)">
          Conclua uma meta para ver a sua conquista aqui.
        </p>
      ) : (
        <ul className="grid w-full grid-cols-1 content-start items-stretch justify-start gap-2 self-stretch sm:grid-cols-2">
          {achievements.map((achievement, index) => (
            <li
              key={`${achievement.title}-${index}`}
              className="flex min-w-0 w-full flex-col items-start justify-start gap-1.5 rounded-xl border border-(--card-barras) bg-(--bg-card) px-4 py-4 sm:px-6"
            >
              <article className="flex min-w-0 items-start justify-start gap-3 self-stretch">
                <h3 className="min-w-0 flex-1 break-words font-manrope text-base font-bold leading-6 text-(--text-title)">
                  {achievement.title}
                </h3>
                <span className="mt-0.5 flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-success px-3 py-1 font-manrope text-xs font-bold text-base-white">
                  Concluída
                </span>
              </article>
              <p className="flex min-w-0 flex-wrap items-center justify-start gap-x-1.5 gap-y-0.5 self-stretch">
                <span className="shrink-0 font-manrope text-sm font-medium leading-5 text-(--text-description-60)">
                  Valor poupado:
                </span>
                <span className="min-w-0 flex-1 break-words font-manrope text-sm font-normal leading-5 text-(--text-description)">
                  {formatAOA(achievement.saved)}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Achievements;
