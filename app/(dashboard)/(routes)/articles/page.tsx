import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

import { ProductsClient } from './components/client';
import { ProductColumn } from './components/columns';

const ProductsPage = async ({ params }: { params: {} }) => {
	const event = await prismadb.event3.findMany({
		include: {
			category: true,
			paragraph_event3: true,
			paragraph_event_ar3: true
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const formattedProducts: ProductColumn[] = event.map((item) => ({
		id: item.id,
		title: item.title,
		title_ar: item.title_ar,
		date_of_event: item.date_of_event,
		date_of_event_ar: item.date_of_event_ar,
		category: item.category.name,
		paragraph_event: item.paragraph_event3.map(p => p.text),
		paragraph_event_ar: item.paragraph_event_ar3.map(p => p.text),
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
