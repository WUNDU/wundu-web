import { LogoProps } from "@/src/types/logo";

const Logo: React.FC<LogoProps> = ({ src }) => {
  return (
    <div className="h-16 w-16">
      <img src={src} alt="Logo" />
    </div>
  );
};
export default Logo;
