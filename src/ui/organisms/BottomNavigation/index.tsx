"use client";
import { ROUTES } from "@/constants/routes";
import BottomNavItem from "@/ui/molecules/BottomNavItem";
import {
  ChartIcon,
  GoalsIcon,
  HomeIcon,
  PlusIcon,
  ScanIcon,
} from "@/constants/icons";
import { useRoutes } from "@/hooks/useRoutes";

const BottomNavigation = () => {
  const { financial } = useRoutes();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 border-t border-slate-200/70 flex justify-around items-center py-3 px-6 md:hidden backdrop-blur-sm">
      <BottomNavItem icon={<HomeIcon />} label="Home" href={ROUTES.HOME} />
      <BottomNavItem icon={<ScanIcon />} label="Scan" href={ROUTES.SCAN} />
      <BottomNavItem
        icon={<GoalsIcon />}
        label="Objectivos"
        href={ROUTES.FINANCIAL}
      />
      {/* <button
        type="button"
        onClick={financial}
        aria-label="Acessar finanças"
        className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white flex items-center justify-center border border-white/60 shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <PlusIcon className="w-7 h-7 text-white -translate-y-[1px]" />
      </button> */}
      {/* <BottomNavItem icon={<LibraryIcon />} label="Biblioteca" href={ROUTES.LIBRARY} /> */}
      <BottomNavItem
        icon={<ChartIcon />}
        label="Gráfico"
        href={ROUTES.CONTROL_PANEL}
      />
    </nav>
  );
};

export default BottomNavigation;
