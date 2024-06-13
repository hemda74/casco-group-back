import prismadb from '@/lib/prismadb';
import { ServiceClient } from './components/client';
import { ServiceColumn } from './components/columns';
import { format } from 'date-fns';

const ServicesPage = async ({ params }: { params: { storeId: string } }) => {
	const services = await prismadb.service.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			category: true,
			serviceDesc: true,
			serviceDescAr: true,
			expertServices: {
				include: {
					expert: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const formattedServices: ServiceColumn[] = services.map((item) => ({
		id: item.id,
		name: item.name,
		name_ar: item.name_ar,
		category: item.category.name,
		experts: item.expertServices.map(es => es.expert.name), // expert 'name' field
		title: item.serviceDesc.map(ti => ti.title),
		desc_1: item.serviceDesc.map(des1 => des1.desc_1),
		desc_2: item.serviceDesc.map(des1 => des1.desc_2),
		title_ar: item.serviceDescAr.map(ti_ar => ti_ar.title_ar),
		desc_1_ar: item.serviceDescAr.map(des1_ar => des1_ar.desc_1_ar),
		desc_2_ar: item.serviceDescAr.map(des1_ar => des1_ar.desc_2_ar),
		createdAt: format(item.createdAt, 'MMMM do, yyyy'),
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