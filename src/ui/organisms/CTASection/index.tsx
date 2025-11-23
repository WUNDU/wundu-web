import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

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
    <section 
      className="py-24 mx-4 shadow-soft-lg relative overflow-hidden rounded-3xl"
      style={{
        background: 'linear-gradient(135deg, #00216b 0%, #003cc3 50%, #ffd400 100%)'
      }}
    >
      {/* Background Pattern com Animação */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary-dark/30 via-secondary/20 to-primary/10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20 animate-pulse-slow"></div>

      {/* Elementos Flutuantes */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full blur-xl animate-float" style={{ backgroundColor: 'rgba(255, 212, 0, 0.2)' }}></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full blur-lg animate-float-delayed" style={{ backgroundColor: 'rgba(202, 111, 5, 0.3)' }}></div>
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-white/10 rounded-full blur-md animate-bounce-soft"></div>
      <div className="absolute top-1/3 right-20 w-18 h-18 rounded-full blur-lg animate-float" style={{ backgroundColor: 'rgba(255, 212, 0, 0.15)' }}></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 fade-in-section">
          {title}
        </h2>
        <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-12 fade-in-section delay-2 leading-relaxed">
          {subtitle}
        </p>
        <div className="fade-in-section delay-4">
          <button
            onClick={handleLogin}
            className="relative group px-10 py-5 font-bold text-xl text-secondary bg-white hover:bg-gray-50 rounded-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-glow-secondary active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center space-x-3">
              <span>{buttonText}</span>
              <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
