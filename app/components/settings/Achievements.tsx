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
      className="flex flex-col items-start justify-start gap-5 self-stretch rounded-2xl border border-(--card-barras) bg-(--background) p-7"
    >
      <div className="flex items-start justify-start gap-2.5">
        <span className="flex py-1.5" aria-hidden="true">
          <Trophy width={20} height={20} className="text-(--icon-hover)" />
        </span>
        <div className="flex flex-col items-start justify-start gap-1">
          <h2
            id="achievements-title"
            className="font-manrope text-lg font-bold leading-7 text-(--text-title)"
          >
            Minhas Conquistas
          </h2>
          <p className="font-manrope text-sm font-normal leading-5 text-(--text-description-60)">
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
        <ul className="flex content-start items-start justify-start gap-2.5 self-stretch flex-wrap">
          {achievements.map((achievement, index) => (
            <li
              key={`${achievement.title}-${index}`}
              className="flex min-w-80 flex-1 flex-col items-start justify-start gap-1.5 rounded-xl border border-(--card-barras) bg-(--bg-card) px-6 py-4"
            >
              <article className="flex items-center justify-start gap-3 self-stretch">
                <h3 className="min-w-0 flex-1 truncate font-manrope text-base font-bold text-(--text-title)">
                  {achievement.title}
                </h3>
                <span className="flex shrink-0 items-center justify-center rounded-[20px] bg-success px-3.5 py-1 font-manrope text-xs font-bold text-white">
                  Concluída
                </span>
              </article>
              <p className="flex items-center justify-start gap-1.5">
                <span className="font-manrope text-sm font-medium leading-5 text-(--text-description-60)">
                  Valor poupado:
                </span>
                <span className="font-manrope text-sm font-normal leading-5 text-(--text-description)">
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
