// src/components/organisms/TermsOfUse/index.tsx
import LegalSection from '@/src/components/molecules/LegalSection';

const TermsOfUse: React.FC = () => {
  return (
    <div className="space-y-8">
      <LegalSection icon="📄" title="1. Aceitação dos Termos" delay={100}>
        <p>
          Ao acessar e utilizar o aplicativo e serviços da WUNDU, você concorda com estes Termos de Uso e com nossa
          Política de Privacidade. Se você não concordar com algum aspecto desses termos, recomendamos que não
          utilize nossos serviços.
        </p>
      </LegalSection>

      <LegalSection icon="🚀" title="2. Uso do Serviço" delay={200}>
        <p className="mb-4">
          A WUNDU oferece um aplicativo de gerenciamento financeiro pessoal que permite aos usuários rastrear
          gastos, criar orçamentos e estabelecer metas financeiras. Ao utilizar nosso serviço, você concorda em:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Fornecer informações precisas e completas quando solicitado</li>
          <li>Manter a segurança de sua conta e senha</li>
          <li>Não utilizar o serviço para qualquer finalidade ilegal ou não autorizada</li>
          <li>Não tentar acessar áreas restritas do serviço sem autorização</li>
        </ul>
      </LegalSection>

      <LegalSection icon="💾" title="3. Conteúdo do Usuário" delay={300}>
        <p>
          Você é o único responsável pelos dados que inserir no aplicativo WUNDU. Ao fornecer seu conteúdo em nosso
          serviço, você concede à WUNDU uma licença mundial, não exclusiva e isenta de royalties para usar,
          modificar, executar e exibir esse conteúdo em conexão com a operação do serviço.
        </p>
      </LegalSection>

      <LegalSection icon="©️" title="4. Propriedade Intelectual" delay={400}>
        <p>
          Todo o conteúdo, recursos e funcionalidades do aplicativo WUNDU, incluindo, mas não se limitando a textos,
          gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, são
          propriedade da WUNDU ou de seus licenciadores e protegidos por leis de propriedade intelectual.
        </p>
      </LegalSection>

      <LegalSection icon="⚠️" title="5. Limitação de Responsabilidade" delay={500}>
        <p className="mb-4">
          A WUNDU não garante que o serviço será ininterrupto, pontual, seguro ou livre de erros. O aplicativo é
          fornecido "como está" e "conforme disponível". Não seremos responsáveis por quaisquer perdas ou danos
          resultantes do uso ou incapacidade de usar nosso serviço.
        </p>
        <p>
          Não somos um serviço de consultoria financeira profissional. As informações fornecidas através de nosso
          aplicativo são apenas para fins informativos e não constituem aconselhamento financeiro, fiscal ou legal.
        </p>
      </LegalSection>

      <LegalSection icon="📝" title="6. Modificações dos Termos" delay={600}>
        <p>
          Reservamo-nos o direito de modificar ou substituir estes termos a qualquer momento. Notificaremos sobre
          alterações significativas através do aplicativo ou site. O uso continuado do serviço após tais alterações
          constitui sua aceitação dos novos termos.
        </p>
      </LegalSection>

      <LegalSection icon="⚖️" title="7. Lei Aplicável" delay={700}>
        <p className="mb-4">
          Estes Termos de Uso são regidos e interpretados de acordo com as leis da República de Angola.
          Especificamente, o processamento de dados pessoais no âmbito do uso dos serviços da WUNDU está sujeito à
          Lei de Proteção de Dados Pessoais, conforme proposta de revisão, incluindo, mas não se limitando aos
          seguintes artigos:
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
          Qualquer disputa decorrente destes Termos será submetida à jurisdição dos tribunais competentes em Angola.
        </p>
      </LegalSection>
    </div>
  );
};

export default TermsOfUse;