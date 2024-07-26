"use client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";
import { columns, InsidersViewColumn } from "./columns";
interface InsidersviewClientProps {
  data: InsidersViewColumn[];
}
export const InsidersviewClient: React.FC<InsidersviewClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`testimonials (${data.length})`} description="Manage testimonials for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/testimonials/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for testimonials" />
      <Separator />
      {/* <ApiList entityName="testimonials" entityIdName="testimonialId" /> */}
    </>
  );
};
