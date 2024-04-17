import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

import { ProductsClient } from './components/client';
import { ProductColumn } from './components/columns';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
	const courses = await prismadb.service.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			category: true,
		},
		orderBy: {
			name: 'desc',
		},
	});

	const formattedProducts: ProductColumn[] = courses.map((item) => ({
		id: item.id,
		name: item.name,
		name_ar: item.name_ar,
		title: item.title,
		title_ar: item.title_ar,
		explanation: item.explanation,
		explanation_2: item.explanation_2,
		explanation_ar: item.explanation_ar,
		explanation_2_ar: item.explanation_2_ar,
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
