interface TextSectionProps {
  title: string;
  content: string;
}

const TextSection: React.FC<TextSectionProps> = ({ title, content }) => {
  return (
    <section className="py-12 fade-in-section">
      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
        {title}
      </h2>
      <p className="text-2xl text-gray-700 leading-relaxed">{content}</p>
    </section>
  );
};

export default TextSection;
