const CheckmarkIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <defs>
        <mask id="SVG9LXuEA4n">
          <g
            fill="none"
            strokeDasharray={24}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="#fff" strokeWidth={2} d="M2 13.5l4 4l10.75 -10.75">
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.5s"
                values="24;0"
              ></animate>
            </path>
            <path
              stroke="#000"
              strokeDashoffset={24}
              strokeWidth={6}
              d="M7.5 13.5l4 4l10.75 -10.75"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.5s"
                dur="0.3s"
                to={0}
              ></animate>
            </path>
          </g>
        </mask>
      </defs>
      <path
        fill="currentColor"
        d="M0 0h24v24H0z"
        mask="url(#SVG9LXuEA4n)"
      ></path>
      <path
        fill="none"
        stroke="currentColor"
        strokeDasharray={24}
        strokeDashoffset={24}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7.5 13.5l4 4l10.75 -10.75"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.5s"
          dur="0.3s"
          to={0}
        ></animate>
      </path>
    </svg>
  );
};
export default CheckmarkIcon;
