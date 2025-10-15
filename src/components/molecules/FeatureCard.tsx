const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center flex flex-col items-center space-y-4 hover:shadow-xl transition-shadow">
    <div className="bg-yellow-100 p-4 rounded-full text-yellow-500">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-blue-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default FeatureCard