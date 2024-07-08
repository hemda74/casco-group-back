import prismadb from '@/lib/prismadb';
import { IndustryColumn } from './components/columns';
import { IndustryClient } from './components/client';

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
	const categories = await prismadb.industry.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			expertIndustry: true,
			industryDetailes: {
				include: {
					industryDetailesPoint: true,
					industryDetailesPointAr: true,
				},
			},
			industryDetailes2: {
				include: {
					industryDetailesPoint2: true,
					industryDetailesPointAr2: true,
				},
			},
		},
		orderBy: {
			name: 'desc',
		},
	});

	const formattedCategories: IndustryColumn[] = categories.map((item) => ({
		id: item.id,
		name: item.name,
		name_ar: item.name_ar,
		expert_name: item.expertIndustry.map((ex) => ex.expert_name),
		expert_name_ar: item.expertIndustry.map((ex) => ex.expert_name_ar),
		expert_title: item.expertIndustry.map((ex) => ex.expert_title),
		expert_title_ar: item.expertIndustry.map((ex) => ex.expert_title_ar),
		expert_mail: item.expertIndustry.map((ex) => ex.expert_mail),
		expert_phone: item.expertIndustry.map((ex) => ex.expert_phone),
		paragraph_title: item.industryDetailes.map((i) => i.title),
		paragraph_title_ar: item.industryDetailes.map((i) => i.title_ar),
		paragraph_points: item.industryDetailes.flatMap((i) =>
			i.industryDetailesPoint.map((n) => n.text)
		),
		paragraph_points_ar: item.industryDetailes.flatMap((i) =>
			i.industryDetailesPointAr.map((n) => n.text)
		),
		how_can_help_title: item.industryDetailes2.map((i) => i.title),
		how_can_help_title_ar: item.industryDetailes2.map((i) => i.title_ar),
		how_can_help_points: item.industryDetailes2.flatMap((i) =>
			i.industryDetailesPoint2.map((n) => n.text)
		),
		how_can_help_points_ar: item.industryDetailes2.flatMap((i) =>
			i.industryDetailesPointAr2.map((n) => n.text)
		),
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<IndustryClient data={formattedCategories} />
			</div>
		</div>
	);
};

export default CategoriesPage;
