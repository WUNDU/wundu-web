import type { ReactNode } from "react";
import Layout from "app/components/layout/Layout";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
