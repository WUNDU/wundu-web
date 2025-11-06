import React from "react";

const DoneAll = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={2}
          d="m8 13l4.228 3.382a1 1 0 0 0 1.398-.148L22 6"
        ></path>
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="m11.19 12.237l4.584-5.604a1 1 0 0 0-1.548-1.266l-4.573 5.59zm-3.167 3.87l-1.537-1.28l-.653.798L2.6 13.2a1 1 0 0 0-1.2 1.6l3.233 2.425a2 2 0 0 0 2.748-.334z"
          clipRule="evenodd"
        ></path>
      </g>
    </svg>
  );
};

export default DoneAll;
