import { requireAuth } from "@/lib/auth";
import DashboardClient from "@/components/layout/DashboardClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return <DashboardClient user={user}>{children}</DashboardClient>;
}
