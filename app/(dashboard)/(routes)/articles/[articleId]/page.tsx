import prismadb from '@/lib/prismadb';

import { EventForm } from './components/event-form';

const ProductPage = async ({
	params,
}: {
	params: { articleId: string; storeId: string };
}) => {
	const article = await prismadb.event3.findUnique({
		where: {
			id: params.articleId,
		},
		include: {
			paragraph_event3: true,
			paragraph_event_ar3: true
		},
	});

	const categories = await prismadb.newsCategory.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	return (
		<div className="flex-row">
			<div className="flex-1 space-x-4 p-8 pt-6">
				<EventForm
					categories={categories}
					initialData={article}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
