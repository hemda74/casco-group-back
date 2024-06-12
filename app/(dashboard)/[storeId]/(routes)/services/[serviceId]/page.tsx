import prismadb from '@/lib/prismadb';

import { ServiceForm } from './components/service-form';

const ProductPage = async ({
	params,
}: {
	params: { ServiceId: string; storeId: string };
}) => {
	const Service = await prismadb.service.findUnique({
		where: {
			id: params.ServiceId,
		},
	});

	const categories = await prismadb.servicesCategory.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	const experts = await prismadb.expert.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	// const colors = await prismadb.color.findMany({
	//   where: {
	//     storeId: params.storeId,
	//   },
	// });

	return (
		<div className="flex-row">
			<div className="flex-1 space-x-4 p-8 pt-6">
				<ServiceForm
					categories={categories}
					initialData={Service}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
