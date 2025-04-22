import { getDevices } from "@/lib/data";
import RealTimeDevicesTable from "@/components/devices/realtime-devices-table";

export default async function Devices() {
  const devices = await getDevices();
  return (
    <div>
      <RealTimeDevicesTable initialDevices={devices} />
    </div>
  );
}
