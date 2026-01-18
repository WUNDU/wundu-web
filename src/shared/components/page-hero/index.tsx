import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/shared/components";

interface PageHeroProps {
  title: string | React.ReactNode;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  gradientColors?: string;
  centered?: boolean;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  description,
  showButton = false,
  buttonText = "Experimente agora - É grátis",
  gradientColors = "from-yellow-400 to-blue-500",
  centered = true,
}) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  const renderTitle = () => {
    if (typeof title === "string") {
      return (
        <span className={`text-gradient bg-gradient-to-r ${gradientColors}`}>
          {title}
        </span>
      );
    }
    return title;
  };

  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #00216b 0%, #003cc3 50%, #003cc3 100%)",
      }}
    >
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary-dark/30 via-secondary/20 to-primary/10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20 animate-pulse-slow"></div>

      {/* Floating Elements with Parallax */}
      <div
        className="absolute top-20 left-20 w-32 h-32 rounded-full blur-xl animate-float transform-gpu"
        style={{ backgroundColor: "rgba(255, 212, 0, 0.2)" }}
      ></div>
      <div
        className="absolute bottom-20 right-20 w-24 h-24 rounded-full blur-lg animate-float-delayed transform-gpu"
        style={{ backgroundColor: "rgba(202, 111, 5, 0.3)" }}
      ></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full blur-md animate-bounce-soft"></div>
      <div
        className="absolute top-1/3 right-10 w-20 h-20 rounded-full blur-lg animate-float"
        style={{ backgroundColor: "rgba(255, 212, 0, 0.15)" }}
      ></div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-primary/30 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-secondary/20 to-transparent rounded-full blur-2xl animate-float-delayed"></div>

      <div
        className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${centered ? "text-center" : ""} relative z-10`}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight fade-in-section animate-in mb-6">
          {renderTitle()}
        </h1>

        {description && (
          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto fade-in-section animate-in delay-2 leading-relaxed">
            {description}
          </p>
        )}

        {showButton && (
          <div className="mt-12 fade-in-section animate-in delay-4">
            <button
              onClick={handleLogin}
              className="relative group px-8 md:px-12 py-4 md:py-5 font-bold text-lg md:text-xl text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-glow-primary active:scale-95 overflow-hidden animate-bounce-gentle md:animate-none"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span>{buttonText}</span>
                <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/50 to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
