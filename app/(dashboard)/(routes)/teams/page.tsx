import prismadb from '@/lib/prismadb';
import { CategoryColumn } from './components/columns';
import { CategoriesClient } from './components/client';

const CategoriesPage = async ({ params }: { params: {} }) => {
	const categories = await prismadb.team.findMany({


		orderBy: {
			name: 'desc',
		},
	});

	const formattedCategories: CategoryColumn[] = categories.map(
		(item) => ({
			id: item.id,
			name: item.name,
			name_ar: item.name_ar,
			address: item.address,
			address_ar: item.address_ar,
			phone: item.phone,
			linkedin: item.linkedin,
		})
	);

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<CategoriesClient data={formattedCategories} />
			</div>
		</div>
	);
};

export default CategoriesPage;
