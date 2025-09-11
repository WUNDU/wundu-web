import { DetailsModalProps } from "@/src/types/modal";
import Calendar from "../icons/Calendar";
import Download from "../icons/Download";
import Info from "../icons/Info";
import Money from "../icons/Money";
import CategoryButton from "../molecules/CategoryButton";
import DetailsSection from "../molecules/DetailsSection";
import ModalHeader from "../molecules/ModalHeader";

const DetailsModal = ({ onClose }: DetailsModalProps) => {
  const handleDownload = () => {
    console.log("Download iniciado!");
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden">
        <ModalHeader title="Detalhes" onClose={onClose} />

        <div className="p-6 text-center">
          <div className="flex justify-between items-center mb-6 py-2 px-4 bg-[#ECF7F2]">
            <div className="rounded-full text-[#4EC988]">
              <span className="font-medium text-center">Comprovativo-12</span>
            </div>
            <div>
              <button onClick={handleDownload} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <Download />
              </button>
            </div>

          </div>

          <DetailsSection icon={<Money />} label="Montante">
            <span className="text-xs font-medium text-gray-500">Valor</span>
            <div className="py-3 px-4 bg-[#F2F7F2] rounded-xl text-[#0F2045] font-bold text-center">
              300.000,00kz
            </div>
          </DetailsSection>

          <DetailsSection icon={<Calendar />} label="Data e Hora">
            <div className="flex gap-4">
              <div className="flex-1">
                <span className="text-xs font-medium text-gray-500">Data</span>
                <div className="py-3 px-4 bg-[#F2F2F7] rounded-xl text-[#0F2045] font-bold mt-1">
                  12 jan de 2025
                </div>
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-gray-500">Hora</span>
                <div className="py-3 px-4 bg-[#F2F2F7] rounded-xl text-[#0F2045] font-bold mt-1">
                  12:32
                </div>
              </div>
            </div>
          </DetailsSection>

          <DetailsSection icon={<Info />} label="Outras informações">
            <span className="text-xs font-medium text-gray-500">Número de operação</span>
            <div className="py-3 px-4 bg-[#F2F2F7] rounded-xl text-[#0F2045] font-bold mt-1">
              287805888
            </div>
          </DetailsSection>
        </div>

        <div className="p-6 pt-0">
          <CategoryButton label="Definir categoria" />
        </div>
      </div>
    </div>
  );
};

export default DetailsModal