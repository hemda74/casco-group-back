import prismadb from '@/lib/prismadb';
import { ServiceForm } from './components/industry-detailes-form';
const ServicePage = async ({
	params,
}: {
	params: { industrydetailesId: string; storeId: string };
}) => {
	const service = await prismadb.industryDetailes.findUnique({
		where: {
			id: params.industrydetailesId,
		},
		include: {
			industryDetailesPoint: true,
			industryDetailesPointAr: true
		}
	});

	const industries = await prismadb.industry.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	return (
		<div className="flex-row">
			<div className="flex-1 space-x-4 p-8 pt-6">
				<ServiceForm
					industries={industries}
					initialData={service}
				/>
			</div>
		</div>
	);
};

export default ServicePage;
