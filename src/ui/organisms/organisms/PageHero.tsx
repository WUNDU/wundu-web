import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";
import Button from "../atoms/Button";

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
  gradientColors = "from-yellow-400 to-orange-500",
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
    <section className="hero-bg pt-28 pb-20 md:pt-36 md:pb-28 border-2 mx-2 my-5 shadow-2xs border-gray-100 relative overflow-hidden rounded-2xl">
      {/* Background Pattern - igual ao da landing page */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-blue-600/10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20"></div>

      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
          centered ? "text-center" : ""
        } relative z-10`}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight fade-in-section animate-in mb-6">
          {renderTitle()}
        </h1>

        {description && (
          <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-3xl mx-auto fade-in-section animate-in delay-2 leading-relaxed">
            {description}
          </p>
        )}

        {showButton && (
          <div className="mt-12 fade-in-section animate-in delay-4">
            <Button
              variant="landing"
              onClick={handleLogin}
              className="py-2 md:px-12 md:py-5 font-bold rounded-full inline-flex items-center space-x-3 md:text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
