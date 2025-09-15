import AddButton from '../atoms/AddButton'; // Or wherever you placed it
import BottomNavItem from '../molecules/BottomNavItem';
import { HomeIcon, LibraryIcon, ScanIcon } from 'lucide-react';
import { ProfileIcon } from '@/src/constants/icons';

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4 md:hidden">
      <BottomNavItem icon={<HomeIcon />} label="Home" href="/home" />
      <BottomNavItem icon={<ScanIcon />} label="Scan" href="/scan" />
      <AddButton />
      <BottomNavItem icon={<LibraryIcon />} label="Biblioteca" href="/library" />
      <BottomNavItem icon={<ProfileIcon />} label="Perfil" href="/profile" />
    </nav>
  );
};

export default BottomNavigation;