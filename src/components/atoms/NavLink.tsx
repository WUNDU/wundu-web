const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <a href={href} className="text-gray-600 hover:text-blue-900 transition">{children}</a>
);

export default NavLink