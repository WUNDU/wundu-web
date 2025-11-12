import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/ui/atoms";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title = "Pronto para simplificar as suas finanças?",
  subtitle = "Junte-se a milhares de usuários que já controlam melhor seu dinheiro com o WUNDU.",
  buttonText = "Experimente agora - É grátis",
}) => {
  const router = useRouter();
  const handleLogin = () => {
    router.push(ROUTES.LOGIN);
  };
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-400 border-2 m-2 border-gray-100 shadow-2xs relative overflow-hidden rounded-2xl">
      {/* Background Pattern com Animação */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-blue-800/10 to-purple-900/20"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-30 animate-pulse-slow"></div>

      {/* Elementos Flutuantes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-400/20 rounded-full blur-lg animate-float-delayed"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 fade-in-section">
          {title}
        </h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12 fade-in-section delay-2 leading-relaxed">
          {subtitle}
        </p>
        <div className="fade-in-section delay-4">
          <Button
            onClick={handleLogin}
            variant="landing"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
