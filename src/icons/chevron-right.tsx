"use client";

import React from "react";

const ChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    className={props.className ?? "h-4 w-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m9 5 7 7-7 7"
    />
  </svg>
);

export default ChevronRight;
