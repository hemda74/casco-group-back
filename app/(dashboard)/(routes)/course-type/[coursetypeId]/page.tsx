import prismadb from "@/lib/prismadb";

import { CourseTypeForm } from "./components/size-form";

const SizePage = async ({
  params
}: {
  params: { coursetypeid: number }
}) => {
  const size = await prismadb.courseType.findUnique({
    where: {
      id: params.coursetypeId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CourseTypeForm initialData={size} />
      </div>
    </div>
  );
}

export default SizePage;
