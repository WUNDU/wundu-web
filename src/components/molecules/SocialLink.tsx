import React from "react";
import { LucideIcon } from "lucide-react";

interface SocialLinkProps {
  href: string;
  icon: LucideIcon;
  color: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon, color }) => {
  return (
    <a
      href={href}
      className={`text-gray-500 hover:${color} transition-all duration-300 transform hover:scale-110`}
    >
      <Icon className="w-6 h-6" />
    </a>
  );
};

export default SocialLink;
