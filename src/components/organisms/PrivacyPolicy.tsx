// src/components/organisms/PrivacyPolicy/index.tsx
import LegalSection from "@/src/components/molecules/LegalSection";
import {
  InfoIcon,
  SecurityIcon,
  SettingsDeskIcon,
  ShareIcon,
} from "@/src/constants/icons";
import {
  Clock10Icon,
  EditIcon,
  LockIcon,
  Shield,
  UserLock,
} from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="space-y-8">
      <LegalSection icon={<Shield />} title="1. Introdução" delay={100}>
        <p>
          A WUNDU está empenhada em proteger sua privacidade e garantir a
          segurança dos seus dados pessoais. Esta Política de Privacidade
          explica como coletamos, usamos, compartilhamos e protegemos suas
          informações quando você utiliza nosso aplicativo de controle
          financeiro, visita nosso site ou interage com nossos serviços,
          comunicações e anúncios. Ao usar nossos serviços, você concorda com
          esta política.
        </p>
      </LegalSection>

      <LegalSection
        icon={<InfoIcon />}
        title="2. Informações que coletamos"
        delay={200}
      >
        <p className="mb-4">Coletamos os seguintes tipos de informações:</p>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          2.1. Informações fornecidas por você:
        </h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            Informações de cadastro (nome, e-mail, senha, número de telefone);
          </li>
          <li>
            Dados financeiros (transações, categorias de gastos, orçamentos);
          </li>
          <li>Metas financeiras;</li>
          <li>Feedback e comunicações que você envia para nós.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          2.2. Informações coletadas automaticamente:
        </h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Dados de uso do aplicativo;</li>
          <li>
            Informações do dispositivo (tipo, sistema operacional,
            identificadores);
          </li>
          <li>Dados de localização aproximada (quando permitido);</li>
          <li>Informações de log e diagnóstico;</li>
          <li>Dados de cookies para melhorar sua experiência.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          2.3. Dados sensíveis:
        </h3>
        <p>
          Podemos processar dados financeiros, que são considerados sensíveis.
          Esses dados são protegidos com medidas de segurança reforçadas e
          processados apenas com seu consentimento explícito ou conforme
          necessário para cumprir obrigações contratuais.
        </p>
      </LegalSection>

      <LegalSection
        icon={<SettingsDeskIcon />}
        title="3. Como usamos suas informações"
        delay={300}
      >
        <p className="mb-4">
          Utilizamos suas informações com base nas seguintes bases legais:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Consentimento</strong>: Quando você nos dá permissão para
            processar seus dados;
          </li>
          <li>
            <strong>Necessidade contratual</strong>: Para cumprir um contrato
            com você;
          </li>
          <li>
            <strong>Obrigação legal</strong>: Para cumprir requisitos legais;
          </li>
          <li>
            <strong>Interesses legítimos</strong>: Quando necessário para nossos
            interesses ou de terceiros, salvo se seus direitos prevalecerem.
          </li>
        </ul>

        <p className="mb-4">Os propósitos incluem:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Fornecer, manter e melhorar nossos serviços;</li>
          <li>Processar e gerenciar suas transações financeiras;</li>
          <li>Personalizar sua experiência e fornecer recomendações;</li>
          <li>Desenvolver novos produtos e recursos;</li>
          <li>
            Comunicar-nos com você sobre atualizações, promoções ou eventos;
          </li>
          <li>
            Detectar, prevenir e solucionar problemas técnicos ou de segurança;
          </li>
          <li>Cumprir obrigações legais.</li>
        </ul>
      </LegalSection>

      <LegalSection
        icon={<ShareIcon />}
        title="4. Compartilhamento de informações"
        delay={400}
      >
        <p className="mb-4">
          Não vendemos seus dados pessoais. Compartilhamos suas informações
          apenas nas seguintes circunstâncias:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Com fornecedores de serviços que trabalham em nosso nome;</li>
          <li>Para cumprir obrigações legais;</li>
          <li>Para proteger direitos e segurança;</li>
          <li>Com seu consentimento ou mediante suas instruções.</li>
        </ul>
        <p>
          Se seus dados forem transferidos para fora de Angola, garantimos que o
          país de destino tenha proteção adequada ou que salvaguardas
          apropriadas estejam em vigor, conforme exigido pelos Artigos 51-54 da
          Lei de Proteção de Dados.
        </p>
      </LegalSection>

      <LegalSection
        icon={<LockIcon />}
        title="5. Segurança dos dados"
        delay={500}
      >
        <p className="mb-4">
          Implementamos medidas técnicas e organizacionais apropriadas para
          proteger seus dados pessoais, incluindo:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Criptografia de dados sensíveis;</li>
          <li>Controles de acesso rigorosos;</li>
          <li>Monitoramento e testes regulares;</li>
          <li>Backups seguros;</li>
          <li>Treinamento de segurança para nossa equipe.</li>
        </ul>
        <p>
          Em caso de violação de dados, avaliaremos a natureza e o escopo da
          violação. Notificaremos a Agência de Proteção de Dados (APD) em até 72
          horas e informaremos os usuários afetados se houver risco
          significativo aos seus direitos e liberdades.
        </p>
      </LegalSection>

      <LegalSection icon={<UserLock />} title="6. Seus direitos" delay={600}>
        <p className="mb-4">
          Você tem certos direitos relacionados aos seus dados pessoais:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Acessar e receber uma cópia dos seus dados;</li>
          <li>Retificar dados incorretos;</li>
          <li>Excluir seus dados (em certas circunstâncias);</li>
          <li>Restringir ou opor-se ao processamento;</li>
          <li>Portabilidade de dados;</li>
          <li>Retirar consentimento a qualquer momento.</li>
        </ul>
        <p>
          Para exercer qualquer um desses direitos, entre em contato conosco
          através de{" "}
          <a
            href="mailto:Support@wundu.tech"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Support@wundu.tech
          </a>
          . Você também pode registrar reclamações junto à Agência de Proteção
          de Dados (APD) de Angola.
        </p>
      </LegalSection>

      <LegalSection
        icon={<Clock10Icon />}
        title="7. Retenção de dados"
        delay={700}
      >
        <p>
          Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir
          os propósitos descritos nesta política, a menos que um período de
          retenção mais longo seja exigido por lei.
        </p>
      </LegalSection>

      <LegalSection
        icon={<EditIcon />}
        title="8. Alterações nesta política"
        delay={800}
      >
        <p className="mb-4">
          Podemos atualizar esta Política de Privacidade periodicamente para
          refletir mudanças em nossas práticas ou por outros motivos
          operacionais, legais ou regulatórios. Notificaremos você sobre
          quaisquer alterações materiais através do nosso aplicativo ou site.
        </p>
        <p className="text-gray-600 font-medium">
          Data da última atualização: 20 de maio de 2025
        </p>
      </LegalSection>
    </div>
  );
};

export default PrivacyPolicy;
