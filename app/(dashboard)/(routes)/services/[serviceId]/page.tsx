import prismadb from '@/lib/prismadb';
import { ServiceForm } from './components/service-form';

const ServicePage = async ({
	params,
}: {
	params: { serviceid: number; };
}) => {
	const service = await prismadb.service.findUnique({
		where: {
			id: params.serviceId,
		},
		include: {
			serviceDesc: true,
			serviceDescAr: true,
			expertService: true,
		}
	});



	return (
		<div className="flex-row">
			<div className="flex-1 space-x-4 p-8 pt-6">
				<ServiceForm
					initialData={service}
				/>
			</div>
		</div>
	);
};

export default ServicePage;
