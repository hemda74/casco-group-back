import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';

import { SizeColumn } from './components/columns';
import { SizesClient } from './components/client';

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
	const types = await prismadb.courseType.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const formattedSizes: SizeColumn[] = types.map((item) => ({
		id: item.id,
		name: item.name,
		name_ar: item.name_ar,

		createdAt: format(item.createdAt, 'MMMM do, yyyy'),
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SizesClient data={formattedSizes} />
			</div>
		</div>
	);
};

export default SizesPage;
