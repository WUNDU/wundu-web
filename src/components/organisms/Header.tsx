'use client';

import Image from "next/image";
import { logo } from "@/src/constants/images";
import { useRouter } from "next/navigation";

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
        <button onClick={handleBack} className="w-6 h-6 flex items-center justify-center">
          {/* Ícone de seta para voltar (pode ser um SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}
      <div className="flex-1 flex justify-center">
        <Image src={logo} alt="Logo" className="w-16 h-16" />
      </div>
    </div>
  );
};

export default Header;
