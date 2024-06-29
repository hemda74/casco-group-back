import prismadb from '@/lib/prismadb';
import { CourseForm } from './components/course-form';

const CategoryPage = async ({
	params,
}: {
	params: { courseId: string; storeId: string };
}) => {
	const course = await prismadb.course.findUnique({
		where: {
			id: params.courseId,
		},
		include: {
			c_intro_ar: true,
			c_intro_en: true,
			c_certification_ar: true,
			c_certification_en: true,
			c_date_ar: true,
			c_date_en: true,
			c_benefit_ar: true,
			c_benefit_en: true,
			c_content_ar: true,
			c_content_en: true,
			c_objective_ar: true,
			c_objective_en: true,
			c_who_should_ar: true,
			c_who_should_en: true,
			images: true,
		},
	});

	const categories = await prismadb.coursesCategory.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<CourseForm
					categories={categories}
					initialData={course}
				/>
			</div>
		</div>
	);
};
export default CategoryPage;
