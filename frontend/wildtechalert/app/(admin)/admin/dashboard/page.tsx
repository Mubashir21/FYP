import { DataTable } from "@/components/dashboard/data-table";
import {
  DetectionColumns,
  DeviceColumns,
} from "@/components/dashboard/columns";
import { detDetections, getDevices } from "@/lib/data";

export default async function Dashboard() {
  const devices = await getDevices();
  const detections = await detDetections();
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <DataTable columns={DeviceColumns} data={devices} />
        <DataTable columns={DetectionColumns} data={detections} />
      </div>
    </main>
  );
}
