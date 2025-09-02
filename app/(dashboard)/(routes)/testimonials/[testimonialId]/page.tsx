import prismadb from "@/lib/prismadb";

import { InsidersViewForm } from "./components/insiders-form";

const InsidersViewPage = async ({
  params
}: {
  params: { testimonialid: number }
}) => {
  const InsidersView = await prismadb.testimonials.findUnique({
    where: {
      id: params.testimonialid
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InsidersViewForm initialData={InsidersView} />
      </div>
    </div>
  );
}

export default InsidersViewPage;
