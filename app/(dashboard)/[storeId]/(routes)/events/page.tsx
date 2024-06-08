import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

import { ProductsClient } from './components/client';
import { ProductColumn } from './components/columns';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
	const event = await prismadb.event.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			category: true,
			paragraph_event: true,
			paragraph_event_ar: true
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const formattedProducts: ProductColumn[] = event.map((item) => ({
		id: item.id,
		title: item.title,
		title_ar: item.title_ar,
		category: item.category.name,
		paragraph_event: item.paragraph_event.map(p => p.text),
		paragraph_event_ar: item.paragraph_event_ar.map(p => p.text),
		createdAt: format(item.createdAt, 'MMMM do, yyyy'),


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
