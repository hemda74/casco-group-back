import prismadb from '@/lib/prismadb';

import { IndustryForm } from './components/industry-form';

const CategoryPage = async ({
	params,
}: {
	params: { industryId: string; storeId: string };
}) => {
	const industry = await prismadb.industry.findUnique({
		where: {
			id: params.industryId,
		},
	});
	const categories = await prismadb.industryCategory.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<IndustryForm
					categories={categories}
					initialData={industry}
				/>
			</div>
		</div>
	);
};

export default CategoryPage;