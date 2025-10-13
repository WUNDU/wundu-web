import { ROUTES } from '@/src/constants/routes';
import AddButton from '../atoms/AddButton'; // Or wherever you placed it
import BottomNavItem from '../molecules/BottomNavItem';
import { ChartIcon, HomeIcon, LibraryIcon, ProfileIcon, ScanIcon } from '@/src/constants/icons';

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4 md:hidden">
      <BottomNavItem icon={<HomeIcon />} label="Home" href={ROUTES.HOME} />
      {/* <BottomNavItem icon={<ScanIcon />} label="Scan" href={ROUTES.SCAN} /> */}
      <AddButton />
      {/* <BottomNavItem icon={<LibraryIcon />} label="Biblioteca" href={ROUTES.LIBRARY} /> */}
      <BottomNavItem icon={<ChartIcon />} label="Gráfico" href={ROUTES.CONTROL_PANEL} />
    </nav>
  );
};

export default BottomNavigation;