"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { logotype } from "@/constants/images";
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
        <Image src={logotype} alt="Logo" className="h-8 w-auto" />
      </div>
    </div>
  );
};

export default Header;
