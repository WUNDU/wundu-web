import CheckIcon from "@/icons/check";
import React from "react";

function NotificationItem(item: NotificationProps) {
  return (
    <article
      className={`flex group shrink-0 p-4 flex-col items-start gap-3 rounded-2xl ${item.lida ? "bg-(--background)" : "bg-(--bg-notify-card)"} hover:bg-(--bg-notify-card-hover)`}
    >
      <section className="flex justify-between items-start flex-1 self-stretch">
        <div className="flex flex-col justify-between items-start flex-1 self-stretch">
          <h1 className="font-bold not-italic text-[16px] text-(--text) leading-normal">
            {item.title}
          </h1>
          <p className="font-medium not-italic text-[14px] text-(--text-description) leading-[155.99%] tracking-[-0.42px]">
            {item.description}
          </p>
          <span className="font-semibold not-italic text-[12px] text-primary-300 leading-[155.99%] pt-3 tracking-[-0.36px]">
            {item.date}
          </span>
        </div>
        {!item.lida && item.onMarkRead ? (
          <div className="flex flex-col justify-center items-center gap-1.5 self-stretch">
            <button
              type="button"
              onClick={() => item.onMarkRead?.(item.id)}
              disabled={item.marking}
              aria-label={`Marcar "${item.title}" como lida`}
              title="Marcar como lida"
              className="flex w-8 h-8 flex-col justify-center items-center rounded-lg hover:bg-primary-300/20 duration-300 disabled:cursor-wait disabled:opacity-50"
            >
              <CheckIcon className="w-4.5 h-4.5 shrink-0 text-base-neutrals" />
            </button>
          </div>
        ) : null}
      </section>
    </article>
  );
}

export default NotificationItem;
