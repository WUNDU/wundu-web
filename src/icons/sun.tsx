import React from "react";

const Sun = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      {...props}
    >
      <path
        d="M26.9091 16H28M16 5.09091V4M16 28V26.9091M24.7273 24.7273L23.6364 23.6364M24.7273 7.27273L23.6364 8.36364M7.27273 24.7273L8.36364 23.6364M7.27273 7.27273L8.36364 8.36364M4 16H5.09091M16 22.5455C17.736 22.5455 19.4008 21.8558 20.6283 20.6283C21.8558 19.4008 22.5455 17.736 22.5455 16C22.5455 14.264 21.8558 12.5992 20.6283 11.3717C19.4008 10.1442 17.736 9.45455 16 9.45455C14.264 9.45455 12.5992 10.1442 11.3717 11.3717C10.1442 12.5992 9.45455 14.264 9.45455 16C9.45455 17.736 10.1442 19.4008 11.3717 20.6283C12.5992 21.8558 14.264 22.5455 16 22.5455Z"
        stroke="CurrentColor"
        strokeOpacity="var(--sun-opacity, 0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sun;
