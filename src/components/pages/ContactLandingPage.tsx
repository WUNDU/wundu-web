// src/components/templates/ContactTemplate/index.tsx
'use client';
import React, { useEffect } from 'react';
import LandingHeader from '@/src/components/organisms/LandingHeader';
import LandingFooter from '@/src/components/organisms/LandingFooter';
import HeroSection from '@/src/components/organisms/HeroSection';
import FeaturesSection from '@/src/components/organisms/FeaturesSection';
import AISection from '@/src/components/organisms/AISection';
import ContactForm from '@/src/components/molecules/ContactForm';
import PageHero from '../organisms/PageHero';

const ContactLandingPage: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Dados para métodos de contacto
  const contactMethods = [
    {
      icon: '📧',
      title: 'E-mail',
      description: 'support@wundu.com',
      subDescription: 'Respostas em até 24h'
    },
    {
      icon: '📞',
      title: 'Telefone',
      description: '+244 923 123 456',
      subDescription: 'Seg-Sex 09AM-10PM'
    },
    {
      icon: '💬',
      title: 'Whatsapp',
      description: '+244 923 123 456',
      subDescription: 'Seg-Sex 09AM-10PM'
    },
    {
      icon: '📍',
      title: 'Escritório',
      description: 'Luanda, Malanga',
      subDescription: 'Rua de Liberdade, 123'
    }
  ];

  // Dados para perguntas frequentes
  const faqFeatures = [
    {
      icon: '🔒',
      title: 'Os meus dados estão seguros?',
      description: 'Sim, utilizamos criptografia de nível bancário para proteger todas as suas informações.'
    },
    {
      icon: '📊',
      title: 'Como categorizar as transações?',
      description: 'A IA categoriza automaticamente, mas pode editar e criar categorias personalizadas.'
    },
    {
      icon: '📤',
      title: 'Como funciona o Upload?',
      description: 'Arrasta o arquivo PDF ou imagem para a área de upload e nossa IA processa automaticamente.'
    },
    {
      icon: '💾',
      title: 'Posso transferir os meus dados?',
      description: 'Sim, você pode exportar relatórios em PDF e CSV a qualquer momento.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      {/* Hero Section Reutilizada */}
      <PageHero
        title="Fale Connosco"
        description="Tem alguma dúvida ou sugestão? A nossa equipe está pronta para te ajudar."
      />

      {/* Métodos de Contacto usando FeaturesSection */}
      <FeaturesSection
        title="Como nos contactar"
        subtitle="Estamos sempre disponíveis para esclarecer suas dúvidas e receber seus comentários."
        features={contactMethods}
        backgroundColor="bg-gray-50"
      />

      {/* Formulário e FAQ usando AISection adaptado */}
      <section className="py-20 bg-white border-2 m-2 border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Formulário */}
            <div className="fade-in-section">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Envia-nos uma Mensagem
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Preencha o formulário abaixo que nós entraremos em contacto consigo
              </p>
              <ContactForm />
            </div>

            {/* FAQ e Horário */}
            <div className="fade-in-section">
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h3>
                <div className="space-y-6">
                  {faqFeatures.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.title}</h4>
                      <p className="text-gray-600">{faq.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Horário de Atendimento</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex justify-between">
                    <span>Segunda–Sexta</span>
                    <span>8:00–18:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sábado</span>
                    <span>10:00–14:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Domingo</span>
                    <span>Fechado</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default ContactLandingPage;