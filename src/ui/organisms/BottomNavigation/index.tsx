"use client";
import { ROUTES } from "@/constants/routes";
import BottomNavItem from "@/ui/molecules/BottomNavItem";
import { ChartIcon, GoalsIcon, HomeIcon, UploadIcon } from "@/constants/icons";

const navItems = [
  { icon: <HomeIcon className="w-5 h-5" />, label: "Home", href: ROUTES.HOME },
  {
    icon: <UploadIcon className="w-5 h-5" />,
    label: "Adicionar",
    href: ROUTES.SCAN,
  },
  { icon: <GoalsIcon className="w-5 h-5" />, label: "Objectivos", href: ROUTES.FINANCIAL },
  {
    icon: <ChartIcon className="w-4 h-4" />,
    label: "Análise",
    href: ROUTES.CONTROL_PANEL,
  },
];

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 border-t border-slate-200/60 backdrop-blur px-4 py-2 shadow-[0_-4px_20px_rgba(15,23,42,0.08)]">
      <div className="mx-auto flex max-w-md items-center justify-between">
        {navItems.map((item) => (
          <BottomNavItem key={item.href} {...item} />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
