import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { InsidersViewColumn } from "./components/columns"
import { InsidersviewClient } from "./components/client";

const insidersViewsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const insidersViews = await prismadb.insidersView.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      title: 'desc'
    }
  });

  const formattedinsidersViews: InsidersViewColumn[] = insidersViews.map((item) => ({
    id: item.id,
    name: item.name,
    name_ar: item.name_ar,
    title: item.title,
    title_ar: item.title_ar,
    text: item.text,
    text_ar: item.text_ar
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InsidersviewClient data={formattedinsidersViews} />
      </div>
    </div>
  );
};

export default insidersViewsPage;
