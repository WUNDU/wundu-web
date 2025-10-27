import { ModalIconProps } from "@/src/types/modal";
import React from "react";

export function ModalIcon({ type }: ModalIconProps) {
  const iconColors = {
    success:
      "border-green-50 bg-green-100 text-green-500 dark:bg-green-700 dark:border-green-600 dark:text-green-100",
    error:
      "border-red-50 bg-red-100 text-red-500 dark:bg-red-700 dark:border-red-600 dark:text-red-100",
    info: "border-blue-50 bg-blue-100 text-blue-500 dark:bg-blue-700 dark:border-blue-600 dark:text-blue-100",
  };

  const iconSvg = {
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={36}
        height={36}
        viewBox="0 0 36 36"
      >
        <path
          fill="currentColor"
          d="M13.72 27.69L3.29 17.27a1 1 0 0 1 1.41-1.41l9 9L31.29 7.29A1 1 0 0 1 32.7 8.7Z"
          className="clr-i-outline clr-i-outline-path-1"
        ></path>
        <path fill="none" d="M0 0h36v36H0z"></path>
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M11.001 10h2v5h-2zM11 16h2v2h-2z"></path>
        <path
          fill="currentColor"
          d="M13.768 4.2C13.42 3.545 12.742 3.138 12 3.138s-1.42.407-1.768 1.063L2.894 18.064a1.99 1.99 0 0 0 .054 1.968A1.98 1.98 0 0 0 4.661 21h14.678c.708 0 1.349-.362 1.714-.968a1.99 1.99 0 0 0 .054-1.968zM4.661 19L12 5.137L19.344 19z"
        ></path>
      </svg>
    ),
    info: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 16.5q.214 0 .357-.144T12.5 16v-4.5q0-.213-.144-.356T11.999 11t-.356.144t-.143.356V16q0 .213.144.356t.357.144M12 9.577q.262 0 .439-.177t.176-.438t-.177-.439T12 8.346t-.438.177t-.177.439t.177.438t.438.177M12.003 21q-1.867 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
        ></path>
      </svg>
    ),
  };

  return (
    <span
      className={`mb-4 inline-flex justify-center items-center size-8 rounded-full border-4 ${iconColors[type]}`}
    >
      {iconSvg[type]}
    </span>
  );
}
