import DevicesTable from "@/components/devices/devices-table";
import { DeviceColumns } from "@/components/devices/columns";
import { getDevices } from "@/lib/data";

export default async function Devices() {
  const devices = await getDevices();
  return (
    <div>
      <div className="mb-4 text-xl md:text-2xl">Devices</div>
      <DevicesTable columns={DeviceColumns} data={devices} />
    </div>
  );
}
