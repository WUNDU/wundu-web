import DashboardLayout from "@/modules/dashboard/components/dashboard-layout";

export default function HomeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
