import { UploadOptionsProps } from "@/src/types/button";
import Image from "../icons/Image";
import Receipt from "../icons/Receipt";
import { useRef } from "react";
import { EditIcon } from "@/src/constants/icons";
import Button from "../atoms/Button";

const UploadOptions: React.FC<UploadOptionsProps> = ({
  onFileSelect,
  onManualClick,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "document"
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0], type);
    }
  };

  const handleManualButtonClick = () => {
    if (onManualClick) {
      onManualClick();
    } else {
      handleButtonClick();
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button
        leftIcon={<EditIcon />}
        variant="option"
        label="Manual"
        onClick={handleManualButtonClick}
      />
      <Button
        leftIcon={<Receipt />}
        label="Comprovativo"
        variant="option"
        onClick={handleButtonClick}
      />
      <Button
        leftIcon={<Image />}
        label="Imagem"
        variant="option"
        onClick={handleButtonClick}
      />
      <Button
        leftIcon={<Receipt />}
        variant="option"
        label="Extrato Bancário"
        onClick={handleButtonClick}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e, "document")}
        style={{ display: "none" }}
      />
      <div className="text-center">
        <div className="flex justify-center items-center p-4">
          <Button variant="more" label="Ver mais" color="bg-yellow-400" />
        </div>
      </div>
    </div>
  );
};

export default UploadOptions;
