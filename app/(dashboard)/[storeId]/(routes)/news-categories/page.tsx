import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';

import { CategoryColumn } from './components/columns';
import { CategoriesClient } from './components/client';

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
	const categories = await prismadb.newsCategory.findMany({
		where: {
			storeId: params.storeId,
		},

		orderBy: {
			createdAt: 'desc',
		},
	});

	const formattedCategories: CategoryColumn[] = categories.map(
		(item) => ({
			id: item.id,
			name: item.name,
			name_ar: item.name_ar,
			createdAt: format(item.createdAt, 'MMMM do, yyyy'),
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
