import OptionButton from "../atoms/OptionButton";
import Image from "../icons/Image";
import Receipt from "../icons/Receipt";

const UploadOptions = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <OptionButton icon={Receipt} text="Comprovativo" onClick={() => console.log('Upload de Comprovativo')} />
      <OptionButton icon={Image} text="Imagem" onClick={() => console.log('Upload de Imagem')} />
      <OptionButton icon={Receipt} text="Documento" onClick={() => console.log('Upload de Documento')} />
    </div>
  );
};

export default UploadOptions