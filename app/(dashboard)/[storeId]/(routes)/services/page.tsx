import prismadb from '@/lib/prismadb';

import { ServiceClient } from './components/client';
import { ServiceColumn } from './components/columns';

const ServicesPage = async ({ params }: { params: { storeId: string } }) => {
	const services = await prismadb.service.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			category: true,
			expertServices: {
				include: {
					expert: true,
				},
			},
		},
		orderBy: {
			name: 'desc',
		},
	});

	const formattedServices: ServiceColumn[] = services.map((item) => ({
		id: item.id,
		name: item.name,
		name_ar: item.name_ar,
		category: item.category.name,
		experts: item.expertServices.map(es => es.expert.name).join(',--------------- '), // assuming expert has a 'name' field
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ServiceClient data={formattedServices} />
			</div>
		</div>
	);
};

export default ServicesPage;