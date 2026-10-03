import React from "react";

type DropmenuSelectProps = {
  options: string[];
  value?: string;
  isOpen: boolean;
  onSelect?: (value: string) => void;
};

function DropmenuSelect({ options, value, isOpen, onSelect }: DropmenuSelectProps) {
  if (!isOpen) return null;

  return (
    <article className="flex w-full flex-col items-start rounded-2xl border border-(--card-barras) bg-(--background) p-2">
      <ul className="flex flex-col items-start gap-1 self-stretch">
        {options.map((option) => {
          const isActive = option === value;
          return (
            <li key={option} className="flex flex-col items-start self-stretch">
              <button
                type="button"
                onClick={() => onSelect?.(option)}
                aria-current={isActive || undefined}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 hover:bg-(--bg-filter) ${
                  isActive ? "bg-primary-300/10" : ""
                }`}
              >
                <span
                  className={`truncate font-manrope text-[14px] font-semibold leading-[155.99%] ${
                    isActive ? "text-primary-300" : "text-(--text)"
                  }`}
                >
                  {option}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default DropmenuSelect;
