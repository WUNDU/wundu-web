import { UploadOptionsProps } from "@/src/types/button";
import OptionButton from "../atoms/OptionButton";
import Image from "../icons/Image";
import Receipt from "../icons/Receipt";
import { useRef } from "react";


const UploadOptions: React.FC<UploadOptionsProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0], type);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <OptionButton icon={Receipt} text="Comprovativo" onClick={handleButtonClick} />
      <OptionButton icon={Image} text="Imagem" onClick={handleButtonClick} />
      <OptionButton icon={Receipt} text="Documento" onClick={handleButtonClick} />

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e, 'document')}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default UploadOptions