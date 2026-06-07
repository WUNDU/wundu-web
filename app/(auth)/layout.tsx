"use client";
import { useUserStore } from "@/store/user-store";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { ROUTES } from "@/constants/routes";
import { LoadingProvider } from "@/contexts/loading-context";
import { motion } from "framer-motion";
import { MessageCircle, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";

const MaintenanceOverlay: React.FC = () => {
  const whatsappLink =
    "https://chat.whatsapp.com/C0gVUnIB9OaHnAZAiiLJmQ?mode=gi_t";
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-secondary to-secondary-dark px-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,212,0,0.1)_0%,transparent_60%)] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 md:mb-16 shrink-0 z-10"
      >
        <Image
          src="/assets/logotype.svg"
          alt="Wundu"
          width={200}
          height={80}
          className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto block mx-auto"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl w-full z-10"
      >
        <h1 className="mb-6 text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-none uppercase text-balance">
          Estamos a <br />
          <span className="text-primary drop-shadow-2xl">Evoluir.</span>
        </h1>
        <p className="mb-12 text-base sm:text-lg md:text-xl lg:text-2xl text-blue-50/70 font-medium max-w-2xl mx-auto leading-relaxed">
          A Wundu está a implementar uma infraestrutura financeira de nova
          geração. Pausa por tempo indeterminado para garantirmos a excelência
          técnica.
        </p>
        <div className="flex flex-col items-center gap-8 sm:gap-10">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 sm:gap-4 rounded-2xl bg-[#25D366] px-6 py-4 sm:px-10 sm:py-5 text-base sm:text-lg md:text-xl font-bold text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="h-5 w-5 sm:h-7 sm:w-7 fill-white" />
            Comunidade WhatsApp
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <div className="flex flex-col items-center gap-2 text-white/40">
            <div className="flex items-center gap-3 text-sm sm:text-base font-bold uppercase tracking-widest">
              <Mail className="h-5 w-5" />
              <span>Aviso por e-mail na reabertura</span>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="absolute bottom-10 text-[10px] font-bold uppercase tracking-[0.6em] text-white/10 z-10">
        © {new Date().getFullYear()} ONEWUNDU. Todos os direitos reservados.
      </div>
    </div>
  );
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, initializeAuth } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  // Alterar para false quando os problemas técnicos forem resolvidos
  const launchDate = new Date("2026-06-08T18:00:00");
  const isMaintenance = new Date() < launchDate;
  // new Date() < launchDate;

  // These pages must remain accessible even when authenticated
  const isVerifyPage =
    pathname === ROUTES.VERIFY_PENDING || pathname === ROUTES.VERIFY_EMAIL;

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && !isVerifyPage) {
        router.push(ROUTES.HOME);
      }
      setChecked(true);
    }
  }, [isAuthenticated, isLoading, router, isVerifyPage]);

  if (!checked || (isAuthenticated && !isVerifyPage)) {
    return null;
  }

  if (isMaintenance) {
    return <MaintenanceOverlay />;
  }

  return <LoadingProvider>{children}</LoadingProvider>;
}
