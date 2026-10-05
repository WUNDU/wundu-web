"use client";

type TransactionPaginationProps = {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  /** Nome dos itens no contador (ex.: "categorias"). Por omissão "transações". */
  itemName?: string;
  /** Rótulo aria da navegação. Por omissão "Paginação de transações". */
  navLabel?: string;
};

function pageItems(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 4)
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  const set = new Set([1, 2, page - 1, page, page + 1, pageCount]);
  const nums = [...set].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

export default function TransactionPagination({
  page,
  pageCount,
  total,
  pageSize,
  onChange,
  itemName = "transações",
  navLabel = "Paginação de transações",
}: TransactionPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label={navLabel}
      className="flex items-center justify-center gap-2 self-stretch px-6 py-2 lg:justify-between lg:gap-4 lg:px-8 lg:py-4"
    >
      <p className="hidden flex-1 font-manrope text-sm font-normal leading-5 text-(--text-description) lg:block">
        Exibindo {from}–{to} de {total} {itemName}
      </p>
      <ul className="flex items-center gap-1">
        <li>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            aria-label="Página anterior"
            className="rounded-md px-3 py-1 font-manrope text-sm font-semibold leading-5 text-(--text-description) transition-colors duration-150 hover:bg-(--background-variant) hover:text-(--text-title) disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-(--text-description) lg:py-1.5"
          >
            Anterior
          </button>
        </li>
        <li
          aria-hidden="true"
          className="flex min-w-8 items-center justify-center rounded-md bg-(--background-variant) px-2 py-1 text-center font-manrope text-sm font-semibold leading-5 text-(--text-title) lg:hidden"
        >
          {page}/{pageCount}
        </li>
        <span className="sr-only lg:hidden">
          Página {page} de {pageCount}
        </span>
        {pageItems(page, pageCount).map((item, i) =>
          item === "…" ? (
            <li
              key={`gap-${i}`}
              aria-hidden="true"
              className="hidden lg:block"
            >
              <span className="flex justify-center px-3 py-1.5 font-manrope text-sm font-semibold leading-5 text-(--text-description)">
                …
              </span>
            </li>
          ) : (
            <li key={item} className="hidden lg:block">
              <button
                type="button"
                onClick={() => onChange(item)}
                aria-label={`Página ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={`min-w-8 rounded-md px-2 py-1.5 text-center font-manrope text-sm font-semibold leading-5 transition-colors duration-150 ${
                  item === page
                    ? "bg-(--bg-button) text-(--button-fg)"
                    : "text-(--text-description) hover:bg-(--background-variant) hover:text-(--text-title)"
                }`}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() => onChange(page + 1)}
            aria-label="Próxima página"
            className="rounded-md px-3 py-1 font-manrope text-sm font-semibold leading-5 text-(--text-description) transition-colors duration-150 hover:bg-(--background-variant) hover:text-(--text-title) disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-(--text-description) lg:py-1.5"
          >
            Próximo
          </button>
        </li>
      </ul>
    </nav>
  );
}
