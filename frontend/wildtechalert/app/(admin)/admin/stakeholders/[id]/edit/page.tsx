import { getStakeholderById } from "@/lib/data";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Form from "@/components/stakeholders/edit-form";

type Params = Promise<{ id: string }>;

export default async function EditStakeholder({ params }: { params: Params }) {
  const { id } = await params;

  const stakeholder = await getStakeholderById(id);

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/stakeholders">
              Stakeholders
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Stakeholder</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-5">
        {/* <p className="text-3xl font-semibold">{stakeholder.name}</p> */}
        <Form stakeholder={stakeholder} />
      </div>
    </main>
  );
}
