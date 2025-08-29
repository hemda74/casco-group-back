import prismadb from '@/lib/prismadb';
import { CourseForm } from './components/course-form';

const CategoryPage = async ({
	params,
}: {
	params: { courseid: number; };
}) => {
	const course = await prismadb.course.findUnique({
		where: {
			id: params.courseid,
		},
		include: {
			CourseType: true,
			c_intro_ar: true,
			c_intro_en: true,
			c_content2_ar: true,
			c_content2_en: true,
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
		},
	});

	const categories = await prismadb.coursesCategory.findMany({

	});
	const types = await prismadb.courseType.findMany({

	});
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<CourseForm
					categories={categories}
					initialData={course}
					types={types}
				/>
			</div>
		</div>
	);
};
export default CategoryPage;
