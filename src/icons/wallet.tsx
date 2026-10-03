const Wallet = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2em"
      height="2em"
      viewBox="0 0 512 512"
      {...props}
    >
      <rect
        width={416}
        height={288}
        x={48}
        y={144}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
        rx={48}
        ry={48}
      ></rect>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M411.36 144v-30A50 50 0 0 0 352 64.9L88.64 109.85A50 50 0 0 0 48 159v49"
      ></path>
      <path
        fill="currentColor"
        d="M368 320a32 32 0 1 1 32-32a32 32 0 0 1-32 32"
      ></path>
    </svg>
  );
};

export default Wallet;
