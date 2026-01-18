"use client";

import React from "react";
import Image from "next/image";
import { user as avatar } from "@/constants/images";
import { HelpIcon, LogoutIcon } from "@/constants/icons";
import { BottomNavigation } from "@/ui/organisms";
import { useRouter } from "next/navigation";
import useRegisterContext from "@/contexts/use-register-context";
const ProfileScreen: React.FC = () => {
  const { user, logoutUser } = useRegisterContext();

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleSupportClick = () => {
    if (typeof window !== "undefined") {
      window.open(
        "mailto:Support@wundu.tech?subject=Suporte%20e%20feedback",
        "_blank",
      );
    }
  };

  const menuItems = [
    {
      icon: <HelpIcon className="text-gray-600" />,
      text: "Suporte e Feedback",
      action: handleSupportClick,
    },
    {
      icon: <LogoutIcon className="text-red-500" />,
      text: "Sair",
      action: handleLogout,
    },
  ];

  const handleMenuClick = (item: (typeof menuItems)[0]) => {
    // if (item.route) {
    //   router.push(item.route); // Navega para a rota especificada
    // } else
    if (item.action) {
      item.action();
    }
  };

  return (
    <div className="flex flex-col justify-center h-full my-5 bg-gray-50">
      {/* Conteúdo principal */}
      <div className="flex-1 justify-center flex flex-col overflow-auto pb-20">
        {/* Header do perfil */}
        <div className="bg-white rounded-2xl mx-5 p-4 border border-gray-200">
          <div className="flex flex-col items-center justify-between">
            <div className="flex flex-col justify-center mt-4 space-y-6 items-center space-x-3">
              <div className="relative">
                <div className="p-1 rounded-full border-2 border-yellow-400 bg-white">
                  <div className="bg-white p-2 rounded-full relative">
                    <Image
                      src={avatar}
                      alt={user?.name || "Usuário"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 right-1 p-1 bg-white rounded-full shadow-md border border-yellow-400">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {user?.name}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Opções */}
        <div className="p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => handleMenuClick(item)}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl">{item.icon}</div>
                  <span
                    className={`text-sm font-medium ${
                      item.text === "Sair" ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
                {item.text === "Sair" ? null : (
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ProfileScreen;
