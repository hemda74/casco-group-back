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
			paragraph_news: true,
			paragraph_news_ar: true
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const formattedProducts: ProductColumn[] = news.map((item) => ({
		id: item.id,
		title: item.title,
		title_ar: item.title_ar,
		category: item.category.name,
		paragraph_news: item.paragraph_news.map(p => p.text),
		paragraph_news_ar: item.paragraph_news_ar.map(p => p.text),
		date_of_news: item.date_of_news,
		date_of_news_ar: item.date_of_news_ar,
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
