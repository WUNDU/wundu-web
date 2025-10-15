'use client';

import LogoType from '../atoms/LogoType';

const LandingFooter = ({ ref }: { ref: React.Ref<HTMLDivElement> }) => (
  <footer className="bg-blue-900 text-white py-16" ref={ref}>
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <LogoType />
          <p className="mt-4 text-sm text-blue-200">
            O futuro das suas finanças começa aqui.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4">Recursos</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-blue-200 hover:text-yellow-400">Blog</a></li>
            <li><a href="#" className="text-blue-200 hover:text-yellow-400">Funcionalidades</a></li>
            <li><a href="#" className="text-blue-200 hover:text-yellow-400">Planos</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4">Empresa</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-blue-200 hover:text-yellow-400">Sobre nós</a></li>
            <li><a href="#" className="text-blue-200 hover:text-yellow-400">Carreiras</a></li>
            <li><a href="#" className="text-blue-200 hover:text-yellow-400">Contactos</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4">Contacto</h4>
          <ul className="space-y-2 text-sm text-blue-200">
            <li>suporte@wundu.com</li>
            <li>+244 123 456 789</li>
            <li>Luanda, Angola</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-blue-800 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center text-sm">
        <p className="text-blue-300">&copy; 2025 WUNDU. Todos os direitos reservados.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-blue-300 hover:text-yellow-400">Termos de Uso</a>
          <a href="#" className="text-blue-300 hover:text-yellow-400">Política de Privacidade</a>
        </div>
      </div>
    </div>
  </footer>
);

export default LandingFooter;