import prismadb from '@/lib/prismadb';
import { CourseColumn } from './components/columns';
import { CourseClient } from './components/client';

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
	const categories = await prismadb.course.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			CourseType: true,
			category: true,
			c_benefit_ar: true,
			c_benefit_en: true,
			c_certification_ar: true,
			c_certification_en: true,
			c_content_ar: true,
			c_content_en: true,
			c_date_ar: true,
			c_date_en: true,
			c_intro_ar: true,
			c_intro_en: true,
			c_objective_ar: true,
			c_objective_en: true,
			c_who_should_ar: true,
			c_who_should_en: true,
		},
		orderBy: {
			c_title: 'desc',
		},
	});

	const formattedCategories: CourseColumn[] = categories.map((item) => ({
		id: item.id,
		c_title: item.c_title,
		c_title_ar: item.c_title_ar,
		category: item.category.name,
		CourseType: item.CourseType.name,
		price_egp: item.price_egp,
		price_ksa: item.price_ksa,
		price_uae: item.price_uae,
		price_usd: item.price_usd,
		c_short_intro_en: item.c_short_intro_en,
		c_short_intro_ar: item.c_short_intro_ar,
		c_duration_en: item.c_duration_en,
		c_duration_ar: item.c_duration_ar,
		c_in_house_en: item.c_in_house_en,
		c_in_house_ar: item.c_in_house_ar,
		c_delv_and_leaders_en: item.c_delv_and_leaders_en,
		c_delv_and_leaders_ar: item.c_delv_and_leaders_ar,
		c_intro_en: item.c_intro_en.map((ex) => ex.text),
		c_intro_ar: item.c_intro_ar.map((ex) => ex.text),
		c_date_en: item.c_date_en.map((ex) => ex.text),
		c_date_ar: item.c_date_ar.map((ex) => ex.text),
		c_content_en: item.c_content_en.map((ex) => ex.text),
		c_content_ar: item.c_content_ar.map((ex) => ex.text),
		c_who_should_en: item.c_who_should_en.map((ex) => ex.text),
		c_who_should_ar: item.c_who_should_ar.map((ex) => ex.text),
		c_objective_en: item.c_objective_en.map((ex) => ex.text),
		c_objective_ar: item.c_objective_ar.map((ex) => ex.text),
		c_benefit_en: item.c_benefit_en.map((ex) => ex.text),
		c_benefit_ar: item.c_benefit_ar.map((ex) => ex.text),
		c_certification_en: item.c_certification_en.map((ex) => ex.text),
		c_certification_ar: item.c_certification_ar.map((ex) => ex.text),
	}));
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<CourseClient data={formattedCategories} />
			</div>
		</div>
	);
};

export default CategoriesPage;
