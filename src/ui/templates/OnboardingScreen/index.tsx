import Logo from "@/ui/atoms/logo";
import { CTA } from "@/ui/molecules";
import Footer from "@/ui/organisms/Footer";

const OnboardingScreen: React.FC = () => {
  const logoUrl = "/assets/logo.png";

  return (
    <div className="relative flex min-h-screen flex-col justify-between p-8">
      <div className="mb-20">
        <Logo src={logoUrl} />
      </div>
      <div className="mx-auto">
        <CTA
          title="Acompanhe seus gastos sem esforço"
          subtitle="Gerencie suas finanças facilmente usando nossa interface intuitiva e amigável, defina metas financeiras e monitore seu progresso."
          variant="default"
        />
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default OnboardingScreen;
