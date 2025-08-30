import prismadb from '@/lib/prismadb';

import { NewsForm } from './components/news-form';

const ProductPage = async ({
	params,
}: {
	params: { newsid: number; };
}) => {
	const News = await prismadb.news.findUnique({
		where: {
			id: params.newsid,
		},
		include: {
			paragraph_news: true,
			paragraph_news_ar: true
		},
	});

	const categories = await prismadb.newsCategory.findMany({

	});
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
