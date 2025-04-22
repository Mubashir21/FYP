import RealTimeAccountApprovalTable from "@/components/settings/approvals/realtime-account-approval";
import { fetchPendingApprovals } from "@/lib/data";

export default async function AccountApprovals() {
  const profiles = await fetchPendingApprovals();
  return (
    <div>
      <RealTimeAccountApprovalTable initialProfiles={profiles} />
    </div>
  );
}
