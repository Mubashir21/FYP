import RealTimeAlertsTable from "@/components/admin/alerts/realtime-alerts";
import { getEmailAlerts } from "@/lib/data";

export default async function Alerts() {
  const alerts = await getEmailAlerts();
  return (
    <div>
      <RealTimeAlertsTable initialAlerts={alerts} />
    </div>
  );
}
