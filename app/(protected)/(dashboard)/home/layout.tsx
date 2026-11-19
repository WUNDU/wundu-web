import type { ReactNode } from "react";
import Layout from "app/components/layout/Layout";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      {/* density-compact: ativa a escala compacta (< 2xl) definida em globals.css */}
      <div className="density-compact contents">{children}</div>
    </Layout>
  );
}
