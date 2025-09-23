import { DetailsModalProps } from "@/src/types/modal";
import CategoryButton from "../molecules/CategoryButton";
import DetailsSection from "../molecules/DetailsSection";
import ModalHeader from "../molecules/ModalHeader";
import { CalendarIcon, DownloadIcon, InfoIcon, MoneyIcon } from "@/src/constants/icons";
import { useCategoryContext } from "@/src/contexts/CategoryContext";

const DetailsModal = ({ onClose }: DetailsModalProps) => {
  const { setIsCategoryModalOpen } = useCategoryContext();

  const handleDownload = () => {
    console.log("Download iniciado!");
  };

  const handleDefineCategory = () => {
    onClose();
    setIsCategoryModalOpen(true);
  };

  return (
    <>
      {/* Desktop: Sem sombra, ocupa todo o espaço disponível */}
      <div className="hidden md:block bg-white rounded-2xl w-full h-full p-10 overflow-hidden">
        <ModalHeader title="Detalhes" onClose={onClose} />

        <div className="p-6 text-center">
          <div className="flex w-full justify-between items-center rounded-2xl mb-6 py-2 px-4 bg-[#ECF7F2]">
            <span className="font-medium text-[#49B58F] flex-1 text-center">
              Comprovativo-12
            </span>

            <button
              onClick={handleDownload}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <DownloadIcon />
            </button>
          </div>



          <DetailsSection icon={<MoneyIcon />} label="Montante">
            <span className="text-sm text-start font-medium text-gray-500">Valor</span>
            <div className="py-3 px-4 bg-[#ECF7F2] rounded-xl text-[#4EC988] font-bold text-center">
              300.000,00kz
            </div>
          </DetailsSection>
          <div className="flex flex-1 items-center justify-between">
            <DetailsSection icon={<CalendarIcon />} label="Data e Hora">
              <div className="flex items-center justify-between space-x-8">
                <div>
                  <span className="text-sm font-medium text-gray-500">Data</span>
                  <div className="py-3 px-4 bg-[#F2F2F7] rounded-xl text-[#0F2045] font-bold mt-1">
                    12 jan de 2025
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Hora</span>
                  <div className="py-3 px-4 bg-[#F2F2F7] rounded-xl text-[#0F2045] font-bold mt-1">
                    12:32
                  </div>
                </div>
              </div>
            </DetailsSection>

            <DetailsSection icon={<InfoIcon />} label="Outras informações">
              <span className="text-sm font-medium text-gray-500">Número de operação</span>
              <div className="py-3 px-4 bg-[#F2F2F7] rounded-xl text-[#0F2045] font-bold mt-1">
                287805888
              </div>
            </DetailsSection>
          </div >
        </div >
        <div className="p-6 pt-0">
          <CategoryButton
            label="Definir categoria"
            onClick={handleDefineCategory}
          />
        </div>
      </div >

      {/* Mobile: Mantém o comportamento original de modal */}
      < div className="md:hidden fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
          <ModalHeader title="Detalhes" onClose={onClose} />

          <div className="p-6 text-center">
            <div className="flex justify-between items-center mb-6 py-2 px-4 bg-[#ECF7F2]">
              <div className="rounded-full text-[#4EC988]">
                <span className="font-medium text-center">Comprovativo-12</span>
              </div>
              <div>
                <button onClick={handleDownload} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <DownloadIcon />
                </button>
              </div>
            </div>

            <DetailsSection icon={<MoneyIcon />} label="Montante">
              <span className="text-sm font-medium text-gray-500">Valor</span>
              <div className="py-3 px-4 bg-[#F2F7F2] rounded-xl text-[#4EC988] font-bold text-center">
                300.000,00kz
              </div>
            </DetailsSection>

            <DetailsSection icon={<CalendarIcon />} label="Data e Hora">
              <div className="flex gap-4">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-500">Data</span>
                  <div className="py-3 px-4 bg-[#F2F2F7] rounded-xl text-[#0F2045] font-bold mt-1">
                    12 jan de 2025
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-500">Hora</span>
                  <div className="py-3 px-4 bg-[#F2F2F7] rounded-xl text-[#0F2045] font-bold mt-1">
                    12:32
                  </div>
                </div>
              </div>
            </DetailsSection>

            <DetailsSection icon={<InfoIcon />} label="Outras informações">
              <span className="text-sm font-medium text-gray-500">Número de operação</span>
              <div className="py-3 px-4 bg-[#F2F2F7] rounded-xl text-[#0F2045] font-bold mt-1">
                287805888
              </div>
            </DetailsSection>
          </div>

          <div className="p-6 pt-0">
            <CategoryButton
              label="Definir categoria"
              onClick={handleDefineCategory}
            />
          </div>
        </div>
      </div >
    </>
  );
};

export default DetailsModal;