import DashboardLayout from "@/ui/organisms/dashboard-layout";

export default function HomeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
