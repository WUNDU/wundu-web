"use client";

import React, { useState } from "react";

const PrivacyPolicy = () => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">1. Introdução</h2>
      <p className="text-slate-600 leading-relaxed">
        A WUNDU está empenhada em proteger a sua privacidade e garantir a
        segurança dos seus dados pessoais. Esta Política de Privacidade explica
        como recolhemos, utilizamos, partilhamos e protegemos as suas
        informações quando utiliza a nossa aplicação de gestão financeira
        pessoal, visita o nosso site ou interage com os nossos serviços. Ao
        utilizar os nossos serviços, concorda com esta política.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        2. Informações que recolhemos
      </h2>
      <p className="mb-4 text-slate-600">
        Recolhemos os seguintes tipos de informações:
      </p>

      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        2.1. Informações fornecidas por si:
      </h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600">
        <li>
          Dados de registo (nome, e-mail, palavra-passe, número de telefone);
        </li>
        <li>
          Dados financeiros (transações de receita e despesa, categorias,
          montantes, datas);
        </li>
        <li>Metas financeiras e progresso associado;</li>
        <li>Limites de gastos por categoria;</li>
        <li>
          Documentos enviados para processamento (comprovativos bancários em
          PDF, JPG ou PNG);
        </li>
        <li>
          Mensagens enviadas ao assistente de IA e histórico de conversas;
        </li>
        <li>Feedback e comunicações que nos envia directamente.</li>
      </ul>

      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        2.2. Informações recolhidas automaticamente:
      </h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600">
        <li>
          Dados de utilização da aplicação (páginas visitadas, funcionalidades
          utilizadas, eventos de interacção);
        </li>
        <li>
          Informações do dispositivo e navegador (tipo, sistema operativo,
          versão);
        </li>
        <li>
          Endereço IP e agente de utilizador associados a cada sessão
          autenticada;
        </li>
        <li>Tokens de notificação push (quando autorizado);</li>
        <li>Informações de diagnóstico e erros capturados automaticamente;</li>
        <li>
          Dados de cookies e sessão necessários para o funcionamento da
          aplicação.
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        2.3. Dados sensíveis:
      </h3>
      <p className="text-slate-600">
        Os dados financeiros e os documentos que carrega são considerados
        sensíveis. São protegidos com medidas de segurança reforçadas e
        processados apenas com o seu consentimento explícito ou conforme
        necessário para cumprir obrigações contratuais. Os documentos enviados
        são processados por reconhecimento óptico de caracteres (OCR) para
        extracção automática de transacções.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        3. Como utilizamos as suas informações
      </h2>
      <p className="mb-4 text-slate-600">
        Utilizamos as suas informações com base nas seguintes bases legais:
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600">
        <li>
          <strong>Consentimento</strong>: Quando nos dá permissão para processar
          os seus dados;
        </li>
        <li>
          <strong>Necessidade contratual</strong>: Para cumprir o contrato de
          prestação de serviços consigo;
        </li>
        <li>
          <strong>Obrigação legal</strong>: Para cumprir requisitos legais
          aplicáveis;
        </li>
        <li>
          <strong>Interesses legítimos</strong>: Quando necessário para os
          nossos interesses ou de terceiros, salvo se os seus direitos
          prevalecerem.
        </li>
      </ul>
      <p className="mb-4 text-slate-600">Os propósitos incluem:</p>
      <ul className="list-disc pl-6 space-y-2 text-slate-600">
        <li>Fornecer, manter e melhorar os nossos serviços;</li>
        <li>Processar e gerir as suas transacções financeiras;</li>
        <li>
          Extrair transacções automaticamente a partir de documentos enviados
          via OCR;
        </li>
        <li>
          Disponibilizar o assistente de IA para consultas e análise do seu
          histórico financeiro;
        </li>
        <li>
          Enviar notificações push sobre alertas de limites, metas e
          actualizações relevantes;
        </li>
        <li>
          Personalizar a sua experiência e fornecer relatórios financeiros
          periódicos;
        </li>
        <li>
          Detectar, prevenir e resolver problemas técnicos ou de segurança;
        </li>
        <li>Cumprir obrigações legais.</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        4. Partilha de informações
      </h2>
      <p className="mb-4 text-slate-600">
        Não vendemos os seus dados pessoais. Partilhamos as suas informações
        apenas nas seguintes circunstâncias:
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600">
        <li>
          Com fornecedores de serviços que trabalham em nosso nome (incluindo
          processamento de OCR e serviços de IA);
        </li>
        <li>
          Com a plataforma de análise PostHog, utilizada para monitorizar o
          desempenho e a qualidade da aplicação — os dados são anonimizados
          sempre que possível;
        </li>
        <li>Para cumprir obrigações legais ou ordens judiciais;</li>
        <li>
          Para proteger direitos, propriedade ou segurança da WUNDU, dos seus
          utilizadores ou do público;
        </li>
        <li>
          Com o seu consentimento expresso ou mediante as suas instruções.
        </li>
      </ul>
      <p className="text-slate-600 leading-relaxed">
        Se os seus dados forem transferidos para fora de Angola, garantimos que
        o país de destino dispõe de protecção adequada ou que salvaguardas
        apropriadas estão em vigor, conforme exigido pelos Artigos 51–54 da Lei
        de Protecção de Dados.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        5. Segurança dos dados
      </h2>
      <p className="mb-4 text-slate-600">
        Implementamos medidas técnicas e organizacionais apropriadas para
        proteger os seus dados pessoais, incluindo:
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600">
        <li>
          Autenticação via tokens de acesso com expiração e tokens de renovação
          em cookies HTTP-only seguros;
        </li>
        <li>
          Gestão de sessões com registo de IP e agente, com possibilidade de
          revogação individual;
        </li>
        <li>Criptografia de dados sensíveis em trânsito e em repouso;</li>
        <li>Controlos de acesso rigorosos;</li>
        <li>Monitorização e testes regulares de segurança;</li>
        <li>Cópias de segurança regulares.</li>
      </ul>
      <p className="text-slate-600 leading-relaxed">
        Em caso de violação de dados, avaliaremos a natureza e o âmbito da
        violação. Notificaremos a Agência de Protecção de Dados (APD) no prazo
        de 72 horas e informaremos os utilizadores afectados se existir risco
        significativo para os seus direitos e liberdades.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        6. Os seus direitos
      </h2>
      <p className="mb-4 text-slate-600">
        Tem os seguintes direitos relativamente aos seus dados pessoais:
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600">
        <li>Aceder e receber uma cópia dos seus dados;</li>
        <li>Rectificar dados incorrectos ou incompletos;</li>
        <li>Eliminar os seus dados (em determinadas circunstâncias);</li>
        <li>Restringir ou opor-se ao processamento;</li>
        <li>Portabilidade dos dados;</li>
        <li>Revogar sessões activas na área de perfil da aplicação;</li>
        <li>Retirar consentimento a qualquer momento.</li>
      </ul>
      <p className="text-slate-600 leading-relaxed">
        Para exercer qualquer um destes direitos, contacte-nos através de{" "}
        <span className="text-[#003cc3] font-semibold">support@wundu.tech</span>
        .
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        7. Retenção de dados
      </h2>
      <p className="text-slate-600 leading-relaxed">
        Mantemos os seus dados pessoais apenas pelo tempo necessário para
        cumprir os propósitos descritos nesta política ou conforme exigido por
        lei. Os documentos enviados e o histórico de conversas com a IA são
        conservados enquanto a conta estiver activa e eliminados mediante pedido
        ou encerramento de conta.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        8. Alterações a esta política
      </h2>
      <p className="mb-4 text-slate-600">
        Podemos actualizar esta Política de Privacidade periodicamente para
        reflectir alterações nas nossas práticas ou por outros motivos
        operacionais, legais ou regulatórios. Notificaremos sobre quaisquer
        alterações materiais através da aplicação ou do site.
      </p>
      <p className="text-slate-400 font-bold italic text-sm">
        Data da última actualização: 29 de maio de 2026
      </p>
    </section>
  </div>
);

const CookiesPolicy = () => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        1. O que são cookies?
      </h2>
      <p className="text-slate-600 leading-relaxed">
        Cookies são pequenos ficheiros de texto armazenados no seu dispositivo
        (computador, tablet, smartphone) quando visita um site. São amplamente
        utilizados para fazer os sites funcionarem de forma mais eficiente e
        para fornecer informações aos proprietários do site.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        2. Como utilizamos cookies
      </h2>
      <p className="mb-4 text-slate-600">
        A WUNDU utiliza cookies para os seguintes propósitos:
      </p>

      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        2.1. Cookies essenciais:
      </h3>
      <p className="mb-6 text-slate-600 leading-relaxed">
        Necessários para o funcionamento da aplicação. Incluem cookies de sessão
        de autenticação (tokens de renovação em cookies HTTP-only seguros) que
        permitem manter a sua sessão activa de forma segura. Sem estes cookies,
        não é possível utilizar as funcionalidades autenticadas da aplicação.
      </p>

      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        2.2. Cookies de desempenho e análise:
      </h3>
      <p className="mb-6 text-slate-600 leading-relaxed">
        Utilizamos a plataforma PostHog para recolher dados sobre como os
        utilizadores interagem com a aplicação — páginas visitadas,
        funcionalidades utilizadas e erros encontrados. Estes dados ajudam-nos a
        melhorar a experiência da aplicação. Os dados recolhidos pelo PostHog
        são anonimizados sempre que possível e não são vendidos a terceiros.
      </p>

      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        2.3. Cookies de funcionalidade:
      </h3>
      <p className="mb-6 text-slate-600 leading-relaxed">
        Permitem que a aplicação recorde as suas preferências (como o
        consentimento de cookies e preferências de interface) para proporcionar
        uma experiência mais personalizada.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        3. Controlo de cookies
      </h2>
      <p className="text-slate-600 leading-relaxed">
        Pode controlar e/ou eliminar cookies conforme desejar através das
        definições do seu navegador. No entanto, se desactivar os cookies
        essenciais, não conseguirá aceder às funcionalidades autenticadas da
        aplicação. Os cookies de análise podem ser recusados no momento do
        consentimento ou posteriormente através das nossas definições de
        privacidade.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        4. Cookies de terceiros
      </h2>
      <p className="mb-4 text-slate-600 leading-relaxed">
        Utilizamos serviços de terceiros que podem colocar cookies no seu
        dispositivo:
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-600">
        <li>
          <strong>PostHog</strong> — análise de utilização e monitorização de
          desempenho (proxied via /ingest para maior privacidade)
        </li>
      </ul>
      <p className="text-slate-600 leading-relaxed">
        Recomendamos que consulte as políticas de privacidade destes terceiros
        para compreender como utilizam as suas informações.
      </p>
    </section>
  </div>
);

const TermsOfUse = () => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        1. Aceitação dos Termos
      </h2>
      <p className="text-slate-600 leading-relaxed">
        Ao aceder e utilizar a aplicação e serviços da WUNDU, concorda com estes
        Termos de Uso e com a nossa Política de Privacidade. Se não concordar
        com algum aspecto destes termos, recomendamos que não utilize os nossos
        serviços.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        2. Descrição do Serviço
      </h2>
      <p className="mb-4 text-slate-600">
        A WUNDU é uma aplicação de gestão financeira pessoal que oferece as
        seguintes funcionalidades:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-slate-600">
        <li>Registo e categorização de transacções de receita e despesa;</li>
        <li>Definição de orçamentos e limites de gastos por categoria;</li>
        <li>Acompanhamento de metas financeiras e respectivo progresso;</li>
        <li>
          Envio de comprovativos bancários (PDF, JPG ou PNG) com extracção
          automática de transacções via OCR;
        </li>
        <li>
          Assistente de IA para consulta e análise do histórico financeiro;
        </li>
        <li>Relatórios financeiros semanais e mensais;</li>
        <li>Notificações push sobre alertas de limites e metas;</li>
        <li>Gestão de sessões activas com possibilidade de revogação.</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        3. Uso Aceitável
      </h2>
      <p className="mb-4 text-slate-600">
        Ao utilizar o nosso serviço, concorda em:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-slate-600">
        <li>Fornecer informações precisas e completas quando solicitado;</li>
        <li>Manter a segurança da sua conta e palavra-passe;</li>
        <li>
          Não utilizar o serviço para qualquer finalidade ilegal ou não
          autorizada;
        </li>
        <li>Não tentar aceder a áreas restritas do serviço sem autorização;</li>
        <li>
          Não enviar documentos que não lhe pertençam ou para os quais não tenha
          autorização;
        </li>
        <li>
          Não utilizar o assistente de IA para fins ilícitos ou para contornar
          as funcionalidades da aplicação.
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        4. Processamento de Documentos e IA
      </h2>
      <p className="mb-4 text-slate-600 leading-relaxed">
        Ao enviar documentos para processamento, autoriza a WUNDU a processar o
        conteúdo desses documentos via OCR para extracção de transacções
        financeiras. Ao utilizar o assistente de IA, as suas mensagens e
        histórico de conversas são processados para gerar respostas contextuais.
      </p>
      <p className="text-slate-600 leading-relaxed">
        O assistente de IA é uma ferramenta de consulta do seu histórico
        financeiro pessoal. As respostas geradas{" "}
        <strong>
          não constituem aconselhamento financeiro, fiscal ou legal profissional
        </strong>
        . A WUNDU não se responsabiliza por decisões tomadas com base nas
        sugestões do assistente de IA.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        5. Conteúdo do Utilizador
      </h2>
      <p className="text-slate-600 leading-relaxed">
        É o único responsável pelos dados que introduz na aplicação WUNDU,
        incluindo transacções, documentos e mensagens ao assistente de IA. Ao
        fornecer conteúdo no nosso serviço, concede à WUNDU uma licença mundial,
        não exclusiva e isenta de royalties para utilizar, processar e armazenar
        esse conteúdo exclusivamente no âmbito da operação do serviço.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        6. Propriedade Intelectual
      </h2>
      <p className="text-slate-600 leading-relaxed">
        Todo o conteúdo, funcionalidades e código da aplicação WUNDU, incluindo
        textos, gráficos, logótipos, ícones, imagens e compilações de dados, são
        propriedade da WUNDU ou dos seus licenciadores e protegidos por leis de
        propriedade intelectual.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        7. Limitação de Responsabilidade
      </h2>
      <p className="mb-4 text-slate-600 leading-relaxed">
        A WUNDU não garante que o serviço será ininterrupto, pontual, seguro ou
        livre de erros. A aplicação é fornecida "tal como está" e "conforme
        disponível". Não seremos responsáveis por quaisquer perdas ou danos
        resultantes do uso ou incapacidade de usar o nosso serviço, incluindo
        perdas decorrentes de erros na extracção OCR de documentos ou de
        respostas do assistente de IA.
      </p>
      <p className="text-slate-600 leading-relaxed">
        A WUNDU não é um serviço de consultoria financeira profissional. As
        informações e ferramentas disponibilizadas são apenas para fins
        informativos e de gestão pessoal, não constituindo aconselhamento
        financeiro, fiscal ou legal.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        8. Modificações dos Termos
      </h2>
      <p className="text-slate-600 leading-relaxed">
        Reservamo-nos o direito de modificar ou substituir estes termos a
        qualquer momento. Notificaremos sobre alterações significativas através
        da aplicação ou do site. A utilização continuada do serviço após tais
        alterações constitui a sua aceitação dos novos termos.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold mb-4 text-slate-900">
        9. Lei Aplicável
      </h2>
      <p className="mb-4 text-slate-600">
        Estes Termos de Uso são regidos e interpretados de acordo com as leis da
        República de Angola. O processamento de dados pessoais no âmbito dos
        serviços da WUNDU está sujeito à Lei de Protecção de Dados Pessoais,
        incluindo:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-600">
        <li>
          <strong>Artigos 1 a 4</strong> – Disposições gerais e princípios
          fundamentais do processamento de dados pessoais
        </li>
        <li>
          <strong>Artigos 6 a 13</strong> – Princípios de licitude, minimização,
          transparência, finalidade, exactidão, conservação, integridade e
          confidencialidade dos dados
        </li>
        <li>
          <strong>Artigos 14 a 23</strong> – Direitos dos titulares dos dados,
          incluindo consentimento, acesso, rectificação, apagamento e
          portabilidade
        </li>
        <li>
          <strong>Artigos 26 a 35</strong> – Segurança dos dados, medidas de
          protecção, avaliação de impacto e notificação de violações de dados
        </li>
        <li>
          <strong>Artigos 39 a 42</strong> – Protecção de dados desde a
          concepção, segurança dos dados e dever de notificação de violações
        </li>
        <li>
          <strong>Artigos 51 a 54</strong> – Transferências internacionais de
          dados, incluindo requisitos de adequação e garantias apropriadas
        </li>
      </ul>
      <p className="text-slate-600 leading-relaxed">
        Qualquer disputa decorrente destes Termos será submetida à jurisdição
        dos tribunais competentes em Angola.
      </p>
    </section>

    <section>
      <p className="text-slate-400 font-bold italic text-sm">
        Data da última actualização: 29 de maio de 2026
      </p>
    </section>
  </div>
);

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<"privacy" | "cookies" | "terms">(
    "privacy",
  );

  return (
    <div className="bg-white min-h-screen p-6 md:px-24 md:py-12 font-sans selection:bg-yellow-100">
      <div className="max-w-4xl mx-auto">
        {/* Signature Line */}
        <div className="h-0.5 w-12 bg-[#ffd400] mb-8" />

        {/* Tab Navigation - Subtle & Side-by-side */}
        <div className="flex border-b border-slate-100 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: "privacy", label: "Privacidade" },
            { id: "cookies", label: "Cookies" },
            { id: "terms", label: "Termos" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-[#003cc3]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#003cc3]" />
              )}
            </button>
          ))}
        </div>

        <div className="mb-12 flex items-center justify-between border-b border-slate-50 pb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffd400]">
            Informação Jurídica
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">
            Última atualização: 20 de maio de 2026
          </span>
        </div>

        {/* Tab Content - Integral Text restored */}
        <main className="min-h-[50vh] pb-24">
          {activeTab === "privacy" && <PrivacyPolicy />}
          {activeTab === "cookies" && <CookiesPolicy />}
          {activeTab === "terms" && <TermsOfUse />}
        </main>

        <footer className="pt-12 border-t border-slate-50">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Wundu &copy; 2026 • Luanda, Angola
          </p>
        </footer>
      </div>
    </div>
  );
}
