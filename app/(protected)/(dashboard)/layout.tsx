import DashboardLayout from "@/ui/organisms/DashboardLayout";


export default function HomeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
