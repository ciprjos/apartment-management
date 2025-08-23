import { auth } from "@/auth";
import { JSX } from "react";
import { AdminDashboard } from "./_components/admin-dashboard";
import { LandlordDashboard } from "./_components/landlord-dashboard";
import { TenantDashboard } from "./_components/tenant-dashboard";
import { ADMIN_ROLE, LANDLORD_ROLE, TENANT_ROLE } from "@/lib/constants";

type DashboardComponentType = () => JSX.Element;

const RoleDashboardMap: Record<string, DashboardComponentType> = {
  [ADMIN_ROLE]: AdminDashboard,
  [LANDLORD_ROLE]: LandlordDashboard,
  [TENANT_ROLE]: TenantDashboard,
};
export default async function DashboardPage() {
  const session = await auth();

  const DashboardComponent =
    RoleDashboardMap[session!.user.role] ?? LandlordDashboard;

  return (
    <>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DashboardComponent />
      </div>
    </>
  );
}
