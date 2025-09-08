'use client'
import Button from "../atoms/Button";

const Footer: React.FC = () => {
  const handleCadastreSe = () => {
    // Ação para o botão Cadastre-se
    console.log('Botão Cadastre-se clicado!');
  };

  const handleFacaLogin = () => {
    // Ação para o botão Faça login
    console.log('Botão Faça login clicado!');
  };

  return (
    <div className="flex w-full items-center gap-4 px-6">
      <Button onClick={handleCadastreSe} variant="primary">
        Cadastre-se
      </Button>
      <Button onClick={handleFacaLogin} variant="secondary">
        Faça login
      </Button>
    </div>
  );
};

export default Footer