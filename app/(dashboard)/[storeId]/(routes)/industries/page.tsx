import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';

import { IndustryColumn } from './components/columns';
import { IndustryClient } from './components/client';

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
	const categories = await prismadb.industry.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			category: true,
			expertIndustry: true,
		},
		orderBy: {
			name: 'desc',
		},
	});

	const formattedCategories: IndustryColumn[] = categories.map(
		(item) => ({
			id: item.id,
			name: item.name,
			name_ar: item.name_ar,
			category: item.category.name,
			expert_name: item.expertIndustry.map((ex) => ex.expert_name),
			expert_name_ar: item.expertIndustry.map((ex) => ex.expert_name_ar),
			expert_title: item.expertIndustry.map((ex) => ex.expert_title),
			expert_title_ar: item.expertIndustry.map((ex) => ex.expert_title_ar),
			expert_mail: item.expertIndustry.map((ex) => ex.expert_mail),
			expert_phone: item.expertIndustry.map((ex) => ex.expert_phone),
		})
	);

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<IndustryClient data={formattedCategories} />
			</div>
		</div>
	);
};

export default CategoriesPage;
