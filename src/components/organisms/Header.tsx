'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import BackArrow from "../icons/BackArrow";
import IconButton from "../atoms/IconButton";
import { logo } from "@/src/constants/images";

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex w-full items-center justify-between p-4">
      {onBack && (
        <IconButton onClick={handleBack} aria-label="Voltar" className="w-6 h-6 flex items-center justify-center">
          <BackArrow />
        </IconButton>
      )}
      <div className="flex-1 flex justify-center">
        <Image src={logo} alt="Logo" className="w-16 h-16" />
      </div>
    </div>
  );
};

export default Header;
