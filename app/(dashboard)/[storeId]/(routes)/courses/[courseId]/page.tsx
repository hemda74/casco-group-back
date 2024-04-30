import prismadb from '@/lib/prismadb';

import { CourseForm } from './components/course-form';

const ProductPage = async ({
	params,
}: {
	params: { courseId: string; storeId: string };
}) => {
	const Course = await prismadb.course.findUnique({
		where: {
			id: params.courseId,
		},
		include: {
			images: true,
		},
	});

	const categories = await prismadb.coursesCategory.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	// const colors = await prismadb.color.findMany({
	//   where: {
	//     storeId: params.storeId,
	//   },
	// });

	return (
		<div className="flex-row">
			<div className="flex-1 space-x-4 p-8 pt-6">
				<CourseForm
					categories={categories}
					initialData={Course}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
