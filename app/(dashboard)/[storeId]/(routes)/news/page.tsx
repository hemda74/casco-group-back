import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

import { ProductsClient } from './components/client';
import { ProductColumn } from './components/columns';
import { title } from 'process';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
	const news = await prismadb.news.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			category: true,
		},
		orderBy: {
			title: 'desc',
		},
	});

	const formattedProducts: ProductColumn[] = news.map((item) => ({
		id: item.id,
		title: item.title,
		title_ar: item.title_ar,
		paragraph_1: item.paragraph_1,
		paragraph_1_ar: item.paragraph_1_ar,
		paragraph_2: item.paragraph_2,
		paragraph_2_ar: item.paragraph_2_ar,
		paragraph_3: item.paragraph_3,
		paragraph_3_ar: item.paragraph_3_ar,
		paragraph_4: item.paragraph_4,
		paragraph_4_ar: item.paragraph_4_ar,
		paragraph_5: item.paragraph_5,
		paragraph_5_ar: item.paragraph_5_ar,
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
