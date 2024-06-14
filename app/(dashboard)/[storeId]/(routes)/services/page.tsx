import prismadb from '@/lib/prismadb';
import { ServiceClient } from './components/client';
import { ServiceColumn } from './components/columns';
import { format } from 'date-fns';

const ServicesPage = async ({ params }: { params: { storeId: string } }) => {
	try {
		const services = await prismadb.service.findMany({
			where: {
				storeId: params.storeId,
			},
			include: {
				category: true,
				serviceDesc: true,
				serviceDescAr: true,
				expertService: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		const formattedServices: ServiceColumn[] = services.map((item) => ({
			id: item.id,
			name: item.name,
			name_ar: item.name_ar,
			category: item.category?.name ?? '',
			expert_name: item.expertService.map((ex) => ex.name),
			expert_name_ar: item.expertService.map((ex) => ex.name_ar),
			expert_title: item.expertService.map((ex) => ex.title),
			expert_title_ar: item.expertService.map((ex) => ex.title_ar),
			expert_mail: item.expertService.map((ex) => ex.mail),
			expert_phone: item.expertService.map((ex) => ex.phone),
			title: item.serviceDesc.map((desc) => desc.title),
			desc_1: item.serviceDesc.map((desc) => desc.desc_1),
			desc_2: item.serviceDesc.map((desc) => desc.desc_2),
			title_ar: item.serviceDescAr.map((descAr) => descAr.title_ar),
			desc_1_ar: item.serviceDescAr.map((descAr) => descAr.desc_1_ar),
			desc_2_ar: item.serviceDescAr.map((descAr) => descAr.desc_2_ar),
			createdAt: format(new Date(item.createdAt), 'MMMM do, yyyy'),
		}));

		return (
			<div className="flex-col">
				<div className="flex-1 space-y-4 p-8 pt-6">
					<ServiceClient data={formattedServices} />
				</div>
			</div>
		);
	} catch (error) {
		console.error('[ServicesPage]', error);
		// Handle error here
		return <div>Error loading services</div>;
	}
};

export default ServicesPage;
