import React, { useEffect, useState } from "react";
import { StatsCard } from "@/ui/atoms";
import { FileIcon } from "@/constants/icons";
import { DocumentService } from "@/services/document-service";

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
