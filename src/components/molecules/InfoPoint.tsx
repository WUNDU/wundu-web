import CheckmarkIcon from "../icons/CheckmarkIcon";

const InfoPoint = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center space-x-3">
    <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center">
      <CheckmarkIcon />
    </span>
    <span className="text-gray-700">{children}</span>
  </li>
);

export default InfoPoint;
