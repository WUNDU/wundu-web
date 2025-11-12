import ContactForm from "@/ui/molecules/ContactForm";
import FAQSection from "@/ui/molecules/FAQSection";

const ContactFormSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 border-2 m-2 border-gray-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Coluna do Formulário */}
          <div className="bg-white rounded-2xl p-8 shadow-lg fade-in-section">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Envia-nos uma Mensagem
            </h2>
            <p className="text-gray-600 mb-8">
              Preencha o formulário abaixo que nós entraremos em contacto
              consigo
            </p>
            <ContactForm />
          </div>

          {/* Coluna da FAQ e Horário */}
          <div className="space-y-8 fade-in-section">
            {/* Horário de Atendimento */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⏰</span>
                Horário de Atendimento
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Segunda–Sexta</span>
                  <span className="text-gray-900 font-medium">8:00–18:00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Sábado</span>
                  <span className="text-gray-900 font-medium">10:00–14:00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Domingo</span>
                  <span className="text-gray-900 font-medium">Fechado</span>
                </div>
              </div>
            </div>
            <FAQSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
