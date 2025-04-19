import { DetectionColumns } from "@/components/detections/columns";
import DetectionsTable from "@/components/detections/detections-table";
import { getDetections } from "@/lib/data";

export default async function Detections() {
  const detections = await getDetections();
  return (
    <div>
      <div className="mb-4 text-xl md:text-2xl">Detections</div>
      <DetectionsTable columns={DetectionColumns} data={detections} />
    </div>
  );
}
