import { getDeviceById } from "@/lib/data";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Form from "@/components/devices/edit-form";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const device = await getDeviceById(id);

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/devices">Devices</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Device</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-5">
        <p className="text-3xl font-semibold">{device.name}</p>
        <Form device={device} />
      </div>
    </main>
  );
}
