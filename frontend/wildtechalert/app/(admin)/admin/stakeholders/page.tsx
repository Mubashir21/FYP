import { getStakeholders } from "@/lib/data";
import RealTimeStakeholdersPage from "@/components/stakeholders/realtime-stakeholders-table";

export default async function Stakeholders() {
  const stakeholders = await getStakeholders();
  return (
    <div>
      <RealTimeStakeholdersPage initialStakeholders={stakeholders} />
    </div>
  );
}
