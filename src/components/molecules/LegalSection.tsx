import type { ReactNode } from "react";

interface LegalSectionProps {
  icon: ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}

const LegalSection: React.FC<LegalSectionProps> = ({
  icon,
  title,
  children,
  delay = 0,
}) => {
  return (
    <div
      className="bg-gray-50 rounded-2xl p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group fade-in-section border border-gray-100"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start space-x-6">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-900 transition-colors">
            {title}
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalSection;
