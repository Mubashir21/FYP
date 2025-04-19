import { DataTable } from "@/components/dashboard/data-table";
import Map from "@/components/dashboard/map";
import {
  DetectionSummaryColumns,
  DeviceSummaryColumns,
} from "@/components/dashboard/columns";
import { getDetections, getDevices } from "@/lib/data";

export default async function Dashboard() {
  const devices = await getDevices();
  const detections = await getDetections();
  return (
    <main className="">
      <h1 className="mb-4 text-xl md:text-2xl">Dashboard</h1>
      <Map devices={devices} />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <div className="flex flex-col gap-4 md:col-span-4">
          <p className="text-xl">Devices</p>
          <DataTable columns={DeviceSummaryColumns} data={devices} />
        </div>
        <div className="flex flex-col gap-4 md:col-span-4">
          <p className="text-xl">Detections</p>
          <DataTable columns={DetectionSummaryColumns} data={detections} />
        </div>
      </div>
    </main>
  );
}
