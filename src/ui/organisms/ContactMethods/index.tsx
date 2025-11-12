import {
  EmailIcon,
  LocationIcon,
  MessageIcon,
  PhoneIcon,
} from "@/constants/icons";

const ContactMethods: React.FC = () => {
  const contactMethods = [
    {
      icon: <EmailIcon className="w-10 h-10 text-[#CA6F06]" />,
      title: "E-mail",
      description: "support@wundu.com",
      subDescription: "Respostas em até 24h",
    },
    {
      icon: <PhoneIcon className="w-10 h-10 text-[#CA6F06]" />,
      title: "Telefone",
      description: "+244 923 123 456",
      subDescription: "Seg-Sex 08AM-10PM",
    },
    {
      icon: <MessageIcon className="w-10 h-10 text-[#CA6F06]" />,
      title: "Whatsapp",
      description: "+244 923 123 456",
      subDescription: "Seg-Sex 08AM-10PM",
    },
    // {
    //   icon: <LocationIcon className="w-10 h-10 text-[#CA6F06]" />,
    //   title: 'Escritório',
    //   description: 'Luanda, Maianga',
    //   subDescription: 'Rua da Liberdade, 123'
    // }
  ];

  return (
    <section className="py-16 bg-white border-2 m-2 border-gray-100 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in-section">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Como nos contactar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos sempre disponíveis para esclarecer suas dúvidas e receber
            seus comentários.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 fade-in-section"
            >
              <div className="text-3xl mb-4 flex items-center justify-center">
                <div className="bg-[#FFC72730] rounded-full p-2">
                  {method.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {method.title}
              </h3>
              <p className="text-gray-700 font-medium mb-1">
                {method.description}
              </p>
              <p className="text-gray-500 text-sm">{method.subDescription}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactMethods;
