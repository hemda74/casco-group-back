import prismadb from '@/lib/prismadb';
import { ServiceForm } from './components/how-can-help-form';
const ServicePage = async ({
	params,
}: {
	params: { howcanhelpId: string; storeId: string };
}) => {
	const service = await prismadb.industryDetailes2.findUnique({
		where: {
			id: params.howcanhelpId,
		},
		include: {
			industryDetailesPoint2: true,
			industryDetailesPointAr2: true
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
