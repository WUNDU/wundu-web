import { logotype } from "@/src/constants/images";
import Image from "next/image";

const LogoType = () => (
  <div className="flex items-center space-x-2">
    <div className="">
      <Image src={logotype} alt={"logotype"} />
    </div>
  </div>
);

export default LogoType;
