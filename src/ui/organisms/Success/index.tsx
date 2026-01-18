import { Button } from "@/ui/atoms";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import {
  CheckmarkIcon,
  MoneyBagIcon,
  ChartIcon,
  GoalsIcon,
} from "@/constants/icons";
import useRegisterContext from "@/contexts/use-register-context";
import { useEffect, useState } from "react";

const Success = () => {
  const { data, loginUser } = useRegisterContext();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [autoLoginError, setAutoLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = async () => {
    if (isLoggingIn) return;

    const email = data.email;
    const password = data.password;

    if (!email || !password) {
      setAutoLoginError(
        "Não conseguimos recuperar suas credenciais. Faça login manualmente.",
      );
      return;
    }

    setAutoLoginError(null);
    setIsLoggingIn(true);

    try {
      await loginUser(email, password);
      router.replace(ROUTES.HOME);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível entrar automaticamente. Faça login manualmente.";
      setAutoLoginError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };
  return (
    <div className="flex m-4 flex-col h-full justify-center items-center text-center p-8 md:p-0 md:gap-6 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              isVisible ? "animate-float-particle" : "opacity-0"
            }`}
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background:
                i % 3 === 0
                  ? "linear-gradient(45deg, #10b981, #3b82f6)"
                  : i % 3 === 1
                    ? "linear-gradient(45deg, #ffd400, #ca6f05)"
                    : "linear-gradient(45deg, #8b5cf6, #ec4899)",
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Success Glow Effect */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          isVisible ? "opacity-20" : "opacity-0"
        }`}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-green-200 via-green-100 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Success Icon with Pulse Animation */}
      <div
        className={`relative transition-all duration-1000 ease-out transform ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-50 opacity-0 translate-y-8"
        }`}
      >
        <div className="w-24 h-24 mb-8 md:mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 shadow-lg relative">
          {/* Pulse Rings */}
          <div
            className={`absolute inset-0 rounded-full bg-green-200 ${
              isVisible ? "animate-ping" : ""
            }`}
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className={`absolute inset-0 rounded-full bg-green-300 ${
              isVisible ? "animate-ping" : ""
            }`}
            style={{ animationDelay: "0.7s" }}
          />

          <CheckmarkIcon
            className={`w-16 h-16 text-green-600 relative z-10 transition-all duration-700 ease-out transform ${
              isVisible
                ? "scale-100 rotate-0 translate-y-1"
                : "scale-0 rotate-180 translate-y-1"
            }`}
            style={{ transitionDelay: "0.3s" }}
          />
        </div>
      </div>

      {/* Title with Slide Up Animation */}
      <h1
        className={`text-3xl md:text-2xl font-bold text-gray-800 transition-all duration-800 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: "0.6s" }}
      >
        Cadastro finalizado com sucesso
      </h1>

      {/* Subtitle with Fade In Animation */}
      <p
        className={`mt-2 text-gray-600 max-w-sm mx-auto transition-all duration-800 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: "0.8s" }}
      >
        Bem-vindo,{" "}
        <span className="font-semibold text-green-600">{data.name}</span>! O
        caminho para a liberdade financeira começa agora.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        {autoLoginError
          ? autoLoginError
          : isLoggingIn
            ? "Entrando..."
            : "Clique no botão abaixo para acessar sua conta."}
      </p>

      {/* Financial Icons */}
      <div
        className={`flex space-x-4 mt-4 transition-all duration-800 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: "1s" }}
      >
        {[
          { Icon: MoneyBagIcon, color: "text-green-500" },
          { Icon: ChartIcon, color: "text-blue-500" },
          { Icon: GoalsIcon, color: "text-yellow-500" },
        ].map(({ Icon, color }, i) => (
          <div
            key={i}
            className={`w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md ${
              isVisible ? "animate-bounce" : ""
            }`}
            style={{ animationDelay: `${1.2 + i * 0.2}s` }}
          >
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        ))}
      </div>

      {/* Button with Slide Up and Scale Animation */}
      <div
        className={`fixed bottom-0 left-0 right-0 p-4 md:static md:p-0 md:w-full md:max-w-sm transition-all duration-800 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
        style={{ transitionDelay: "1.4s" }}
      >
        <Button
          onClick={handleContinue}
          type="button"
          disabled={isLoggingIn}
          className="hover:scale-105 transition-transform duration-300 ease-out disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? "Entrando..." : "Ir para o app"}
        </Button>
      </div>
    </div>
  );
};

export default Success;
