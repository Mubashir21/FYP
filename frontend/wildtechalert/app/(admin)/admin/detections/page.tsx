import RealTimeDetectionsTable from "@/components/detections/realtime-detections";
import { getDetections } from "@/lib/data";

export default async function Detections() {
  const detections = await getDetections();
  return (
    <div>
      <RealTimeDetectionsTable initialDetections={detections} />
    </div>
  );
}
