// src/components/organisms/CookiesPolicy/index.tsx
import LegalSection from "@/src/components/molecules/LegalSection";
import { SettingsDeskIcon, SettingsIcon } from "@/src/constants/icons";
import { CookieIcon, PlugIcon } from "lucide-react";

const CookiesPolicy: React.FC = () => {
  return (
    <div className="space-y-8">
      <LegalSection
        icon={<CookieIcon />}
        title="1. O que são cookies?"
        delay={100}
      >
        <p>
          Cookies são pequenos arquivos de texto que são armazenados no seu
          dispositivo (computador, tablet, smartphone) quando você visita um
          site. Eles são amplamente utilizados para fazer os sites funcionarem
          de maneira mais eficiente, bem como fornecer informações aos
          proprietários do site.
        </p>
      </LegalSection>

      <LegalSection
        icon={<SettingsDeskIcon />}
        title="2. Como usamos cookies"
        delay={200}
      >
        <p className="mb-4">
          A WUNDU utiliza cookies para os seguintes propósitos:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          2.1. Cookies essenciais:
        </h3>
        <p className="mb-6">
          Necessários para o funcionamento do site. Incluem, por exemplo,
          cookies que permitem que você faça login em áreas seguras do site.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          2.2. Cookies de desempenho:
        </h3>
        <p className="mb-6">
          Coletam informações sobre como os visitantes usam nosso site, quais
          páginas visitam e se encontram erros. Esses cookies não coletam
          informações que identificam um visitante e são usados apenas para
          melhorar o funcionamento do site.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          2.3. Cookies de funcionalidade:
        </h3>
        <p className="mb-6">
          Permitem que o site lembre de escolhas que você faz (como seu nome de
          usuário, idioma ou região) e forneçam recursos aprimorados e mais
          personalizados.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          2.4. Cookies de publicidade/direcionamento:
        </h3>
        <p>
          Registram suas visitas ao nosso site, as páginas que você visitou e os
          links que você seguiu. Usamos essas informações para tornar nossa
          publicidade mais relevante para seus interesses.
        </p>
      </LegalSection>

      <LegalSection
        icon={<SettingsIcon />}
        title="3. Controle de cookies"
        delay={300}
      >
        <p className="mb-4">
          Você pode controlar e/ou excluir cookies conforme desejar. Você pode
          excluir todos os cookies que já estão no seu dispositivo e pode
          configurar a maioria dos navegadores para impedir que sejam colocados.
          No entanto, se você fizer isso, talvez tenha que ajustar manualmente
          algumas preferências sempre que visitar um site, e alguns serviços e
          funcionalidades podem não funcionar.
        </p>
        <p className="mb-4">
          Para mais informações sobre como gerenciar cookies, visite:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <a
              href="https://support.google.com/accounts/answer/61416"
              className="text-blue-600 hover:text-blue-800"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/pt-BR/kb/cookies-informacoes-que-os-sites-armazenam-no-seu-computador"
              className="text-blue-600 hover:text-blue-800"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/pt-br/help/17442/windows-internet-explorer-delete-manage-cookies"
              className="text-blue-600 hover:text-blue-800"
            >
              Internet Explorer
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac"
              className="text-blue-600 hover:text-blue-800"
            >
              Safari
            </a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        icon={<PlugIcon />}
        title="4. Cookies de terceiros"
        delay={400}
      >
        <p className="mb-4">
          Alguns cookies são colocados por serviços de terceiros que aparecem em
          nossas páginas. Utilizamos serviços de terceiros como:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Google Analytics (análise de tráfego)</li>
          <li>Redes sociais (botões de compartilhamento)</li>
          <li>Serviços de publicidade</li>
        </ul>
        <p>
          Esses terceiros podem coletar suas informações pessoais quando você
          interage com seus serviços. Recomendamos que você consulte as
          políticas de privacidade desses terceiros para entender como eles usam
          suas informações.
        </p>
      </LegalSection>
    </div>
  );
};

export default CookiesPolicy;
