import CheckIcon from "@/icons/check";
import type { AccountDTO } from "../mock/account";
import { formatAOA } from "../../utils/format-AOA";

type AccountItemProps = {
  account: AccountDTO;
  selected?: boolean;
  onToggle?: (account: AccountDTO) => void;
  onSelect?: (account: AccountDTO) => void;
};

function AccountItem({ account, selected = false, onToggle, onSelect }: AccountItemProps) {
  return (
    <article
      onClick={onSelect ? () => onSelect(account) : undefined}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.target instanceof HTMLInputElement) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(account);
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      className={`group flex h-20 items-center justify-start gap-3 self-stretch border-b border-(--border-button) px-4 py-3 transition-all duration-200 hover:rounded-3xl hover:border-transparent hover:bg-(--bg-list) has-checked:rounded-3xl has-checked:border-transparent has-checked:bg-(--bg-list) ${
        onSelect ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex flex-1 items-center justify-start gap-6 px-2 py-1.5">
        {/* Checkbox — marca ao passar o mouse na linha */}
        <span
          onClick={(event) => event.stopPropagation()}
          className="relative flex size-4 shrink-0 items-center justify-center"
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle?.(account)}
            onClick={(event) => event.stopPropagation()}
            aria-label={`Selecionar ${account.name}`}
            className="peer size-4 cursor-pointer appearance-none rounded-sm border border-(--border-hover) bg-transparent transition-colors group-hover:border-primary-300 group-hover:bg-primary-300 checked:border-primary-300 checked:bg-primary-300 focus:outline-none"
          />
          <CheckIcon className="pointer-events-none absolute inset-0 m-auto size-3 text-white opacity-0 transition-opacity group-hover:opacity-100 peer-checked:opacity-100" />
        </span>

        <span
          aria-hidden="true"
          className={`size-10 shrink-0 rounded-full ${account.dotClassName ?? "bg-success"}`}
        />

        <div className="flex flex-1 flex-col items-start justify-center gap-1 self-stretch">
          <h3 className="self-stretch truncate font-manrope text-base font-bold text-(--text-title)">
            {account.name}
          </h3>
          {account.kind ? (
            <p className="font-manrope text-sm font-normal leading-5 text-(--text-description)">
              {account.kind}
            </p>
          ) : null}
        </div>
      </div>

      <p className="text-right font-inter text-base font-semibold text-(--text-title)">
        {formatAOA(account.balance)}
      </p>
    </article>
  );
}

export default AccountItem;
