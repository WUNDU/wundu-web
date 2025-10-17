// src/components/molecules/FAQSection/index.tsx
const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: 'O que é a WUNDU?',
      answer: 'WUNDU é um aplicativo de controle financeiro pessoal que ajuda você a gerenciar suas finanças, acompanhar gastos, criar orçamentos e alcançar suas metas financeiras de forma simples e intuitiva.'
    },
    {
      question: 'Como funciona o Upload?',
      answer: 'Arrasta o arquivo PDF ou imagem para a área de upload e nossa IA processa automaticamente as transações.'
    },
    {
      question: 'Posso transferir os meus dados?',
      answer: 'Sim, você pode exportar relatórios em PDF e CSV a qualquer momento.'
    },
    {
      question: 'Os meus dados estão seguros?',
      answer: 'Sim, utilizamos criptografia de nível bancário para proteger todas as suas informações.'
    },
    {
      question: 'Como categorizar as transações?',
      answer: 'A IA categoriza automaticamente, mas você pode editar e criar categorias personalizadas.'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">{faq.question}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;