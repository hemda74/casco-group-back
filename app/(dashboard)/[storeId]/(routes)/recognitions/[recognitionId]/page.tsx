import prismadb from "@/lib/prismadb";

import { InsidersViewForm } from "./components/insiders-form";

const recognitionPage = async ({
  params
}: {
  params: { recognitionId: string }
}) => {
  const recognition = await prismadb.recognition.findUnique({
    where: {
      id: params.recognitionId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InsidersViewForm initialData={recognition} />
      </div>
    </div>
  );
}

export default recognitionPage;
