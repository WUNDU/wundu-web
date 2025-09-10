import Logo from "../atoms/logo";
import CtaSection from "../molecules/CtaSection";
import Footer from "../organisms/Footer";

const OnboardingScreen: React.FC = () => {
  const logoUrl = '/assets/logo.png';

  return (
    <div className="relative flex min-h-screen flex-col justify-between p-8">
      <div className="mb-20">
        <Logo src={logoUrl} />
      </div>
      <div className="mx-auto">
        <CtaSection />
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default OnboardingScreen;