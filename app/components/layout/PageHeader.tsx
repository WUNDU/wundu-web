import type { ReactNode } from "react";

type PageHeaderProps = {
  /** Título da página */
  title: string;
  /** Ações alinhadas à direita (botões, filtros, etc.) */
  children?: ReactNode;
};

function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="self-stretch h-20 px-8 py-4 flex flex-col justify-center items-start gap-2.5 border-b border-(--card-barras) bg-(--bg-card) shrink-0">
      <div className="self-stretch flex justify-between items-center">
        <div className="h-11 flex justify-start items-center gap-2">
          <h1 className="text-2xl not-italic font-bold font-manrope leading-9 text-(--text-title)">
            {title}
          </h1>
        </div>
        {children ? (
          <div className="flex justify-start items-center gap-3">{children}</div>
        ) : null}
      </div>
    </header>
  );
}

export default PageHeader;
