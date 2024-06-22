import prismadb from '@/lib/prismadb';
import { ServiceClient } from './components/client';
import { ServiceColumn } from './components/columns';
import { format } from 'date-fns';

const ServicesPage = async ({ params }: { params: { storeId: string } }) => {
	try {
		const services = await prismadb.industryDetailes2.findMany({
			where: {
				storeId: params.storeId,
			},
			include: {
				industry: true,
				industryDetailesPoint2: true,
				industryDetailesPointAr2: true,
			},
			orderBy: {
				title: 'desc',
			},
		});

		const formattedServices: ServiceColumn[] = services.map((item) => ({
			id: item.id,
			title: item.title,
			title_ar: item.title_ar,
			industry: item.industry?.name ?? '',
			text_en: item.industryDetailesPoint2.map((desc) => desc.text),
			text_ar: item.industryDetailesPointAr2.map((desc) => desc.text)
		}));
		return (
			<div className="flex-col" >
				<div className="flex-1 space-y-4 p-8 pt-6">
					<ServiceClient data={formattedServices} />
				</div>
			</div >
		);
	} catch (error) {
		console.error('[ServicesPage]', error);
		// Handle error here
		return <div className='m-auto'>Error loading services</div>;
	}
};

export default ServicesPage;
