import prismadb from '@/lib/prismadb';

import { NewsForm } from './components/news-form';

const ProductPage = async ({
	params,
}: {
	params: { newsId: string; storeId: string };
}) => {
	const News = await prismadb.news.findUnique({
		where: {
			id: params.newsId,
		},
		include: {
			images: true,
		},
	});

	const categories = await prismadb.newsCategory.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	// const colors = await prismadb.color.findMany({
	//   where: {
	//     storeId: params.storeId,
	//   },
	// });

	return (
		<div className="flex-row">
			<div className="flex-1 space-x-4 p-8 pt-6">
				<NewsForm
					categories={categories}
					initialData={News}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
