"use client";
import { ROUTES } from "@/src/constants/routes";
import BottomNavItem from "../molecules/BottomNavItem";
import { ChartIcon, HomeIcon } from "@/src/constants/icons";
import Button from "../atoms/Button";
import { useRoutes } from "@/src/hooks/useRoutes";

const BottomNavigation = () => {
  const { financial } = useRoutes();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4 md:hidden">
      <BottomNavItem icon={<HomeIcon />} label="Home" href={ROUTES.HOME} />
      {/* <BottomNavItem icon={<ScanIcon />} label="Scan" href={ROUTES.SCAN} /> */}
      <Button
        className="bg-yellow-400 rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-200 active:scale-95"
        variant="fab"
        onClick={financial}
      />
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
