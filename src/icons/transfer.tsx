const Transfer = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 17H4m13-3s3 2.21 3 3s-3 3-3 3M5 7h15M7 4S4 6.21 4 7s3 3 3 3"
      ></path>
    </svg>
  );
};

export default Transfer;
