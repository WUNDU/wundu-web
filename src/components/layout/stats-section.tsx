import React, { useEffect, useState } from "react";
import { FileIcon } from "@/constants/icons";
import { DocumentService } from "@/services/document.service";

interface StatsCardProps {
  icon: React.ElementType;
  count: number | string;
  label: string;
  color: string;
  iconColor: string;
  border?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, count, label, color, iconColor, border }) => (
  <div className={`flex flex-col md:flex-row items-center justify-center space-x-1 sm:space-x-2 lg:space-x-4 bg-white p-1 sm:p-2 lg:p-4 ${border} min-w-fit`}>
    <div className={`p-1 sm:p-2 lg:p-3 rounded-full ${color}`}>
      <Icon className={`w-3 h-3 sm:w-4 lg:w-6 sm:h-4 lg:h-6 ${iconColor}`} />
    </div>
    <div className="text-center md:text-left">
      <h3 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">{count}</h3>
      <p className="text-xs sm:text-xs lg:text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const StatsSection: React.FC = () => {
  const [totalDocuments, setTotalDocuments] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDocumentsCount = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const count = await DocumentService.getTotalDocuments();
        if (isMounted) {
          setTotalDocuments(count);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : "Não foi possível obter o total de comprovativos.";
          setError(message);
          setTotalDocuments(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDocumentsCount();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayCount = isLoading
    ? "..."
    : (totalDocuments ?? 0).toLocaleString("pt-AO");

  return (
    <section className="flex-1 w-full mt-4 sm:mt-6 md:mt-0">
      <div className="rounded-3xl bg-white border border-gray-100 shadow-lg ring-1 ring-black/5 p-3 sm:p-5 lg:p-7">
        <div className="flex flex-col gap-2">
          <StatsCard
            icon={FileIcon}
            count={displayCount}
            label="Total de comprovativos"
            color="bg-blue-50"
            iconColor="text-blue-500"
          />
          {error && (
            <p className="text-xs text-red-500 text-center sm:text-left">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
