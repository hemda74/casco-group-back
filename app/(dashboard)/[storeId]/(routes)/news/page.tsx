import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

import { ProductsClient } from './components/client';
import { ProductColumn } from './components/columns';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
	const news = await prismadb.news.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			category: true,
			paragraph: true
		},
		orderBy: {
			title: 'desc',
		},
	});

	const formattedProducts: ProductColumn[] = news.map((item) => ({
		id: item.id,
		title: item.title,
		title_ar: item.title_ar,
		category: item.category.name,
		paragraph: item.paragraph.map(p => p.text),
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
