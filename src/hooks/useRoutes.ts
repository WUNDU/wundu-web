import { useRouter } from "next/navigation";
import { ROUTES } from "../constants/routes";

export function useRoutes() {
  const routes = useRouter();
  const financial = () => routes.push(ROUTES.FINANCIAL);

  return { financial };
}
