import type { AccountDTO } from "../mock/account";
import { formatAOA } from "../../utils/format-AOA";
import AccountItem from "./AccountItem";

type AccountListProps = {
  accounts: AccountDTO[];
  selectedIds?: Set<string> | string[];
  onToggle?: (account: AccountDTO) => void;
  onSelect?: (account: AccountDTO) => void;
};

function AccountList({ accounts, selectedIds, onToggle, onSelect }: AccountListProps) {
  const isSelected = (id: string) =>
    Array.isArray(selectedIds)
      ? selectedIds.includes(id)
      : (selectedIds?.has(id) ?? false);

  const total = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <section
      aria-label="Contas"
      className="flex flex-col items-start justify-start gap-3 self-stretch"
    >
      {accounts.length === 0 ? (
        <p className="font-manrope text-sm text-(--text-description)">
          Nenhuma conta encontrada.
        </p>
      ) : (
        <>
          <ul className="flex flex-col items-start justify-start gap-2 self-stretch">
            {accounts.map((account) => (
              <li key={account.id} className="flex flex-col self-stretch">
                <AccountItem
                  account={account}
                  selected={isSelected(account.id)}
                  onToggle={onToggle}
                  onSelect={onSelect}
                />
              </li>
            ))}
          </ul>
          <footer className="flex h-4 items-center justify-end self-stretch">
            <div className="flex items-center justify-start px-4">
              <p className="font-manrope text-base font-medium text-(--text-description)">
                TOTAL
              </p>
              <p className="w-44 text-right font-inter text-lg font-bold leading-7 text-(--text-title)">
                {formatAOA(total)}
              </p>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}

export default AccountList;
