import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

import { ProductsClient } from './components/client';
import { ProductColumn } from './components/columns';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
	const courses = await prismadb.course.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			category: true,
		},
		orderBy: {
			date_and_rev: 'desc',
		},
	});

	const formattedProducts: ProductColumn[] = courses.map((item) => ({
		id: item.id,
		name: item.name,
		name_ar: item.name_ar,

		price: formatter.format(item.price.toNumber()),
		category: item.category.name,
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ProductsClient data={formattedProducts} />
			</div>
		</div>
	);
};

export default ProductsPage;
