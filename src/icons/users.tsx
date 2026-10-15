const Users = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M13 11a4 4 0 1 0-8 0a4 4 0 0 0 8 0"></path>
        <path d="M11.039 7.558a4 4 0 1 1 1.923 2.885M15 21a6 6 0 0 0-12 0"></path>
        <path d="M21 17a6 6 0 0 0-6-6"></path>
      </g>
    </svg>
  );
};

export default Users;
