"use client";

import React, { useEffect, useState } from "react";
import LandingHeader from "@/components/layout/landing-header";
import LandingFooter from "@/components/layout/landing-footer";
import { MessagesSquare } from "lucide-react";
import {
  InfoIcon,
  SettingsDeskIcon,
  ShareIcon,
  DocumentIcon,
  EditIcon,
  SettingsIcon,
} from "@/constants/icons";
import {
  Clock10Icon,
  EditIcon as LucideEditIcon,
  LockIcon,
  Shield,
  UserLock,
  CopyrightIcon,
  GavelIcon,
  RocketIcon,
  UserPenIcon,
  CookieIcon,
  PlugIcon,
} from "lucide-react";

const LegalSection = ({
  icon,
  title,
  children,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <div
    className="bg-gray-50 rounded-2xl p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-500 ease-out group fade-in-section border border-gray-100 hover:border-blue-200 hover:bg-white transform hover:-translate-y-1"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0">
      <div className="flex-shrink-0 mx-auto md:mx-0">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-all duration-500 ease-out">
          {icon}
        </div>
      </div>
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-900 transition-colors duration-300">
          {title}
        </h2>
        <div className="text-gray-700 leading-relaxed space-y-4">{children}</div>
      </div>
    </div>
  </div>
);

const LegalTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: "privacy" | "cookies" | "terms";
  onTabChange: (tab: "privacy" | "cookies" | "terms") => void;
}) => {
  const tabs: { id: "privacy" | "cookies" | "terms"; label: string }[] = [
    { id: "privacy", label: "Política de Privacidade" },
    { id: "cookies", label: "Política de Cookies" },
    { id: "terms", label: "Termos de Uso" },
  ];

  return (
    <div className="flex flex-wrap mb-12 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`text-lg px-8 py-4 font-medium transition-all duration-500 ease-out relative transform hover:scale-105 ${
            activeTab === tab.id
              ? "text-blue-900 border-b-2 border-blue-900 font-semibold"
              : "text-gray-500 hover:text-blue-700"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-yellow-600 rounded-full"></div>
          )}
        </button>
      ))}
    </div>
  );
};

const PrivacyPolicy: React.FC = () => (
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

    <LegalSection icon={<InfoIcon />} title="2. Informações que coletamos" delay={200}>
      <p className="mb-4">Coletamos os seguintes tipos de informações:</p>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        2.1. Informações fornecidas por você:
      </h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Informações de cadastro (nome, e-mail, senha, número de telefone);</li>
        <li>Dados financeiros (transações, categorias de gastos, orçamentos);</li>
        <li>Metas financeiras;</li>
        <li>Feedback e comunicações que você envia para nós.</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        2.2. Informações coletadas automaticamente:
      </h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Dados de uso do aplicativo;</li>
        <li>Informações do dispositivo (tipo, sistema operacional, identificadores);</li>
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

    <LegalSection icon={<SettingsDeskIcon />} title="3. Como usamos suas informações" delay={300}>
      <p className="mb-4">
        Utilizamos suas informações com base nas seguintes bases legais:
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Consentimento</strong>: Quando você nos dá permissão para processar seus dados;</li>
        <li><strong>Necessidade contratual</strong>: Para cumprir um contrato com você;</li>
        <li><strong>Obrigação legal</strong>: Para cumprir requisitos legais;</li>
        <li><strong>Interesses legítimos</strong>: Quando necessário para nossos interesses ou de terceiros, salvo se seus direitos prevalecerem.</li>
      </ul>
      <p className="mb-4">Os propósitos incluem:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Fornecer, manter e melhorar nossos serviços;</li>
        <li>Processar e gerenciar suas transações financeiras;</li>
        <li>Personalizar sua experiência e fornecer recomendações;</li>
        <li>Desenvolver novos produtos e recursos;</li>
        <li>Comunicar-nos com você sobre atualizações, promoções ou eventos;</li>
        <li>Detectar, prevenir e solucionar problemas técnicos ou de segurança;</li>
        <li>Cumprir obrigações legais.</li>
      </ul>
    </LegalSection>

    <LegalSection icon={<ShareIcon />} title="4. Compartilhamento de informações" delay={400}>
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

    <LegalSection icon={<LockIcon />} title="5. Segurança dos dados" delay={500}>
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
        <a href="mailto:Support@wundu.tech" className="text-blue-600 hover:text-blue-800 font-medium">
          Support@wundu.tech
        </a>
        . Você também pode registrar reclamações junto à Agência de Proteção
        de Dados (APD) de Angola.
      </p>
    </LegalSection>

    <LegalSection icon={<Clock10Icon />} title="7. Retenção de dados" delay={700}>
      <p>
        Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir
        os propósitos descritos nesta política, a menos que um período de
        retenção mais longo seja exigido por lei.
      </p>
    </LegalSection>

    <LegalSection icon={<LucideEditIcon />} title="8. Alterações nesta política" delay={800}>
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

const CookiesPolicy: React.FC = () => (
  <div className="space-y-8">
    <LegalSection icon={<CookieIcon />} title="1. O que são cookies?" delay={100}>
      <p>
        Cookies são pequenos arquivos de texto que são armazenados no seu
        dispositivo (computador, tablet, smartphone) quando você visita um
        site. Eles são amplamente utilizados para fazer os sites funcionarem
        de maneira mais eficiente, bem como fornecer informações aos
        proprietários do site.
      </p>
    </LegalSection>

    <LegalSection icon={<SettingsDeskIcon />} title="2. Como usamos cookies" delay={200}>
      <p className="mb-4">A WUNDU utiliza cookies para os seguintes propósitos:</p>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1. Cookies essenciais:</h3>
      <p className="mb-6">
        Necessários para o funcionamento do site. Incluem, por exemplo,
        cookies que permitem que você faça login em áreas seguras do site.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2. Cookies de desempenho:</h3>
      <p className="mb-6">
        Coletam informações sobre como os visitantes usam nosso site, quais
        páginas visitam e se encontram erros. Esses cookies não coletam
        informações que identificam um visitante e são usados apenas para
        melhorar o funcionamento do site.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3. Cookies de funcionalidade:</h3>
      <p className="mb-6">
        Permitem que o site lembre de escolhas que você faz (como seu nome de
        usuário, idioma ou região) e forneçam recursos aprimorados e mais
        personalizados.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4. Cookies de publicidade/direcionamento:</h3>
      <p>
        Registram suas visitas ao nosso site, as páginas que você visitou e os
        links que você seguiu. Usamos essas informações para tornar nossa
        publicidade mais relevante para seus interesses.
      </p>
    </LegalSection>

    <LegalSection icon={<SettingsIcon />} title="3. Controle de cookies" delay={300}>
      <p className="mb-4">
        Você pode controlar e/ou excluir cookies conforme desejar. Você pode
        excluir todos os cookies que já estão no seu dispositivo e pode
        configurar a maioria dos navegadores para impedir que sejam colocados.
        No entanto, se você fizer isso, talvez tenha que ajustar manualmente
        algumas preferências sempre que visitar um site, e alguns serviços e
        funcionalidades podem não funcionar.
      </p>
      <p className="mb-4">Para mais informações sobre como gerenciar cookies, visite:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <a href="https://support.google.com/accounts/answer/61416" className="text-blue-600 hover:text-blue-800">
            Google Chrome
          </a>
        </li>
        <li>
          <a href="https://support.mozilla.org/pt-BR/kb/cookies-informacoes-que-os-sites-armazenam-no-seu-computador" className="text-blue-600 hover:text-blue-800">
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a href="https://support.microsoft.com/pt-br/help/17442/windows-internet-explorer-delete-manage-cookies" className="text-blue-600 hover:text-blue-800">
            Internet Explorer
          </a>
        </li>
        <li>
          <a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" className="text-blue-600 hover:text-blue-800">
            Safari
          </a>
        </li>
      </ul>
    </LegalSection>

    <LegalSection icon={<PlugIcon />} title="4. Cookies de terceiros" delay={400}>
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

const TermsOfUse: React.FC = () => (
  <div className="space-y-8">
    <LegalSection icon={<DocumentIcon />} title="1. Aceitação dos Termos" delay={100}>
      <p>
        Ao acessar e utilizar o aplicativo e serviços da WUNDU, você concorda
        com estes Termos de Uso e com nossa Política de Privacidade. Se você
        não concordar com algum aspecto desses termos, recomendamos que não
        utilize nossos serviços.
      </p>
    </LegalSection>

    <LegalSection icon={<RocketIcon />} title="2. Uso do Serviço" delay={200}>
      <p className="mb-4">
        A WUNDU oferece um aplicativo de gerenciamento financeiro pessoal que
        permite aos usuários rastrear gastos, criar orçamentos e estabelecer
        metas financeiras. Ao utilizar nosso serviço, você concorda em:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Fornecer informações precisas e completas quando solicitado</li>
        <li>Manter a segurança de sua conta e senha</li>
        <li>Não utilizar o serviço para qualquer finalidade ilegal ou não autorizada</li>
        <li>Não tentar acessar áreas restritas do serviço sem autorização</li>
      </ul>
    </LegalSection>

    <LegalSection icon={<UserPenIcon />} title="3. Conteúdo do Usuário" delay={300}>
      <p>
        Você é o único responsável pelos dados que inserir no aplicativo
        WUNDU. Ao fornecer seu conteúdo em nosso serviço, você concede à WUNDU
        uma licença mundial, não exclusiva e isenta de royalties para usar,
        modificar, executar e exibir esse conteúdo em conexão com a operação
        do serviço.
      </p>
    </LegalSection>

    <LegalSection icon={<CopyrightIcon />} title="4. Propriedade Intelectual" delay={400}>
      <p>
        Todo o conteúdo, recursos e funcionalidades do aplicativo WUNDU,
        incluindo, mas não se limitando a textos, gráficos, logotipos, ícones,
        imagens, clipes de áudio, downloads digitais e compilações de dados,
        são propriedade da WUNDU ou de seus licenciadores e protegidos por
        leis de propriedade intelectual.
      </p>
    </LegalSection>

    <LegalSection icon={<InfoIcon />} title="5. Limitação de Responsabilidade" delay={500}>
      <p className="mb-4">
        A WUNDU não garante que o serviço será ininterrupto, pontual, seguro
        ou livre de erros. O aplicativo é fornecido "como está" e "conforme
        disponível". Não seremos responsáveis por quaisquer perdas ou danos
        resultantes do uso ou incapacidade de usar nosso serviço.
      </p>
      <p>
        Não somos um serviço de consultoria financeira profissional. As
        informações fornecidas através de nosso aplicativo são apenas para
        fins informativos e não constituem aconselhamento financeiro, fiscal
        ou legal.
      </p>
    </LegalSection>

    <LegalSection icon={<EditIcon />} title="6. Modificações dos Termos" delay={600}>
      <p>
        Reservamo-nos o direito de modificar ou substituir estes termos a
        qualquer momento. Notificaremos sobre alterações significativas
        através do aplicativo ou site. O uso continuado do serviço após tais
        alterações constitui sua aceitação dos novos termos.
      </p>
    </LegalSection>

    <LegalSection icon={<GavelIcon />} title="7. Lei Aplicável" delay={700}>
      <p className="mb-4">
        Estes Termos de Uso são regidos e interpretados de acordo com as leis
        da República de Angola. Especificamente, o processamento de dados
        pessoais no âmbito do uso dos serviços da WUNDU está sujeito à Lei de
        Proteção de Dados Pessoais, conforme proposta de revisão, incluindo,
        mas não se limitando aos seguintes artigos:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li><strong>Artigos 1 a 4</strong> – Disposições gerais e princípios fundamentais do processamento de dados pessoais</li>
        <li><strong>Artigos 6 a 13</strong> – Princípios de licitude, minimização, transparência, finalidade, exatidão, conservação, integridade e confidencialidade dos dados</li>
        <li><strong>Artigos 14 a 23</strong> – Direitos dos titulares dos dados, incluindo consentimento, acesso, retificação, apagamento e portabilidade</li>
        <li><strong>Artigos 26 a 35</strong> – Segurança dos dados, medidas de proteção, avaliação de impacto e notificação de violações de dados</li>
        <li><strong>Artigos 39 a 42</strong> – Proteção de dados desde a concepção, segurança dos dados e dever de notificação de violações</li>
        <li><strong>Artigos 51 a 54</strong> – Transferências internacionais de dados, incluindo requisitos de adequação e garantias apropriadas</li>
      </ul>
      <p>
        Qualquer disputa decorrente destes Termos será submetida à jurisdição
        dos tribunais competentes em Angola.
      </p>
    </LegalSection>
  </div>
);

export default function Legal() {
  const [activeTab, setActiveTab] = useState<"privacy" | "cookies" | "terms">("privacy");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".fade-in-section").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      {/* Hero Section */}
      <section className="min-h-[80vh] relative">
        <div className="absolute inset-0 z-0 bg-linear-to-br from-blue-900 via-blue-800 to-yellow-400"></div>
        <div className="absolute inset-0 z-10 bg-linear-to-br from-blue-900/80 via-blue-800/70 to-yellow-400/80"></div>

        <div className="container mx-auto px-6 relative z-20 flex items-center min-h-[80vh]">
          <div className="max-w-4xl mx-auto text-center fade-in-section">
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-white mb-6 text-sm font-medium">
              WUNDU • Privacidade e Segurança em Primeiro Lugar
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Políticas de Privacidade e Cookies
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Entenda como coletamos, usamos e protegemos suas informações
              pessoais e financeiras enquanto você utiliza os serviços da WUNDU.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#policy-content"
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-medium text-center shadow-lg hover:shadow-xl transition-all duration-500 ease-out hover:scale-105 transform hover:-translate-y-1 animate-fade-in"
              >
                Ler a Política <span className="ml-2">↓</span>
              </a>
              <a
                href="/contacts"
                className="bg-white/20 flex text-white px-10 py-4 rounded-full font-medium text-center hover:bg-white/30 transition-all duration-500 ease-out hover:scale-105 transform hover:-translate-y-1 animate-fade-in"
              >
                Fale Conosco{" "}
                <span className="ml-2">
                  <MessagesSquare />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
          <div className="animate-bounce">
            <a
              href="#policy-content"
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-300"
            >
              <span className="text-white">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* Tabbed Content */}
      <section id="policy-content" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-section">
            <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
              NOSSAS POLÍTICAS
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              Entenda Nossas Regras
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Saiba como tratamos seus dados e os termos que regem o uso do
              nosso serviço.
            </p>
          </div>

          <LegalTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="max-w-4xl mx-auto">
            {activeTab === "privacy" && <PrivacyPolicy />}
            {activeTab === "cookies" && <CookiesPolicy />}
            {activeTab === "terms" && <TermsOfUse />}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gray-50 border-2 m-2 border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-r from-blue-900 to-blue-800 rounded-3xl overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

            <div className="p-12 md:p-16 text-center relative z-10 fade-in-section">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Dúvidas sobre nossa política?
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Estamos comprometidos com a transparência e queremos garantir
                que você compreenda completamente como tratamos suas
                informações. Entre em contato conosco caso tenha dúvidas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contacts"
                  className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-medium text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Fale Conosco <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
