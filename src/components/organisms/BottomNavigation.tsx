import AddButton from '../atoms/AddButton'; // Or wherever you placed it
import Home from '../icons/Home';
import Scan from '../icons/Scan';
import Library from '../icons/Library';
import Profile from '../icons/Profile';
import BottomNavItem from '../molecules/BottomNavItem';

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4 md:hidden">
      <BottomNavItem icon={<Home />} label="Home" href="/home" />
      <BottomNavItem icon={<Scan />} label="Scan" href="/scan" />
      <AddButton />
      <BottomNavItem icon={<Library />} label="Biblioteca" href="/library" />
      <BottomNavItem icon={<Profile />} label="Perfil" href="/profile" />
    </nav>
  );
};

export default BottomNavigation;