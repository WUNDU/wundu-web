"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { logo } from "@/constants/images";
import { BackArrowIcon } from "@/constants/icons";
import { Button } from "@/components/ui";

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
    <div className="flex flex-col gap-4 w-full justify-between">
      {onBack && (
        <Button
          variant="icon"
          onClick={handleBack}
          aria-label="Voltar"
          className="w-7 h-7 flex items-center justify-center"
        >
          <BackArrowIcon />
        </Button>
      )}
      <div className="flex-1 flex ">
        <Image src={logo} alt="Logo" className="w-12 h-12" />
      </div>
    </div>
  );
};

export default Header;
