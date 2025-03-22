import Dashboard from "@/components/Dashboard/Dashboard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth()
  if (!session?.user) redirect(`/`)
  return (
    <div className="grow px-12 py-8">
      <Dashboard />
    </div>
  );
}
export default DashboardPage