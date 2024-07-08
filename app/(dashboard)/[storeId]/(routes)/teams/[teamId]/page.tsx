import prismadb from '@/lib/prismadb';

import { CategoryForm } from './components/team-form';

const ProductPage = async ({
	params,
}: {
	params: { teamId: string; storeId: string };
}) => {
	const team = await prismadb.team.findUnique({
		where: {
			id: params.teamId,
		},

	});

	return (
		<div className="flex-row">
			<div className="flex-1 space-x-4 p-8 pt-6">
				<CategoryForm
					initialData={team}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
