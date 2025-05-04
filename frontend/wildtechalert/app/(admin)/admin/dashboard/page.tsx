import Map from "@/components/admin/dashboard/map";
import { fetchCardsData, getDetections, getDevicesByStatus } from "@/lib/data";
import { DetectionsChart } from "@/components/admin/dashboard/detections/detections-chart";
import { DetectionsByDevicesChart } from "@/components/admin/dashboard/detections/detections-devices-chart";
import { SectionCards } from "@/components/admin/dashboard/section-cards";

export default async function Dashboard() {
  const devices = await getDevicesByStatus();
  const detections = await getDetections();
  const cardData = await fetchCardsData();

  const data = [
    cardData.deviceCount.toLocaleString(),
    cardData.totalDetectionCount.toLocaleString(),
    cardData.stakeholderCount.toLocaleString(),
    cardData.alertCount.toLocaleString(),
    cardData.todayDetectionCount.toLocaleString(),
  ];
  return (
    <main className="">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <div className="flex flex-col gap-4 md:col-span-4">
          <p className="text-xl">Devices</p>
          <DataTable columns={DeviceSummaryColumns} data={devices} />
        </div>
        <div className="flex flex-col gap-4 md:col-span-4">
          <p className="text-xl">Detections</p>
          <DataTable columns={DetectionSummaryColumns} data={detections} />
        </div> */}
        <div className="flex flex-col gap-4 md:col-span-8">
          <SectionCards data={data} />
        </div>
        <div className="flex flex-col gap-4 md:col-span-8">
          <DetectionsChart detections={detections} />
        </div>
        <div className="flex flex-col gap-4 md:col-span-8">
          <Map devices={devices} />
        </div>
        <div className="flex flex-col gap-4 md:col-span-4">
          <DetectionsByDevicesChart detections={detections} devices={devices} />
        </div>
      </div>
    </main>
  );
}
