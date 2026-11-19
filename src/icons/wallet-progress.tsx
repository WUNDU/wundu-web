const WalletProgress = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      {...props}
    >
      <path
        d="M18.04 12.507C17.62 12.917 17.38 13.507 17.44 14.137C17.53 15.217 18.52 16.007 19.6 16.007H21.5V17.197C21.5 19.267 19.81 20.957 17.74 20.957H6.26C4.19 20.957 2.5 19.267 2.5 17.197V10.467C2.5 8.39704 4.19 6.70703 6.26 6.70703H17.74C19.81 6.70703 21.5 8.39704 21.5 10.467V11.907H19.48C18.92 11.907 18.41 12.127 18.04 12.507Z"
        stroke="CurrentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 11.3663V6.7964C2.5 5.6064 3.23 4.54636 4.34 4.12636L12.28 1.12636C13.52 0.656359 14.85 1.57639 14.85 2.90639V6.70638"
        stroke="CurrentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.5588 12.9282V14.9882C22.5588 15.5382 22.1188 15.9882 21.5588 16.0082H19.5988C18.5188 16.0082 17.5288 15.2182 17.4388 14.1382C17.3788 13.5082 17.6188 12.9182 18.0388 12.5082C18.4088 12.1282 18.9188 11.9082 19.4788 11.9082H21.5588C22.1188 11.9282 22.5588 12.3782 22.5588 12.9282Z"
        stroke="CurrentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 10.957H14"
        stroke="CurrentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default WalletProgress;
