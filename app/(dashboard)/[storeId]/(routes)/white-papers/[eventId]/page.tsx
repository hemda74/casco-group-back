import prismadb from '@/lib/prismadb';

import { EventForm } from './components/event-form';

const ProductPage = async ({
	params,
}: {
	params: { eventId: string; storeId: string };
}) => {
	const event = await prismadb.event2.findUnique({
		where: {
			id: params.eventId,
		},
		include: {
			paragraph_event2: true,
			paragraph_event_ar2: true
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
					initialData={event}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
