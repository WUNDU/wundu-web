import { UploadOptionsProps } from "@/types/button";
import { ImageIcon, ReceiptIcon } from "@/constants/icons";
import { useRef } from "react";
import { EditIcon } from "@/constants/icons";
import { Button } from "@/ui/atoms";

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
        leftIcon={<ReceiptIcon />}
        label="Comprovativo"
        variant="option"
        onClick={handleButtonClick}
      />
      {/* <Button
        leftIcon={<ImageIcon />}
        label="Imagem"
        variant="option"
        onClick={handleButtonClick}
      /> */}
      <Button
        leftIcon={<ReceiptIcon />}
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
    </div>
  );
};

export default UploadOptions;
